'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                TalesAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => router.push('/signup')}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/grid.svg)',
          backgroundSize: '50px 50px',
          opacity: 0.5
        }} />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Transform Your Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Create immersive narratives with AI-powered storytelling, voice cloning, and interactive elements
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => router.push('/signup')}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => router.push('/demo')}
                className="w-full sm:w-auto bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Try Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2">
          <div className="w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl" />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-black/50 backdrop-blur-xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl backdrop-blur-lg"
            >
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <Image src="/ai-icon.svg" alt="AI Icon" width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Story Generation</h3>
              <p className="text-gray-400">Create captivating stories with our advanced AI technology</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl backdrop-blur-lg"
            >
              <div className="h-12 w-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6">
                <Image src="/voice-icon.svg" alt="Voice Icon" width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Voice Cloning</h3>
              <p className="text-gray-400">Bring your characters to life with unique voices</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl backdrop-blur-lg"
            >
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Image src="/interactive-icon.svg" alt="Interactive Icon" width={24} height={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Interactive Elements</h3>
              <p className="text-gray-400">Create branching narratives and interactive stories</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">1000+</div>
              <p className="text-gray-400 mt-2">Stories Created</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">50+</div>
              <p className="text-gray-400 mt-2">Voice Styles</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">4.9/5</div>
              <p className="text-gray-400 mt-2">User Rating</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
