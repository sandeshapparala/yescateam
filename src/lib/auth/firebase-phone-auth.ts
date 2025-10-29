// Firebase Phone Authentication Client-Side Utilities
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

/**
 * Initialize reCAPTCHA verifier for phone authentication
 * @param containerId - The ID of the HTML element to render reCAPTCHA
 * @param onSuccess - Optional callback when reCAPTCHA is verified
 * @param onError - Optional callback when reCAPTCHA fails
 */
export function initializeRecaptcha(
  containerId: string = 'recaptcha-container',
  onSuccess?: () => void,
  onError?: (error: Error) => void
): RecaptchaVerifier {
  // Clean up existing verifier
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible', // 'invisible' or 'normal'
    callback: () => {
      console.log('reCAPTCHA verified successfully');
      onSuccess?.();
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
      onError?.(new Error('reCAPTCHA expired'));
    },
    'error-callback': (error: Error) => {
      console.error('reCAPTCHA error:', error);
      onError?.(error);
    }
  });

  return recaptchaVerifier;
}

/**
 * Send SMS OTP via Firebase Phone Authentication
 * @param phoneNumber - Phone number in E.164 format (e.g., +919876543210)
 * @returns Promise<ConfirmationResult>
 */
export async function sendFirebasePhoneOTP(phoneNumber: string): Promise<ConfirmationResult> {
  try {
    if (!recaptchaVerifier) {
      throw new Error('reCAPTCHA not initialized. Call initializeRecaptcha() first.');
    }

    // Render reCAPTCHA if it's invisible
    await recaptchaVerifier.render();

    // Send SMS via Firebase
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    
    console.log('Firebase SMS sent successfully to:', phoneNumber);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending Firebase Phone OTP:', error);
    
    // Reset reCAPTCHA on error
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to send SMS');
  }
}

/**
 * Verify the SMS code sent by Firebase
 * @param code - 6-digit verification code from SMS
 * @returns Promise<{ success: boolean, uid: string }>
 */
export async function verifyFirebaseSMSCode(code: string): Promise<{ success: boolean; uid: string }> {
  try {
    if (!confirmationResult) {
      throw new Error('No confirmation result. Send OTP first.');
    }

    // Verify the code
    const userCredential = await confirmationResult.confirm(code);
    const uid = userCredential.user.uid;
    
    console.log('Firebase Phone Auth successful. UID:', uid);
    
    return { success: true, uid };
  } catch (error) {
    console.error('Error verifying Firebase SMS code:', error);
    throw new Error(error instanceof Error ? error.message : 'Invalid verification code');
  }
}

/**
 * Sign in with phone credential directly (alternative method)
 * @param verificationId - Verification ID from Firebase
 * @param code - 6-digit verification code
 */
export async function signInWithPhoneCredential(verificationId: string, code: string) {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const userCredential = await signInWithCredential(auth, credential);
    return { success: true, uid: userCredential.user.uid };
  } catch (error) {
    console.error('Error signing in with phone credential:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to sign in');
  }
}

/**
 * Clean up reCAPTCHA verifier
 */
export function cleanupRecaptcha() {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  confirmationResult = null;
}

/**
 * Get the current confirmation result (for external access)
 */
export function getConfirmationResult(): ConfirmationResult | null {
  return confirmationResult;
}
