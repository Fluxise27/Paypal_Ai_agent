import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

import { CATALOG, catalogLine, pickProduct } from "./catalog";
import { approveLink, appUrl, createOrder, formatUsd, paypalConfigured } from "./paypal";
import type { AuditStep, CheckoutResult } from "./types";

function addStep(steps: AuditStep[], label: string, detail?: string) {
  steps.push({ at: new Date().toISOString(), label, detail });
}

function lastCreatedOrder(toolResults: unknown): any | null {
  let found: any = null;
  for (const entry of (toolResults as any[]) ?? []) {
    const name = entry?.toolName ?? entry?.type;
    const output = entry?.result ?? entry?.output;
    if (name === "create_order" && output?.id) found = output;
  }
  return found;
}

function itemFromOrder(order: any): { name: string; price: number } {
  const unit = order?.purchase_units?.[0];
  const item = unit?.items?.[0];
  return {
    name: item?.name ?? unit?.description ?? "PayPal order",
    price: Number(item?.unit_amount?.value ?? unit?.amount?.value ?? 0),
  };
}

/**
 * Agent path: the PayPal Agent Toolkit exposes create_order as an LLM tool.
 * We wrap that tool with a hard spend cap + catalog/price allowlist so the
 * model cannot overspend or invent a merchant.
 */
async function runAgent(
  prompt: string,
  budget: number,
  steps: AuditStep[],
): Promise<CheckoutResult> {
  const { PayPalAgentToolkit } = await import("@paypal/agent-toolkit/ai-sdk");

  const toolkit = new PayPalAgentToolkit({
    clientId: process.env.PAYPAL_CLIENT_ID!,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
    configuration: {
      actions: { orders: { create: true } },
      context: { sandbox: process.env.PAYPAL_ENV !== "live" },
    },
  });

  const base = appUrl();
  const tools = toolkit.getTools() as Record<string, any>;
  const create = tools.create_order;
  if (!create?.execute) {
    throw new Error("Agent Toolkit did not expose the create_order tool.");
  }

  tools.create_order = {
    ...create,
    execute: async (args: any, options: any) => {
      const items: any[] = Array.isArray(args?.items) ? args.items : [];
      if (items.length === 0) {
        throw new Error("Guard: create_order needs at least one line item.");
      }

      let total = 0;
      for (const item of items) {
        const allowed = CATALOG.find(
          (product) => product.name.toLowerCase() === String(item?.name ?? "").toLowerCase(),
        );
        if (!allowed) {
          throw new Error(`Guard: "${item?.name}" is not in the merchant allowlist.`);
        }
        const unit = Number(item?.itemCost);
        if (!Number.isFinite(unit) || Math.abs(unit - allowed.price) > 0.009) {
          throw new Error(`Guard: price mismatch for ${allowed.name}.`);
        }
        const quantity = Number(item?.quantity ?? 1);
        const tax = Number(item?.taxPercent ?? 0);
        total += unit * quantity * (1 + tax / 100);
      }

      if (total > budget + 0.005) {
        throw new Error(
          `Guard: $${total.toFixed(2)} exceeds the $${budget.toFixed(2)} spend cap.`,
        );
      }

      addStep(
        steps,
        "Spend cap + allowlist passed",
        `${items.length} item(s), $${total.toFixed(2)} of $${budget.toFixed(2)}`,
      );

      // Never trust the model with the redirect targets or currency.
      return create.execute(
        {
          ...args,
          currencyCode: "USD",
          returnUrl: `${base}/api/paypal/return`,
          cancelUrl: `${base}/api/paypal/cancel`,
        },
        options,
      );
    },
  };

  const model = process.env.AGENT_MODEL || "gpt-4o-mini";
  const system = [
    "You are AgentCart, an autonomous shopping agent running against PayPal sandbox.",
    `You have a hard spend cap of $${budget.toFixed(2)} USD.`,
    "",
    "The only items you may buy (merchant allowlist, exact names and prices):",
    ...CATALOG.map(catalogLine),
    "",
    "Rules:",
    "1. Choose exactly one catalog item that best matches the user's request. Never exceed the cap.",
    "2. Call create_order exactly once with:",
    '   currencyCode: "USD",',
    '   items: [{ name: "<exact catalog name>", quantity: 1, description: "<short description>", itemCost: <exact price>, taxPercent: 0 }],',
    `   returnUrl: "${base}/api/paypal/return",`,
    `   cancelUrl: "${base}/api/paypal/cancel"`,
    "3. Do not capture, refund, or call any other tool. A human must approve the payment first.",
    "4. If nothing fits the cap, do not create an order. Reply with exactly: NO_MATCH",
    "5. After the tool call, reply with one short sentence explaining why you chose that item.",
  ].join("\n");

  addStep(steps, "Agent is shopping", `model ${model} · PayPal Agent Toolkit`);

  const result = await generateText({
    model: openai(model),
    system,
    prompt,
    tools,
    maxSteps: 4,
    temperature: 0,
  });

  const order = lastCreatedOrder(result.toolResults);
  if (!order) {
    throw new Error("The agent finished without creating a PayPal order.");
  }

  const approveUrl = approveLink(order);
  if (!approveUrl) {
    throw new Error("PayPal did not return an approval link for the order.");
  }

  addStep(steps, "PayPal order created", order.id);

  return {
    mode: "agent",
    orderId: order.id,
    approveUrl,
    item: itemFromOrder(order),
    rationale:
      result.text?.trim() ||
      "The agent picked an item inside your cap and created a PayPal order.",
    steps,
  };
}

