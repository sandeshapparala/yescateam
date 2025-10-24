// Payment Failed Page
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTransactionId(searchParams.get('transaction'));
    setError(searchParams.get('error'));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-destructive mb-2">
              Payment Failed
            </h1>
            <p className="text-xl text-muted-foreground">
              చెల్లింపు విఫలమైంది
            </p>
          </div>

          {/* Error Message */}
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 mb-6">
            <p className="text-foreground mb-2">
              Your payment could not be processed.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              మీ చెల్లింపు ప్రాసెస్ చేయబడలేదు.
            </p>
            {error && (
              <p className="text-sm text-destructive">
                Error: {error}
              </p>
            )}
            {transactionId && (
              <p className="text-xs text-muted-foreground mt-2">
                Transaction ID: {transactionId}
              </p>
            )}
          </div>

          {/* Possible Reasons */}
          <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">
              Possible reasons:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Insufficient balance in your account</li>
              <li>• Payment was cancelled</li>
              <li>• Network connectivity issue</li>
              <li>• Bank declined the transaction</li>
              <li>• Session timeout</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/register?type=normal'}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again - మళ్ళీ ప్రయత్నించండి
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
            >
              Return to Home - హోమ్ కు వెళ్ళండి
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? Contact support for assistance.
            </p>
            <p className="text-sm text-muted-foreground">
              సహాయం కావాలా? మద్దతు కోసం సంప్రదించండి.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
