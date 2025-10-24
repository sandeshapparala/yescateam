// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

// Firebase Utility Functions
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

// ===== ID GENERATORS =====

/**
 * Generate a new member ID (e.g., YESCA0001)
 * @param counter - Current member counter from settings
 */
export const generateMemberId = (counter: number): string => {
  return `YESCA${String(counter).padStart(4, '0')}`;
};

/**
 * Generate a new registration ID (e.g., YC26-0001)
 * @param campId - Camp ID (e.g., "YC26")
 * @param counter - Current registration counter for this camp
 */
export const generateRegistrationId = (campId: string, counter: number): string => {
  return `${campId}-${String(counter).padStart(4, '0')}`;
};

// ===== COUNTER MANAGEMENT =====

/**
 * Get and increment a counter atomically
 * @param counterName - Name of the counter field
 * @returns New counter value
 */
export const incrementCounter = async (counterName: string): Promise<number> => {
  const counterRef = doc(db, COLLECTIONS.SETTINGS, 'counters');
  const counterDoc = await getDoc(counterRef);
  
  if (!counterDoc.exists()) {
    // Initialize counters document
    await setDoc(counterRef, {
      member_counter: 1,
      [`registration_counter_${counterName}`]: 1,
    });
    return 1;
  }
  
  const currentValue = counterDoc.data()[counterName] || 0;
  const newValue = currentValue + 1;
  
  await updateDoc(counterRef, {
    [counterName]: newValue,
  });
  
  return newValue;
};

// ===== DATE UTILITIES =====

/**
 * Convert JavaScript Date to Firestore Timestamp
 */
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = (): Timestamp => {
  return Timestamp.now();
};

// ===== VALIDATION UTILITIES =====

/**
 * Validate phone number format (10 digits)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return /^[6-9]\d{9}$/.test(phone);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob: Date): number => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// ===== SEARCH UTILITIES =====

/**
 * Search members by phone number
 */
export const searchMemberByPhone = async (phoneNumber: string) => {
  const membersRef = collection(db, COLLECTIONS.MEMBERS);
  const q = query(membersRef, where('phone_number', '==', phoneNumber));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Search members by name (case-insensitive)
 */
export const searchMemberByName = async (name: string) => {
  const membersRef = collection(db, COLLECTIONS.MEMBERS);
  const q = query(
    membersRef,
    where('full_name', '>=', name),
    where('full_name', '<=', name + '\uf8ff'),
    limit(20)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ===== ERROR HANDLING =====

/**
 * Handle Firebase errors with user-friendly messages
 */
export const handleFirebaseError = (error: any): string => {
  if (error.code) {
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'not-found':
        return 'The requested data was not found.';
      case 'already-exists':
        return 'This record already exists.';
      case 'unauthenticated':
        return 'Please sign in to continue.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  return 'An unexpected error occurred.';
};

// ===== EXPORT ALL =====
export const FirebaseUtils = {
  generateMemberId,
  generateRegistrationId,
  incrementCounter,
  dateToTimestamp,
  timestampToDate,
  getCurrentTimestamp,
  isValidPhoneNumber,
  isValidEmail,
  calculateAge,
  searchMemberByPhone,
  searchMemberByName,
  handleFirebaseError,
};
