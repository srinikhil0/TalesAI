'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StoryPlayer from '@/components/StoryPlayer';
import VoiceLibrary from '@/components/VoiceLibrary';
import { storyService } from '@/services/storyService';
import { Story, UserStory } from '@/types/story';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<UserStory[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const [featured, recent] = await Promise.all([
            storyService.getFeaturedStories(),
            storyService.getRecentlyPlayed(user.uid)
          ]);

          setFeaturedStories(featured);
          setRecentlyPlayed(recent);
        } catch (error) {
          console.error('Error fetching data:', error);
          if (error instanceof Error && error.message.includes('permission-denied')) {
            router.push('/login');
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, router]);

  const playStory = async (story: Story) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      setCurrentStory(story);
      await storyService.updateProgress(user.uid, story.id, 0);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Sidebar Navigation - Hidden on mobile */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:w-64 md:flex md:flex-col bg-black/30 backdrop-blur-lg border-r border-white/10 p-6">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              TalesAI
            </h1>
          </Link>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'bg-purple-500/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('browse')}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              activeTab === 'browse' ? 'bg-purple-500/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span>Browse Stories</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              activeTab === 'library' ? 'bg-purple-500/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a1 1 0 000 2h6a1 1 0 100-2H7zM4 8a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 12a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span>My Library</span>
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              activeTab === 'voices' ? 'bg-purple-500/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
            </svg>
            <span>My Voices</span>
          </button>
        </nav>

        <div className="mt-8 pt-8 border-t border-white/10">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">PLAYLISTS</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
              Favorites
            </button>
            <button className="w-full text-left text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
              Recently Played
            </button>
            <button className="w-full text-left text-gray-400 hover:text-white p-2 rounded-lg transition-colors">
              Bedtime Stories
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              TalesAI
            </h1>
          </Link>
          <button className="p-2 bg-purple-500/20 rounded-lg text-white text-sm hover:bg-purple-500/30 transition-colors">
            Record Voice
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 pb-24 md:pb-0">
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden md:flex fixed top-0 right-0 left-64 h-16 bg-black/30 backdrop-blur-lg border-b border-white/10 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-purple-400 transition-colors">
              {user?.displayName}
            </button>
          </div>
          <button className="px-6 py-3 bg-purple-500/20 text-white rounded-lg hover:bg-purple-500/30 transition-colors">
            Record New Voice
          </button>
        </div>

        {/* Content Area */}
        <div className="pt-16 p-4 md:p-6">
          {activeTab === 'home' && (
            <>
              {/* Featured Section */}
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Featured Stories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                  {featuredStories.map((story) => (
                    <div 
                      key={story.id}
                      className="bg-white/5 rounded-lg p-3 md:p-4 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => playStory(story)}
                    >
                      <div className="aspect-square bg-purple-500/20 rounded-lg mb-3 md:mb-4 flex items-center justify-center">
                        {story.coverImage ? (
                          <Image
                            src={story.coverImage}
                            alt={story.title}
                            width={48}
                            height={48}
                            className="rounded-lg"
                          />
                        ) : (
                          <Image src="/story-icon.svg" alt="Story" width={48} height={48} />
                        )}
                      </div>
                      <h3 className="text-sm md:text-base text-white font-medium mb-1">{story.title}</h3>
                      <p className="text-xs md:text-sm text-gray-400">
                        {story.category} • {Math.ceil(story.duration / 60)} min
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently Played */}
              {recentlyPlayed.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Recently Played</h2>
                  <div className="bg-white/5 rounded-lg">
                    <div className="grid grid-cols-1 gap-2 p-3 md:p-4">
                      {recentlyPlayed.map(async (userStory) => {
                        const story = await storyService.getStoryById(userStory.storyId);
                        if (!story) return null;
                        
                        return (
                          <div 
                            key={userStory.id}
                            className="flex items-center space-x-3 md:space-x-4 p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            onClick={() => playStory(story)}
                          >
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              {story.coverImage ? (
                                <Image
                                  src={story.coverImage}
                                  alt={story.title}
                                  width={24}
                                  height={24}
                                  className="rounded-lg"
                                />
                              ) : (
                                <Image src="/story-icon.svg" alt="Story" width={24} height={24} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm md:text-base text-white font-medium truncate">
                                {story.title}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-400 truncate">
                                Progress: {Math.round((userStory.progress / story.duration) * 100)}%
                              </p>
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">
                              {Math.ceil(story.duration / 60)} min
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'voices' && <VoiceLibrary />}
        </div>
      </div>

      {/* Story Player */}
      <StoryPlayer story={currentStory} />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black/30 backdrop-blur-lg border-t border-white/10 h-[72px]">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              activeTab === 'home' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('browse')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              activeTab === 'browse' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span className="text-xs mt-1">Browse</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              activeTab === 'library' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a1 1 0 000 2h6a1 1 0 100-2H7zM4 8a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 12a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span className="text-xs mt-1">Library</span>
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              activeTab === 'voices' ? 'text-white' : 'text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
            </svg>
            <span className="text-xs mt-1">Voices</span>
          </button>
        </div>
      </div>
    </div>
  );
} 