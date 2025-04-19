import { getAuth } from 'firebase/auth';
import { getUserSettings, updateSettingsModule } from '../firebase/settingsService';

// Type declarations for Google API
declare global {
  interface Window {
    gapi: {
      load: (apiName: string, callback: () => void) => void;
      client: {
        init: (params: {
          clientId?: string; 
          apiKey?: string;
          scope?: string;
          discoveryDocs?: string[];
        }) => Promise<any>;
        setToken: (token: string) => void;
        gmail: {
          users: {
            messages: {
              send: (params: any) => Promise<any>;
            };
          };
        };
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (params: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: any) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { 
              prompt?: string;
            }) => void;
          };
        };
      };
    };
  }
}

// Gmail API scopes required for this application
const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
const SCOPES_STRING = GMAIL_SCOPES.join(' ');

// Token response interface
interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  expires_at?: number;
}

// Storage keys
const TOKEN_STORAGE_KEY = 'gmail_token';
const TOKEN_USER_ID_KEY = 'gmail_user_id';

// Global variables for authentication state
let loadingGIS = false;
let currentTokenResponse: TokenResponse | null = null;
let tokenExpiryTimer: NodeJS.Timeout | null = null;

/**
 * Save the token to localStorage
 * @param userId User ID associated with the token
 * @param tokenResponse The token to save
 */
const saveTokenToStorage = (userId: string, tokenResponse: TokenResponse) => {
  try {
    // Store the token in localStorage
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenResponse));
    localStorage.setItem(TOKEN_USER_ID_KEY, userId);
  } catch (error) {
    console.error('Error saving token to storage:', error);
  }
};

/**
 * Load the token from localStorage
 * @param userId User ID to validate the token belongs to the correct user
 * @returns The stored token or null if not found or invalid
 */
const loadTokenFromStorage = (userId: string): TokenResponse | null => {
  try {
    // Check if the stored token belongs to the current user
    const storedUserId = localStorage.getItem(TOKEN_USER_ID_KEY);
    if (storedUserId !== userId) {
      return null;
    }
    
    // Get the token from localStorage
    const tokenJson = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!tokenJson) {
      return null;
    }
    
    // Parse the token
    const token = JSON.parse(tokenJson) as TokenResponse;
    
    // Verify the token has the required fields
    if (!token.access_token || !token.expires_at) {
      return null;
    }
    
    // Check if the token is expired
    if (token.expires_at < Date.now()) {
      // Clear expired token
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(TOKEN_USER_ID_KEY);
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error loading token from storage:', error);
    return null;
  }
};

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
 * Initialize Gmail API
 */
const initGmailAPI = async (): Promise<boolean> => {
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
    console.error('Error initializing Gmail API:', error);
    return false;
  }
};

/**
 * Setup token refresh before expiration
 * @param tokenClient The token client
 * @param tokenResponse The token response
 * @param userId The user ID
 */
const setupTokenRefresh = (tokenClient: any, tokenResponse: TokenResponse, userId: string) => {
  // Store the token response with expiration time
  const expiresAt = Date.now() + (tokenResponse.expires_in * 1000);
  currentTokenResponse = {
    ...tokenResponse,
    expires_at: expiresAt
  };
  
  // Save token to localStorage for persistence
  saveTokenToStorage(userId, currentTokenResponse);

  // Clear any existing timer
  if (tokenExpiryTimer) {
    clearTimeout(tokenExpiryTimer);
  }

  // Set a timer to refresh the token 5 minutes before it expires
  const timeToRefresh = (tokenResponse.expires_in - 300) * 1000;
  if (timeToRefresh > 0) {
    tokenExpiryTimer = setTimeout(() => {
      tokenClient.requestAccessToken({ prompt: '' });
    }, timeToRefresh);
  }
};

/**
 * Apply the access token to the gapi client
 * @param accessToken The access token to apply
 */
const applyAccessToken = (accessToken: string) => {
  if (window.gapi?.client?.setToken) {
    // @ts-ignore
    window.gapi.client.setToken({ access_token: accessToken });
  }
};

/**
 * Initialize the GAPI client
 * @param clientId The client ID
 * @param apiKey The API key
 */
const initGapiClient = async (clientId: string, apiKey?: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // @ts-ignore
      window.gapi.load('client', async () => {
        try {
          // Initialize the client with minimal settings
          await window.gapi.client.init({
            apiKey: apiKey,
            clientId: clientId
          });
          
          // In the newer Google API approach, we don't need to load the discovery document
          // The Gmail API will be available after authentication
          
          resolve();
        } catch (error) {
          console.error('Error initializing GAPI client:', error);
          reject(error);
        }
      });
    } catch (error) {
      console.error('Error loading GAPI client:', error);
      reject(error);
    }
  });
};

/**
 * Check if the current token is valid
 */
const isTokenValid = (): boolean => {
  if (!currentTokenResponse || !currentTokenResponse.expires_at) {
    return false;
  }
  
  // Return true if the token is valid for at least 5 more minutes
  const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
  return currentTokenResponse.expires_at > fiveMinutesFromNow;
};

/**
 * Authenticate with Gmail API
 * @param userId The user ID
 */
