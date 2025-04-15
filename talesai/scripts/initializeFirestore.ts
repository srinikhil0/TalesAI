import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../serviceAccountKey.json'), 'utf8')
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

async function initializeFirestore() {
  try {
    console.log('Initializing Firestore...');

    // Create collections if they don't exist
    const collections = ['stories', 'users', 'voiceClones', 'interactions'];
    
    for (const collectionName of collections) {
      db.collection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }

    // Create a sample story
    const storiesRef = db.collection('stories');
    const sampleStory = {
      title: 'Welcome to TalesAI',
      description: 'Your first AI-powered interactive story',
      duration: 300, // 5 minutes in seconds
      category: 'Adventure',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      coverImage: '/story-icon.svg',
      sections: [
        {
          id: '1',
          content: 'Welcome to your first interactive story!',
          voiceId: 'default',
          duration: 30,
          nextSections: ['2']
        }
      ]
    };

    await storiesRef.doc('welcome-story').set(sampleStory);
    console.log('Created sample story');

    console.log('Firestore initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    process.exit(1);
  }
}

initializeFirestore(); 