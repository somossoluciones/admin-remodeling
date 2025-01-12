import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session check:', session?.user?.email);
      if (session?.user) {
        const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS?.split(',') || [];
        if (!allowedEmails.includes(session.user.email || '')) {
          console.log('Email not allowed:', session.user.email);
          supabase.auth.signOut();
          navigate('/login');
          return;
        }
        console.log('Email allowed, setting user');
        setUser(session.user);
        setLoading(false);
      } else {
        console.log('No session, redirecting to login');
        setUser(null);
        setLoading(false);
        navigate('/login');
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      
      if (session?.user) {
        const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS?.split(',') || [];
        if (!allowedEmails.includes(session.user.email || '')) {
          console.log('Email not allowed:', session.user.email);
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }
        console.log('Email allowed, updating user');
        setUser(session.user);
      } else {
        console.log('No session in state change');
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const value = {
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
