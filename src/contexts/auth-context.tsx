
'use client';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_USERNAME_FOR_SETUP } from '@/app/users/user-data'; // Assuming this is where it's defined

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { username: string } | null; // Basic user object
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  let activityTimer: NodeJS.Timeout;

  const resetActivityTimer = useCallback(() => {
    clearTimeout(activityTimer);
    if (isAuthenticated) {
      activityTimer = setTimeout(() => {
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive",
        });
        logout();
      }, SESSION_TIMEOUT_DURATION);
    }
  }, [isAuthenticated, toast]); // Added toast to dependencies, logout will be defined below

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authUser');
    }
    clearTimeout(activityTimer);
    router.push('/paneladmin');
  }, [router, activityTimer]);


  useEffect(() => {
    // Initialize auth state from localStorage
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedUser = localStorage.getItem('authUser');
      if (storedAuth === 'true' && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
        resetActivityTimer(); // Start timer if authenticated
      }
    }
    setIsLoading(false);
  }, [resetActivityTimer]);


  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      window.addEventListener('mousemove', resetActivityTimer);
      window.addEventListener('keypress', resetActivityTimer);
      window.addEventListener('scroll', resetActivityTimer);
      window.addEventListener('click', resetActivityTimer);
      resetActivityTimer(); // Initialize timer
    }

    return () => {
      clearTimeout(activityTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', resetActivityTimer);
        window.removeEventListener('keypress', resetActivityTimer);
        window.removeEventListener('scroll', resetActivityTimer);
        window.removeEventListener('click', resetActivityTimer);
      }
    };
  }, [isAuthenticated, resetActivityTimer, activityTimer]);


  const login = async (usernameInput: string) => {
    // Mock login: In a real app, this would involve an API call
    // For this prototype, we'll use the DEFAULT_USERNAME_FOR_SETUP
    if (usernameInput === DEFAULT_USERNAME_FOR_SETUP) {
      setIsAuthenticated(true);
      const userData = { username: usernameInput };
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authUser', JSON.stringify(userData));
      }
      resetActivityTimer();
      router.push('/');
    } else {
      throw new Error("Invalid credentials"); // Or handle error appropriately
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
