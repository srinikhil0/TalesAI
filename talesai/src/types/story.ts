export interface Story {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  category: string;
  coverImage?: string;
  audioUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  ageGroup?: string;
  language: string;
  tags: string[];
  sections: {
    id: string;
    content: string;
    voiceId: string;
    duration: number;
    nextSections: string[];
    audioUrl?: string;
  }[];
}

export interface Voice {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  isDefault: boolean;
  audioSample?: string;
}

export interface UserStory {
  id: string;
  storyId: string;
  userId: string;
  voiceId: string;
  progress: number; // in seconds
  lastPlayed: Date;
  isFavorite: boolean;
}

export interface StorySection {
  id: string;
  storyId: string;
  title: string;
  order: number;
  duration: number;
  audioUrl?: string;
} 