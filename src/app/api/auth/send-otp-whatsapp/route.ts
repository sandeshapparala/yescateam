// Send OTP via WhatsApp API Route
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { generateOTP, hashOTP, formatPhoneNumber, isValidIndianPhone } from '@/lib/auth/otp-utils';

const MAX_OTP_REQUESTS_PER_HOUR = 3;
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

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

    //   // Check if there's a recent unexpired OTP
    //   if (data.expires_at && data.expires_at > timestamp && !data.verified) {
    //     const remainingTime = Math.ceil((data.expires_at - timestamp) / 1000);
    //     return NextResponse.json(
    //       { 
    //         error: `Please wait ${remainingTime} seconds before requesting a new OTP.`,
    //         remainingTime 
    //       },
    //       { status: 429 }
    //     );
    //   }
    // }

    // Generate and hash OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);

    // Get IP for tracking
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Store OTP in Firestore
    const otpData = {
      otp: hashedOTP,
      phone_number: formattedPhone,
      method: 'whatsapp',
      verified: false,
      attempts: 0,
      created_at: timestamp,
      expires_at: timestamp + OTP_EXPIRY_MS,
      ip_address: ip,
      request_history: otpDoc.exists 
        ? [...(otpDoc.data()!.request_history || []), timestamp].slice(-10) // Keep last 10
        : [timestamp],
    };

    await otpRef.set(otpData);

    // TODO: Send OTP via WhatsApp API (when Meta approval is ready)
    // For now, in development, we'll return OTP in response
    // In production, remove this and only send via WhatsApp
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      console.log(`🔐 OTP for ${formattedPhone}: ${otp}`);
    }

    // TODO: Uncomment when WhatsApp API is ready
    // await sendWhatsAppOTP(formattedPhone, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent via WhatsApp',
      phone_number: formattedPhone,
      expires_in: OTP_EXPIRY_MS / 1000, // seconds
      // Remove this in production:
      ...(isDevelopment && { otp_dev_only: otp }),
    });

  } catch (error) {
    console.error('Send WhatsApp OTP error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send OTP', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
