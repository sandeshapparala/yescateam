// Get Member Profile by Firebase UID or Phone Number
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { formatPhoneNumber } from '@/lib/auth/otp-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');
    const phoneNumber = searchParams.get('phone_number');

    if (!uid && !phoneNumber) {
      return NextResponse.json(
        { error: 'UID or phone number is required' },
        { status: 400 }
      );
    }

    let memberDoc = null;

    // If UID is provided, look up by UID
    if (uid) {
      // Check users collection with UID (could be Firebase UID or phone number)
      const userRef = adminDb.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data()!;
        
        // 🔗 Best case: Direct member_id link exists
        if (userData.member_id) {
          const memberRef = adminDb.collection('members').doc(userData.member_id);
          const directMemberDoc = await memberRef.get();
          
          if (directMemberDoc.exists) {
            memberDoc = directMemberDoc;
          }
        }
        
        // Fallback: Query by phone number if no member_id link
        if (!memberDoc && userData.phone_number) {
          const memberPhone = userData.phone_number;
          const phoneWithoutCountryCode = memberPhone.replace('+91', '');
          const membersRef = adminDb.collection('members');
          
          // Try with +91 format first
          let memberSnapshot = await membersRef.where('phone_number', '==', memberPhone).limit(1).get();
          
          // Try without country code if not found
          if (memberSnapshot.empty) {
            memberSnapshot = await membersRef.where('phone_number', '==', phoneWithoutCountryCode).limit(1).get();
          }

          if (!memberSnapshot.empty) {
            memberDoc = memberSnapshot.docs[0];
          }
        }
      } else {
        // Try using UID as phone number directly (legacy support)
        const formattedUid = uid.startsWith('+') ? uid : `+91${uid}`;
        const phoneWithoutCountryCode = formattedUid.replace('+91', '');
        const membersRef = adminDb.collection('members');
        
        // Try both formats
        let memberSnapshot = await membersRef.where('phone_number', '==', formattedUid).limit(1).get();
        if (memberSnapshot.empty) {
          memberSnapshot = await membersRef.where('phone_number', '==', phoneWithoutCountryCode).limit(1).get();
        }

        if (!memberSnapshot.empty) {
          memberDoc = memberSnapshot.docs[0];
        }
      }
    }

    // If phone number is provided, look up directly
    if (!memberDoc && phoneNumber) {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const membersRef = adminDb.collection('members');
      const memberQuery = membersRef.where('phone_number', '==', formattedPhone).limit(1);
      const memberSnapshot = await memberQuery.get();

      if (!memberSnapshot.empty) {
        memberDoc = memberSnapshot.docs[0];
      }
    }

    if (!memberDoc) {
      return NextResponse.json(
        { error: 'Member profile not found' },
        { status: 404 }
      );
    }

    const memberData = {
      member_id: memberDoc.id,
      ...memberDoc.data(),
    };

    return NextResponse.json({
      success: true,
      member: memberData,
    });
  } catch (error) {
    console.error('Get member profile error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch member profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
