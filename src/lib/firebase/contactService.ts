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

// Contact message interface
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: string; // Optional for logged-in users
  createdAt?: Timestamp;
}

/**
 * Add a new contact message to Firestore
 * @param message The contact message to add
 * @returns The newly created message with ID
 */
export const addContactMessage = async (message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> => {
  try {
    const contactsRef = collection(db, 'contactMessages');
    
    // Add the message with server timestamp
    const docRef = await addDoc(contactsRef, {
      ...message,
      createdAt: serverTimestamp()
    });
    
    // Return the created message with ID
    return {
      id: docRef.id,
      ...message,
      createdAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error adding contact message:', error);
    throw error;
  }
};

/**
 * Get all contact messages for a user
 * Only used by admins or for user to view their own messages
 * @param userId The user's ID
 * @returns Array of contact messages
 */
export const getUserContactMessages = async (userId: string): Promise<ContactMessage[]> => {
  try {
    const contactsRef = collection(db, 'contactMessages');
    const q = query(
      contactsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ContactMessage, 'id'>
    }));
  } catch (error) {
    console.error('Error getting contact messages:', error);
    throw error;
  }
}; 