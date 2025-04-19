import { getAuth } from 'firebase/auth';
import { getUserSettings } from '../firebase/settingsService';
import { Prescription } from '../firebase/prescriptionService';
import { getPatient } from '../firebase/patientService';
import { format } from 'date-fns';

/**
 * Send a prescription confirmation email
 * @param userId The user ID
 * @param prescription The prescription to send details for
 * @param recipientEmail The email address to send to
 */
export const sendPrescriptionEmail = async (
  userId: string,
  prescription: Prescription,
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
    
    // Get additional patient information if available
    const patient = await getPatient(userId, prescription.patientId);
    
    // Format date for display
    const prescriptionDate = prescription.createdAt instanceof Date 
      ? format(prescription.createdAt, 'MMMM d, yyyy')
      : format(prescription.createdAt.toDate(), 'MMMM d, yyyy');
    
    // Build email content
    const emailSubject = `Prescription from ${settings.clinic?.clinicName || 'Your Doctor'}`;
    
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
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 10px; }
    .prescription-details { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .details-row { display: flex; margin-bottom: 10px; }
    .details-label { font-weight: bold; width: 130px; }
    .details-value { flex: 1; }
    .patient-info { margin-bottom: 20px; }
    .medicines { margin-bottom: 20px; }
    .medicine { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
    .clinic-info { font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .footer { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 30px; }
    .note { font-style: italic; color: #6b7280; margin-top: 15px; }
    @media (max-width: 600px) {
      .details-row { flex-direction: column; }
      .details-label { width: 100%; margin-bottom: 5px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">${clinicInfo.name}</div>
    <p>Prescription Details</p>
  </div>
  
  <p>Dear ${patient?.name || prescription.patientName},</p>
  
  <p>Please find your prescription details below.</p>
  
  <div class="prescription-details">
    <div class="details-row">
      <div class="details-label">Date:</div>
      <div class="details-value">${prescriptionDate}</div>
    </div>
    <div class="details-row">
      <div class="details-label">Diagnosis:</div>
      <div class="details-value">${prescription.diagnosis || 'N/A'}</div>
    </div>
    ${prescription.notes ? `
    <div class="details-row">
      <div class="details-label">Notes:</div>
      <div class="details-value">${prescription.notes}</div>
    </div>` : ''}
  </div>

  <div class="medicines">
    <p><strong>Prescribed Medicines:</strong></p>
    ${prescription.medicines.map(medicine => `
      <div class="medicine">
        <p><strong>${medicine.name}</strong></p>
        <p>Dosage: ${medicine.dosage}</p>
        <p>Frequency: ${medicine.frequency}</p>
        <p>Duration: ${medicine.duration}</p>
        <p>Instructions: ${medicine.instructions}</p>
      </div>
    `).join('')}
  </div>

  ${patient ? `
  <div class="patient-info">
    <p><strong>Your Information:</strong></p>
    <p>Name: ${patient.name}<br>
    ${patient.dateOfBirth ? `Date of Birth: ${patient.dateOfBirth}<br>` : ''}
    ${patient.phone ? `Phone: ${patient.phone}<br>` : ''}
    ${patient.email ? `Email: ${patient.email}` : ''}</p>
  </div>` : ''}
  
  <p class="note">Please take your medicines as prescribed. If you have any questions or concerns, contact us at ${clinicInfo.phone} or ${clinicInfo.email}.</p>
  
  <div class="clinic-info">
    <p>${clinicInfo.name}<br>
    ${clinicInfo.address}<br>
    Phone: ${clinicInfo.phone}<br>
    Email: ${clinicInfo.email}
    ${clinicInfo.website ? `<br>Website: <a href="${clinicInfo.website}">${clinicInfo.website}</a>` : ''}
    </p>
  </div>
  
  <div class="footer">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
    `;
    
    // Convert HTML to plain text for non-HTML email clients
    const plainText = `
PRESCRIPTION DETAILS

Dear ${patient?.name || prescription.patientName},

Please find your prescription details below.

PRESCRIPTION DETAILS:
Date: ${prescriptionDate}
Diagnosis: ${prescription.diagnosis || 'N/A'}
${prescription.notes ? `Notes: ${prescription.notes}` : ''}

PRESCRIBED MEDICINES:
${prescription.medicines.map(medicine => `
* ${medicine.name}
  Dosage: ${medicine.dosage}
  Frequency: ${medicine.frequency}
  Duration: ${medicine.duration}
  Instructions: ${medicine.instructions}
`).join('\n')}

${patient ? `YOUR INFORMATION:
Name: ${patient.name}
${patient.dateOfBirth ? `Date of Birth: ${patient.dateOfBirth}` : ''}
${patient.phone ? `Phone: ${patient.phone}` : ''}
${patient.email ? `Email: ${patient.email}` : ''}` : ''}

Please take your medicines as prescribed. If you have any questions or concerns, contact us at ${clinicInfo.phone} or ${clinicInfo.email}.

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
      message: `Prescription details sent to ${recipientEmail}`
    };
  } catch (error) {
    console.error('Error sending prescription email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error sending prescription email'
    };
  }
};

/**
 * Get Gmail access token from current token or localStorage
 */
const getGmailAccessToken = async (userId: string): Promise<string | null> => {
  try {
    // Try to get token from localStorage
    const tokenJson = localStorage.getItem('gmail_token');
    const userIdJson = localStorage.getItem('gmail_user_id');
    
    if (tokenJson && userIdJson === userId) {
      const token = JSON.parse(tokenJson);
      
      // Check if token is expired
      if (token.expires_at && token.expires_at > Date.now()) {
        return token.access_token;
      }
    }
    
    // If no valid token in storage, redirect to Gmail authentication
    // This would usually be handled by the Gmail service
    // For simplicity, we'll return null here and let the caller handle the error
    return null;
  } catch (error) {
    console.error('Error getting Gmail access token:', error);
    return null;
  }
}; 