// Verify OTP and Generate Firebase Custom Token
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { verifyOTP, formatPhoneNumber, isValidIndianPhone } from '@/lib/auth/otp-utils';

const MAX_VERIFICATION_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const { phone_number, otp } = await request.json();

    // Validate inputs
    if (!phone_number || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(phone_number)) {
      return NextResponse.json(
        { error: 'Invalid Indian phone number' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phone_number);
    const timestamp = Date.now();

    // Get OTP document from Firestore
    const otpRef = adminDb.collection('otp_verifications').doc(formattedPhone);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json(
        { error: 'OTP not found. Please request a new OTP.' },
        { status: 404 }
      );
    }

    const otpData = otpDoc.data()!;

    // Check if already verified
    if (otpData.verified) {
      return NextResponse.json(
        { error: 'OTP already used. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check expiry
    if (timestamp > otpData.expires_at) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpData.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      return NextResponse.json(
        { error: 'Maximum verification attempts exceeded. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, otpData.otp);

    if (!isValid) {
      // Increment attempts
      await otpRef.update({
        attempts: otpData.attempts + 1,
        last_attempt_at: timestamp,
      });

      const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - (otpData.attempts + 1);
      return NextResponse.json(
        { 
          error: 'Invalid OTP. Please try again.',
          remaining_attempts: remainingAttempts > 0 ? remainingAttempts : 0,
        },
        { status: 400 }
      );
    }

    // ✅ OTP is valid! Create Firebase Custom Token
    console.log('✅ OTP verified for:', formattedPhone);

    // Create custom token with Firebase Admin SDK
    const customToken = await adminAuth.createCustomToken(formattedPhone, {
      phone: formattedPhone,
      verified_at: timestamp,
      verification_method: otpData.method,
    });

    // Mark OTP as verified
    await otpRef.update({
      verified: true,
      verified_at: timestamp,
    });

    // Check if user already exists in Firestore
    // Store user doc with phone as ID for consistency
    const userRef = adminDb.collection('users').doc(formattedPhone);
    const userDoc = await userRef.get();

    // Check if member exists and get member_id
    // Members store phone without +91, so we need to check both formats
    const phoneWithoutCountryCode = formattedPhone.replace('+91', '');
    const membersRef = adminDb.collection('members');
    
    // Try both formats to find member
    let memberSnapshot = await membersRef.where('phone_number', '==', formattedPhone).limit(1).get();
    if (memberSnapshot.empty) {
      memberSnapshot = await membersRef.where('phone_number', '==', phoneWithoutCountryCode).limit(1).get();
    }
    
    const memberId = !memberSnapshot.empty ? memberSnapshot.docs[0].id : null;

    if (!userDoc.exists) {
      // Create new user document with member_id link
      await userRef.set({
        phone_number: formattedPhone,
        member_id: memberId, // 🔗 Direct link to member
        created_at: timestamp,
        last_login_at: timestamp,
        verification_method: otpData.method,
        auth_provider: 'phone',
      });
    } else {
      // Update last login and link member_id if not already linked
      const updateData: Record<string, unknown> = {
        last_login_at: timestamp,
      };
      
      // Link member_id if found and not already linked
      if (memberId && !userDoc.data()?.member_id) {
        updateData.member_id = memberId;
      }
      
      await userRef.update(updateData);
    }

    // Create audit log
    await adminDb.collection('audit_logs').add({
      action: 'phone_verification_success',
      resource_type: 'authentication',
      resource_id: formattedPhone,
      actor_type: 'user',
      actor_id: formattedPhone,
      details: {
        method: otpData.method,
        ip_address: otpData.ip_address,
      },
      timestamp,
    });

    console.log('🎉 Custom token created for:', formattedPhone);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      custom_token: customToken,
      phone_number: formattedPhone,
      user_exists: userDoc.exists,
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify OTP', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
