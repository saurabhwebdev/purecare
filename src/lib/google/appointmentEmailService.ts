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
    
    // Find provider information if available
    let providerInfo = null;
    if (settings.providers && settings.providers.providers && settings.providers.providers.length > 0) {
      // Try to find the provider by name (case insensitive)
      providerInfo = settings.providers.providers.find(
        p => p.name.toLowerCase() === appointment.provider.toLowerCase()
      );
      
      // If exact match is not found, try to find a partial match
      if (!providerInfo) {
        providerInfo = settings.providers.providers.find(
          p => appointment.provider.toLowerCase().includes(p.name.toLowerCase()) || 
               p.name.toLowerCase().includes(appointment.provider.toLowerCase())
        );
      }
      
      // If still not found and there's a default provider, use that
      if (!providerInfo && settings.providers.defaultProvider) {
        providerInfo = settings.providers.providers.find(
          p => p.id === settings.providers.defaultProvider
        );
      }
    }
    
    // Build email content
    const emailSubject = `Appointment Confirmation: ${appointmentDate} at ${appointmentTime}`;
    
    const clinicInfo = {
      name: settings.clinic?.clinicName || 'Our Clinic',
      address: [settings.clinic?.address, settings.clinic?.city, settings.clinic?.state, settings.clinic?.zipCode].filter(Boolean).join(', '),
      phone: settings.clinic?.phone || 'N/A',
      email: settings.clinic?.email || 'N/A',
      website: settings.clinic?.website || '',
    };
    
    // Get provider name with title if available
    const providerName = providerInfo 
      ? `${providerInfo.title && providerInfo.title !== 'none' ? providerInfo.title + ' ' : ''}${providerInfo.name}`.trim()
      : appointment.provider;
      
    const providerSpecialty = providerInfo?.specialty || '';
    
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
      background-color: #f0f2f5;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px; 
      margin: 20px auto;
      background-color: transparent;
      padding: 0 15px;
    }
    .slip-container {
      background-color: #ffffff;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      overflow: hidden;
      margin-bottom: 20px;
    }
    .header { 
      background-color: #4f46e5;
      color: white;
      text-align: center; 
      padding: 35px 20px 45px;
      position: relative;
    }
    .ticket-tear {
      height: 20px;
      background: linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%),
                  linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
      background-color: #4f46e5;
      position: relative;
      top: -2px;
    }
    .logo { 
      font-size: 28px; 
      font-weight: bold;
      margin-bottom: 15px; 
      letter-spacing: 0.5px;
    }
    .appointment-type {
      display: inline-block;
      background-color: rgba(255,255,255,0.25);
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .content {
      padding: 35px;
    }
    .greeting {
      font-size: 18px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .appointment-intro {
      margin-bottom: 30px;
      color: #4b5563;
    }
    .date-time-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 20px;
    }
    .date-box, .time-box {
      background-color: #f8fafc;
      border-radius: 16px;
      padding: 25px 20px;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    .date-box h3, .time-box h3 {
      margin: 0 0 12px 0;
      color: #4f46e5;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .date-box p, .time-box p {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }
    .time-box p span {
      font-size: 14px;
      color: #64748b;
      display: block;
      margin-top: 5px;
      font-weight: normal;
    }
    .details-section {
      margin-bottom: 30px;
      background-color: #f8fafc;
      border-radius: 16px;
      padding: 25px;
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    .details-section:last-of-type {
      margin-bottom: 35px;
    }
    .details-section h3 {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #0f172a;
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .detail-row {
      display: flex;
      margin-bottom: 16px;
      align-items: flex-start;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-icon {
      color: #4f46e5;
      font-size: 18px;
      margin-right: 15px;
      min-width: 24px;
      text-align: center;
    }
    .detail-content {
      flex: 1;
    }
    .detail-content p {
      margin: 0;
      color: #1f2937;
      font-size: 15px;
    }
    .detail-label {
      font-weight: 600;
      margin-right: 5px;
    }
    .button-section {
      text-align: center;
      margin: 35px 0;
    }
    .button {
      display: inline-block;
      background-color: #4f46e5; 
      color: white !important; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 12px; 
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
      border: none;
      cursor: pointer;
    }
    .button:hover {
      background-color: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(79, 70, 229, 0.25);
    }
    .button-calendar {
      background-color: #10b981;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }
    .button-calendar:hover {
      background-color: #059669;
      box-shadow: 0 6px 15px rgba(16, 185, 129, 0.25);
    }
    .clinic-info { 
      background-color: #f8fafc;
      border-radius: 16px;
      padding: 25px;
      font-size: 14px; 
      color: #64748b; 
      margin-top: 20px;
      text-align: center;
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    .clinic-info p {
      margin: 0 0 10px 0;
    }
    .clinic-info p:last-child {
      margin-bottom: 0;
    }
    .clinic-info a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }
    .clinic-info a:hover {
      color: #4338ca;
      text-decoration: underline;
    }
    .footer { 
      text-align: center; 
      font-size: 12px; 
      color: #94a3b8; 
      margin-top: 25px;
      padding: 0 20px 20px;
    }
    .footer p {
      margin: 0 0 8px 0;
    }
    .footer p:last-child {
      margin-bottom: 0;
    }
    .appointment-barcode {
      text-align: center;
      margin: 35px 0;
      opacity: 0.9;
    }
    .appointment-barcode img {
      max-width: 80%;
      height: auto;
      border-radius: 8px;
      padding: 15px;
      background-color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .appointment-barcode p {
      margin: 10px 0 0 0;
      font-size: 13px;
      color: #64748b;
      letter-spacing: 0.5px;
    }
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        width: 100%;
        padding: 0;
      }
      .slip-container {
        border-radius: 0;
      }
      .content {
        padding: 25px 20px;
      }
      .date-time-section {
        flex-direction: column;
        gap: 15px;
      }
      .date-box, .time-box {
        width: 100%;
      }
      .details-section, .clinic-info {
        padding: 20px;
      }
      .button {
        display: block;
        width: 100%;
      }
      .appointment-barcode img {
        max-width: 90%;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="slip-container">
      <div class="header">
        <div class="logo">${clinicInfo.name}</div>
        <div class="appointment-type">${appointment.type}</div>
      </div>
      
      <div class="ticket-tear"></div>
      
      <div class="content">
        <p class="greeting">Hello <strong>${patient?.name || appointment.patientName}</strong>,</p>
        
        <p class="appointment-intro">Your appointment has been confirmed with the following details:</p>
        
        <div class="date-time-section">
          <div class="date-box">
            <h3>Date</h3>
            <p>${appointmentDate}</p>
          </div>
          <div class="time-box">
            <h3>Time</h3>
            <p>${appointmentTime} <span>${appointment.duration} mins</span></p>
          </div>
        </div>
        
        <div class="details-section">
          <h3>Provider</h3>
          <div class="detail-row">
            <div class="detail-icon">🩺</div>
            <div class="detail-content">
              <p><span class="detail-label">${providerInfo?.title && providerInfo.title !== 'none' ? providerInfo.title : ''}</span> ${providerInfo?.name || appointment.provider}</p>
              ${providerSpecialty ? `<p style="font-size: 13px; color: #64748b; margin-top: 4px;">${providerSpecialty}</p>` : ''}
            </div>
          </div>
        </div>
        
        ${appointment.notes ? `
        <div class="details-section">
          <h3>Appointment Notes</h3>
          <div class="detail-row">
            <div class="detail-icon">📝</div>
            <div class="detail-content">
              <p>${appointment.notes}</p>
            </div>
          </div>
        </div>` : ''}
        
        <div class="details-section">
          <h3>Location</h3>
          <div class="detail-row">
            <div class="detail-icon">📍</div>
            <div class="detail-content">
              <p>${clinicInfo.address}</p>
            </div>
          </div>
        </div>
        
        ${patient ? `
        <div class="details-section">
          <h3>Patient Information</h3>
          <div class="detail-row">
            <div class="detail-icon">👤</div>
            <div class="detail-content">
              <p><span class="detail-label">Name:</span>${patient.name}</p>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-icon">📞</div>
            <div class="detail-content">
              <p><span class="detail-label">Phone:</span>${patient.phone}</p>
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-icon">✉️</div>
            <div class="detail-content">
              <p><span class="detail-label">Email:</span>${patient.email}</p>
            </div>
          </div>
        </div>` : ''}
        
        <div class="button-section">
          <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${providerName}`)}&dates=${formatDateTimeForGoogleCalendar(appointment.date, appointment.time, appointment.duration)}&details=${encodeURIComponent(`Appointment Type: ${appointment.type}\nProvider: ${providerName}\n${providerSpecialty ? `Specialty: ${providerSpecialty}\n` : ''}${appointment.notes ? `Notes: ${appointment.notes}` : ''}`)}&location=${encodeURIComponent(clinicInfo.address)}" class="button button-calendar" target="_blank">
            Add to Calendar
          </a>
        </div>
        
        <div class="appointment-barcode">
          <img src="https://barcode.tec-it.com/barcode.ashx?data=APP-${appointment.id.substring(0,10)}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=&qunit=Mm&quiet=0" alt="Appointment Barcode">
          <p>Appointment ID: ${appointment.id.substring(0,10)}</p>
        </div>
        
        <div class="clinic-info">
          <p><strong>Need to reschedule?</strong></p>
          <p>Please contact us at ${clinicInfo.phone} or ${clinicInfo.email}</p>
          ${clinicInfo.website ? `<p><a href="${clinicInfo.website}">${clinicInfo.website}</a></p>` : ''}
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>© ${new Date().getFullYear()} ${clinicInfo.name}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
    
    // Convert HTML to plain text for non-HTML email clients
    const plainText = `
APPOINTMENT CONFIRMATION

Hello ${patient?.name || appointment.patientName},

Your appointment has been confirmed with the following details:

DATE: ${appointmentDate}
TIME: ${appointmentTime} (${appointment.duration} minutes)
PROVIDER: ${providerName}${providerSpecialty ? ` (${providerSpecialty})` : ''}
APPOINTMENT TYPE: ${appointment.type}
${appointment.notes ? `NOTES: ${appointment.notes}` : ''}

LOCATION:
${clinicInfo.address}

${patient ? `PATIENT INFORMATION:
Name: ${patient.name}
Phone: ${patient.phone}
Email: ${patient.email}` : ''}

To add this appointment to your calendar, please click the "Add to Calendar" link in the HTML version of this email.

Need to reschedule? Please contact us at ${clinicInfo.phone} or ${clinicInfo.email}
${clinicInfo.website ? `Website: ${clinicInfo.website}` : ''}

Appointment ID: ${appointment.id.substring(0,10)}

This is an automated message. Please do not reply to this email.
© ${new Date().getFullYear()} ${clinicInfo.name}. All rights reserved.
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