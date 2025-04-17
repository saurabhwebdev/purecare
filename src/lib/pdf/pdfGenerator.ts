import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Prescription } from '../firebase/prescriptionService';
import { Invoice } from '../firebase/invoiceService';

/**
 * Generate a PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param options PDF generation options
 * @returns Promise with the generated PDF blob
 */
export const generatePDF = async (
  element: HTMLElement,
  options: {
    filename?: string;
    format?: 'a4' | 'letter' | 'legal';
    orientation?: 'portrait' | 'landscape';
    margin?: number;
    scale?: number;
  } = {}
): Promise<Blob> => {
  const {
    filename = 'document.pdf',
    format = 'a4',
    orientation = 'portrait',
    margin = 10,
    scale = 2,
  } = options;

  // Get dimensions based on paper format
  const dimensions = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
    legal: { width: 215.9, height: 355.6 },
  };

  const paperWidth = dimensions[format].width;
  const paperHeight = dimensions[format].height;

  // Create the PDF document with proper dimensions
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format,
  });

  // Scale the content for better quality
  const canvas = await html2canvas(element, {
    scale,
    logging: false,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  // Calculate scaling to fit the PDF page with margins
  const imgWidth = paperWidth - 2 * margin;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Convert the canvas to an image
  const imgData = canvas.toDataURL('image/png');

  // Add the image to the PDF
  pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

  // Return as blob
  return pdf.output('blob');
};

/**
 * Generate a prescription PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param prescription The prescription data (used for filename)
 * @returns Promise with the generated PDF blob and filename
 */
export const generatePrescriptionPDF = async (
  element: HTMLElement,
  prescription: Prescription
): Promise<{ blob: Blob; filename: string }> => {
  // Create a filename based on patient name and date
  const date = prescription.createdAt instanceof Date 
    ? prescription.createdAt 
    : prescription.createdAt.toDate();
  
  const dateStr = date.toISOString().split('T')[0];
  const safePatientName = prescription.patientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `prescription_${safePatientName}_${dateStr}.pdf`;

  // Generate the PDF
  const blob = await generatePDF(element, {
    filename,
    format: 'a4',
    orientation: 'portrait',
    margin: 10,
    scale: 2,
  });

  return { blob, filename };
};

/**
 * Generate an invoice PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param invoice The invoice data (used for filename)
 * @returns Promise with the generated PDF blob and filename
 */
export const generateInvoicePDF = async (
  element: HTMLElement,
  invoice: Invoice
): Promise<{ blob: Blob; filename: string }> => {
  // Create a filename based on invoice number and date
  const date = invoice.createdAt instanceof Date 
    ? invoice.createdAt 
    : invoice.createdAt.toDate();
  
  const dateStr = date.toISOString().split('T')[0];
  const safeInvoiceNumber = invoice.invoiceNumber.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `invoice_${safeInvoiceNumber}_${dateStr}.pdf`;

  // Generate the PDF
  const blob = await generatePDF(element, {
    filename,
    format: 'a4',
    orientation: 'portrait',
    margin: 10,
    scale: 2,
  });

  return { blob, filename };
};

/**
 * Download a blob as a file
 * @param blob The blob to download
 * @param filename The filename to use
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Add to document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}; 