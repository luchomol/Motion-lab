'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LogIn } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MobileBottomBar from '@/components/MobileBottomBar';
import { useTheme } from '@/components/ThemeProvider';

export default function LoginPage() {
  const router = useRouter();
  const { isSunlight } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData?.user?.rol === 'ENTRENADOR') {
          router.push('/admin');
        } else {
          router.push('/entrenamiento');
        }
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors ${
      isSunlight ? 'bg-slate-50 text-slate-900' : 'bg-[#05070c] text-white'
    }`}>
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 pt-28 pb-20 relative z-10">
        <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl relative transition-all ${
          isSunlight
            ? 'bg-white border-2 border-slate-300 shadow-slate-200'
            : 'bg-[#0a0f1d] border-slate-800'
        }`}>
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 border ${
              isSunlight
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-blue-500/10 text-sky-400 border-blue-500/20'
            }`}>
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className={`text-3xl font-black tracking-tight ${isSunlight ? 'text-[#020617]' : 'text-white'}`}>
              Iniciar Sesión
            </h1>
            <p className={`mt-2 text-sm font-semibold ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
              Accede a tu cuenta de Motion Lab
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${
                isSunlight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                Email o Usuario
              </label>
              <input
                type="text"
                required
                className={`w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors border touch-target ${
                  isSunlight
                    ? 'bg-white border-2 border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-none'
                    : 'bg-[#05070c] border border-slate-700 text-white focus:outline-none focus:border-sky-500'
                }`}
                placeholder="tu@correo.com o usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${
                isSunlight ? 'text-slate-800' : 'text-slate-300'
              }`}>
                Contraseña
              </label>
              <input
                type="password"
                required
                className={`w-full rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors border touch-target ${
                  isSunlight
                    ? 'bg-white border-2 border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-none'
                    : 'bg-[#05070c] border border-slate-700 text-white focus:outline-none focus:border-sky-500'
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/40 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 hover:from-blue-600 hover:to-sky-400 text-white font-black uppercase tracking-wider text-sm transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50 touch-target active:scale-[0.98]"
            >
              {loading ? 'Ingresando...' : 'Entrar a mi Cuenta'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className={`mt-6 pt-6 border-t text-center ${isSunlight ? 'border-slate-200' : 'border-slate-800'}`}>
            <p className={`text-sm font-semibold ${isSunlight ? 'text-slate-700' : 'text-slate-300'}`}>
              ¿No tienes una cuenta?{' '}
              <Link href="/onboarding" className="text-blue-600 hover:text-blue-800 font-black transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>

      <MobileBottomBar />
    </div>
  );
}
