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
      console.log('Session:', session);
      if (session?.user) {
        const allowedEmails = ['robmarq47@mrqzremodeling.com', 'creandolasoluciones@gmail.com'];
        if (!allowedEmails.includes(session.user.email || '')) {
          supabase.auth.signOut();
          navigate('/login');
          return;
        }
      }
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate('/login');
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      if (session?.user) {
        const allowedEmails = ['robmarq47@mrqzremodeling.com', 'creandolasoluciones@gmail.com'];
        if (!allowedEmails.includes(session.user.email || '')) {
          supabase.auth.signOut();
          navigate('/login');
          return;
        }
      }
      setUser(session?.user ?? null);

      if (!session?.user) {
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
