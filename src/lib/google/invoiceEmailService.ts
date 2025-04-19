import { getAuth } from 'firebase/auth';
import { getUserSettings } from '../firebase/settingsService';
import { Invoice } from '../firebase/invoiceService';
import { getPatient } from '../firebase/patientService';
import { format } from 'date-fns';

/**
 * Send an invoice confirmation email
 * @param userId The user ID
 * @param invoice The invoice to send details for
 * @param recipientEmail The email address to send to
 */
export const sendInvoiceEmail = async (
  userId: string,
  invoice: Invoice,
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
    const patient = await getPatient(userId, invoice.patientId);
    
    // Format dates for display
    const invoiceDate = invoice.createdAt instanceof Date 
      ? format(invoice.createdAt, 'MMMM d, yyyy')
      : format(invoice.createdAt.toDate(), 'MMMM d, yyyy');
    
    const dueDate = format(new Date(invoice.dueDate), 'MMMM d, yyyy');
    
    // Build email content
    const emailSubject = `Invoice #${invoice.invoiceNumber} from ${settings.clinic?.clinicName || 'Your Doctor'}`;
    
    const clinicInfo = {
      name: settings.clinic?.clinicName || 'Our Clinic',
      address: [settings.clinic?.address, settings.clinic?.city, settings.clinic?.state, settings.clinic?.zipCode].filter(Boolean).join(', '),
      phone: settings.clinic?.phone || 'N/A',
      email: settings.clinic?.email || 'N/A',
      website: settings.clinic?.website || '',
    };
    
    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: settings.financial.currency || 'USD',
      }).format(amount);
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
    .invoice-details { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .details-row { display: flex; margin-bottom: 10px; }
    .details-label { font-weight: bold; width: 130px; }
    .details-value { flex: 1; }
    .patient-info { margin-bottom: 20px; }
    .items { margin-bottom: 20px; width: 100%; border-collapse: collapse; }
    .items th { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
    .items td { padding: 8px; border-bottom: 1px solid #e5e7eb; }
    .items .amount { text-align: right; }
    .summary { margin: 20px 0; width: 100%; }
    .summary-row { display: flex; justify-content: space-between; padding: 5px 0; }
    .summary-total { border-top: 1px solid #e5e7eb; font-weight: bold; padding-top: 10px; }
    .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
    .status-paid { background-color: #dcfce7; color: #166534; }
    .status-due { background-color: #fee2e2; color: #b91c1c; }
    .status-sent { background-color: #dbeafe; color: #1e40af; }
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
    <p>Invoice</p>
  </div>
  
  <p>Dear ${patient?.name || invoice.patientName},</p>
  
  <p>Please find your invoice details below.</p>
  
  <div class="invoice-details">
    <div class="details-row">
      <div class="details-label">Invoice #:</div>
      <div class="details-value">${invoice.invoiceNumber}</div>
    </div>
    <div class="details-row">
      <div class="details-label">Date:</div>
      <div class="details-value">${invoiceDate}</div>
    </div>
    <div class="details-row">
      <div class="details-label">Due Date:</div>
      <div class="details-value">${dueDate}</div>
    </div>
    <div class="details-row">
      <div class="details-label">Status:</div>
      <div class="details-value">
        <span class="status ${
          invoice.status === 'paid' ? 'status-paid' : 
          invoice.status === 'overdue' ? 'status-due' : 
          'status-sent'
        }">
          ${invoice.status.toUpperCase()}
        </span>
      </div>
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Rate</th>
        <th class="amount">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(item.rate)}</td>
          <td class="amount">${formatCurrency(item.amount)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-row">
      <div>Subtotal:</div>
      <div>${formatCurrency(invoice.subtotal)}</div>
    </div>
    ${invoice.tax > 0 ? `
    <div class="summary-row">
      <div>Tax:</div>
      <div>${formatCurrency(invoice.tax)}</div>
    </div>
    ` : ''}
    ${invoice.discount > 0 ? `
    <div class="summary-row">
      <div>Discount:</div>
      <div>-${formatCurrency(invoice.discount)}</div>
    </div>
    ` : ''}
    <div class="summary-row summary-total">
      <div>Total:</div>
      <div>${formatCurrency(invoice.total)}</div>
    </div>
  </div>

  ${patient ? `
  <div class="patient-info">
    <p><strong>Your Information:</strong></p>
    <p>Name: ${patient.name}<br>
    ${patient.dateOfBirth ? `Date of Birth: ${patient.dateOfBirth}<br>` : ''}
    ${patient.phone ? `Phone: ${patient.phone}<br>` : ''}
    ${patient.email ? `Email: ${patient.email}` : ''}</p>
  </div>` : ''}

  ${invoice.notes ? `
  <div class="note">
    <p><strong>Notes:</strong></p>
    <p>${invoice.notes}</p>
  </div>` : ''}
  
  <p class="note">Please make payment by the due date. If you have any questions about this invoice, please contact us at ${clinicInfo.phone} or ${clinicInfo.email}.</p>
  
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
INVOICE

Dear ${patient?.name || invoice.patientName},

Please find your invoice details below.

INVOICE DETAILS:
Invoice #: ${invoice.invoiceNumber}
Date: ${invoiceDate}
Due Date: ${dueDate}
Status: ${invoice.status.toUpperCase()}

ITEMS:
${invoice.items.map(item => `
* ${item.description}
  Quantity: ${item.quantity}
  Rate: ${formatCurrency(item.rate)}
  Amount: ${formatCurrency(item.amount)}
`).join('\n')}

SUMMARY:
Subtotal: ${formatCurrency(invoice.subtotal)}
${invoice.tax > 0 ? `Tax: ${formatCurrency(invoice.tax)}` : ''}
${invoice.discount > 0 ? `Discount: -${formatCurrency(invoice.discount)}` : ''}
Total: ${formatCurrency(invoice.total)}

${patient ? `YOUR INFORMATION:
Name: ${patient.name}
${patient.dateOfBirth ? `Date of Birth: ${patient.dateOfBirth}` : ''}
${patient.phone ? `Phone: ${patient.phone}` : ''}
${patient.email ? `Email: ${patient.email}` : ''}` : ''}

${invoice.notes ? `NOTES:
${invoice.notes}` : ''}

Please make payment by the due date. If you have any questions about this invoice, please contact us at ${clinicInfo.phone} or ${clinicInfo.email}.

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
      message: `Invoice sent to ${recipientEmail}`
    };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error sending invoice email'
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