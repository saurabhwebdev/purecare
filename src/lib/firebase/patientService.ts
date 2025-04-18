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
  limit, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';

// Patient interface
export interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  insuranceProvider: string;
  insuranceNumber: string;
  status: 'Active' | 'Inactive';
  notes?: string;
  lastVisit?: string | null;
  upcomingAppointment?: string | null;
  medicalHistory?: MedicalRecord[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
}

// Medical record interface
export interface MedicalRecord {
  id?: string;
  patientId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  provider: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Appointment interface
export interface Appointment {
  id?: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
  notes?: string;
  provider: string;
  googleEventId?: string;
  syncedWithGoogle?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Get all patients for a user
 * @param userId - The ID of the user/clinic
 */
export const getPatients = async (userId: string): Promise<Patient[]> => {
  try {
    const patientsRef = collection(db, 'users', userId, 'patients');
    const q = query(patientsRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const patients: Patient[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Patient;
      patients.push({
        ...data,
        id: doc.id
      });
    });
    
    return patients;
  } catch (error) {
    console.error('Error getting patients:', error);
    throw error;
  }
};

/**
 * Get a specific patient by ID
 * @param userId - The ID of the user/clinic
 * @param patientId - The ID of the patient to retrieve
 */
export const getPatient = async (userId: string, patientId: string): Promise<Patient | null> => {
  try {
    const docRef = doc(db, 'users', userId, 'patients', patientId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        ...docSnap.data() as Patient,
        id: docSnap.id
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting patient:', error);
    throw error;
  }
};

/**
 * Add a new patient
 * @param userId - The ID of the user/clinic
 * @param patient - The patient data to add
 */
export const addPatient = async (userId: string, patient: Omit<Patient, 'id'>): Promise<string> => {
  try {
    const patientsRef = collection(db, 'users', userId, 'patients');
    
    const newPatient = {
      ...patient,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId
    };
    
    const docRef = await addDoc(patientsRef, newPatient);
    return docRef.id;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error;
  }
};

/**
 * Update an existing patient
 * @param userId - The ID of the user/clinic
 * @param patientId - The ID of the patient to update
 * @param patient - The updated patient data
 */
export const updatePatient = async (
  userId: string, 
  patientId: string, 
  patient: Partial<Patient>
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'patients', patientId);
    
    await updateDoc(docRef, {
      ...patient,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

/**
 * Delete a patient
 * @param userId - The ID of the user/clinic
 * @param patientId - The ID of the patient to delete
 */
export const deletePatient = async (userId: string, patientId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'patients', patientId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

/**
 * Search for patients by name, email, or phone
 * @param userId - The ID of the user/clinic
 * @param searchTerm - The term to search for
 */
export const searchPatients = async (userId: string, searchTerm: string): Promise<Patient[]> => {
  try {
    // Since Firestore doesn't support full text search natively,
    // we'll fetch all patients and filter client-side
    const patients = await getPatients(userId);
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(lowerSearchTerm) ||
      patient.email.toLowerCase().includes(lowerSearchTerm) ||
      patient.phone.includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
};

/**
 * Get patient medical records
 * @param userId - The ID of the user/clinic
 * @param patientId - The ID of the patient
 */
export const getPatientMedicalRecords = async (
  userId: string, 
  patientId: string
): Promise<MedicalRecord[]> => {
  try {
    const recordsRef = collection(db, 'users', userId, 'patients', patientId, 'medicalRecords');
    const q = query(recordsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const records: MedicalRecord[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as MedicalRecord;
      records.push({
        ...data,
        id: doc.id
      });
    });
    
    return records;
  } catch (error) {
    console.error('Error getting medical records:', error);
    throw error;
  }
};

/**
 * Add a medical record for a patient
 * @param userId - The ID of the user/clinic
 * @param patientId - The ID of the patient
 * @param record - The medical record to add
 */
export const addMedicalRecord = async (
  userId: string, 
  patientId: string, 
  record: Omit<MedicalRecord, 'id'>
): Promise<string> => {
  try {
    const recordsRef = collection(db, 'users', userId, 'patients', patientId, 'medicalRecords');
    
    const newRecord = {
      ...record,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(recordsRef, newRecord);
    
    // Update the patient's last visit date
    await updatePatient(userId, patientId, {
      lastVisit: record.date
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding medical record:', error);
    throw error;
  }
};

/**
 * Get patient appointments
 * @param userId - The ID of the user/clinic
 * @param patientId - The ID of the patient (optional - if provided, only returns this patient's appointments)
 */
export const getAppointments = async (
  userId: string, 
  patientId?: string
): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, 'users', userId, 'appointments');
    
    let q;
    if (patientId) {
      q = query(
        appointmentsRef, 
        where('patientId', '==', patientId),
        orderBy('date', 'desc'),
        orderBy('time', 'asc')
      );
    } else {
      q = query(
        appointmentsRef,
        orderBy('date', 'desc'),
        orderBy('time', 'asc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    const appointments: Appointment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Appointment;
      appointments.push({
        ...data,
        id: doc.id
      });
    });
    
    return appointments;
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
};

/**
 * Add an appointment
 * @param userId - The ID of the user/clinic
 * @param appointment - The appointment to add
 */
export const addAppointment = async (
  userId: string, 
  appointment: Omit<Appointment, 'id'>
): Promise<string> => {
  try {
    const appointmentsRef = collection(db, 'users', userId, 'appointments');
    
    const newAppointment = {
      ...appointment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(appointmentsRef, newAppointment);
    
    // Update the patient's upcoming appointment
    await updatePatient(userId, appointment.patientId, {
      upcomingAppointment: appointment.date
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding appointment:', error);
    throw error;
  }
};

/**
 * Update an appointment status
 * @param userId - The ID of the user/clinic
 * @param appointmentId - The ID of the appointment
 * @param status - The new status
 */
export const updateAppointmentStatus = async (
  userId: string, 
  appointmentId: string, 
  status: Appointment['status']
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'appointments', appointmentId);
    
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    // If appointment is completed, update the patient's last visit date
    if (status === 'Completed') {
      const appointmentDoc = await getDoc(docRef);
      if (appointmentDoc.exists()) {
        const appointmentData = appointmentDoc.data() as Appointment;
        await updatePatient(userId, appointmentData.patientId, {
          lastVisit: appointmentData.date
        });
      }
    }
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

/**
 * Update an appointment with a Google Calendar event ID
 * @param userId - The ID of the user/clinic
 * @param appointmentId - The ID of the appointment
 * @param googleEventId - The Google Calendar event ID
 */
export const updateAppointmentWithGoogleEventId = async (
  userId: string,
  appointmentId: string,
  googleEventId: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'appointments', appointmentId);
    
    await updateDoc(docRef, {
      googleEventId,
      syncedWithGoogle: true,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating appointment with Google Calendar event ID:', error);
    throw error;
  }
}; 