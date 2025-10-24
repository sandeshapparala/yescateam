// Payment Success Page
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    member_id: string;
    registration_id: string;
    transaction_id: string;
    full_name: string;
    phone_number: string;
  } | null>(null);

  useEffect(() => {
    const memberId = searchParams.get('member_id');
    const registrationId = searchParams.get('registration_id');
    const transactionId = searchParams.get('transaction');

    if (!memberId || !registrationId || !transactionId) {
      setError('Invalid payment confirmation link');
      setLoading(false);
      return;
    }

    // Verify the IDs with the server
    fetch(`/api/payment/verify-success?member_id=${memberId}&registration_id=${registrationId}&transaction=${transactionId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData({
            member_id: result.member_id,
            registration_id: result.registration_id,
            transaction_id: result.transaction_id,
            full_name: result.full_name,
            phone_number: result.phone_number,
          });
        } else {
          setError(result.error || 'Invalid payment confirmation');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Verification error:', err);
        setError('Failed to verify payment');
        setLoading(false);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      });
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
            <div className="text-destructive mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error}
            </h1>
            <p className="text-muted-foreground mb-6">
              This payment confirmation link is invalid or has been tampered with.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
            <div className="text-destructive mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Invalid Request
            </h1>
            <p className="text-muted-foreground mb-6">
              Registration details not found.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
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
              Payment Successful!
            </h1>
            <p className="text-xl text-muted-foreground">
              చెల్లింపు విజయవంతమైంది!
            </p>
          </div>

          {/* Registration Details */}
          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <p className="text-foreground mb-4">
              Your registration has been completed successfully.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              మీ నమోదు విజయవంతంగా పూర్తయింది.
            </p>

            <div className="bg-background border border-border rounded-lg p-4 space-y-3">
              <div className="mb-3 pb-3 border-b border-border">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-lg font-semibold text-foreground">
                  {data.full_name}
                </p>
                <p className="text-sm text-muted-foreground">{data.phone_number}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Member ID</p>
                  <p className="text-lg font-bold text-primary font-mono">
                    {data.member_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Registration ID</p>
                  <p className="text-sm font-mono text-foreground">
                    {data.registration_id}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="text-sm font-mono text-foreground">
                  {data.transaction_id}
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
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6">
            <p className="text-sm text-muted-foreground">
              Please save your Member ID and Registration ID for future reference.
            </p>
            <p className="text-sm text-muted-foreground">
              భవిష్యత్ సూచన కోసం మీ మెంబర్ ID మరియు రిజిస్ట్రేషన్ ID ని సేవ్ చేయండి.
            </p>
            <p className="text-sm text-muted-foreground">
              Please collect your ID card from the front desk at the camp venue.
            </p>
            <p className="text-sm text-muted-foreground">
              క్యాంప్ వేదికలో ఫ్రంట్ డెస్క్ వద్ద మీ ID కార్డ్ ని సేకరించండి.
            </p>
          </div>

          {/* Actions */}
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home - హోమ్ కు వెళ్ళండి
          </button>
        </div>
      </div>
    </div>
  );
}
