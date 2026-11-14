# AgentCart

**An AI shopping agent with a seatbelt: it can create a real PayPal order, but it cannot spend your money without approval.**

Built for a PayPal-sponsored hackathon. Sandbox only — no real money moves.

---

## The 30-second pitch

Agentic commerce has a trust problem: nobody wants to hand an LLM their card. AgentCart splits the job in two.

1. The agent picks an item from a fixed catalog, inside a hard spend cap, and creates a **PayPal order**.
2. A human approves it in PayPal.
3. The server **captures** the payment and renders a receipt with the real order and capture IDs.

The agent gets autonomy. The human keeps the keys.

## How it works

```
Browser ──► POST /api/checkout
              │
              ├─ Agent Toolkit (LLM) ──► create_order ──► PayPal Orders v2
              │        └─ guard: spend cap + merchant/price allowlist
              │
              └─ Safe checkout fallback ─► create_order ──► PayPal Orders v2
                                                        │
              approveUrl ◄──────────────────────────────┘
              │
Browser ──► paypal.com (sandbox login + approval)
              │
              └─► GET /api/paypal/return?token=ORDER_ID
                        │
                        └─ POST /v2/checkout/orders/{id}/capture
                                   │
                                   └─► /receipt?order=ORDER_ID
```

The fallback is the point: if the model is slow, unavailable, or tries to overspend, the app still completes the flow through the same PayPal APIs. It is also your live-demo insurance.

## Quickstart

Requirements: Node 20+ recommended (18.18 works; a few Agent Toolkit transitive deps warn on 18) and a PayPal Developer account.

```bash
npm install
cp .env.example .env.local
# paste your sandbox Client ID + Secret into .env.local
npm run check:paypal    # confirms the credentials and token work
npm run dev             # http://localhost:3000
```

### 1. Get sandbox credentials

1. Open the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. **Apps & Credentials → Sandbox → Create App**.
3. Copy the **Client ID** and **Secret** into `.env.local`.

### 2. Create a sandbox buyer (do this before the demo)

1. Dashboard → **Testing Tools → Sandbox Accounts → Create Account**.
2. Type: **Personal**. Copy the generated email and password.
3. Use those credentials on the PayPal approval screen. Put them in the
   "Judge test credentials" section below so judges can try it too.

### 3. Set the public URL

PayPal redirects the buyer back to `APP_URL` after approval. That URL must be
reachable by the browser running the demo:

```bash
# local testing of create/capture only
APP_URL=http://localhost:3000

# full approve -> capture demo (recommended)
APP_URL=https://your-app.vercel.app
```

Deploy with `vercel` or import the repo into Vercel. Add the same env vars there.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PAYPAL_CLIENT_ID` | yes | Sandbox app client ID |
| `PAYPAL_CLIENT_SECRET` | yes | Sandbox app secret (server only) |
| `PAYPAL_ENV` | yes | `sandbox` (default) or `live` |
| `APP_URL` | yes | Public URL used for `return_url` / `cancel_url` |
| `OPENAI_API_KEY` | no | Enables the Agent Toolkit path |
| `AGENT_MODEL` | no | Default `gpt-4o-mini` |
| `AGENT_DISABLED` | no | `1` forces the deterministic path |

Without `OPENAI_API_KEY`, the app runs the safe checkout path. That is a feature,
not a failure state.

## The trust layer (the part judges remember)

- **Hard cap**: enforced inside the wrapped `create_order` tool, not just in the
  prompt. The order is refused before it reaches PayPal.
- **Merchant + price allowlist**: item names must match a catalog entry exactly,
  and `itemCost` must match the published price.
- **No capture before approval**: the agent only gets the `create_order` tool.
  Capture happens in the return route after the human approves.
- **Audit trail**: every step is timestamped and shown in the UI.
- **Deterministic fallback**: same PayPal APIs, no LLM in the loop.

## Run the demo (2 minutes)

1. Say: *"Everyone is shipping buying agents, but nobody wants to give an LLM their card."*
2. Type: **"Buy a USB-C cable under $15"**, cap **$15**.
3. Point at the audit trail: request → cap/allowlist pass → PayPal order created.
4. Click **Approve in PayPal**, sign in as the sandbox buyer, approve.
5. Land on the receipt: **COMPLETED**, real capture ID, payer, amount.
6. Close with the safety story: the agent literally cannot exceed the cap, and
   the capture only happens after a human tap.
7. Fallback line: *"If the model fails, the same flow runs deterministically — the demo never dies."*

## Why this maps to sponsor judging

| Criterion | Where it shows up |
| --- | --- |
| Use of PayPal | Orders v2 create + capture, approval redirect, sandbox receipts |
| Use of PayPal's newest tech | Agent Toolkit function calling (`create_order`), optional MCP config |
| Use of AI sponsor | Vercel AI SDK + configurable model (`AGENT_MODEL`) |
| Technical depth | Guarded tool wrapper, token cache, deterministic fallback |
| Product thinking | Spend cap, allowlist, human approval, audit log |
| Demo quality | One screen, live sandbox proof, 2-minute script |

### Bonus: expose the same agent through MCP

Judges can run the PayPal MCP server themselves in Claude Desktop or Cursor.
Paste this in the README slide / submission notes (no extra code in this repo):

```json
{
  "mcpServers": {
    "paypal": {
      "command": "npx",
      "args": ["-y", "@paypal/mcp", "--tools=all"],
      "env": {
        "PAYPAL_ACCESS_TOKEN": "YOUR_SANDBOX_ACCESS_TOKEN",
        "PAYPAL_ENVIRONMENT": "SANDBOX"
      }
    }
  }
}
```

Or use the hosted server: `https://mcp.sandbox.paypal.com/mcp` with a bearer token.

