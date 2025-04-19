import { getAuth } from 'firebase/auth';
import { getUserSettings } from '../firebase/settingsService';
import { Appointment, getPatient } from '../firebase/patientService';
import { format, parseISO } from 'date-fns';

/**
 * Send an appointment confirmation email
 * @param userId The user ID
 * @param appointment The appointment to send details for
 * @param recipientEmail The email address to send to
 */
export const sendAppointmentEmail = async (
  userId: string,
  appointment: Appointment,
  recipientEmail: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get clinic info from settings
    const settings = await getUserSettings(userId);
    
    if (!settings.gmail?.enabled || !settings.gmail?.clientId) {
      return {
        success: false,
        message: "Gmail integration is not enabled. Please enable it in settings first."
      };
    }
    
    // Get additional patient information
    const patient = await getPatient(userId, appointment.patientId);
    
    // Format date and time for display
    const appointmentDate = format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy');
    const appointmentTime = appointment.time;
    const appointmentEndTime = calculateEndTime(appointment.time, appointment.duration);
    
    // Build email content
    const emailSubject = `Appointment Confirmation: ${appointmentDate} at ${appointmentTime}`;
    
    const clinicInfo = {
      name: settings.clinic?.clinicName || 'Our Clinic',
      address: [settings.clinic?.address, settings.clinic?.city, settings.clinic?.state, settings.clinic?.zipCode].filter(Boolean).join(', '),
      phone: settings.clinic?.phone || 'N/A',
      email: settings.clinic?.email || 'N/A',
      website: settings.clinic?.website || '',
    };
    
    // Build email HTML content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      padding: 30px;
      margin-bottom: 20px;
    }
    .header { 
      text-align: center; 
      margin-bottom: 30px; 
      border-bottom: 2px solid #f3f4f6;
      padding-bottom: 20px;
    }
    .logo { 
      font-size: 28px; 
      font-weight: bold; 
      color: #4f46e5; 
      margin-bottom: 10px; 
    }
    .appointment-badge {
      display: inline-block;
      background-color: #4f46e5;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .appointment-details { 
      background-color: #f9fafb; 
      border-radius: 10px;
      padding: 25px; 
      margin-bottom: 25px; 
    }
    .details-row { 
      display: flex; 
      margin-bottom: 15px;
      align-items: flex-start;
    }
    .details-label { 
      font-weight: 600; 
      width: 130px; 
      color: #6b7280;
    }
    .details-value { 
      flex: 1; 
    }
    .patient-info { 
      margin-bottom: 25px; 
      background-color: #f9fafb;
      border-radius: 10px;
      padding: 20px;
    }
    .clinic-info { 
      font-size: 14px; 
      color: #6b7280; 
      text-align: center; 
      margin-top: 30px; 
      padding-top: 20px; 
      border-top: 1px solid #e5e7eb; 
    }
    .footer { 
      text-align: center; 
      font-size: 12px; 
      color: #9ca3af; 
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .button { 
      display: inline-block;
      background-color: #4f46e5; 
      color: white !important; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 600;
      margin-right: 10px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #4338ca;
    }
    .button-calendar {
      background-color: #10b981;
    }
    .button-calendar:hover {
      background-color: #059669;
    }
    .button-section {
      text-align: center;
      margin: 30px 0;
    }
    .icon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-position: center;
    }
    @media (max-width: 600px) {
      .details-row { flex-direction: column; }
      .details-label { width: 100%; margin-bottom: 5px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${clinicInfo.name}</div>
      <div class="appointment-badge">Appointment Confirmation</div>
    </div>
    
    <p class="greeting">Hello ${patient?.name || appointment.patientName},</p>
    
    <p>Your appointment has been successfully scheduled with <strong>${appointment.provider}</strong> at ${clinicInfo.name}.</p>
    
    <div class="appointment-details">
      <div class="details-row">
        <div class="details-label">📅 Date:</div>
        <div class="details-value">${appointmentDate}</div>
      </div>
      <div class="details-row">
        <div class="details-label">⏰ Time:</div>
        <div class="details-value">${appointmentTime} - ${appointmentEndTime}</div>
      </div>
      <div class="details-row">
        <div class="details-label">⏱️ Duration:</div>
        <div class="details-value">${appointment.duration} minutes</div>
      </div>
      <div class="details-row">
        <div class="details-label">🏥 Type:</div>
        <div class="details-value">${appointment.type}</div>
      </div>
      <div class="details-row">
        <div class="details-label">👨‍⚕️ Provider:</div>
        <div class="details-value">${appointment.provider}</div>
      </div>
      ${appointment.notes ? `
      <div class="details-row">
        <div class="details-label">📝 Notes:</div>
        <div class="details-value">${appointment.notes}</div>
      </div>` : ''}
    </div>

    <div class="button-section">
      <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${appointment.provider}`)}&dates=${formatDateTimeForGoogleCalendar(appointment.date, appointment.time, appointment.duration)}&details=${encodeURIComponent(`Appointment Type: ${appointment.type}\nProvider: ${appointment.provider}\n${appointment.notes ? `Notes: ${appointment.notes}` : ''}`)}&location=${encodeURIComponent(clinicInfo.address)}" class="button button-calendar" target="_blank">
        Add to Calendar
      </a>
    </div>

    ${patient ? `
    <div class="patient-info">
      <p style="margin-top: 0;"><strong>Your Information:</strong></p>
      <p style="margin-bottom: 0;">👤 Name: ${patient.name}<br>
      📞 Phone: ${patient.phone}<br>
      ✉️ Email: ${patient.email}</p>
    </div>` : ''}
    
    <p><strong>📍 Clinic Location:</strong><br>
    ${clinicInfo.address}</p>
    
    <p>If you need to reschedule or cancel your appointment, please contact us at ${clinicInfo.phone} or ${clinicInfo.email}.</p>
    
    <div class="clinic-info">
      <p>${clinicInfo.name}<br>
      ${clinicInfo.address}<br>
      Phone: ${clinicInfo.phone}<br>
      Email: ${clinicInfo.email}
      ${clinicInfo.website ? `<br>Website: <a href="${clinicInfo.website}" style="color: #4f46e5; text-decoration: none;">${clinicInfo.website}</a>` : ''}
      </p>
    </div>
    
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `;
    
    // Convert HTML to plain text for non-HTML email clients
    const plainText = `
APPOINTMENT CONFIRMATION

Hello ${patient?.name || appointment.patientName},

Your appointment has been successfully scheduled with ${appointment.provider} at ${clinicInfo.name}.

APPOINTMENT DETAILS:
Date: ${appointmentDate}
Time: ${appointmentTime} - ${appointmentEndTime}
Duration: ${appointment.duration} minutes
Appointment Type: ${appointment.type}
Provider: ${appointment.provider}
${appointment.notes ? `Notes: ${appointment.notes}` : ''}

To add this appointment to your calendar, please click the "Add to Calendar" link in the HTML version of this email.

${patient ? `YOUR INFORMATION:
Name: ${patient.name}
Phone: ${patient.phone}
Email: ${patient.email}` : ''}

CLINIC LOCATION:
${clinicInfo.address}

If you need to reschedule or cancel your appointment, please contact us at ${clinicInfo.phone} or ${clinicInfo.email}.

${clinicInfo.name}
${clinicInfo.address}
Phone: ${clinicInfo.phone}
Email: ${clinicInfo.email}
${clinicInfo.website ? `Website: ${clinicInfo.website}` : ''}

This is an automated message, please do not reply to this email.
    `.trim();
    
    // Make direct fetch request to Gmail API with access token
    const accessToken = await getGmailAccessToken(userId);
    if (!accessToken) {
      return {
        success: false,
        message: "Failed to get Gmail authentication token. Please check your Gmail settings."
      };
    }
    
    // Create email content with MIME formatting for both HTML and plain text
    const boundary = `boundary_${Date.now().toString(36)}`;
    const emailLines = [
      'MIME-Version: 1.0',
      `To: ${recipientEmail}`,
      `From: ${clinicInfo.name} <${settings.clinic?.email || 'noreply@example.com'}>`,
      `Subject: ${emailSubject}`,
      `Content-Type: multipart/alternative; boundary=${boundary}`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      '',
      plainText,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      '',
      emailHtml,
      '',
      `--${boundary}--`
    ];
    
    const emailContent = emailLines.join('\r\n');
    
    // Encode the email to base64 URL-safe format
    let encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the email via Gmail API
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
      return {
        success: false,
        message: `Gmail API error: ${errorData.error?.message || 'Unknown error'}`
      };
    }
    
    return {
      success: true,
      message: `Appointment details sent to ${recipientEmail}`
    };
  } catch (error) {
    console.error('Error sending appointment email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error sending appointment email'
    };
  }
};

