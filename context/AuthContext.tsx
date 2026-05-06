import { supabase } from '@/lib/supabase';
import { getProfile } from '@/services/profileService';
import { UserProfile } from '@/types/database';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  refreshProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const loadProfile = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    try {
      setIsProfileLoading(true);
      const loadedProfile = await getProfile(currentUser.id);
      setProfile(loadedProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error loading session:', error.message);
      }

      if (!isMounted) return;

      const currentSession = data.session ?? null;
      const currentUser = currentSession?.user ?? null;

      setSession(currentSession);
      setUser(currentUser);
      setIsLoading(false);

      await loadProfile(currentUser);
    };

    bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;

      setSession(nextSession ?? null);
      setUser(nextUser);
      setIsLoading(false);

      loadProfile(nextUser);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    await loadProfile(user);
  };

  const login = async (email: string, password: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      throw new Error('Email and password are required.');
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const signup = async (email: string, password: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      throw new Error('Email and password are required.');
    }

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isProfileLoading,
      refreshProfile,
      login,
      signup,
      logout,
    }),
    [user, session, profile, isLoading, isProfileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}