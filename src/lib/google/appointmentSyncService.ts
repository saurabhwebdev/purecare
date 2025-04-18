import { Appointment, updateAppointmentWithGoogleEventId } from '../firebase/patientService';
import { CalendarEvent, syncAppointmentWithGoogleCalendar, authenticateWithGoogle } from './googleCalendarService';
import { getUserSettings } from '../firebase/settingsService';
import { parseISO, addMinutes, format } from 'date-fns';

/**
 * Convert an appointment to a Google Calendar event
 * @param appointment The appointment to convert
 * @param timezone The user's timezone
 */
export const convertAppointmentToCalendarEvent = (
  appointment: Appointment,
  timezone: string
): CalendarEvent => {
  // Parse the date and time
  const startDateTime = parseISO(`${appointment.date}T${appointment.time}`);
  const endDateTime = addMinutes(startDateTime, appointment.duration);

  return {
    summary: `Appointment: ${appointment.patientName}`,
    description: `Type: ${appointment.type}
Provider: ${appointment.provider}
Notes: ${appointment.notes || 'None'}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: timezone,
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: timezone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 }, // 30 minutes before
      ],
    },
    // If the appointment already has a Google Event ID, include it
    ...(appointment.googleEventId && { id: appointment.googleEventId }),
  };
};

/**
 * Sync an appointment with Google Calendar
 * @param userId The user ID
 * @param appointment The appointment to sync
 */
export const syncAppointmentToGoogleCalendar = async (
  userId: string,
  appointment: Appointment
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Starting Google Calendar sync for appointment:', appointment);
    
    // Get user settings to check if Google Calendar is enabled
    const settings = await getUserSettings(userId);
    console.log('User settings for Google Calendar:', settings.google);
    
    // Check if Google Calendar is enabled
    if (!settings.google.calendarEnabled) {
      console.log('Google Calendar integration is not enabled');
      return {
        success: false,
        message: 'Google Calendar integration is not enabled. Please enable it in settings first.',
      };
    }

    // Check if client ID is configured
    if (!settings.google.clientId) {
      console.log('Google Calendar Client ID is not configured');
      return {
        success: false,
        message: 'Google Calendar Client ID is not configured. Please add your Google OAuth Client ID in settings first.',
      };
    }

    // Authenticate with Google if needed
    if (!settings.google.apiKeyConfigured) {
      console.log('Attempting to authenticate with Google Calendar');
      const authenticated = await authenticateWithGoogle(userId);
      if (!authenticated) {
        console.log('Failed to authenticate with Google Calendar');
        return {
          success: false,
          message: 'Failed to authenticate with Google Calendar. Please check your credentials in settings.',
        };
      }
      console.log('Successfully authenticated with Google Calendar');
    }

    // Convert appointment to calendar event
    const calendarEvent = convertAppointmentToCalendarEvent(
      appointment,
      settings.location?.timezone || 'America/New_York'
    );
    console.log('Converted appointment to calendar event:', calendarEvent);

    // Sync with Google Calendar
    console.log('Syncing event with Google Calendar...');
    const googleEventId = await syncAppointmentWithGoogleCalendar(userId, calendarEvent);
    console.log('Google Calendar sync result, event ID:', googleEventId);

    // If sync was successful, update the appointment with the Google Event ID
    if (googleEventId) {
      console.log('Updating appointment with Google Event ID');
      await updateAppointmentWithGoogleEventId(userId, appointment.id || '', googleEventId);
      
      return {
        success: true,
        message: 'Appointment successfully synced with Google Calendar.',
      };
    }

    console.log('Failed to sync with Google Calendar - no event ID returned');
    return {
      success: false,
      message: 'Failed to sync appointment with Google Calendar.',
    };
  } catch (error) {
    console.error('Error syncing appointment with Google Calendar:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    };
  }
}; 