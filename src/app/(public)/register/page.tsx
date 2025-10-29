// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

// Registration Page - Handles both Normal and Faithbox Registration
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegistrationForm } from '@/components/registration/RegistrationForm';
import { RegistrationType, REGISTRATION_CONFIGS } from '@/lib/registration/types';
import { RegistrationFormData } from '@/lib/validations/registration';

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') as RegistrationType) || 'normal';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<{
    member_id: string;
    registration_id: string;
    yc26_registration_number: number;
  } | null>(null);

  // Validate registration type
  const registrationType: RegistrationType = ['normal', 'faithbox'].includes(type) 
    ? type 
    : 'normal';

  const config = REGISTRATION_CONFIGS[registrationType];

  const handleSubmit = async (data: RegistrationFormData, amount: number) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Initiate payment
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: data,
          registration_type: registrationType,
          amount: amount, // Use selected amount from price selector
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment initiation failed');
      }

      // Store merchant order ID in sessionStorage before redirect
      sessionStorage.setItem('phonepe_merchant_order_id', result.merchant_order_id);
      console.log('Stored merchant order ID:', result.merchant_order_id);

      // Step 2: Redirect to PhonePe payment page
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError(err instanceof Error ? err.message : 'Payment initiation failed');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Registration Successful!
              </h1>
              <p className="text-xl text-muted-foreground">
                నమోదు విజయవంతమైంది!
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <p className="text-foreground mb-4">
                Your registration for <strong>{config.title}</strong> has been successfully submitted.
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                మీరు విజయవంతంగా నమోదు చేసుకున్నారు.
              </p>
              
              {registrationData && (
                <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Member ID</p>
                      <p className="text-lg font-bold text-primary font-mono">
                        {registrationData.member_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Registration ID</p>
                      <p className="text-sm font-mono text-foreground">
                        {registrationData.registration_id}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">Registration Number</p>
                    <p className="text-lg font-semibold text-foreground">
                      #{registrationData.yc26_registration_number}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground italic">
                      Group will be assigned when you collect your ID card at camp
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      క్యాంప్ వద్ద మీ ID కార్డ్ సేకరించినప్పుడు గ్రూప్ కేటాయించబడుతుంది
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Please collect your ID card from the front desk at the camp venue.
              </p>
              <p className="text-sm text-muted-foreground">
                క్యాంప్ వేదికలో ఫ్రంట్ డెస్క్ వద్ద మీ ID కార్డ్ ని సేకరించండి.
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Home - హోమ్ కు వెళ్ళండి
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4">
            <p className="font-semibold">Registration Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <RegistrationForm
        registrationType={registrationType}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading registration form...</p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterPageContent />
    </Suspense>
  );
}
