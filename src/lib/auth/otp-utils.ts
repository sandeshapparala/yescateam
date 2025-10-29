// OTP Utility Functions
import bcrypt from 'bcryptjs';

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP using bcrypt
 */
export async function hashOTP(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

/**
 * Verify OTP against hashed value
 */
export async function verifyOTP(plainOTP: string, hashedOTP: string): Promise<boolean> {
  return bcrypt.compare(plainOTP, hashedOTP);
}

/**
 * Check if OTP has expired (5 minutes)
 */
export function isOTPExpired(createdAt: number): boolean {
  const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
  return Date.now() - createdAt > EXPIRY_TIME;
}

/**
 * Format phone number to E.164 format (+91XXXXXXXXXX)
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 91, add +
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If it's 10 digits, add +91
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it already has +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  return `+${cleaned}`;
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Check if it's a valid Indian number (+91 followed by 10 digits starting with 6-9)
  return /^\+91[6-9]\d{9}$/.test(formatted);
}
