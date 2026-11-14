import { NextResponse } from "next/server";

import { runCheckout } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return NextResponse.json(
        { error: "Tell the agent what to buy." },
        { status: 400 },
      );
    }

    const requestedBudget = Number(body?.budget);
    const budget =
      Number.isFinite(requestedBudget) && requestedBudget > 0
        ? Math.min(requestedBudget, 500)
        : 15;

    const result = await runCheckout(prompt, budget);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
