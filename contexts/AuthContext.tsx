import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
// FIX: In some older versions of @supabase/supabase-js v2, Session and User types were not exported correctly.
// Importing them from the underlying @supabase/auth-js package is a more robust solution.
import type { Session, User } from '@supabase/auth-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Relying solely on onAuthStateChange is a more robust pattern.
    // It's called once on listener attachment with the initial session, and then on any auth state change.
    // This removes the need for a separate getSession() call and avoids potential race conditions.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  const login = async (email: string, pass: string) => {
    // FIX: The parameter is `pass`, but Supabase expects a `password` property.
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };
  
  const value = {
    session,
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
