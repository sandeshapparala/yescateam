// Send OTP via Firebase Phone Authentication (SMS Fallback)
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { formatPhoneNumber, isValidIndianPhone } from '@/lib/auth/otp-utils';

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json();

    // Validate phone number
    if (!phone_number || !isValidIndianPhone(phone_number)) {
      return NextResponse.json(
        { error: 'Invalid Indian phone number. Must be 10 digits starting with 6-9.' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phone_number);
    const timestamp = Date.now();

    // Rate limiting: Check recent OTP requests
    const otpRef = adminDb.collection('otp_verifications').doc(formattedPhone);
    const otpDoc = await otpRef.get();

    // RATE LIMITING DISABLED
    // if (otpDoc.exists) {
    //   const data = otpDoc.data()!;
    //   const hourAgo = timestamp - (60 * 60 * 1000);
    //   
    //   // Count requests in last hour
    //   const recentRequests = data.request_history?.filter((t: number) => t > hourAgo).length || 0;
    //   
    //   if (recentRequests >= MAX_OTP_REQUESTS_PER_HOUR) {
    //     return NextResponse.json(
    //       { error: 'Too many OTP requests. Please try again after an hour.' },
    //       { status: 429 }
    //     );
    //   }
    // }

    // Get IP for tracking
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Store metadata for tracking (no OTP needed - Firebase handles verification)
    const smsData = {
      phone_number: formattedPhone,
      method: 'sms_firebase',
      verified: false, // Will be set to true after Firebase auth succeeds
      created_at: timestamp,
      ip_address: ip,
      request_history: otpDoc.exists 
        ? [...(otpDoc.data()!.request_history || []), timestamp].slice(-10)
        : [timestamp],
    };

    await otpRef.set(smsData);

    // Firebase Phone Auth SMS Flow:
    // Firebase handles EVERYTHING - SMS sending AND verification on client-side
    // We don't generate or send any OTP for SMS
    
    console.log(`📱 Firebase Phone Auth SMS ready for ${formattedPhone}`);

    // Client Flow:
    // 1. Client calls signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
    // 2. Firebase automatically sends SMS with verification code
    // 3. User enters Firebase's verification code
    // 4. Client calls confirmationResult.confirm(code) -> Firebase verifies
    // 5. Firebase returns auth result with user credentials
    // 6. Client requests custom token from backend
    // 7. Client signs in with signInWithCustomToken for our app

    return NextResponse.json({
      success: true,
      message: 'Ready for Firebase Phone Auth SMS',
      phone_number: formattedPhone,
      use_firebase_phone_auth: true,
      // Note: No OTP generated - Firebase handles everything
    });

  } catch (error) {
    console.error('Send SMS OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send SMS OTP', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
