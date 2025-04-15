import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Story, UserStory, StorySection } from '@/types/story';

const STORIES_PER_PAGE = 10;

export const storyService = {
  // Get featured stories
  getFeaturedStories: async (): Promise<Story[]> => {
    const q = query(
      collection(db, 'stories'),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as Story[];
  },

  // Get recently played stories for a user
  getRecentlyPlayed: async (userId: string): Promise<UserStory[]> => {
    const q = query(
      collection(db, 'userStories'),
      where('userId', '==', userId),
      orderBy('lastPlayed', 'desc'),
      limit(5)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastPlayed: (doc.data().lastPlayed as Timestamp).toDate(),
    })) as UserStory[];
  },

  // Get story details
  getStoryById: async (storyId: string): Promise<Story | null> => {
    const docRef = doc(db, 'stories', storyId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
      updatedAt: (docSnap.data().updatedAt as Timestamp).toDate(),
    } as Story;
  },

  // Get story sections
  getStorySections: async (storyId: string): Promise<StorySection[]> => {
    const q = query(
      collection(db, 'storySections'),
      where('storyId', '==', storyId),
      orderBy('order', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as StorySection[];
  },

  // Get stories by category
  getStoriesByCategory: async (
    category: string,
    lastDoc?: DocumentSnapshot
  ): Promise<{ stories: Story[]; lastDoc: DocumentSnapshot | null }> => {
    let q = query(
      collection(db, 'stories'),
      where('category', '==', category),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc'),
      limit(STORIES_PER_PAGE)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const stories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
    })) as Story[];

    return {
      stories,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  },

  // Update story progress
  updateProgress: async (
    userId: string,
    storyId: string,
    progress: number
  ): Promise<void> => {
    const q = query(
      collection(db, 'userStories'),
      where('userId', '==', userId),
      where('storyId', '==', storyId)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userStory = snapshot.docs[0];
      await updateDoc(userStory.ref, {
        progress,
        lastPlayed: new Date(),
      });
    }
  },
}; 