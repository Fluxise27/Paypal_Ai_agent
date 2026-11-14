import Link from "next/link";

import { getOrder, paypalConfigured } from "@/lib/paypal";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: {
    order?: string;
    error?: string;
  };
};

function usd(value: unknown): string {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
}

export default async function ReceiptPage({ searchParams }: PageProps) {
  const orderId = typeof searchParams?.order === "string" ? searchParams.order : null;
  const errorParam =
    typeof searchParams?.error === "string" ? searchParams.error : null;

  let order: any = null;
  let loadError = errorParam;

  if (orderId && paypalConfigured()) {
    try {
      order = await getOrder(orderId);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Could not load order.";
    }
  }

  const unit = order?.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  const completed = capture?.status === "COMPLETED" || order?.status === "COMPLETED";
  const amount = capture?.amount?.value ?? unit?.amount?.value ?? "0.00";
  const itemName = unit?.items?.[0]?.name ?? unit?.description ?? "PayPal order";
  const payerName = [order?.payer?.name?.given_name, order?.payer?.name?.surname]
    .filter(Boolean)
    .join(" ");
  const payer = payerName || order?.payer?.email_address || "Sandbox buyer";
  const createdAt = capture?.create_time
    ? new Date(capture.create_time).toLocaleString()
    : null;

  return (
    <main className="receipt-wrap">
      <header className="topbar" style={{ paddingBottom: 0 }}>
        <Link className="brand" href="/">
          <span className="logo">🛒</span>
          AgentCart
        </Link>
        <span className="badge sandbox">PayPal sandbox</span>
      </header>

      <section className="card receipt-card">
        {!orderId && (
          <>
            <div className="check pending">!</div>
            <h1 className="receipt-title">No order to show</h1>
            <p className="receipt-note">
              This page needs a PayPal order ID. Start a new errand and approve the
              order to see a receipt.
            </p>
            <div className="receipt-actions">
              <Link className="btn" href="/">
                Run an errand
              </Link>
            </div>
          </>
        )}

        {orderId && loadError && (
          <>
            <div className="check pending">!</div>
            <h1 className="receipt-title">We could not confirm this payment</h1>
            <p className="receipt-note">{loadError}</p>
            <div className="alert" style={{ marginTop: 18 }}>
              <strong>Order {orderId}</strong>
              If you approved it in PayPal, retry the capture below. Sandbox orders
              stay valid for a while, so a retry usually works.
            </div>
            <div className="receipt-actions">
              <a className="btn paypal" href={`/api/paypal/return?token=${orderId}`}>
                Retry capture
              </a>
              <Link className="btn ghost" href="/">
                Start over
              </Link>
            </div>
          </>
        )}

        {orderId && !loadError && order && (
          <>
            <div className={`check ${completed ? "" : "pending"}`}>
              {completed ? "✓" : "…"}
            </div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              {completed ? "Payment captured" : `Order status: ${order.status}`}
            </p>
            <h1 className="receipt-title">{itemName}</h1>
            <p className="receipt-amount">
              ${usd(amount)} <small>USD</small>
            </p>
            <p className="receipt-note">
              {completed
                ? "The agent created this order, you approved it in PayPal, and the payment was captured server-side. This is a sandbox transaction — no real money moved."
                : "The order exists but the capture has not completed yet. Retry the capture or approve the order in PayPal."}
            </p>

            <div className="detail-grid">
              <div className="detail">
                <span>Order ID</span>
                <strong>{orderId}</strong>
              </div>
              <div className="detail">
                <span>Capture ID</span>
                <strong>{capture?.id ?? "pending"}</strong>
              </div>
              <div className="detail">
                <span>Payer</span>
                <strong className="human">{payer}</strong>
              </div>
              <div className="detail">
                <span>Status</span>
                <strong>{capture?.status ?? order.status}</strong>
              </div>
              <div className="detail">
                <span>Environment</span>
                <strong>{process.env.PAYPAL_ENV === "live" ? "LIVE" : "SANDBOX"}</strong>
              </div>
              <div className="detail">
                <span>Captured at</span>
                <strong className="human">{createdAt ?? "—"}</strong>
              </div>
            </div>

            <div className="proof">
              Proof for judges: open this order in the PayPal sandbox dashboard and
              compare the order ID and capture ID above. The same IDs are returned by
              <code> POST /v2/checkout/orders/{"{id}"}/capture</code>.
            </div>

            <div className="receipt-actions">
              {!completed && (
                <a className="btn paypal" href={`/api/paypal/return?token=${orderId}`}>
                  Retry capture
                </a>
              )}
              <Link className="btn ghost" href="/">
                Run another errand
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
