'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl backdrop-blur-lg border border-white/10">
        <div className="text-center">
          <Link href="/" className="flex justify-center mb-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              TalesAI
            </h2>
          </Link>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue your creative journey
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300">
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 