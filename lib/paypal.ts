const BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

export class PayPalError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status = 500, detail: unknown = null) {
    super(message);
    this.name = "PayPalError";
    this.status = status;
    this.detail = detail;
  }
}

export function paypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function appUrl(): string {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
}

export function paypalBaseUrl(): string {
  return BASE;
}

async function readError(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text.slice(0, 500);
  }
}

export async function getAccessToken(): Promise<string> {
  if (!paypalConfigured()) {
    throw new PayPalError(
      "PayPal credentials are missing. Copy .env.example to .env.local and add PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET.",
      400,
    );
  }

  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) {
    return tokenCache.token;
  }

  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new PayPalError(
      "PayPal rejected the client credentials. Double-check you are using a sandbox app.",
      response.status,
      await readError(response),
    );
  }

  const json = (await response.json()) as { access_token: string; expires_in: number };
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + Math.max(60, json.expires_in - 120) * 1000,
  };
  return json.access_token;
}

type CreateOrderInput = {
  amount: string;
  description: string;
  itemName: string;
  returnUrl: string;
  cancelUrl: string;
};

export async function createOrder(input: CreateOrderInput): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`${BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: input.description,
          amount: {
            currency_code: "USD",
            value: input.amount,
            breakdown: {
              item_total: { currency_code: "USD", value: input.amount },
            },
          },
          items: [
            {
              name: input.itemName,
              quantity: "1",
              category: "PHYSICAL_GOODS",
              unit_amount: { currency_code: "USD", value: input.amount },
            },
          ],
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "AgentCart",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: input.returnUrl,
            cancel_url: input.cancelUrl,
          },
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new PayPalError(
      "PayPal could not create the order.",
      response.status,
      await readError(response),
    );
  }

  return response.json();
}

export async function captureOrder(orderId: string): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  });

  const json = await readError(response);

  if (!response.ok) {
    const issue = (json as any)?.details?.[0]?.issue;
    throw new PayPalError(
      issue === "ORDER_ALREADY_CAPTURED"
        ? "This order was already captured."
        : "PayPal could not capture the order.",
      response.status,
      json,
    );
  }

  return json;
}

export async function getOrder(orderId: string): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`${BASE}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new PayPalError(
      "PayPal could not load that order.",
      response.status,
      await readError(response),
    );
  }

  return response.json();
}

export function approveLink(order: any): string | null {
  const links = Array.isArray(order?.links) ? order.links : [];
  const approve = links.find((link: any) => link?.rel === "approve");
  return approve?.href ?? null;
}

export function formatUsd(value: number): string {
  return value.toFixed(2);
}
