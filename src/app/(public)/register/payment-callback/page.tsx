// Payment Callback Page - User is redirected here after PhonePe payment
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying payment status...');

  useEffect(() => {
    // Try to get merchantOrderId from multiple sources
    let merchantOrderId = searchParams.get('merchantOrderId') || 
                         searchParams.get('merchant_order_id') ||
                         searchParams.get('orderId');
    
    // If not in URL params, try sessionStorage
    if (!merchantOrderId) {
      merchantOrderId = sessionStorage.getItem('phonepe_merchant_order_id');
      console.log('Retrieved from sessionStorage:', merchantOrderId);
    }
    
    console.log('Callback received, params:', Object.fromEntries(searchParams.entries()));
    console.log('Extracted merchantOrderId:', merchantOrderId);
    
    if (!merchantOrderId) {
      setStatus('error');
      setMessage('Invalid callback - Order ID missing');
      
      // Show all params for debugging
      const allParams = Object.fromEntries(searchParams.entries());
      console.error('All query params:', allParams);
      setTimeout(() => {
        router.push('/register?type=normal');
      }, 3000);
      return;
    }

    // Clear sessionStorage after retrieving
    sessionStorage.removeItem('phonepe_merchant_order_id');

    // Call our API to verify payment status
    fetch(`/api/payment/verify?merchant_order_id=${merchantOrderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.state === 'COMPLETED') {
          // Payment successful - redirect to success page
          router.push(
            `/register/payment-success?member_id=${data.member_id}&registration_id=${data.registration_id}&transaction=${merchantOrderId}`
          );
        } else {
          // Payment failed or pending
          router.push(
            `/register/payment-failed?transaction=${merchantOrderId}&status=${data.state || 'UNKNOWN'}`
          );
        }
      })
      .catch((error) => {
        console.error('Verification error:', error);
        router.push(`/register/payment-failed?error=verification_failed&transaction=${merchantOrderId}`);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">{status === 'verifying' ? 'Verifying Payment' : 'Processing...'}</h2>
        <p className="text-muted-foreground">{message}</p>
        <p className="text-sm text-muted-foreground mt-4">Please wait, do not refresh this page</p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-muted-foreground">Please wait</p>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
