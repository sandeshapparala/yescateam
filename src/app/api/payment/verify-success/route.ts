// Verify Payment Success - Validates that IDs match and belong together
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('member_id');
    const registrationId = searchParams.get('registration_id');
    const transactionId = searchParams.get('transaction');

    if (!memberId || !registrationId || !transactionId) {
      return NextResponse.json(
        { success: false, error: 'Missing parameters' },
        { status: 400 }
      );
    }

    console.log('Verifying success page IDs:', { memberId, registrationId, transactionId });

    // Get registration document
    const regDoc = await adminDb
      .collection('camps')
      .doc('YC26')
      .collection('registrations')
      .doc(registrationId)
      .get();

    if (!regDoc.exists) {
      console.log('Registration not found:', registrationId);
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    const regData = regDoc.data()!;

    // Verify all IDs match
    if (
      regData.member_id !== memberId ||
      regData.payment_order_id !== transactionId
    ) {
      console.log('ID mismatch detected:', {
        providedMemberId: memberId,
        actualMemberId: regData.member_id,
        providedTransactionId: transactionId,
        actualTransactionId: regData.payment_order_id,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid or tampered IDs' },
        { status: 403 }
      );
    }

    // Verify payment was actually completed
    if (regData.payment_status !== 'completed') {
      console.log('Payment not completed:', regData.payment_status);
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Return verified data
    return NextResponse.json({
      success: true,
      member_id: regData.member_id,
      registration_id: regData.registration_id,
      transaction_id: regData.payment_order_id,
      full_name: regData.full_name,
      phone_number: regData.phone_number,
      verified: true,
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
