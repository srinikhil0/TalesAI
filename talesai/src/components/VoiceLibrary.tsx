import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { voiceService } from '@/services/voiceService';
import { storageService } from '@/services/storageService';

export default function VoiceLibrary() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSampleUrl, setVoiceSampleUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load existing voice sample if available
    const loadVoiceSample = async () => {
      if (!user) return;
      try {
        const path = `users/${user.uid}/voice-sample.mp3`;
        const url = await storageService.getFileUrl(path);
        setVoiceSampleUrl(url);
      } catch {
        // Voice sample doesn't exist yet
        setVoiceSampleUrl(null);
      }
    };

    loadVoiceSample();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(false);

      // Validate file type
      if (!file.type.startsWith('audio/')) {
        throw new Error('Please upload an audio file');
      }

      // Create voice clone
      await voiceService.createVoiceClone(user.uid, file);
      setSuccess(true);

      // Update preview URL
      const path = `users/${user.uid}/voice-sample.${file.name.split('.').pop()}`;
      const url = await storageService.getFileUrl(path);
      setVoiceSampleUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload voice sample');
    } finally {
      setIsUploading(false);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="pt-20 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Voice Library</h2>
        
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-white mb-2">Upload Your Voice Sample</h3>
            <p className="text-gray-400 mb-6">
              Record a short audio clip to create your voice clone. This will be used to narrate all stories.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 bg-purple-500/20 text-white rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Select Audio File'}
            </button>

            {error && (
              <p className="mt-4 text-red-500">{error}</p>
            )}

            {success && (
              <p className="mt-4 text-green-500">Voice sample uploaded successfully!</p>
            )}

            {voiceSampleUrl && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Your Voice Sample</h4>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={togglePlayback}
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
                  <span className="text-sm text-gray-400">Click to preview</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={voiceSampleUrl || undefined}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
} 