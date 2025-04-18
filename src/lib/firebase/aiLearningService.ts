import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp, 
  Timestamp,
  limit,
  FieldValue
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';
import { Medicine } from './prescriptionService';

// AI Learning entry interface
export interface LearningEntry {
  id?: string;
  doctorId: string;
  symptoms: string;
  medications: Medicine[];
  createdAt: Timestamp | Date | FieldValue;
  usageCount: number;
}

/**
 * Save a new AI learning entry to Firebase
 * @param doctorId The doctor's ID
 * @param symptoms The symptoms text
 * @param medications The suggested medications
 */
export const saveAILearningEntry = async (
  doctorId: string,
  symptoms: string,
  medications: Medicine[]
): Promise<LearningEntry> => {
  try {
    // Check if a similar entry already exists
    const similarEntries = await getSimilarSymptomEntries(doctorId, symptoms);
    
    if (similarEntries.length > 0) {
      // If we have an entry with the exact same symptoms, just update its usage count
      const exactMatch = similarEntries.find(entry => entry.symptoms.toLowerCase() === symptoms.toLowerCase());
      
      if (exactMatch && exactMatch.id) {
        // Update existing entry with new medications and increment usage count
        const docRef = doc(db, 'aiLearning', exactMatch.id);
        await setDoc(docRef, {
          medications: medications,
          usageCount: (exactMatch.usageCount || 0) + 1,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        
        return {
          ...exactMatch,
          medications,
          usageCount: (exactMatch.usageCount || 0) + 1
        };
      }
    }
    
    // Create a new entry
    const learningRef = collection(db, 'aiLearning');
    const newEntry: Omit<LearningEntry, 'id'> = {
      doctorId,
      symptoms,
      medications,
      createdAt: serverTimestamp(),
      usageCount: 1
    };
    
    const docRef = doc(learningRef);
    await setDoc(docRef, newEntry);
    
    return {
      id: docRef.id,
      ...newEntry,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error saving AI learning entry:', error);
    throw error;
  }
};

/**
 * Get all AI learning entries for a doctor
 * @param doctorId The doctor's ID
 * @param maxEntries Maximum number of entries to retrieve (default: 100)
 */
export const getDoctorAILearningEntries = async (
  doctorId: string,
  maxEntries = 100
): Promise<LearningEntry[]> => {
  try {
    const learningRef = collection(db, 'aiLearning');
    const q = query(
      learningRef,
      where('doctorId', '==', doctorId),
      orderBy('usageCount', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(maxEntries)
    );
    
    const querySnapshot = await getDocs(q);
    const entries: LearningEntry[] = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data() as Omit<LearningEntry, 'id'>;
      entries.push({
        id: doc.id,
        ...data
      });
    });
    
    return entries;
  } catch (error) {
    console.error('Error getting AI learning entries:', error);
    throw error;
  }
};

/**
 * Get entries with similar symptoms for learning
 * @param doctorId The doctor's ID
 * @param symptoms The symptoms to find similar entries for
 */
export const getSimilarSymptomEntries = async (
  doctorId: string,
  symptoms: string
): Promise<LearningEntry[]> => {
  try {
    // First get all entries for this doctor
    const allEntries = await getDoctorAILearningEntries(doctorId);
    
    // No entries yet
    if (allEntries.length === 0) return [];
    
    // Extract keywords from the symptoms
    const keywords = symptoms.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);
    
    // If we don't have enough keywords, return empty array
    if (keywords.length < 2) return allEntries.slice(0, 5);  // Return top 5 entries if not enough keywords
    
    // Score each entry based on keyword matches
    const scoredEntries = allEntries.map(entry => {
      const entryText = entry.symptoms.toLowerCase();
      let score = 0;
      
      // Score based on keyword matches
      keywords.forEach(keyword => {
        if (entryText.includes(keyword)) score += 1;
      });
      
      // Bonus for usage count
      score += Math.min(entry.usageCount || 0, 3) * 0.5;
      
      return { entry, score };
    });
    
    // Sort by score and return the top entries
    return scoredEntries
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 1)  // Only include entries with at least 2 keyword matches
      .map(item => item.entry)
      .slice(0, 5);  // Return top 5 matches
  } catch (error) {
    console.error('Error finding similar symptom entries:', error);
    return [];
  }
};

/**
 * Get learning prompt context from previous entries
 * @param doctorId The doctor's ID
 * @param symptoms The symptoms to find learning data for
 */
export const getLearningContext = async (
  doctorId: string,
  symptoms: string
): Promise<string> => {
  try {
    const similarEntries = await getSimilarSymptomEntries(doctorId, symptoms);
    
    if (similarEntries.length === 0) return "";
    
    let relevantHistory = "";
    
    // Format the entries into a string for the AI prompt
    similarEntries.forEach(entry => {
      const medicationsText = entry.medications.map(med => 
        `- ${med.name} (${med.dosage}, ${med.frequency}, ${med.duration})`
      ).join('\n');
      
      if (medicationsText) {
        // Include usage count as an indicator of success
        const usageInfo = entry.usageCount > 1 ? ` [prescribed ${entry.usageCount} times]` : '';
        relevantHistory += `For similar symptoms "${entry.symptoms}"${usageInfo}, these medications were previously suggested:\n${medicationsText}\n\n`;
      }
    });
    
    return relevantHistory ? 
      `PREVIOUSLY SUCCESSFUL TREATMENTS:\n${relevantHistory}\nConsider these past treatments in your suggestions if appropriate for the current symptoms.\n\n` : 
      "";
  } catch (error) {
    console.error('Error getting learning context:', error);
    return "";
  }
};

/**
 * Check if doctor has learning data
 * @param doctorId The doctor's ID
 */
export const checkDoctorHasLearningData = async (doctorId: string): Promise<boolean> => {
  try {
    const learningRef = collection(db, 'aiLearning');
    const q = query(
      learningRef,
      where('doctorId', '==', doctorId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking for learning data:', error);
    return false;
  }
}; 