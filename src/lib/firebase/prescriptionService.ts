import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';
import { getUserSettings, UserSettings } from './settingsService';

// Prescription medicine interface
export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Prescription interface
export interface Prescription {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  medicines: Medicine[];
  diagnosis: string;
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
  clinicInfo?: {
    clinicName: string;
    clinicAddress: string;
    clinicContact: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorLicense: string;
  };
}

/**
 * Get all prescriptions
 * @param userId The doctor's ID
 */
export const getAllPrescriptions = async (userId: string) => {
  try {
    console.log("Querying prescriptions with doctorId:", userId);
    const prescriptionsRef = collection(db, 'prescriptions');
    const q = query(
      prescriptionsRef,
      where('doctorId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    console.log("Raw prescription query result size:", querySnapshot.size);
    const prescriptions: Prescription[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Prescription, 'id'>;
      console.log("Found prescription doc:", doc.id, data);
      prescriptions.push({
        id: doc.id,
        ...data,
      });
    });

    return prescriptions;
  } catch (error) {
    console.error('Error getting prescriptions:', error);
    throw error;
  }
};

/**
 * Get prescriptions for a specific patient
 * @param doctorId The doctor's ID
 * @param patientId The patient's ID
 */
export const getPatientPrescriptions = async (doctorId: string, patientId: string) => {
  try {
    const prescriptionsRef = collection(db, 'prescriptions');
    const q = query(
      prescriptionsRef,
      where('doctorId', '==', doctorId),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const prescriptions: Prescription[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Prescription, 'id'>;
      prescriptions.push({
        id: doc.id,
        ...data,
      });
    });

    return prescriptions;
  } catch (error) {
    console.error('Error getting patient prescriptions:', error);
    throw error;
  }
};

/**
 * Get a prescription by ID
 * @param prescriptionId The prescription ID
 */
export const getPrescription = async (prescriptionId: string) => {
  try {
    const docRef = doc(db, 'prescriptions', prescriptionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Prescription, 'id'>;
      return {
        id: docSnap.id,
        ...data,
      } as Prescription;
    } else {
      throw new Error('Prescription not found');
    }
  } catch (error) {
    console.error('Error getting prescription:', error);
    throw error;
  }
};

/**
 * Create a new prescription with clinic info from settings
 * @param doctorId The doctor's ID
 * @param prescription The prescription data
 */
export const createPrescription = async (doctorId: string, prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'clinicInfo' | 'doctorId'>) => {
  try {
    console.log("Creating prescription for doctorId:", doctorId);
    console.log("Input prescription data:", prescription);
    // Get clinic settings for the prescription
    const settings = await getUserSettings(doctorId);
    
    const clinicInfo = {
      clinicName: settings.clinic.clinicName,
      clinicAddress: `${settings.clinic.address}, ${settings.clinic.city}, ${settings.clinic.state} ${settings.clinic.zipCode}`,
      clinicContact: `Phone: ${settings.clinic.phone} | Email: ${settings.clinic.email}`,
      doctorName: '', // This should be filled from user profile
      doctorSpecialty: settings.clinic.specialty,
      doctorLicense: settings.clinic.licenseNumber,
    };

    const prescriptionWithTimestamp = {
      ...prescription,
      doctorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      clinicInfo,
    };

    console.log("Final prescription data to save:", prescriptionWithTimestamp);
    const docRef = await addDoc(collection(db, 'prescriptions'), prescriptionWithTimestamp);
    console.log("Successfully added prescription with ID:", docRef.id);
    
    return {
      id: docRef.id,
      ...prescriptionWithTimestamp,
    };
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

/**
 * Update a prescription
 * @param prescriptionId The prescription ID
 * @param prescription The updated prescription data
 */
export const updatePrescription = async (
  prescriptionId: string,
  prescription: Partial<Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  try {
    const docRef = doc(db, 'prescriptions', prescriptionId);
    
    await updateDoc(docRef, {
      ...prescription,
      updatedAt: serverTimestamp(),
    });
    
    return {
      id: prescriptionId,
      ...prescription,
    };
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error;
  }
};

/**
 * Delete a prescription
 * @param prescriptionId The prescription ID
 */
export const deletePrescription = async (prescriptionId: string) => {
  try {
    const docRef = doc(db, 'prescriptions', prescriptionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting prescription:', error);
    throw error;
  }
};

/**
 * Get user settings and prescription data for PDF generation
 * @param doctorId The doctor's ID
 * @param prescriptionId The prescription ID
 */
export const getPrescriptionWithSettings = async (doctorId: string, prescriptionId: string) => {
  try {
    const [settings, prescription] = await Promise.all([
      getUserSettings(doctorId),
      getPrescription(prescriptionId)
    ]);
    
    return {
      settings,
      prescription
    };
  } catch (error) {
    console.error('Error getting prescription with settings:', error);
    throw error;
  }
}; 