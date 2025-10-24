// PhonePe Standard Checkout Configuration and Utilities

// Validate required environment variables
if (!process.env.PHONEPE_CLIENT_ID) {
  throw new Error('PHONEPE_CLIENT_ID is not configured');
}
if (!process.env.PHONEPE_CLIENT_VERSION) {
  throw new Error('PHONEPE_CLIENT_VERSION is not configured');
}
if (!process.env.PHONEPE_CLIENT_SECRET) {
  throw new Error('PHONEPE_CLIENT_SECRET is not configured');
}
if (!process.env.PHONEPE_BASE_URL) {
  throw new Error('PHONEPE_BASE_URL is not configured');
}
if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error('NEXT_PUBLIC_URL is not configured');
}

export const PHONEPE_CONFIG = {
  CLIENT_ID: process.env.PHONEPE_CLIENT_ID,
  CLIENT_VERSION: process.env.PHONEPE_CLIENT_VERSION,
  CLIENT_SECRET: process.env.PHONEPE_CLIENT_SECRET,
  API_BASE_URL: process.env.PHONEPE_BASE_URL,
  REDIRECT_URL: process.env.NEXT_PUBLIC_URL + '/register/payment-callback?from=phonepe',
};

/**
 * Generate Authorization Token for PhonePe Standard Checkout
 */
export async function getPhonePeAuthToken(): Promise<string> {
  const tokenUrl = `${PHONEPE_CONFIG.API_BASE_URL}/v1/oauth/token`;
  
  const params = new URLSearchParams();
  params.append('client_id', PHONEPE_CONFIG.CLIENT_ID);
  params.append('client_version', PHONEPE_CONFIG.CLIENT_VERSION);
  params.append('client_secret', PHONEPE_CONFIG.CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to get PhonePe auth token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create PhonePe payment order
 */
export async function createPhonePeOrder(authToken: string, orderData: {
  merchantOrderId: string;
  amount: number; // in paisa (1 rupee = 100 paise)
}) {
  const orderUrl = `${PHONEPE_CONFIG.API_BASE_URL}/checkout/v2/pay`;
  
  const payload = {
    merchantOrderId: orderData.merchantOrderId,
    amount: orderData.amount,
    expireAfter: 1200, // 20 minutes
    paymentFlow: {
      type: 'PG_CHECKOUT',
      merchantUrls: {
        redirectUrl: PHONEPE_CONFIG.REDIRECT_URL,
      },
    },
  };

  const response = await fetch(orderUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create PhonePe order: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Check payment status from PhonePe Standard Checkout
 */
export async function checkPhonePeOrderStatus(authToken: string, merchantOrderId: string) {
  const statusUrl = `${PHONEPE_CONFIG.API_BASE_URL}/checkout/v2/order/${merchantOrderId}/status?details=false`;

  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `O-Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to check order status: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Generate unique transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `YC26_${timestamp}_${random}`;
}
