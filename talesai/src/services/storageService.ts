import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const storageService = {
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async getFileUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  async uploadAudio(audioBlob: Blob, storyId: string, sectionId: string): Promise<string> {
    const path = `stories/${storyId}/sections/${sectionId}.mp3`;
    return this.uploadFile(new File([audioBlob], `${sectionId}.mp3`, { type: 'audio/mpeg' }), path);
  },

  async uploadImage(file: File, storyId: string): Promise<string> {
    const path = `stories/${storyId}/cover.${file.name.split('.').pop()}`;
    return this.uploadFile(file, path);
  }
}; 