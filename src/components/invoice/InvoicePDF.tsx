import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { Invoice } from '@/lib/firebase/invoiceService';
import { UserSettings } from '@/lib/firebase/settingsService';

interface InvoicePDFProps {
  invoice: Invoice;
  settings: UserSettings;
}

const InvoicePDF = forwardRef<HTMLDivElement, InvoicePDFProps>(
  ({ invoice, settings }, ref) => {
    // Format date
    const formatDate = (date: string | Date | any) => {
      if (!date) return 'N/A';
      try {
        if (typeof date === 'string') {
          return format(new Date(date), settings.location.dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : 'MM/dd/yyyy');
        }
        const dateObj = date instanceof Date ? date : date.toDate();
        return format(dateObj, settings.location.dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : 'MM/dd/yyyy');
      } catch (error) {
        return 'Invalid Date';
      }
    };

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: settings.financial.currency || 'USD',
      }).format(amount);
    };

    return (
      <div ref={ref} className="invoice-pdf p-8 max-w-[800px] mx-auto bg-white text-gray-800">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-blue-500 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">{invoice.clinicInfo?.clinicName || settings.clinic.clinicName}</h1>
            <p className="text-sm text-gray-600">
              {invoice.clinicInfo?.clinicAddress || 
                `${settings.clinic.address}, ${settings.clinic.city}, ${settings.clinic.state} ${settings.clinic.zipCode}`}
            </p>
            <p className="text-sm text-gray-600">
              {invoice.clinicInfo?.clinicContact || 
                `Phone: ${settings.clinic.phone} | Email: ${settings.clinic.email}`}
            </p>
            {settings.clinic.website && (
              <p className="text-sm text-blue-600">Website: {settings.clinic.website}</p>
            )}
            {(invoice.clinicInfo?.taxId || settings.clinic.taxId) && (
              <p className="text-sm text-gray-600">Tax ID: {invoice.clinicInfo?.taxId || settings.clinic.taxId}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-blue-700">INVOICE</div>
            <p className="text-sm text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-600">Date: {formatDate(invoice.createdAt)}</p>
            <p className="text-sm text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase" 
              style={{ 
                backgroundColor: 
                  invoice.status === 'paid' ? '#d1fae5' : 
                  invoice.status === 'overdue' ? '#fee2e2' : 
                  invoice.status === 'sent' ? '#e0f2fe' : 
                  invoice.status === 'cancelled' ? '#f3f4f6' : '#f3f4f6',
                color:
                  invoice.status === 'paid' ? '#047857' : 
                  invoice.status === 'overdue' ? '#b91c1c' : 
                  invoice.status === 'sent' ? '#0369a1' : 
                  invoice.status === 'cancelled' ? '#6b7280' : '#6b7280',
              }}
            >
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mt-6 mb-8">
          <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Bill To</h2>
          <p className="font-medium">{invoice.patientName}</p>
          <p className="text-sm text-gray-600">Patient ID: {invoice.patientId}</p>
        </div>

        {/* Invoice Items */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left">
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 font-medium text-right">Qty</th>
                <th className="py-2 font-medium text-right">Rate</th>
                <th className="py-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.rate)}</td>
                  <td className="py-3 text-right">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Tax ({(invoice.tax / invoice.subtotal * 100).toFixed(2)}%):</span>
                <span>{formatCurrency(invoice.tax)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Discount:</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-2">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
            {invoice.status === 'paid' && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded p-2">
                <div className="text-green-800 text-center font-medium">PAID</div>
                {invoice.paymentDate && (
                  <div className="text-xs text-center text-green-700">
                    Payment Date: {formatDate(invoice.paymentDate)}
                  </div>
                )}
                {invoice.paymentMethod && (
                  <div className="text-xs text-center text-green-700">
                    Method: {invoice.paymentMethod}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase text-gray-500 mb-2">Notes</h2>
            <p className="text-gray-800 whitespace-pre-line text-sm border-t border-gray-200 pt-2">{invoice.notes}</p>
          </div>
        )}

        {/* Payment Instructions */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>Please make payment by the due date.</p>
          <p className="mt-1">Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

InvoicePDF.displayName = 'InvoicePDF';

export default InvoicePDF; 