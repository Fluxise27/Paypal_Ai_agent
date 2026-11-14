#!/usr/bin/env node
/**
 * Quick credential check. Reads .env.local (or .env), requests a sandbox token,
 * and prints the environment it will use. No order is created.
 *
 *   npm run check:paypal
 */
import { readFileSync, existsSync } from "node:fs";

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(".env.local");
loadEnv(".env");

const id = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;
const env = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
const base =
  env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

if (!id || !secret) {
  console.error("✖ Missing PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET.");
  console.error("  Copy .env.example to .env.local and paste your sandbox app keys.");
  process.exit(1);
}

console.log(`→ Environment: ${env}`);
console.log(`→ Base URL:    ${base}`);
console.log(`→ Client ID:   ${id.slice(0, 8)}…${id.slice(-4)}`);

const auth = Buffer.from(`${id}:${secret}`).toString("base64");
const response = await fetch(`${base}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

if (!response.ok) {
  const body = await response.text();
  console.error(`✖ PayPal rejected the credentials (${response.status}).`);
  console.error(body.slice(0, 600));
  process.exit(1);
}

const json = await response.json();
console.log(`✔ Token OK (expires in ${json.expires_in}s, app ${json.app_id}).`);
console.log("  Next: npm run dev, then try an errand in the browser.");
