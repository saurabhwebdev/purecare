// Google Calendar API integration
import { getUserSettings, updateSettingsModule } from '../firebase/settingsService';

// Type declarations for Google API
declare global {
  interface Window {
    gapi: {
      load: (apiName: string, callback: () => void) => void;
      client: {
        init: (params: {
          clientId: string;
          scope: string;
          discoveryDocs?: string[];
        }) => Promise<any>;
        calendar: {
          events: {
            update: (params: any) => Promise<any>;
            insert: (params: any) => Promise<any>;
            delete: (params: any) => Promise<any>;
            list: (params: any) => Promise<any>;
          };
        };
      };
    };
    google: {
      accounts: {
        id: {
          initialize: (params: {
            client_id: string;
            callback: (response: any) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, options: any) => void;
        };
        oauth2: {
          initTokenClient: (params: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: any) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

// Google API key type
export interface GoogleCalendarConfig {
  apiKey: string;
  clientId: string;
  calendarId: string;
}

// Appointment event type for Google Calendar
export interface CalendarEvent {
  id?: string;
  summary: string;
  description: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
  }[];
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: 'email' | 'popup';
      minutes: number;
    }[];
  };
}

// Global variable to track if we're in the process of loading Google Identity Services
let loadingGIS = false;

/**
 * Load Google Identity Services script
 * @returns Promise that resolves when GIS is loaded
 */
const loadGoogleIdentityServices = async (): Promise<boolean> => {
  // Check if Google Identity Services script is already loaded
  if (window.google?.accounts) {
    return true;
  }

  // Prevent multiple simultaneous loads
  if (loadingGIS) {
    return new Promise((resolve) => {
      // Poll for GIS initialization
      const checkGIS = setInterval(() => {
        if (window.google?.accounts) {
          clearInterval(checkGIS);
          resolve(true);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGIS);
        console.error('Timeout waiting for Google Identity Services to initialize');
        resolve(false);
      }, 10000);
    });
  }

  loadingGIS = true;

  // Load Google Identity Services script
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-identity-services-script';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      loadingGIS = false;
      resolve(true);
    };
    
    script.onerror = () => {
      loadingGIS = false;
      console.error('Failed to load Google Identity Services');
      resolve(false);
    };
    
    document.head.appendChild(script);
  });
};

/**
 * Initialize Google Calendar API
 * This function should be called when the app starts
 */
export const initGoogleCalendarAPI = async (): Promise<boolean> => {
  try {
    // Check if Google API script is already loaded
    if (document.getElementById('google-api-script')) {
      // Even if the script is loaded, wait for gapi to be fully initialized
      if (!window.gapi) {
        return new Promise((resolve) => {
          // Poll for gapi initialization
          const checkGapi = setInterval(() => {
            if (window.gapi) {
              clearInterval(checkGapi);
              resolve(true);
            }
          }, 100);
          
          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkGapi);
            console.error('Timeout waiting for gapi to initialize');
            resolve(false);
          }, 5000);
        });
      }
      return true;
    }

    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.id = 'google-api-script';
    script.async = true;
    script.defer = true;
    
    // Return a promise that resolves when the script is loaded
    return new Promise((resolve) => {
      script.onload = () => {
        // Wait for gapi to be fully initialized
        const checkGapi = setInterval(() => {
          if (window.gapi) {
            clearInterval(checkGapi);
            resolve(true);
          }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkGapi);
          console.error('Timeout waiting for gapi to initialize');
          resolve(false);
        }, 5000);
      };
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error initializing Google Calendar API:', error);
    return false;
  }
};

/**
 * Authenticate with Google Calendar API using user-specific credentials
 * @param userId User ID to fetch credentials from settings
 */
