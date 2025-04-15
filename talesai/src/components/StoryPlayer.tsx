'use client';

import { useState, useRef, useEffect } from 'react';
import { Story } from '@/types/story';

interface StoryPlayerProps {
  story: Story | undefined;
}

export default function StoryPlayer({ story }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!story) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-t border-white/10 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          {/* Story Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{story.title}</h3>
            <p className="text-sm text-gray-400 truncate">{story.description}</p>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 bg-purple-500/20 rounded-lg text-white hover:bg-purple-500/30 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H5z" />
                  <path d="M13 4a1 1 0 00-1 1v10a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1h-2z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>

            {/* Progress Bar */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={story.audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
} 