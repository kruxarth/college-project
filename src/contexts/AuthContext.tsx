import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, CurrentUser, SignupData } from '@/types';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import * as fs from '@/services/firestore';

interface AuthContextType {
  currentUser: CurrentUser | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string; role?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } else {
        setCurrentUser(null);
        setUser(null);
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
        return { success: false, error: 'Profile not found' };
      }
      const session: CurrentUser = { id: uid, email: profile.email, role: profile.role };
      setCurrentUser(session);
      setUser(profile as User);
      return { success: true, role: profile.role };
    } catch (err: any) {
      const message = err?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string; role?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const uid = cred.user.uid;
      // create Firestore profile (don't store password)
      const { password, ...profileWithoutPassword } = userData;
      const profile = await fs.createUserProfile(uid, profileWithoutPassword);
      const session: CurrentUser = { id: uid, email: profile.email, role: profile.role };
      setCurrentUser(session);
      setUser(profile as User);
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
      await fs.updateUserProfile(currentUser.id, updates);
      const updated = await fs.getUserProfile(currentUser.id);
      setUser(updated as User | null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, user, login, signup, logout, updateProfile, isLoading }}>
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
