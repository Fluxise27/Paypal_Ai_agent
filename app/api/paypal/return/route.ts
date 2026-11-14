import { NextResponse } from "next/server";

import { captureOrder } from "@/lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("token");

  if (!orderId) {
    return NextResponse.redirect(new URL("/?error=missing_order", url.origin));
  }

  const receipt = new URL("/receipt", url.origin);
  receipt.searchParams.set("order", orderId);

  try {
    await captureOrder(orderId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Capture failed.";
    // An already-captured order is fine: the receipt page will show the
    // completed capture instead of failing the demo.
    if (!/already captured/i.test(message)) {
      receipt.searchParams.set("error", message);
    }
  }

  return NextResponse.redirect(receipt);
}
