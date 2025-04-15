import { storageService } from './storageService';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export const voiceService = {
  async createVoiceClone(userId: string, audioFile: File): Promise<string> {
    try {
      // 1. Upload voice sample to Firebase Storage
      const voiceSampleUrl = await storageService.uploadFile(
        audioFile,
        `users/${userId}/voice-sample.${audioFile.name.split('.').pop()}`
      );

      // 2. Create voice clone using ElevenLabs API
      const response = await fetch(`${ELEVENLABS_API_URL}/voices/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          name: `user-${userId}`,
          files: [voiceSampleUrl],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create voice clone');
      }

      const { voice_id } = await response.json();

      // 3. Store voice ID in user's profile
      await setDoc(doc(db, 'users', userId), {
        voiceId: voice_id,
        voiceSampleUrl,
        updatedAt: new Date(),
      }, { merge: true });

      return voice_id;
    } catch (error) {
      console.error('Error creating voice clone:', error);
      throw error;
    }
  },

  async getUserVoiceId(userId: string): Promise<string | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.data()?.voiceId || null;
  }
}; 