import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Trash2, Plus, Calendar } from 'lucide-react';
import { Invoice, InvoiceItem } from '@/lib/firebase/invoiceService';
import { UserSettings } from '@/lib/firebase/settingsService';
import { format } from 'date-fns';

// Form schema for validation
const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  rate: z.coerce.number().min(0.01, 'Rate must be greater than 0'),
  amount: z.coerce.number().min(0, 'Amount must be at least 0'),
});

const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  patientId: z.string().min(1, 'Patient is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.coerce.number().min(0, 'Subtotal must be at least 0'),
  tax: z.coerce.number().min(0, 'Tax must be at least 0'),
  discount: z.coerce.number().min(0, 'Discount must be at least 0'),
  total: z.coerce.number().min(0, 'Total must be at least 0'),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentDate: z.date().optional().nullable(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  invoice?: Invoice;
  patientId?: string;
  patientName?: string;
  isCreating?: boolean;
  onSubmit: (data: Partial<Invoice>) => Promise<void>;
  isSubmitting: boolean;
  settings?: UserSettings;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  patientId,
  patientName,
  isCreating = false,
  onSubmit,
  isSubmitting,
  settings
}) => {
  // Set default values for the form
  const defaultValues: Partial<InvoiceFormValues> = {
    invoiceNumber: invoice?.invoiceNumber || `INV-${new Date().getFullYear().toString().substring(2, 4)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`,
    patientId: invoice?.patientId || patientId || '',
    patientName: invoice?.patientName || patientName || '',
    status: invoice?.status || 'draft',
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate) : new Date(new Date().setDate(new Date().getDate() + 30)),
    items: invoice?.items || [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: invoice?.subtotal || 0,
    tax: invoice?.tax || 0,
    discount: invoice?.discount || 0,
    total: invoice?.total || 0,
    notes: invoice?.notes || '',
    paymentMethod: invoice?.paymentMethod || '',
    paymentDate: invoice?.paymentDate ? new Date(invoice.paymentDate) : null,
  };

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  });

  // Calculate amount, subtotal, and total when items change
  useEffect(() => {
    const items = form.watch('items');
    const tax = form.watch('tax');
    const discount = form.watch('discount');
    
    // Calculate amount for each item
    const updatedItems = items.map(item => ({
      ...item,
      amount: (item.quantity || 0) * (item.rate || 0)
    }));
    
    if (JSON.stringify(updatedItems) !== JSON.stringify(items)) {
      form.setValue('items', updatedItems);
    }
    
    // Calculate subtotal
    const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    form.setValue('subtotal', subtotal);
    
    // Calculate total
    const total = subtotal + (tax || 0) - (discount || 0);
    form.setValue('total', total);
  }, [form.watch('items'), form.watch('tax'), form.watch('discount')]);

  // Handle form submission
  const handleSubmit = async (values: InvoiceFormValues) => {
    await onSubmit({
      ...values,
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
      paymentDate: values.paymentDate ? format(values.paymentDate, 'yyyy-MM-dd') : undefined,
      createdAt: invoice?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  };

  // Add a new invoice item
  const addItem = () => {
    const currentItems = form.getValues('items');
    form.setValue('items', [
      ...currentItems,
      { description: '', quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  // Remove an invoice item
  const removeItem = (index: number) => {
    const items = form.getValues('items');
    if (items.length > 1) {
      form.setValue(
        'items',
        items.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!patientId} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('status') === 'paid' && (
                <>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {settings?.financial.paymentMethods.cash && (
                              <SelectItem value="cash">Cash</SelectItem>
                            )}
                            {settings?.financial.paymentMethods.creditCard && (
                              <SelectItem value="credit_card">Credit Card</SelectItem>
                            )}
                            {settings?.financial.paymentMethods.bankTransfer && (
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            )}
                            {settings?.financial.paymentMethods.insurance && (
                              <SelectItem value="insurance">Insurance</SelectItem>
                            )}
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Payment Date</FormLabel>
                        <DatePicker
                          value={field.value || undefined}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {form.watch('items').map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-end border-b border-border pb-4"
                >
                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value) || 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.01"
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-3 md:col-span-1">
                    <FormField
                      control={form.control}
                      name={`items.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="0.01"
                              disabled
                              value={field.value.toFixed(2)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={form.watch('items').length <= 1}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${form.watch('subtotal').toFixed(2)}</span>
                </div>
                
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="m-0">Tax:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-32 text-right"
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="m-0">Discount:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-32 text-right"
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total:</span>
                  <span>${form.watch('total').toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isCreating ? 'Create Invoice' : 'Update Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm; 