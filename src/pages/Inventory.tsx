import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  PlusCircle, 
  Search, 
  Package,
  Edit,
  Trash2,
  MoreVertical,
  AlertTriangle,
  ClipboardList,
  Loader
} from 'lucide-react';

// Import inventory service
import { 
  InventoryItem,
  getAllInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getLowStockItems,
  getInventoryItemsByCategory
} from '@/lib/firebase/inventoryService';

// Import settings service
import { getUserSettings, UserSettings, defaultSettings } from '@/lib/firebase/settingsService';

const Inventory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [isViewHistoryOpen, setIsViewHistoryOpen] = useState(false);
  const [itemToViewHistory, setItemToViewHistory] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [itemToAdjust, setItemToAdjust] = useState<InventoryItem | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
    name: '',
    category: 'Medication',
    quantity: 0,
    unit: 'units',
    reorderLevel: 5,
    purchasePrice: 0,
    sellingPrice: 0
  });

  // Categories for the clinic inventory
  const categories = [
    'Medication',
    'Equipment',
    'Supplies',
    'Instruments',
    'Lab Materials',
    'Office Supplies'
  ];

  // Fetch inventory items and settings from Firebase
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user settings
        const userSettings = await getUserSettings(user.uid);
        setSettings(userSettings);
        
        // Fetch inventory items
        const items = await getAllInventoryItems(user.uid);
        setInventoryItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load inventory items',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  // Filter items based on search and category
  useEffect(() => {
    const filtered = inventoryItems.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplierName && item.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || 
        item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, inventoryItems]);

  // Update form field
  const updateItemField = (field: keyof Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, value: any) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding an item
  const handleAddItem = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Add the new item to Firebase
      const addedItem = await addInventoryItem(user.uid, newItem);
      
      // Update local state
      setInventoryItems(prev => [addedItem, ...prev]);
      
      // Reset form and close dialog
      setNewItem({
        name: '',
        category: 'Medication',
        quantity: 0,
        unit: 'units',
        reorderLevel: 5,
        purchasePrice: 0,
        sellingPrice: 0
      });
      
      toast({
        title: 'Success',
        description: 'Inventory item added successfully.',
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add inventory item',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setIsAddItemOpen(false);
    }
  };

  // Handle deleting an item
  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      // Delete from Firebase
      await deleteInventoryItem(itemToDelete);
      
      // Update local state
      setInventoryItems(prev => prev.filter(item => item.id !== itemToDelete));
      
      toast({
        title: 'Success',
        description: 'Inventory item deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete inventory item',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  // Handle editing an item
  const handleEditItem = (id: string) => {
    const itemToEdit = inventoryItems.find(item => item.id === id);
    if (itemToEdit) {
      setItemToEdit(itemToEdit);
      setIsEditItemOpen(true);
    }
  };

  // Handle viewing item history
  const handleViewHistory = (item: InventoryItem) => {
    setItemToViewHistory(item);
    setIsViewHistoryOpen(true);
  };

  // Handle stock adjustment
  const handleAdjustStock = (item: InventoryItem) => {
    setItemToAdjust(item);
    setAdjustmentQuantity(0);
    setIsAdjustmentOpen(true);
  };

  // Confirm stock adjustment
  const confirmAdjustment = async () => {
    if (!user || !itemToAdjust || !itemToAdjust.id) return;
    
    setIsSaving(true);
    try {
      // Calculate new quantity
      const newQuantity = itemToAdjust.quantity + adjustmentQuantity;
      
      // Don't allow negative quantities
      if (newQuantity < 0) {
        toast({
          title: 'Error',
          description: 'Stock quantity cannot be negative.',
          variant: 'destructive',
        });
        return;
      }
      
      // Update the quantity in the database
      await updateInventoryItem(itemToAdjust.id, {
        quantity: newQuantity
      });
      
      // Update the local state
      setInventoryItems(prev => 
        prev.map(item => 
          item.id === itemToAdjust.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      toast({
        title: 'Success',
        description: `Stock adjusted by ${adjustmentQuantity > 0 ? '+' : ''}${adjustmentQuantity} units.`,
      });
      
      // Close the dialog
      setIsAdjustmentOpen(false);
      setItemToAdjust(null);
      setAdjustmentQuantity(0);
    } catch (error) {
      console.error('Error adjusting stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to adjust stock level.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if item is low in stock
  const isLowStock = (item: InventoryItem) => {
    return item.quantity <= item.reorderLevel;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings?.financial?.currency || 'USD',
    }).format(amount);
  };

  // Save edited item
  const saveEditedItem = async () => {
    if (!user || !itemToEdit || !itemToEdit.id) return;
    
    setIsSaving(true);
    try {
      // Update the item in the database
      await updateInventoryItem(itemToEdit.id, {
        name: itemToEdit.name,
        category: itemToEdit.category,
        quantity: itemToEdit.quantity,
        unit: itemToEdit.unit,
        reorderLevel: itemToEdit.reorderLevel,
        expiryDate: itemToEdit.expiryDate,
        supplierName: itemToEdit.supplierName,
        supplierContact: itemToEdit.supplierContact,
        purchasePrice: itemToEdit.purchasePrice,
        sellingPrice: itemToEdit.sellingPrice,
        location: itemToEdit.location,
        notes: itemToEdit.notes
      });
      
      // Update the local state
      setInventoryItems(prev => 
        prev.map(item => 
          item.id === itemToEdit.id ? itemToEdit : item
        )
      );
      
      toast({
        title: 'Success',
        description: 'Item updated successfully',
      });
      
      // Close the dialog
      setIsEditItemOpen(false);
      setItemToEdit(null);
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update edited item field
  const updateEditedItemField = (field: keyof Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, value: any) => {
    setItemToEdit(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  return (
    <DashboardLayout>
      <div className="w-full backdrop-blur-md bg-background/80 py-4 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">Manage your clinical inventory and supplies</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1 whitespace-nowrap">
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Item</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                    <DialogDescription>
                      Enter the item details to add to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) => updateItemField('name', e.target.value)}
                          placeholder="Enter item name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => updateItemField('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="0"
                          value={newItem.quantity.toString()}
                          onChange={(e) => updateItemField('quantity', parseInt(e.target.value) || 0)}
                          placeholder="Enter quantity"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={newItem.unit}
                          onChange={(e) => updateItemField('unit', e.target.value)}
                          placeholder="Enter unit (e.g., tablets, boxes)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reorderLevel">Reorder Level</Label>
                        <Input
                          id="reorderLevel"
                          type="number"
                          min="0"
                          value={newItem.reorderLevel.toString()}
                          onChange={(e) => updateItemField('reorderLevel', parseInt(e.target.value) || 0)}
                          placeholder="Enter reorder level"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={newItem.expiryDate || ''}
                          onChange={(e) => updateItemField('expiryDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplierName">Supplier Name</Label>
                        <Input
                          id="supplierName"
                          value={newItem.supplierName || ''}
                          onChange={(e) => updateItemField('supplierName', e.target.value)}
                          placeholder="Enter supplier name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplierContact">Supplier Contact</Label>
                        <Input
                          id="supplierContact"
                          value={newItem.supplierContact || ''}
                          onChange={(e) => updateItemField('supplierContact', e.target.value)}
                          placeholder="Enter supplier contact"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purchasePrice">Purchase Price</Label>
                        <Input
                          id="purchasePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.purchasePrice.toString()}
                          onChange={(e) => updateItemField('purchasePrice', parseFloat(e.target.value) || 0)}
                          placeholder="Enter purchase price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sellingPrice">Selling Price</Label>
                        <Input
                          id="sellingPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.sellingPrice.toString()}
                          onChange={(e) => updateItemField('sellingPrice', parseFloat(e.target.value) || 0)}
                          placeholder="Enter selling price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Storage Location</Label>
                        <Input
                          id="location"
                          value={newItem.location || ''}
                          onChange={(e) => updateItemField('location', e.target.value)}
                          placeholder="Enter storage location"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Input
                          id="notes"
                          value={newItem.notes || ''}
                          onChange={(e) => updateItemField('notes', e.target.value)}
                          placeholder="Enter additional notes"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="button" 
                      onClick={handleAddItem}
                      disabled={!newItem.name || isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : 'Add Item'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {inventoryItems.length} items
          </div>
        </div>
        
        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} className={isLowStock(item) ? 'bg-amber-50/30' : ''}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{item.quantity} {item.unit}</span>
                          {isLowStock(item) && (
                            <span aria-label="Low stock">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isLowStock(item) ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.location || 'Not specified'}</TableCell>
                      <TableCell>{formatCurrency(item.purchasePrice)}</TableCell>
                      <TableCell>{formatCurrency(item.sellingPrice)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditItem(item.id!)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAdjustStock(item)}>
                              <Loader className="h-4 w-4 mr-2" />
                              Adjust Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewHistory(item)}>
                              <ClipboardList className="h-4 w-4 mr-2" />
                              View History
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(item.id!)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchTerm || categoryFilter !== 'all' ? (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-10 w-10 mb-2 opacity-50" />
                          <p>No items matching your filters</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Package className="h-10 w-10 mb-2 opacity-50" />
                          <p>No inventory items yet</p>
                          <p className="text-sm">Add your first item to get started</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              inventory item and its history from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustmentOpen} onOpenChange={setIsAdjustmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
            <DialogDescription>
              {itemToAdjust && `Current stock: ${itemToAdjust.quantity} ${itemToAdjust.unit}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adjustment">Adjustment Amount</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustmentQuantity(prev => prev - 1)}
                  >
                    -
                  </Button>
                  <Input
                    id="adjustment"
                    type="number"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustmentQuantity(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use positive values to add stock, negative values to remove stock.
                </p>
              </div>

              {itemToAdjust && (
                <div className="text-sm border rounded-md p-3 bg-muted/30">
                  <p>
                    <span className="font-semibold">New stock level:</span>{' '}
                    {Math.max(0, itemToAdjust.quantity + adjustmentQuantity)} {itemToAdjust.unit}
                  </p>
                  {itemToAdjust.reorderLevel > (itemToAdjust.quantity + adjustmentQuantity) && (
                    <p className="text-amber-600 mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      This will put the item below the reorder level ({itemToAdjust.reorderLevel} {itemToAdjust.unit}).
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAdjustmentOpen(false);
                setItemToAdjust(null);
                setAdjustmentQuantity(0);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAdjustment}
              disabled={!itemToAdjust || adjustmentQuantity === 0 || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Adjust Stock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the item details below.
            </DialogDescription>
          </DialogHeader>
          {itemToEdit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    value={itemToEdit.name}
                    onChange={(e) => updateEditedItemField('name', e.target.value)}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={itemToEdit.category}
                    onValueChange={(value) => updateEditedItemField('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    min="0"
                    value={itemToEdit.quantity.toString()}
                    onChange={(e) => updateEditedItemField('quantity', parseInt(e.target.value) || 0)}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Input
                    id="edit-unit"
                    value={itemToEdit.unit}
                    onChange={(e) => updateEditedItemField('unit', e.target.value)}
                    placeholder="Enter unit (e.g., tablets, boxes)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-reorderLevel">Reorder Level</Label>
                  <Input
                    id="edit-reorderLevel"
                    type="number"
                    min="0"
                    value={itemToEdit.reorderLevel.toString()}
                    onChange={(e) => updateEditedItemField('reorderLevel', parseInt(e.target.value) || 0)}
                    placeholder="Enter reorder level"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expiryDate">Expiry Date (if applicable)</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={itemToEdit.expiryDate || ''}
                    onChange={(e) => updateEditedItemField('expiryDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplierName">Supplier Name</Label>
                  <Input
                    id="edit-supplierName"
                    value={itemToEdit.supplierName || ''}
                    onChange={(e) => updateEditedItemField('supplierName', e.target.value)}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-supplierContact">Supplier Contact</Label>
                  <Input
                    id="edit-supplierContact"
                    value={itemToEdit.supplierContact || ''}
                    onChange={(e) => updateEditedItemField('supplierContact', e.target.value)}
                    placeholder="Enter supplier contact"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-purchasePrice">Purchase Price</Label>
                  <Input
                    id="edit-purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemToEdit.purchasePrice.toString()}
                    onChange={(e) => updateEditedItemField('purchasePrice', parseFloat(e.target.value) || 0)}
                    placeholder="Enter purchase price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sellingPrice">Selling Price</Label>
                  <Input
                    id="edit-sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemToEdit.sellingPrice.toString()}
                    onChange={(e) => updateEditedItemField('sellingPrice', parseFloat(e.target.value) || 0)}
                    placeholder="Enter selling price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Storage Location</Label>
                  <Input
                    id="edit-location"
                    value={itemToEdit.location || ''}
                    onChange={(e) => updateEditedItemField('location', e.target.value)}
                    placeholder="Enter storage location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Input
                    id="edit-notes"
                    value={itemToEdit.notes || ''}
                    onChange={(e) => updateEditedItemField('notes', e.target.value)}
                    placeholder="Enter additional notes"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditItemOpen(false);
                setItemToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEditedItem}
              disabled={!itemToEdit || !itemToEdit.name || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View History Dialog */}
      <Dialog open={isViewHistoryOpen} onOpenChange={setIsViewHistoryOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Item History</DialogTitle>
            <DialogDescription>
              {itemToViewHistory ? `History for ${itemToViewHistory.name}` : 'Loading history...'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {itemToViewHistory ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Item Details</h3>
                      <div className="p-4 rounded-md border">
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="font-medium">Name:</dt>
                            <dd>{itemToViewHistory.name}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Category:</dt>
                            <dd>{itemToViewHistory.category}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Current Stock:</dt>
                            <dd>{itemToViewHistory.quantity} {itemToViewHistory.unit}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Added On:</dt>
                            <dd>
                              {itemToViewHistory.createdAt && typeof itemToViewHistory.createdAt.toDate === 'function' 
                                ? itemToViewHistory.createdAt.toDate().toLocaleDateString()
                                : 'Unknown date'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Financial Information</h3>
                      <div className="p-4 rounded-md border">
                        <dl className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <dt className="font-medium">Purchase Price:</dt>
                            <dd>{formatCurrency(itemToViewHistory.purchasePrice)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Selling Price:</dt>
                            <dd>{formatCurrency(itemToViewHistory.sellingPrice)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Current Inventory Value:</dt>
                            <dd>{formatCurrency(itemToViewHistory.purchasePrice * itemToViewHistory.quantity)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="font-medium">Activity Log</h3>
                    <div className="border rounded-md">
                      <div className="p-4 text-center text-muted-foreground">
                        <ClipboardList className="mx-auto h-12 w-12 opacity-20 mb-2" />
                        <p>Activity tracking will be implemented in a future update.</p>
                        <p className="text-sm">This will show stock adjustments, price changes, and other actions.</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <Loader className="h-8 w-8 animate-spin opacity-50" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsViewHistoryOpen(false);
                setItemToViewHistory(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Inventory; 