import { Story } from '@/types/story';
import { storageService } from './storageService';
import { voiceService } from './voiceService';

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export const audioService = {
  async generateAudio(text: string, voiceId: string): Promise<Blob> {
    try {
      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  },

  async generateStoryAudio(story: Story, userId: string): Promise<string[]> {
    try {
      // Get user's voice ID
      const voiceId = await voiceService.getUserVoiceId(userId);
      if (!voiceId) {
        throw new Error('User has no voice clone');
      }

      const audioUrls: string[] = [];
      
      // Generate and store audio for each section
      for (const section of story.sections) {
        // Check if audio already exists for this section with user's voice
        const existingAudioPath = `stories/${story.id}/sections/${section.id}/${userId}.mp3`;
        try {
          const existingUrl = await storageService.getFileUrl(existingAudioPath);
          audioUrls.push(existingUrl);
        } catch {
          // If audio doesn't exist, generate and store it
          const audioBlob = await this.generateAudio(section.content, voiceId);
          const audioUrl = await storageService.uploadFile(
            new File([audioBlob], `${section.id}.mp3`, { type: 'audio/mpeg' }),
            existingAudioPath
          );
          audioUrls.push(audioUrl);
        }
      }
      
      return audioUrls;
    } catch (error) {
      console.error('Error generating story audio:', error);
      throw error;
    }
  }
}; 