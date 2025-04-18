import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  Timestamp,
  increment,
  updateDoc,
  arrayUnion,
  limit
} from 'firebase/firestore';
import { db } from '@/lib/auth/firebase';

// Constants
export const FREE_MONTHLY_SUGGESTIONS = 5;
export const REFERRAL_REWARD = 5;

// User usage tracking interface
export interface UserUsage {
  id?: string;
  userId: string;
  monthlyUsageCount: number;
  totalUsageCount: number;
  lastUsageDate: Timestamp | Date;
  lastMonthReset: Timestamp | Date;
  usageHistory: Array<{
    date: Timestamp | Date;
    count: number;
  }>;
  referralCode: string;
  referralCount: number;
  referredBy?: string;
  referredUsers: string[];
  referralBonus?: number;
}

/**
 * Initialize or get user usage data
 * @param userId The user ID
 */
export const getUserUsage = async (userId: string): Promise<UserUsage> => {
  try {
    const userUsageRef = doc(db, 'userUsage', userId);
    const userUsageSnap = await getDoc(userUsageRef);
    
    if (userUsageSnap.exists()) {
      const data = userUsageSnap.data() as Omit<UserUsage, 'id'>;
      
      // Check if we need to reset monthly usage (new month)
      const lastReset = data.lastMonthReset ? new Date((data.lastMonthReset as Timestamp).toDate()) : new Date(0);
      const now = new Date();
      
      // If it's a new month, reset the monthly usage
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        await updateDoc(userUsageRef, {
          monthlyUsageCount: 0,
          lastMonthReset: serverTimestamp()
        });
        
        return {
          ...data,
          id: userId,
          monthlyUsageCount: 0,
          lastMonthReset: now
        };
      }
      
      return {
        ...data,
        id: userId
      };
    } else {
      // Create new user usage record with a unique referral code
      const referralCode = generateReferralCode(userId);
      const newUserUsage: Omit<UserUsage, 'id'> = {
        userId,
        monthlyUsageCount: 0,
        totalUsageCount: 0,
        lastUsageDate: new Date(0),
        lastMonthReset: new Date(),
        usageHistory: [],
        referralCode,
        referralCount: 0,
        referredUsers: []
      };
      
      await setDoc(userUsageRef, {
        ...newUserUsage,
        lastUsageDate: serverTimestamp(),
        lastMonthReset: serverTimestamp()
      });
      
      return {
        ...newUserUsage,
        id: userId
      };
    }
  } catch (error) {
    console.error('Error getting user usage:', error);
    throw error;
  }
};

/**
 * Check if a user can use the AI suggestion feature
 * @param userId The user ID
 */
export const canUseAISuggestion = async (userId: string): Promise<{canUse: boolean; remainingCount: number}> => {
  try {
    const usage = await getUserUsage(userId);
    
    // Calculate remaining suggestions including both types of referral bonuses:
    // 1. Bonus for referring others (referralCount * REFERRAL_REWARD)
    // 2. Bonus for being referred by someone else (referralBonus, default to REFERRAL_REWARD if referredBy exists)
    const referralBonus = usage.referralBonus || (usage.referredBy ? REFERRAL_REWARD : 0);
    const allowedCount = FREE_MONTHLY_SUGGESTIONS + (usage.referralCount * REFERRAL_REWARD) + referralBonus;
    const remainingCount = allowedCount - usage.monthlyUsageCount;
    
    return {
      canUse: remainingCount > 0,
      remainingCount
    };
  } catch (error) {
    console.error('Error checking AI usage:', error);
    throw error;
  }
};

/**
 * Record a usage of the AI suggestion feature
 * @param userId The user ID
 */
export const recordAIUsage = async (userId: string): Promise<void> => {
  try {
    const userUsageRef = doc(db, 'userUsage', userId);
    
    // First update the counters and lastUsageDate
    await updateDoc(userUsageRef, {
      monthlyUsageCount: increment(1),
      totalUsageCount: increment(1),
      lastUsageDate: serverTimestamp()
    });
    
    // Then add the usage history entry separately
    // We need to use a JavaScript Date rather than serverTimestamp
    // because serverTimestamp() cannot be used with arrayUnion
    await updateDoc(userUsageRef, {
      usageHistory: arrayUnion({
        date: new Date(),
        count: 1
      })
    });
  } catch (error) {
    console.error('Error recording AI usage:', error);
    throw error;
  }
};

/**
 * Get a user's referral information
 * @param userId The user ID
 */
export const getUserReferralInfo = async (userId: string): Promise<{
  referralCode: string;
  referralLink: string;
  referralCount: number;
  referredUsers: string[];
}> => {
  try {
    const usage = await getUserUsage(userId);
    
    // Create referral link
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/signup?ref=${usage.referralCode}`;
    
    return {
      referralCode: usage.referralCode,
      referralLink,
      referralCount: usage.referralCount,
      referredUsers: usage.referredUsers
    };
  } catch (error) {
    console.error('Error getting referral info:', error);
    throw error;
  }
};

/**
 * Process a new user signup with a referral code
 * @param newUserId The new user's ID
 * @param referralCode The referral code used
 */
export const processReferral = async (newUserId: string, referralCode: string): Promise<boolean> => {
  try {
    // Find the user who owns this referral code
    const userUsageRef = collection(db, 'userUsage');
    const q = query(
      userUsageRef,
      where('referralCode', '==', referralCode),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('No user found with this referral code');
      return false;
    }
    
    const referrerDoc = querySnapshot.docs[0];
    const referrerId = referrerDoc.id;
    
    // Don't allow self-referrals
    if (referrerId === newUserId) {
      console.error('Cannot refer yourself');
      return false;
    }
    
    // Update the referrer's record
    await updateDoc(doc(db, 'userUsage', referrerId), {
      referralCount: increment(1),
      referredUsers: arrayUnion(newUserId)
    });
    
    // Update the new user's record to store who referred them and give them a bonus
    await getUserUsage(newUserId); // Ensure the user record exists
    await updateDoc(doc(db, 'userUsage', newUserId), {
      referredBy: referrerId,
      referralBonus: REFERRAL_REWARD
    });
    
    return true;
  } catch (error) {
    console.error('Error processing referral:', error);
    return false;
  }
};

/**
 * Generate a unique referral code for a user
 * @param userId The user ID
 */
const generateReferralCode = (userId: string): string => {
  // Create a short referral code based on userId and timestamp
  const timestamp = Date.now().toString(36);
  const userIdPart = userId.slice(0, 5);
  const randomPart = Math.random().toString(36).slice(2, 5);
  
  return `${userIdPart}${timestamp.slice(-3)}${randomPart}`.toUpperCase();
}; 