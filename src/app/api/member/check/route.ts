// Check if Member Exists by Phone Number
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { formatPhoneNumber } from '@/lib/auth/otp-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get('phone_number');

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const phoneWithoutCountryCode = formattedPhone.replace('+91', '');

    // Check if member exists - try both formats
    const membersRef = adminDb.collection('members');
    
    // Try with +91 format first
    let memberSnapshot = await membersRef.where('phone_number', '==', formattedPhone).limit(1).get();
    
    // Try without country code if not found
    if (memberSnapshot.empty) {
      memberSnapshot = await membersRef.where('phone_number', '==', phoneWithoutCountryCode).limit(1).get();
    }

    const exists = !memberSnapshot.empty;
    const memberId = exists ? memberSnapshot.docs[0].id : null;

    return NextResponse.json({
      success: true,
      exists,
      member_id: memberId,
    });
  } catch (error) {
    console.error('Check member error:', error);
    return NextResponse.json(
      {
        error: 'Failed to check member',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