## Devpost submission checklist

- [ ] Public repo (this one) with secrets excluded — check `.gitignore`
- [ ] Deployed URL with env vars set
- [ ] 2-minute video, public on YouTube/Vimeo
- [ ] README includes **judge test credentials** for the sandbox buyer
- [ ] Every sponsor tool named explicitly in the submission text
- [ ] Screenshot of the PayPal sandbox transaction (order + capture ID)
- [ ] Submit at least 45 minutes before the deadline

### Judge test credentials

```
Sandbox buyer email:    <fill this in>
Sandbox buyer password: <fill this in>
Spend cap:              $15
```

> Never put live credentials here. Sandbox only.

## Deliverables (docs)

| File | What it is |
| --- | --- |
| `docs/AgentCart-Pamphlet.pdf` | 30-page illustrated technical pamphlet: problem, architecture, trust model, implementation, operations |
| `docs/pamphlet.html` | Source of the pamphlet (print CSS, A4, one section per page) |
| `docs/AgentCart-Deck.pptx` | 14-slide pitch deck: problem, insight, solution, architecture, differentiation, judging, roadmap |
| `docs/AgentCart-Deck.pdf` | Flat export of the deck for quick review or upload |

Rebuild after edits:

```bash
cd deck
node render-pamphlet.mjs      # pamphlet HTML -> PDF (needs a local Chrome)
node build-deck.cjs           # deck source -> PPTX
```

## Project structure

```
app/
  page.tsx                  errand UI + approval queue + audit trail
  receipt/page.tsx          server-rendered receipt from PayPal
  api/checkout/route.ts     agent or safe checkout -> PayPal order
  api/paypal/return/route.ts capture on return, then redirect to receipt
  api/paypal/cancel/route.ts cancel path
lib/
  agent.ts                  Agent Toolkit + guard wrapper + fallback
  paypal.ts                 OAuth token cache, Orders v2 create/get/capture
  catalog.ts                demo catalog = merchant allowlist
  types.ts                  shared result types
scripts/paypal-check.mjs    credential smoke test
```

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `PayPal rejected the client credentials` | Using live keys with `PAYPAL_ENV=sandbox`, or a typo. Re-copy from the sandbox app. |
| Approval page loops back with an error | `APP_URL` does not match the URL the browser is using. Set it to the deployed HTTPS URL. |
| `ORDER_ALREADY_CAPTURED` | Harmless. The receipt page re-fetches and shows the completed capture. |
| Agent never creates an order | No `OPENAI_API_KEY`, bad key, or guard rejection. Check the audit trail; the fallback should still finish. |
| `Nothing in the demo catalog is under $X` | Raise the cap or add a product in `lib/catalog.ts`. |
| Receipt shows `pending` | Approval did not complete, or capture failed. Use **Retry capture**. |

## Notes

- `ai@4` is pinned on purpose: `@paypal/agent-toolkit@1.11` is built against the
  AI SDK v4 API (`maxSteps`, `toolResults`). Upgrading to AI SDK v5 requires
  switching to `stopWhen: stepCountIs(...)` and reading `toolResults[].output`.
- The Agent Toolkit is imported dynamically so a toolkit load failure cannot
  take down the deterministic path.
- Use the sandbox only. A live client secret in a public repo is an instant
  disqualifier and a real financial risk.