export const authenticateWithGoogle = async (userId: string): Promise<boolean> => {
  try {
    // Get user settings to access their Google API credentials
    const settings = await getUserSettings(userId);
    
    // Check if credentials are configured
    if (!settings.google.clientId) {
      console.error('Google Calendar Client ID not configured');
      return false;
    }
    
    // Initialize Google API if not already initialized
    if (!window.gapi) {
      const apiInitialized = await initGoogleCalendarAPI();
      if (!apiInitialized) {
        console.error('Failed to initialize Google API');
        return false;
      }
    }

    // Load Google Identity Services
    const gisLoaded = await loadGoogleIdentityServices();
    if (!gisLoaded) {
      console.error('Failed to load Google Identity Services');
      return false;
    }

    // Return a promise that resolves when auth is complete
    return new Promise((resolve) => {
      window.gapi.load('client', async () => {
        try {
          // Initialize the gapi client
          await window.gapi.client.init({
            clientId: settings.google.clientId,
            scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
          });
          
          // Get access token using Google Identity Services
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: settings.google.clientId,
            scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                console.error('Error getting access token:', tokenResponse);
                resolve(false);
                return;
              }

              // Update the apiKeyConfigured flag if successful
              await updateSettingsModule(userId, 'google', {
                ...settings.google,
                apiKeyConfigured: true
              });
              resolve(true);
            },
            error_callback: (error) => {
              console.error('Error authenticating with Google:', error);
              resolve(false);
            }
          });
          
          // Request an access token
          tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (error) {
          console.error('Error authenticating with Google:', error);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    return false;
  }
};

/**
 * Ensure Google Calendar API is initialized and authenticated
 * @param userId User ID
 */
export const ensureGoogleCalendarReady = async (userId: string): Promise<boolean> => {
  try {
    // Get user settings
    const settings = await getUserSettings(userId);
    
    // Check if Google Calendar is enabled
    if (!settings.google.calendarEnabled) {
      return false;
    }

    // Check if credentials are configured
    if (!settings.google.clientId) {
      console.error('Google Calendar Client ID not configured');
      return false;
    }

    // Initialize and authenticate with Google API
    if (!window.gapi || !window.gapi.client || !window.gapi.client.calendar) {
      // First ensure API is loaded
      const apiInitialized = await initGoogleCalendarAPI();
      if (!apiInitialized) {
        console.error('Failed to initialize Google API');
        return false;
      }
      
      // Load Google Identity Services
      const gisLoaded = await loadGoogleIdentityServices();
      if (!gisLoaded) {
        console.error('Failed to load Google Identity Services');
        return false;
      }
      
      // Then authenticate
      const authenticated = await authenticateWithGoogle(userId);
      if (!authenticated) {
        console.error('Failed to authenticate with Google Calendar');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring Google Calendar is ready:', error);
    return false;
  }
};

/**
 * Sync an appointment with Google Calendar
 * @param userId User ID
 * @param event Calendar event
 */
export const syncAppointmentWithGoogleCalendar = async (
  userId: string,
  event: CalendarEvent
): Promise<string | null> => {
  try {
    // Ensure Google Calendar API is ready
    const isReady = await ensureGoogleCalendarReady(userId);
    if (!isReady) {
      return null;
    }
    
    // Get user settings
    const settings = await getUserSettings(userId);
    
    // Use the user's calendar ID
    const calendarId = settings.google.calendarId || 'primary';

    // Create or update event
    let response;
    if (event.id) {
      // Update existing event
      response = await window.gapi.client.calendar.events.update({
        calendarId,
        eventId: event.id,
        resource: event,
      });
    } else {
      // Create new event
      response = await window.gapi.client.calendar.events.insert({
        calendarId,
        resource: event,
      });
    }

    // Update last sync date
    await updateSettingsModule(userId, 'google', {
      ...settings.google,
      lastSyncDate: new Date(),
    });

    return response.result.id;
  } catch (error) {
    console.error('Error syncing appointment with Google Calendar:', error);
    return null;
  }
};

/**
 * Delete an appointment from Google Calendar
 * @param userId User ID
 * @param eventId Event ID
 */
export const deleteAppointmentFromGoogleCalendar = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  try {
    // Get user settings
    const settings = await getUserSettings(userId);
    
    // Check if Google Calendar is enabled
    if (!settings.google.calendarEnabled || !settings.google.apiKeyConfigured) {
      return false;
    }

    // Use the user's calendar ID
    const calendarId = settings.google.calendarId || 'primary';

    // Delete event
    await window.gapi.client.calendar.events.delete({
      calendarId,
      eventId,
    });

    // Update last sync date
    await updateSettingsModule(userId, 'google', {
      ...settings.google,
      lastSyncDate: new Date(),
    });

    return true;
  } catch (error) {
    console.error('Error deleting appointment from Google Calendar:', error);
    return false;
  }
};

/**
 * Get user's Google Calendar events
 * @param userId User ID
 * @param params Query parameters
 */
export const getGoogleCalendarEvents = async (
  userId: string,
  params: {
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
  } = {}
): Promise<CalendarEvent[]> => {
  try {
    // Get user settings
    const settings = await getUserSettings(userId);
    
    // Check if Google Calendar is enabled
    if (!settings.google.calendarEnabled || !settings.google.apiKeyConfigured) {
      return [];
    }

    // Use the user's calendar ID
    const calendarId = settings.google.calendarId || 'primary';

    // Get events
    const response = await window.gapi.client.calendar.events.list({
      calendarId,
      timeMin: params.timeMin || new Date().toISOString(),
      timeMax: params.timeMax,
      maxResults: params.maxResults || 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.result.items;
  } catch (error) {
    console.error('Error getting Google Calendar events:', error);
    return [];
  }
}; 