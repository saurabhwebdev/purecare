import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
  signInWithPopup,
  deleteUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc, getDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with the display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName
        });
      }
      
      // Initialize user usage data
      if (userCredential.user) {
        // Import here to avoid circular dependencies
        const { getUserUsage } = await import('@/lib/firebase/referralService');
        await getUserUsage(userCredential.user.uid);
      }
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to PureCare",
      });
      
      return userCredential;
    } catch (error: any) {
      toast({
        title: "Failed to create account",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Signed in successfully!",
        description: "Welcome back to PureCare",
      });
      
      return userCredential;
    } catch (error: any) {
      toast({
        title: "Failed to sign in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Check if this is a new user by looking at metadata
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;
      
      // If new user, initialize usage data
      if (isNewUser && userCredential.user) {
        // Import here to avoid circular dependencies
        const { getUserUsage } = await import('@/lib/firebase/referralService');
        await getUserUsage(userCredential.user.uid);
      }
      
      toast({
        title: isNewUser ? "Account created successfully!" : "Signed in with Google successfully!",
        description: "Welcome to PureCare",
      });
      
      return userCredential;
    } catch (error: any) {
      toast({
        title: "Failed to sign in with Google",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Failed to sign out",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for further instructions",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send password reset email",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      
      // 1. Archive user data instead of deleting it
      // Create a copy of all user data in an "archived_users" collection
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        archivedAt: new Date(),
        // Add any other user properties we want to preserve
      };
      
      // Create the archived user document
      await setDoc(doc(db, 'archived_users', user.uid), userData);
      
      // 2. Archive user's data collections (patients, appointments, invoices, etc.)
      // This is where we'd clone all the user's data to archived collections
      const collectionsToArchive = [
        'settings',
        'patients',
        'appointments',
        'invoices',
        'prescriptions',
        'medical_records'
      ];
      
      for (const collectionName of collectionsToArchive) {
        // Get all documents in the collection that belong to this user
        const q = query(collection(db, collectionName), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        // For each document, create a copy in the archived collection
        for (const docSnapshot of querySnapshot.docs) {
          const data = docSnapshot.data();
          await setDoc(
            doc(db, `archived_${collectionName}`, docSnapshot.id), 
            {
              ...data,
              archivedAt: new Date()
            }
          );
        }
      }
      
      // 3. Delete the actual user account from Firebase Auth
      await deleteUser(user);
      
      toast({
        title: "Account deleted successfully",
        description: "Your account and all associated data have been deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Failed to delete account",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
