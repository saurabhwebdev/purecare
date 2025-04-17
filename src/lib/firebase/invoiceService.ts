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
import { getUserSettings } from './settingsService';

// Invoice item interface
export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Invoice interface
export interface Invoice {
  id?: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  clinicInfo?: {
    clinicName: string;
    clinicAddress: string;
    clinicContact: string;
    taxId: string;
  };
}

// Generate a unique invoice number
export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `INV-${year}${month}-${randomDigits}`;
};

/**
 * Get all invoices
 * @param userId The doctor's ID
 */
export const getAllInvoices = async (userId: string) => {
  try {
    const invoicesRef = collection(db, 'invoices');
    const q = query(
      invoicesRef,
      where('doctorId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const invoices: Invoice[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Invoice, 'id'>;
      invoices.push({
        id: doc.id,
        ...data,
      });
    });

    return invoices;
  } catch (error) {
    console.error('Error getting invoices:', error);
    throw error;
  }
};

/**
 * Get invoices for a specific patient
 * @param doctorId The doctor's ID
 * @param patientId The patient's ID
 */
export const getPatientInvoices = async (doctorId: string, patientId: string) => {
  try {
    const invoicesRef = collection(db, 'invoices');
    const q = query(
      invoicesRef,
      where('doctorId', '==', doctorId),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const invoices: Invoice[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Invoice, 'id'>;
      invoices.push({
        id: doc.id,
        ...data,
      });
    });

    return invoices;
  } catch (error) {
    console.error('Error getting patient invoices:', error);
    throw error;
  }
};

/**
 * Get an invoice by ID
 * @param invoiceId The invoice ID
 */
export const getInvoice = async (invoiceId: string) => {
  try {
    const docRef = doc(db, 'invoices', invoiceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Invoice, 'id'>;
      return {
        id: docSnap.id,
        ...data,
      } as Invoice;
    } else {
      throw new Error('Invoice not found');
    }
  } catch (error) {
    console.error('Error getting invoice:', error);
    throw error;
  }
};

/**
 * Create a new invoice with clinic info from settings
 * @param doctorId The doctor's ID
 * @param invoice The invoice data
 */
export const createInvoice = async (
  doctorId: string, 
  invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'clinicInfo' | 'invoiceNumber'>
) => {
  try {
    // Get clinic settings for the invoice
    const settings = await getUserSettings(doctorId);
    
    const clinicInfo = {
      clinicName: settings.clinic.clinicName,
      clinicAddress: `${settings.clinic.address}, ${settings.clinic.city}, ${settings.clinic.state} ${settings.clinic.zipCode}`,
      clinicContact: `Phone: ${settings.clinic.phone} | Email: ${settings.clinic.email}`,
      taxId: settings.clinic.taxId || '',
    };

    // Generate invoice number if not provided
    const invoiceNumber = generateInvoiceNumber();

    const invoiceWithTimestamp = {
      ...invoice,
      invoiceNumber,
      doctorId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      clinicInfo,
    };

    const docRef = await addDoc(collection(db, 'invoices'), invoiceWithTimestamp);
    
    return {
      id: docRef.id,
      ...invoiceWithTimestamp,
    };
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

/**
 * Update an invoice
 * @param invoiceId The invoice ID
 * @param invoice The updated invoice data
 */
export const updateInvoice = async (
  invoiceId: string,
  invoice: Partial<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  try {
    const docRef = doc(db, 'invoices', invoiceId);
    
    await updateDoc(docRef, {
      ...invoice,
      updatedAt: serverTimestamp(),
    });
    
    return {
      id: invoiceId,
      ...invoice,
    };
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

/**
 * Delete an invoice
 * @param invoiceId The invoice ID
 */
export const deleteInvoice = async (invoiceId: string) => {
  try {
    const docRef = doc(db, 'invoices', invoiceId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

/**
 * Update invoice status
 * @param invoiceId The invoice ID
 * @param status The new status
 */
export const updateInvoiceStatus = async (
  invoiceId: string, 
  status: Invoice['status'],
  paymentMethod?: string,
  paymentDate?: string
) => {
  try {
    const docRef = doc(db, 'invoices', invoiceId);
    
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    // Add payment details if status is paid
    if (status === 'paid' && paymentMethod) {
      updateData.paymentMethod = paymentMethod;
      updateData.paymentDate = paymentDate || new Date().toISOString().split('T')[0];
    }
    
    await updateDoc(docRef, updateData);
    
    return {
      id: invoiceId,
      status,
      ...(paymentMethod && { paymentMethod }),
      ...(paymentDate && { paymentDate }),
    };
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
};

/**
 * Get user settings and invoice data for PDF generation
 * @param doctorId The doctor's ID
 * @param invoiceId The invoice ID
 */
export const getInvoiceWithSettings = async (doctorId: string, invoiceId: string) => {
  try {
    const [settings, invoice] = await Promise.all([
      getUserSettings(doctorId),
      getInvoice(invoiceId)
    ]);
    
    return {
      settings,
      invoice
    };
  } catch (error) {
    console.error('Error getting invoice with settings:', error);
    throw error;
  }
}; 