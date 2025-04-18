import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';

// Settings types
export interface ClinicSettings {
  clinicName: string;
  clinicDescription: string;
  specialty: string;
  licenseNumber: string;
  taxId: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LocationSettings {
  country: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
}

export interface FinancialSettings {
  currency: string;
  currencySymbol: string;
  taxRate: string;
  invoicePrefix: string;
  paymentMethods: {
    creditCard: boolean;
    bankTransfer: boolean;
    cash: boolean;
    insurance: boolean;
  };
}

export interface NotificationSettings {
  notificationsEmail: boolean;
  notificationsMobile: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
}

export interface AppearanceSettings {
  darkMode: boolean;
  compactMode: boolean;
}

export interface GoogleSettings {
  calendarEnabled: boolean;
  calendarId: string;
  syncAppointments: boolean;
  syncReminders: boolean;
  apiKeyConfigured: boolean;
  lastSyncDate?: Date | null;
  clientId?: string;
  apiKey?: string;
}

export interface GmailSettings {
  enabled: boolean;
  clientId?: string;
  apiKey?: string;
  syncEmails: boolean;
  syncContacts: boolean;
  emailLabels?: string[];
  lastSyncDate?: Date | null;
  apiKeyConfigured: boolean;
}

export interface UserSettings {
  clinic: ClinicSettings;
  location: LocationSettings;
  financial: FinancialSettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  google: GoogleSettings;
  gmail?: GmailSettings;
  lastUpdated?: Date;
}

// Default settings
export const defaultSettings: UserSettings = {
  clinic: {
    clinicName: '',
    clinicDescription: '',
    specialty: '',
    licenseNumber: '',
    taxId: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  },
  location: {
    country: 'US',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  },
  financial: {
    currency: 'USD',
    currencySymbol: '$',
    taxRate: '',
    invoicePrefix: 'INV-',
    paymentMethods: {
      creditCard: true,
      bankTransfer: true,
      cash: true,
      insurance: true,
    },
  },
  notifications: {
    notificationsEmail: true,
    notificationsMobile: true,
    appointmentReminders: true,
    marketingEmails: false,
  },
  appearance: {
    darkMode: false,
    compactMode: false,
  },
  google: {
    calendarEnabled: false,
    calendarId: '',
    syncAppointments: true,
    syncReminders: true,
    apiKeyConfigured: false,
    lastSyncDate: null,
    clientId: '',
    apiKey: '',
  },
  gmail: {
    enabled: false,
    clientId: '',
    apiKey: '',
    syncEmails: true,
    syncContacts: true,
    emailLabels: [],
    lastSyncDate: null,
    apiKeyConfigured: false
  },
};

/**
 * Get user settings from Firestore
 * @param userId The user's ID
 */
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    const docRef = doc(db, 'userSettings', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserSettings;
      
      // Convert any server timestamps back to Date objects
      if (data.lastUpdated) {
        data.lastUpdated = new Date(data.lastUpdated as any);
      }
      
      return data;
    } else {
      // No settings found, create default settings
      await setDoc(docRef, {
        ...defaultSettings,
        lastUpdated: new Date()
      });
      return defaultSettings;
    }
  } catch (error) {
    console.error("Error getting user settings:", error);
    return defaultSettings;
  }
};

/**
 * Update user settings in Firestore
 * @param userId The user's ID
 * @param settings The settings to update
 */
export const updateUserSettings = async (
  userId: string, 
  settings: Partial<UserSettings>
): Promise<void> => {
  try {
    const docRef = doc(db, 'userSettings', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update existing settings
      await updateDoc(docRef, {
        ...settings,
        lastUpdated: new Date()
      });
    } else {
      // Create new settings document
      await setDoc(docRef, {
        ...defaultSettings,
        ...settings,
        lastUpdated: new Date()
      });
    }
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
};

/**
 * Update a specific settings module
 * @param userId The user's ID
 * @param module The settings module to update
 * @param data The module data to update
 */
export const updateSettingsModule = async (
  userId: string,
  module: keyof Omit<UserSettings, 'lastUpdated'>,
  data: any
): Promise<void> => {
  try {
    const docRef = doc(db, 'userSettings', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update just the specific module
      await updateDoc(docRef, {
        [module]: data,
        lastUpdated: new Date()
      });
    } else {
      // Create new settings with module data
      const newSettings = { ...defaultSettings };
      newSettings[module] = data;
      
      await setDoc(docRef, {
        ...newSettings,
        lastUpdated: new Date()
      });
    }
  } catch (error) {
    console.error(`Error updating ${module} settings:`, error);
    throw error;
  }
};

/**
 * Subscribe to settings changes
 * @param userId The user's ID
 * @param callback Function to call when settings change
 */
export const subscribeToSettings = (
  userId: string,
  callback: (settings: UserSettings) => void
) => {
  const docRef = doc(db, 'userSettings', userId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as UserSettings;
      
      // Convert any server timestamps back to Date objects
      if (data.lastUpdated) {
        data.lastUpdated = new Date(data.lastUpdated as any);
      }
      
      callback(data);
    } else {
      callback(defaultSettings);
    }
  });
}; 