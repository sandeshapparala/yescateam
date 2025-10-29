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

    // Get amount from request (user-selected variable pricing)
    const amount = body.amount || 300; // Fallback to 300 if not provided

    // Validate amount based on registration type
    const minAmounts: Record<string, number> = {
      normal: 300,
      faithbox: 50,
      kids: 300,
    };
    const maxAmount = 1000;
    
    const minAmount = minAmounts[registrationType] || 300;
    if (amount < minAmount || amount > maxAmount) {
      return NextResponse.json(
        { error: `Amount must be between ₹${minAmount} and ₹${maxAmount}` },
        { status: 400 }
      );
    }

    // Generate unique merchant order ID
    const merchantOrderId = generateTransactionId();
    const timestamp = new Date().toISOString();

    // Save all form data to yc26/pending_registrations before payment
    const pendingRegRef = adminDb.collection('camps').doc('YC26').collection('pending_registrations').doc(merchantOrderId);
    await pendingRegRef.set({
      merchant_order_id: merchantOrderId,
      registration_type: registrationType,
      amount,
      // All form fields
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      gender: formData.gender,
      age: formData.age,
      dob: formData.dob || null,
      believer: formData.believer === 'yes',
      church_name: formData.church_name,
      address: formData.address,
      fathername: formData.fathername || null,
      marriage_status: formData.marriage_status || null,
      baptism_date: formData.baptism_date || null,
      camp_participated_since: formData.camp_participated_since || null,
      education: formData.education || null,
      occupation: formData.occupation || null,
      future_goals: formData.future_goals || null,
      current_skills: formData.current_skills || null,
      desired_skills: formData.desired_skills || null,
      // Payment tracking
      payment_status: 'pending',
      status: 'pending',
      created_at: timestamp,
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

    // Store order ID in pending registration
    await pendingRegRef.update({
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
