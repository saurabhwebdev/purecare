import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';

// Feedback interface
export interface Feedback {
  id?: string;
  name: string;
  email: string;
  rating?: number; // Making rating optional
  category: string;
  feedback: string;
  userId?: string; // Optional for logged-in users
  createdAt?: Timestamp;
}

/**
 * Add new feedback to Firestore
 * @param feedback The feedback data to add
 * @returns The newly created feedback with ID
 */
export const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
  try {
    const feedbackRef = collection(db, 'feedback');
    
    // Add the feedback with server timestamp
    const docRef = await addDoc(feedbackRef, {
      ...feedback,
      createdAt: serverTimestamp()
    });
    
    // Return the created feedback with ID
    return {
      id: docRef.id,
      ...feedback,
      createdAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
};

/**
 * Get all feedback for a user
 * Only used by admins or for user to view their own feedback
 * @param userId The user's ID
 * @returns Array of feedback
 */
export const getUserFeedback = async (userId: string): Promise<Feedback[]> => {
  try {
    const feedbackRef = collection(db, 'feedback');
    const q = query(
      feedbackRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Feedback, 'id'>
    }));
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
}; 