/**
 * Get Gmail access token from current token or localStorage
 */
const getGmailAccessToken = async (userId: string): Promise<string | null> => {
  try {
    // Try to get token from localStorage first
    const tokenJson = localStorage.getItem('gmail_token');
    const userIdJson = localStorage.getItem('gmail_user_id');
    
    if (tokenJson && userIdJson === userId) {
      const token = JSON.parse(tokenJson);
      
      // Check if token is not expired
      if (token.expires_at && token.expires_at > Date.now()) {
        return token.access_token;
      }
    }
    
    // Token expired or not found, use Gmail service to authenticate or refresh
    // Import dynamically to avoid circular dependencies
    const { ensureGmailReady } = await import('./gmailService');
    const ready = await ensureGmailReady(userId);
    
    if (ready) {
      // After authentication, the token should be in localStorage
      const newTokenJson = localStorage.getItem('gmail_token');
      if (newTokenJson) {
        const newToken = JSON.parse(newTokenJson);
        return newToken.access_token;
      }
    } else {
      // If authentication failed, redirect to settings
      if (typeof window !== 'undefined') {
        alert('Your Gmail authentication has expired. Please re-authenticate in Settings.');
        window.location.href = `/settings?tab=integrations&promptGmail=true`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Gmail access token:', error);
    
    // Show a more helpful error message to the user
    if (typeof window !== 'undefined') {
      alert('There was a problem authenticating with Gmail. Please check your settings and try again.');
      window.location.href = '/settings?tab=integrations&promptGmail=true';
    }
    
    return null;
  }
};

/**
 * Format date and time for Google Calendar link
 */
const formatDateTimeForGoogleCalendar = (date: string, time: string, duration: number): string => {
  try {
    // Parse start date and time
    const startDate = parseISO(date);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create full start datetime
    const startDateTime = new Date(startDate);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    // Create end datetime (add duration)
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration);
    
    // Format for Google Calendar (YYYYMMDDTHHmmssZ/YYYYMMDDTHHmmssZ)
    const formatForCalendar = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    return `${formatForCalendar(startDateTime)}/${formatForCalendar(endDateTime)}`;
  } catch (error) {
    console.error('Error formatting date for calendar:', error);
    return '';
  }
};

/**
 * Calculate end time based on start time and duration
 */
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  try {
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // Calculate end time
    let endHours = hours;
    let endMinutes = minutes + durationMinutes;
    
    // Handle minute overflow
    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
    }
    
    // Handle 24-hour overflow
    if (endHours >= 24) {
      endHours = endHours % 24;
    }
    
    // Format as HH:MM
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Error calculating end time:', error);
    return startTime; // Return original time if calculation fails
  }
}; 