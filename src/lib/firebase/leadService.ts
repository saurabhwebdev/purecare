import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';

// Lead interface
export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  message?: string;
  source?: string;
  createdAt?: Timestamp;
}

/**
 * Add a new lead to Firestore
 * @param lead The lead information to add
 * @returns The newly created lead with ID
 */
export const addLead = async (lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
  try {
    const leadsRef = collection(db, 'leads');
    
    // Add the lead with server timestamp
    const docRef = await addDoc(leadsRef, {
      ...lead,
      createdAt: serverTimestamp()
    });
    
    // Return the created lead with ID
    return {
      id: docRef.id,
      ...lead,
      createdAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error adding lead:', error);
    throw error;
  }
}; 