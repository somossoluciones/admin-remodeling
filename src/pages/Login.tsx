import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Chrome } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      // Verificar el correo después del inicio de sesión
      const session = await supabase.auth.getSession();
      const userEmail = session.data.session?.user?.email;

      if (!userEmail) {
        throw new Error('No se pudo obtener el correo electrónico');
      }

      const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS?.split(',') || [];
      if (!allowedEmails.includes(userEmail.trim())) {
        await supabase.auth.signOut();
        throw new Error('Acceso no autorizado - Correo no registrado');
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">MRQZ REMODELING</h1>
          <p className="text-gray-600 mt-2">Inicia sesión con Google para continuar</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Chrome className="h-5 w-5 text-blue-500" />
          {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;
