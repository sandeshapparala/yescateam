// Payment Initiation API - Step 1: Create Payment Request (Standard Checkout)
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { registrationSchema } from '@/lib/validations/registration';
import { generateTransactionId, getPhonePeAuthToken, createPhonePeOrder } from '@/lib/payment/phonepe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate form data
    const validationResult = registrationSchema.safeParse(body.formData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const formData = validationResult.data;
    const registrationType = body.registration_type || 'normal';

    // Get registration fee based on type
    const fees: Record<string, number> = {
      normal: 500,
      faithbox: 250,
      kids: 300,
    };
    const amount = fees[registrationType] || 500;

    // Generate unique merchant order ID
    const merchantOrderId = generateTransactionId();

    // Store pending payment data in Firestore (temporary)
    const pendingPaymentRef = adminDb.collection('pending_payments').doc(merchantOrderId);
    await pendingPaymentRef.set({
      merchant_order_id: merchantOrderId,
      registration_type: registrationType,
      amount,
      form_data: formData,
      payment_status: 'PENDING',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    });

    console.log('Getting PhonePe auth token...');
    // Step 1: Get authorization token
    const authToken = await getPhonePeAuthToken();
    console.log('Auth token received');

    // Step 2: Create payment order
    console.log('Creating PhonePe order...');
    const orderResponse = await createPhonePeOrder(authToken, {
      merchantOrderId,
      amount: amount * 100, // Convert to paise
    });
    
    console.log('PhonePe Order Response:', JSON.stringify(orderResponse, null, 2));

    // Store order ID in pending payment
    await pendingPaymentRef.update({
      phonepe_order_id: orderResponse.orderId,
      payment_state: orderResponse.state,
    });

    // Return redirect URL to open PhonePe checkout
    // Note: Don't modify redirectUrl as PhonePe might not preserve custom params
    return NextResponse.json({
      success: true,
      merchant_order_id: merchantOrderId,
      order_id: orderResponse.orderId,
      redirect_url: orderResponse.redirectUrl,
      message: 'Payment order created successfully',
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
