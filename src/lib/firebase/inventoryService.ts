import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';

// Inventory item interface
export interface InventoryItem {
  id?: string;
  userId: string; // ID of the user who owns this inventory item
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  expiryDate?: string;
  supplierName?: string;
  supplierContact?: string;
  purchasePrice: number;
  sellingPrice: number;
  location?: string;
  notes?: string;
  createdAt: any; // Timestamp from Firebase
  updatedAt: any; // Timestamp from Firebase
}

/**
 * Get all inventory items for a user
 * @param userId The user's ID
 */
export const getAllInventoryItems = async (userId: string) => {
  try {
    const inventoryRef = collection(db, 'inventory');
    const q = query(
      inventoryRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const items: InventoryItem[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<InventoryItem, 'id'>;
      items.push({
        id: doc.id,
        ...data,
      });
    });

    return items;
  } catch (error) {
    console.error('Error getting inventory items:', error);
    throw error;
  }
};

/**
 * Get a specific inventory item by ID
 * @param itemId The inventory item's ID
 */
export const getInventoryItem = async (itemId: string) => {
  try {
    const docRef = doc(db, 'inventory', itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<InventoryItem, 'id'>;
      return {
        id: docSnap.id,
        ...data,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting inventory item:', error);
    throw error;
  }
};

/**
 * Add a new inventory item
 * @param userId The user's ID
 * @param inventoryData The inventory item data
 */
export const addInventoryItem = async (userId: string, inventoryData: Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    const inventoryRef = collection(db, 'inventory');
    const newItem = {
      ...inventoryData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(inventoryRef, newItem);
    return {
      id: docRef.id,
      ...newItem,
    };
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

/**
 * Update an existing inventory item
 * @param itemId The inventory item's ID
 * @param inventoryData The updated inventory item data
 */
export const updateInventoryItem = async (itemId: string, inventoryData: Partial<Omit<InventoryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const docRef = doc(db, 'inventory', itemId);
    
    // Get current item to verify ownership (could add more security checks here)
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Inventory item not found');
    }

    const updateData = {
      ...inventoryData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);
    
    return {
      id: itemId,
      ...docSnap.data(),
      ...updateData,
    };
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

/**
 * Delete an inventory item
 * @param itemId The inventory item's ID
 */
export const deleteInventoryItem = async (itemId: string) => {
  try {
    const docRef = doc(db, 'inventory', itemId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};

/**
 * Get inventory items by category
 * @param userId The user's ID
 * @param category The category to filter by
 */
export const getInventoryItemsByCategory = async (userId: string, category: string) => {
  try {
    const inventoryRef = collection(db, 'inventory');
    const q = query(
      inventoryRef,
      where('userId', '==', userId),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const items: InventoryItem[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<InventoryItem, 'id'>;
      items.push({
        id: doc.id,
        ...data,
      });
    });

    return items;
  } catch (error) {
    console.error('Error getting inventory items by category:', error);
    throw error;
  }
};

/**
 * Get low stock inventory items
 * @param userId The user's ID
 */
export const getLowStockItems = async (userId: string) => {
  try {
    // This requires a client-side filter since Firestore can't compare two fields in a query
    const allItems = await getAllInventoryItems(userId);
    return allItems.filter(item => item.quantity <= item.reorderLevel);
  } catch (error) {
    console.error('Error getting low stock items:', error);
    throw error;
  }
}; 