export const authenticateWithGmail = async (userId: string): Promise<boolean> => {
  try {
    // Get user settings
    const settings = await getUserSettings(userId);
    
    // Check if credentials are configured
    if (!settings.gmail?.enabled || !settings.gmail?.clientId) {
      console.error('Gmail integration is not enabled or configured properly');
      return false;
    }
    
    // First check if we have a valid stored token
    const storedToken = loadTokenFromStorage(userId);
    if (storedToken && storedToken.access_token) {
      // Apply the stored token
      applyAccessToken(storedToken.access_token);
      currentTokenResponse = storedToken;
      
      // Initialize the GAPI client
      await initGapiClient(settings.gmail.clientId, settings.gmail.apiKey);
      
      // Since we have a valid token, we can skip the authentication prompt
      return true;
    }

    // Return a promise that resolves when auth is complete
    return new Promise((resolve) => {
      // First initialize the gapi client
      initGapiClient(settings.gmail.clientId, settings.gmail.apiKey)
        .then(() => {
          // Now initialize the token client with GIS
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: settings.gmail.clientId,
            scope: SCOPES_STRING,
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                console.error('Error getting access token:', tokenResponse);
                resolve(false);
                return;
              }

              // Apply the token to the gapi client
              applyAccessToken(tokenResponse.access_token);
              
              // Setup automatic token refresh
              setupTokenRefresh(tokenClient, tokenResponse, userId);

              // Update the apiKeyConfigured flag if successful
              await updateSettingsModule(userId, 'gmail', {
                ...settings.gmail,
                apiKeyConfigured: true
              });
              
              resolve(true);
            },
            error_callback: (error) => {
              console.error('Error authenticating with Gmail:', error);
              resolve(false);
            }
          });
          
          // Request an access token
          tokenClient.requestAccessToken({
            prompt: settings.gmail.apiKeyConfigured ? '' : 'consent',
          });
        })
        .catch((error) => {
          console.error('Failed to initialize gapi client:', error);
          resolve(false);
        });
    });
  } catch (error) {
    console.error('Error authenticating with Gmail:', error);
    return false;
  }
};

/**
 * Ensure Gmail API is initialized and authenticated
 * @param userId The user ID
 */
export const ensureGmailReady = async (userId: string): Promise<boolean> => {
  try {
    // Get user settings
    const settings = await getUserSettings(userId);
    
    // Check if Gmail is enabled
    if (!settings.gmail?.enabled) {
      return false;
    }

    // Check if credentials are configured
    if (!settings.gmail?.clientId) {
      console.error('Gmail Client ID not configured');
      return false;
    }

    // First try to load a token from storage
    if (!currentTokenResponse) {
      const storedToken = loadTokenFromStorage(userId);
      if (storedToken) {
        currentTokenResponse = storedToken;
        applyAccessToken(storedToken.access_token);
      }
    }

    // Check if we already have a valid token
    if (isTokenValid() && window.gapi?.client?.gmail) {
      return true;
    }

    // Initialize and authenticate with Gmail API
    if (!window.gapi || !window.gapi.client || !window.gapi.client.gmail) {
      // First ensure API is loaded
      const apiInitialized = await initGmailAPI();
      if (!apiInitialized) {
        console.error('Failed to initialize Gmail API');
        return false;
      }
      
      // Load Google Identity Services
      const gisLoaded = await loadGoogleIdentityServices();
      if (!gisLoaded) {
        console.error('Failed to load Google Identity Services');
        return false;
      }
      
      // Then authenticate
      const authenticated = await authenticateWithGmail(userId);
      if (!authenticated) {
        console.error('Failed to authenticate with Gmail');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring Gmail is ready:', error);
    return false;
  }
};

/**
 * Send a test email to verify Gmail integration is working
 * @param userId The user ID
 * @param recipientEmail The email address to send the test email to
 */
const sendGmailTestEmail = async (userId: string, recipientEmail: string): Promise<boolean> => {
  try {
    // Ensure Gmail API is ready
    const isReady = await ensureGmailReady(userId);
    if (!isReady) {
      throw new Error('Gmail API is not ready');
    }
    
    // Get current user info
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userEmail = currentUser?.email || 'PureCare User';
    const userName = currentUser?.displayName || 'PureCare User';

    // Create email content with proper MIME formatting
    const emailLines = [
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      `To: ${recipientEmail}`,
      `From: ${userName} <${userEmail}>`,
      'Subject: PureCare Gmail Integration Test',
      '',
      'This is a test email from PureCare to verify that your Gmail integration is working correctly.',
      '',
      'If you\'re receiving this message, your Gmail integration is properly configured!',
      '',
      `Sent from PureCare Healthcare Management System at ${new Date().toLocaleString()}`
    ];
    const emailContent = emailLines.join('\r\n');

    // Encode the email to base64 URL-safe format
    let encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Create a direct fetch request to the Gmail API instead of using the gapi client
    // This avoids issues with the discovery document
    const accessToken = currentTokenResponse?.access_token;
    if (!accessToken) {
      throw new Error('No access token available');
    }
    
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error sending email via Gmail API:', errorData);
      throw new Error(`Gmail API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

/**
 * Public function to send a test email
 * @param recipientEmail The email address to send the test email to
 */
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }
    
    return await sendGmailTestEmail(currentUser.uid, recipientEmail);
  } catch (error) {
    console.error('Error in sendTestEmail:', error);
    throw error;
  }
} 