// PhonePe Callback Test Page - For debugging
'use client';

import { useState } from 'react';

export default function CallbackTestPage() {
  const [transactionId, setTransactionId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!transactionId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/payment/callback?transaction_id=${transactionId}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">PhonePe Payment Status Checker</h1>
        
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium mb-2">
            Transaction ID
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="YC26_1234567890_123456"
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
          <button
            onClick={checkStatus}
            disabled={loading || !transactionId}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </div>

        {result && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Result:</h2>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
