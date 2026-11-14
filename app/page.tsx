"use client";

import { useEffect, useState } from "react";

import { CATALOG } from "@/lib/catalog";
import type { CheckoutResult } from "@/lib/types";

const SUGGESTIONS = [
  "Buy a USB-C cable under $15",
  "I need a notebook for under $10",
  "Get me coffee beans, max $15",
  "A desk lamp under $30",
];

function timeOf(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [budget, setBudget] = useState(15);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canceled, setCanceled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("canceled=1")) setCanceled(true);
  }, []);

  async function shop(text?: string) {
    const finalPrompt = (text ?? prompt).trim();
    if (!finalPrompt || loading) return;

    setPrompt(finalPrompt);
    setLoading(true);
    setError(null);
    setResult(null);
    setCanceled(false);
    setCopied(false);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, budget }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Checkout failed.");
      }
      setResult(data as CheckoutResult);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  async function copyOrderId() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.orderId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard can be blocked; the ID is visible anyway */
    }
  }

  const emoji =
    CATALOG.find(
      (product) => product.name.toLowerCase() === result?.item.name.toLowerCase(),
    )?.emoji ?? "🛍️";

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo">🛒</span>
          AgentCart
        </div>
        <div className="topbar-right">
          <span className="badge">
            <span className="dot" />
            Human-in-the-loop
          </span>
          <span className="badge sandbox">PayPal sandbox</span>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">Agentic commerce, with a seatbelt</p>
        <h1>
          The agent shops.
          <br />
          <span className="grad">You approve the payment.</span>
        </h1>
        <p className="lede">
          AgentCart gives an AI agent a real PayPal sandbox account — but no ability
          to spend without you. It picks an item, creates a PayPal order, and stops.
          You approve. Then it captures the payment and shows the receipt.
        </p>
        <div className="trust">
          <span>
            <b>Hard cap</b> enforced in code
          </span>
          <span>
            <b>Allowlist</b> of merchants &amp; prices
          </span>
          <span>
            <b>No capture</b> before approval
          </span>
          <span>
            <b>Audit log</b> for every step
          </span>
        </div>
      </section>

      <div className="layout">
        <section className="card">
          <div className="card-title">
            <h2>Give the agent an errand</h2>
            <span className="step-no">Step 01</span>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void shop();
            }}
          >
            <label htmlFor="prompt">What should it buy?</label>
            <input
              id="prompt"
              className="prompt-input"
              placeholder="Buy a USB-C cable under $15"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              autoComplete="off"
            />

            <div className="budget-row">
              <div>
                <label htmlFor="budget">Spend cap</label>
                <div className="budget-wrap">
                  <span>$</span>
                  <input
                    id="budget"
                    className="budget-input"
                    type="number"
                    min={1}
                    max={500}
                    step={1}
                    value={budget}
                    onChange={(event) => setBudget(Number(event.target.value))}
                  />
                </div>
              </div>
              <button className="btn" type="submit" disabled={loading || !prompt.trim()}>
                {loading ? "Shopping…" : "Let it shop"}
              </button>
            </div>
          </form>

          <div className="suggestions">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="suggestion"
                onClick={() => void shop(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <p className="hint">
            The agent uses PayPal&apos;s Agent Toolkit to create the order. If the
            model is unavailable or tries to overspend, the app falls back to a
            deterministic checkout using the same PayPal Orders API.
          </p>

          {canceled && (
            <div className="alert info" style={{ marginTop: 16 }}>
              <strong>Checkout canceled</strong>
              Nothing was captured. The order is still open in your PayPal sandbox
              account, and your spend cap was never touched.
            </div>
          )}

          {error && (
            <div className="alert" style={{ marginTop: 16 }}>
              <strong>Could not complete the errand</strong>
              {error}
            </div>
          )}
        </section>

        <section className="card" aria-live="polite">
          <div className="card-title">
            <h2>Approval queue</h2>
            <span className="step-no">Step 02</span>
          </div>

          {loading && (
            <div className="empty">
              <div className="empty-row">
                <span className="empty-icon">🤖</span>
                <div>
                  <strong>The agent is working</strong>
                  <p>
                    Reading the catalog, checking your cap, and creating a PayPal
                    order. It will stop before capture.
                  </p>
                </div>
              </div>
              <div className="empty-row">
                <span className="empty-icon">🔒</span>
                <div>
                  <strong>Payment is still locked</strong>
                  <p>No money moves until you approve in PayPal.</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="empty">
              <div className="empty-row">
                <span className="empty-icon">🛍️</span>
                <div>
                  <strong>1. Agent picks an item</strong>
                  <p>From a fixed catalog, under your cap, at the listed price.</p>
                </div>
              </div>
              <div className="empty-row">
                <span className="empty-icon">🔐</span>
                <div>
                  <strong>2. You approve in PayPal</strong>
                  <p>
                    A real sandbox checkout. Sign in with the sandbox buyer account
                    from the README.
                  </p>
                </div>
              </div>
              <div className="empty-row">
                <span className="empty-icon">🧾</span>
                <div>
                  <strong>3. Agent captures and receipts</strong>
                  <p>
                    You get a real capture ID, payer, and amount — proof the
                    integration works.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && result && (
            <div>
              <div className="order-head">
                <div>
                  <span className={`mode ${result.mode === "safe" ? "safe" : ""}`}>
                    {result.mode === "agent" ? "Agent Toolkit" : "Safe checkout"}
                  </span>
                  <h3 className="item-name">
                    {emoji} {result.item.name}
                  </h3>
                  <p className="item-sub">One item · seller on the allowlist</p>
                </div>
              </div>

              <div className="price">
                ${result.item.price.toFixed(2)} <small>USD</small>
              </div>

              <p className="rationale">{result.rationale}</p>

              <div className="order-meta">
                <button
                  type="button"
                  className="pill"
                  onClick={() => void copyOrderId()}
                  title="Copy order ID"
                >
                  {copied ? "Copied ✓" : `Order ${result.orderId}`}
                </button>
                <span className="pill">cap ${budget.toFixed(2)}</span>
              </div>

              <a className="btn paypal full" href={result.approveUrl}>
                Approve in PayPal →
              </a>
              <p className="safe-note">
                You will leave the app and sign in to PayPal sandbox. The agent
                cannot capture until you return.
              </p>

              <div className="trail">
                <h3>Audit trail</h3>
                <ul>
                  {result.steps.map((step, index) => (
                    <li key={`${step.at}-${index}`}>
                      <span className="step-label">{step.label}</span>
                      <time>{timeOf(step.at)}</time>
                      {step.detail && <span className="step-detail">{step.detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer>
        <span>
          Built with PayPal Orders v2 + Agent Toolkit · sandbox only, no real money.
        </span>
        <span>
          Fallback proof: <a href="/api/paypal/cancel">cancel path</a> ·{" "}
          <a href="https://developer.paypal.com/dashboard/">PayPal dashboard</a>
        </span>
      </footer>
    </main>
  );
}
