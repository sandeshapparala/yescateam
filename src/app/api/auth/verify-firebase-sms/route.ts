// Sync Firebase Phone Auth User to Firestore
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { formatPhoneNumber, isValidIndianPhone } from '@/lib/auth/otp-utils';

export async function POST(request: NextRequest) {
  try {
    const { phone_number, firebase_uid } = await request.json();

    // Validate inputs
    if (!phone_number || !firebase_uid) {
      return NextResponse.json(
        { error: 'Phone number and Firebase UID are required' },
        { status: 400 }
      );
    }

    if (!isValidIndianPhone(phone_number)) {
      return NextResponse.json(
        { error: 'Invalid Indian phone number' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phone_number);
    const timestamp = Date.now();

    // Get the Firebase SMS verification record
    const otpRef = adminDb.collection('otp_verifications').doc(formattedPhone);
    const otpDoc = await otpRef.get();

    if (otpDoc.exists && otpDoc.data()?.method === 'sms_firebase') {
      // Mark as verified
      await otpRef.update({
        verified: true,
        verified_at: timestamp,
        firebase_uid: firebase_uid,
      });
    }

    console.log('✅ Syncing Firebase SMS user to Firestore:', formattedPhone);

    // For Firebase SMS, we need to create TWO docs:
    // 1. users/{firebase_uid} -> for UID-based lookups
    // 2. users/{phone_number} -> for phone-based lookups (consistency with WhatsApp)
    
    // Check if member exists and get member_id
    const phoneWithoutCountryCode = formattedPhone.replace('+91', '');
    const membersRef = adminDb.collection('members');
    
    // Try both formats to find member
    let memberSnapshot = await membersRef.where('phone_number', '==', formattedPhone).limit(1).get();
    if (memberSnapshot.empty) {
      memberSnapshot = await membersRef.where('phone_number', '==', phoneWithoutCountryCode).limit(1).get();
    }
    
    const memberId = !memberSnapshot.empty ? memberSnapshot.docs[0].id : null;
    
    const userData = {
      phone_number: formattedPhone,
      firebase_uid: firebase_uid,
      member_id: memberId,
      last_login_at: timestamp,
      verification_method: 'sms_firebase',
      auth_provider: 'phone',
    };
    
    // Create/update user doc with Firebase UID as doc ID
    const firebaseUidRef = adminDb.collection('users').doc(firebase_uid);
    const firebaseUidDoc = await firebaseUidRef.get();
    
    if (!firebaseUidDoc.exists) {
      await firebaseUidRef.set({
        ...userData,
        created_at: timestamp,
      });
    } else {
      await firebaseUidRef.update({
        last_login_at: timestamp,
        member_id: memberId || firebaseUidDoc.data()?.member_id,
      });
    }
    
    // Also create/update user doc with phone number as doc ID (for consistency)
    const userRef = adminDb.collection('users').doc(formattedPhone);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        ...userData,
        created_at: timestamp,
      });
    } else {
      await userRef.update({
        firebase_uid: firebase_uid,
        last_login_at: timestamp,
        member_id: memberId || userDoc.data()?.member_id,
      });
    }

    // Create audit log
    await adminDb.collection('audit_logs').add({
      action: 'firebase_sms_verification_success',
      resource_type: 'authentication',
      resource_id: formattedPhone,
      actor_type: 'user',
      actor_id: formattedPhone,
      details: {
        method: 'sms_firebase',
        firebase_uid: firebase_uid,
      },
      timestamp,
    });

    console.log('🎉 User synced to Firestore:', formattedPhone);

    return NextResponse.json({
      success: true,
      message: 'Firebase SMS user synced successfully',
      phone_number: formattedPhone,
      firebase_uid: firebase_uid,
      user_exists: userDoc.exists,
    });

  } catch (error) {
    console.error('Verify Firebase SMS error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify Firebase SMS', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
