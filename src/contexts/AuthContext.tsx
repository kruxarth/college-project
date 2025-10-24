import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storage, { User, CurrentUser } from '@/services/localStorage';

interface AuthContextType {
  currentUser: CurrentUser | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = storage.getCurrentUser();
    if (session) {
      setCurrentUser(session);
      const fullUser = storage.getUserById(session.id);
      setUser(fullUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = storage.getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const session: CurrentUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    storage.setCurrentUser(session);
    setCurrentUser(session);
    setUser(user);
    return { success: true };
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    const existingUser = storage.getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    storage.saveUser(newUser);
    
    const session: CurrentUser = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    
    storage.setCurrentUser(session);
    setCurrentUser(session);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    storage.clearCurrentUser();
    setCurrentUser(null);
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      storage.updateUser(currentUser.id, updates);
      const updatedUser = storage.getUserById(currentUser.id);
      setUser(updatedUser);
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