/**
 * Deterministic path: no LLM, same PayPal APIs. Used when no model key is set
 * or when the agent fails / gets blocked. This is the demo-saver.
 */
async function runSafe(
  prompt: string,
  budget: number,
  steps: AuditStep[],
): Promise<CheckoutResult> {
  const product = pickProduct(prompt, budget);
  if (!product) {
    throw new Error(
      `Nothing in the demo catalog is under $${budget.toFixed(2)}. Raise the cap or add a product.`,
    );
  }

  addStep(steps, "Safe checkout selected an item", `${product.name} · $${product.price.toFixed(2)}`);

  const base = appUrl();
  const order = await createOrder({
    amount: formatUsd(product.price),
    description: product.description,
    itemName: product.name,
    returnUrl: `${base}/api/paypal/return`,
    cancelUrl: `${base}/api/paypal/cancel`,
  });

  const approveUrl = approveLink(order);
  if (!approveUrl) {
    throw new Error("PayPal did not return an approval link for the order.");
  }

  addStep(steps, "PayPal order created", order.id);

  return {
    mode: "safe",
    orderId: order.id,
    approveUrl,
    item: { name: product.name, price: product.price },
    rationale: `Safe checkout picked ${product.name} for $${product.price.toFixed(
      2,
    )} — inside your cap and on the allowlist.`,
    steps,
  };
}

export async function runCheckout(prompt: string, budget: number): Promise<CheckoutResult> {
  const steps: AuditStep[] = [];

  if (!paypalConfigured()) {
    throw new Error(
      "PayPal sandbox credentials are missing. Copy .env.example to .env.local and add PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET.",
    );
  }

  addStep(steps, "Request received", `"${prompt}" · cap $${budget.toFixed(2)}`);

  const agentEnabled =
    Boolean(process.env.OPENAI_API_KEY) && process.env.AGENT_DISABLED !== "1";

  if (agentEnabled) {
    try {
      return await runAgent(prompt, budget, steps);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addStep(steps, "Agent path failed — falling back to safe checkout", message);
    }
  } else {
    addStep(
      steps,
      "Agent disabled",
      process.env.OPENAI_API_KEY
        ? "AGENT_DISABLED=1"
        : "No OPENAI_API_KEY set — using deterministic checkout",
    );
  }

  return runSafe(prompt, budget, steps);
}
