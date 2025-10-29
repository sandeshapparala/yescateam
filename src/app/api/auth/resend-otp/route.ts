// Resend OTP (same method as original)
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { generateOTP, hashOTP, formatPhoneNumber, isValidIndianPhone } from '@/lib/auth/otp-utils';

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json();

    if (!phone_number || !isValidIndianPhone(phone_number)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phone_number);
    const timestamp = Date.now();

    // Get existing OTP document
    const otpRef = adminDb.collection('otp_verifications').doc(formattedPhone);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json(
        { error: 'No OTP found. Please request a new OTP first.' },
        { status: 404 }
      );
    }

    const otpData = otpDoc.data()!;

    // Check if already verified
    if (otpData.verified) {
      return NextResponse.json(
        { error: 'OTP already verified. No need to resend.' },
        { status: 400 }
      );
    }

    // Check cooldown period
    if (timestamp - otpData.created_at < RESEND_COOLDOWN_MS) {
      const remainingTime = Math.ceil((RESEND_COOLDOWN_MS - (timestamp - otpData.created_at)) / 1000);
      return NextResponse.json(
        { 
          error: `Please wait ${remainingTime} seconds before resending.`,
          remaining_time: remainingTime
        },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);

    // Update OTP document
    await otpRef.update({
      otp: hashedOTP,
      created_at: timestamp,
      expires_at: timestamp + OTP_EXPIRY_MS,
      attempts: 0, // Reset attempts
      resent_at: timestamp,
      resend_count: (otpData.resend_count || 0) + 1,
    });

    // TODO: Send OTP based on original method
    const method = otpData.method || 'whatsapp';
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.log(`🔄 Resent ${method.toUpperCase()} OTP for ${formattedPhone}: ${otp}`);
    }

    // TODO: Uncomment when WhatsApp/SMS APIs are ready
    // if (method === 'whatsapp') {
    //   await sendWhatsAppOTP(formattedPhone, otp);
    // } else {
    //   await sendSMSOTP(formattedPhone, otp);
    // }

    return NextResponse.json({
      success: true,
      message: `OTP resent via ${method}`,
      method,
      phone_number: formattedPhone,
      expires_in: OTP_EXPIRY_MS / 1000,
      // Remove in production:
      ...(isDevelopment && { otp_dev_only: otp }),
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to resend OTP', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
