import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, CurrentUser, SignupData } from '@/types';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '@/firebase/config';
import * as fs from '@/services/firestore';
import { emailService } from '@/services/emailService';

interface AuthContextType {
  currentUser: CurrentUser | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string; role?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  sendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  checkEmailVerification: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    // Subscribe to Firebase auth state
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await fs.getUserProfile(fbUser.uid);
        const session: CurrentUser = {
          id: fbUser.uid,
          email: fbUser.email || '',
          role: (profile && (profile.role as CurrentUser['role'])) || 'donor',
        };
        setCurrentUser(session);
        setUser(profile as User | null);
        setIsEmailVerified(fbUser.emailVerified);
      } else {
        setCurrentUser(null);
        setUser(null);
        setIsEmailVerified(false);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; role?: string }> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const profile = await fs.getUserProfile(uid);
      
      if (!profile) {
        return { success: false, error: 'User profile not found. Please contact support.' };
      }
      
      const session: CurrentUser = { id: uid, email: profile.email, role: profile.role };
      setCurrentUser(session);
      setUser(profile as User);
      
      return { success: true, role: profile.role };
    } catch (err: any) {
      let message = 'Login failed';
      
      // Provide more specific error messages
      switch (err?.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email address. Please sign up first.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email format.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Please wait a few minutes before trying again.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid email or password. Please check your credentials.';
          break;
        default:
          message = err?.message || 'Login failed';
      }
      
      return { success: false, error: message };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await emailService.sendPasswordReset(email);
      return result;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send password reset email' };
    }
  };

  const sendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await emailService.sendVerificationEmail();
      return result;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send verification email' };
    }
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    const verified = await emailService.refreshEmailVerificationStatus();
    setIsEmailVerified(verified);
    return verified;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const current = auth.currentUser;
      if (!current || !current.email) return { success: false, error: 'No authenticated user' };
      const cred = EmailAuthProvider.credential(current.email, currentPassword);
      await reauthenticateWithCredential(current, cred);
      await updatePassword(current, newPassword);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to change password' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string; role?: string }> => {
    try {
      // validate phone: if provided, must be exactly 10 digits
      if (userData.phone && !/^\d{10}$/.test(userData.phone)) {
        return { success: false, error: 'Phone number must be exactly 10 digits' };
      }
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const uid = cred.user.uid;
      // create Firestore profile (don't store password)
      const { password, ...profileWithoutPassword } = userData;
      const profile = await fs.createUserProfile(uid, profileWithoutPassword);
      const session: CurrentUser = { id: uid, email: profile.email, role: profile.role };
      setCurrentUser(session);
      setUser(profile as User);
      
      // Send verification email after successful signup
      await emailService.sendVerificationEmail();
      
      // Send welcome notification
      await emailService.notifyDonationCreated(
        profile.email,
        profile.fullName,
        'Welcome to FoodShare!'
      );
      
      return { success: true, role: profile.role };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (currentUser) {
      if (updates.phone && !/^\d{10}$/.test(updates.phone)) {
        // reject invalid phone updates
        return;
      }
      await fs.updateUserProfile(currentUser.id, updates);
      const updated = await fs.getUserProfile(currentUser.id);
      setUser(updated as User | null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      user, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      isLoading, 
      resetPassword, 
      changePassword,
      sendVerificationEmail,
      checkEmailVerification,
      isEmailVerified
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
