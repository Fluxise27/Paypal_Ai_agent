/* AgentCart hackathon deck — 16:9, dark PayPal-blue theme, shape diagrams. */
const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "AgentCart";
pptx.company = "AgentCart";
pptx.subject = "Agentic checkout with human approval";
pptx.title = "AgentCart — autonomy with a seatbelt";

const W = 13.333;
const H = 7.5;
const M = 0.62;
const CW = W - M * 2;

const C = {
  bg: "071021",
  navy: "0B1B33",
  panel: "0F213D",
  panel2: "132845",
  line: "23395B",
  text: "EEF2FF",
  muted: "9AA9C4",
  dim: "6F80A0",
  blue: "4D8DFF",
  blueDeep: "0B6FE8",
  cyan: "009CDE",
  gold: "FFC439",
  green: "2BD67B",
  red: "FF7B7B",
  white: "FFFFFF",
};

pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial", lang: "en-US" };

function base(slide, section, n) {
  slide.background = { color: C.bg };
  // soft ambient glows
  slide.addShape(pptx.ShapeType.ellipse, {
    x: W - 4.6, y: -2.4, w: 6.8, h: 6.8,
    fill: { color: C.cyan, transparency: 88 }, line: { color: C.cyan, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: -2.8, y: H - 2.6, w: 6.2, h: 5.6,
    fill: { color: C.blue, transparency: 90 }, line: { color: C.blue, transparency: 100 },
  });

  slide.addText("AGENTCART", {
    x: M, y: 0.26, w: 3, h: 0.28, fontSize: 9, bold: true,
    color: C.text, charSpacing: 2.4, fontFace: "Arial",
  });
  slide.addText(section.toUpperCase(), {
    x: W - M - 5, y: 0.26, w: 5, h: 0.28, fontSize: 8.5,
    color: C.dim, charSpacing: 1.8, align: "right",
  });
  slide.addShape(pptx.ShapeType.line, {
    x: M, y: H - 0.42, w: CW, h: 0,
    line: { color: C.line, width: 0.6 },
  });
  slide.addText(`${String(n).padStart(2, "0")} / 14`, {
    x: W - M - 1.2, y: H - 0.34, w: 1.2, h: 0.2,
    fontSize: 8, color: C.dim, align: "right", fontFace: "Consolas",
  });
  slide.addText("AgentCart · sandbox build", {
    x: M, y: H - 0.34, w: 5, h: 0.2,
    fontSize: 8, color: C.dim,
  });
}

function heading(slide, kicker, title, sub, subY = 1.62) {
  slide.addText(kicker.toUpperCase(), {
    x: M, y: 0.64, w: CW, h: 0.26, fontSize: 9.5, bold: true,
    color: C.blue, charSpacing: 2.2,
  });
  const twoLines = title.includes("\n");
  slide.addText(title, {
    x: M, y: 0.92, w: CW, h: twoLines ? 0.9 : 0.58,
    fontSize: twoLines ? 25 : 28, bold: true,
    color: C.text, charSpacing: -0.6, valign: "top", fit: "shrink",
    lineSpacingMultiple: 0.95,
  });
  if (sub) {
    slide.addText(sub, {
      x: M, y: subY, w: 11.5, h: 0.62, fontSize: 13,
      color: C.muted, lineSpacingMultiple: 1.05, valign: "top", fit: "shrink",
    });
  }
}

function box(slide, opts) {
  const {
    x, y, w, h, text, sub, fill = C.panel, line = C.line,
    color = C.text, size = 12, subSize = 9, bold = true,
    align = "center", radius = 0.08, lineWidth = 0.8,
  } = opts;
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: fill },
    line: { color: line, width: lineWidth },
    rectRadius: radius,
  });
  slide.addText(
    [
      { text, options: { bold, color, fontSize: size, breakLine: Boolean(sub) } },
      ...(sub ? [{ text: sub, options: { color: C.muted, fontSize: subSize, bold: false } }] : []),
    ],
    {
      x: x + 0.08, y: y + 0.04, w: w - 0.16, h: h - 0.08,
      align, valign: "middle", fontFace: "Arial", lineSpacingMultiple: 0.95,
    },
  );
}

function arrow(slide, x, y, w, color = C.dim) {
  slide.addShape(pptx.ShapeType.line, {
    x, y, w, h: 0,
    line: { color, width: 1.4, endArrowType: "triangle" },
  });
}

function notes(slide, text) {
  slide.addNotes(text);
}

/* ---------------------------------------------------------------- 01 title */
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.addShape(pptx.ShapeType.ellipse, {
    x: 8.2, y: -2.8, w: 7.6, h: 7.6,
    fill: { color: C.cyan, transparency: 82 }, line: { color: C.cyan, transparency: 100 },
  });
  s.addShape(pptx.ShapeType.ellipse, {
    x: -2.4, y: 4.2, w: 6.4, h: 5.8,
    fill: { color: C.blue, transparency: 84 }, line: { color: C.blue, transparency: 100 },
  });
  s.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.16, h: H, fill: { color: C.blueDeep }, line: { color: C.blueDeep },
  });

  s.addText("PAYPAL  ·  AGENTIC COMMERCE  ·  SANDBOX", {
    x: M, y: 0.75, w: 9.5, h: 0.3, fontSize: 10, bold: true,
    color: C.blue, charSpacing: 2.6,
  });
  s.addText("AgentCart", {
    x: M, y: 1.3, w: 9.5, h: 1.1, fontSize: 60, bold: true,
    color: C.white, charSpacing: -1.8,
  });
  s.addText("The agent shops. You approve the payment.", {
    x: M, y: 2.45, w: 9.8, h: 0.6, fontSize: 24, bold: true,
    color: "9CC0FF", charSpacing: -0.4,
  });
  s.addText(
    "An AI buying agent that can create a real PayPal order — but cannot spend your money without you.",
    { x: M, y: 3.12, w: 9.0, h: 0.7, fontSize: 13.5, color: C.muted, lineSpacingMultiple: 1.1 },
  );

  const chips = ["Orders v2", "Agent Toolkit", "Human-in-the-loop", "Deterministic fallback"];
  let cx = M;
  for (const chip of chips) {
    const w = 0.22 + chip.length * 0.095;
    s.addShape(pptx.ShapeType.roundRect, {
      x: cx, y: 4.05, w, h: 0.36, fill: { color: C.panel }, line: { color: C.line, width: 0.7 }, rectRadius: 0.18,
    });
    s.addText(chip, { x: cx, y: 4.09, w, h: 0.28, fontSize: 9, color: C.muted, align: "center" });
    cx += w + 0.14;
  }

  s.addShape(pptx.ShapeType.line, { x: M, y: 5.25, w: CW, h: 0, line: { color: C.line, width: 0.8 } });
  const steps = [
    ["01", "INTENT", "one sentence + a cap"],
    ["02", "REASON", "model picks from catalog"],
    ["03", "GUARD", "cap + allowlist in code"],
    ["04", "ORDER", "PayPal creates it; stop"],
    ["05", "APPROVE", "buyer authenticates"],
    ["06", "CAPTURE", "server settles + receipts"],
  ];
  const sw = CW / 6;
  steps.forEach(([n, t, d], i) => {
    const x = M + i * sw;
    s.addText(n, { x, y: 5.45, w: 0.5, h: 0.25, fontSize: 9, bold: true, color: i === 4 ? C.gold : C.blue, fontFace: "Consolas" });
    s.addText(t, { x: x + 0.36, y: 5.43, w: sw - 0.4, h: 0.24, fontSize: 8.5, bold: true, color: C.text, charSpacing: 1 });
    s.addText(d, { x, y: 5.72, w: sw - 0.18, h: 0.4, fontSize: 7.5, color: C.dim, lineSpacingMultiple: 0.95 });
    if (i < 5) {
      s.addShape(pptx.ShapeType.line, { x: x + sw - 0.18, y: 5.56, w: 0.12, h: 0, line: { color: C.line, width: 1, endArrowType: "triangle" } });
    }
  });

  s.addText("Autonomy with a seatbelt.", {
    x: M, y: 6.45, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.gold,
  });
  s.addText("Hackathon build · November 2026", {
    x: W - M - 4, y: 6.47, w: 4, h: 0.26, fontSize: 9, color: C.dim, align: "right",
  });
  notes(s, "Open with the tension: agents can reason about money, but nobody wants to hand an LLM their card. AgentCart gives the agent real purchasing power with a hard boundary and a human approval. The demo is a real sandbox payment, not a mock. Keep this slide up for 10 seconds, then move to the problem.");
}

/* ---------------------------------------------------------------- 02 problem */
{
  const s = pptx.addSlide();
  base(s, "The problem", 2);
  heading(s, "The problem", "Agents can reason about money.\nThey shouldn't be trusted with it.", "A language model is an excellent planner and a terrible fiduciary. It has no stable budget, no native concept of consent, and no immune system against \"ignore your instructions\".", 1.9);

  const cards = [
    ["01", "The overspend", "The prompt says $15. The model finds $49 earbuds that fit the intent better. Nothing in the architecture stops it, because the limit lived in prose.", C.red],
    ["02", "The wrong merchant", "The agent buys from a lookalike store. There is no allowlist, so money goes to an entity the user never chose.", C.gold],
    ["03", "The injected instruction", "A product description hides \"refund to account X\". If the model holds payout tools, the injection becomes a transaction.", C.red],
  ];
  const cw = 3.86;
  cards.forEach(([n, t, d, accent], i) => {
    const x = M + i * (cw + 0.24);
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.55, w: cw, h: 1.95, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: 2.55, w: 0.07, h: 1.95, fill: { color: accent }, line: { color: accent },
    });
    s.addText(n, { x: x + 0.22, y: 2.7, w: 0.5, h: 0.25, fontSize: 9, bold: true, color: accent, fontFace: "Consolas" });
    s.addText(t, { x: x + 0.22, y: 2.96, w: cw - 0.4, h: 0.32, fontSize: 14, bold: true, color: C.text });
    s.addText(d, { x: x + 0.22, y: 3.34, w: cw - 0.42, h: 1.0, fontSize: 9.5, color: C.muted, lineSpacingMultiple: 1.05 });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 4.72, w: CW, h: 0.82, fill: { color: "2A160F" }, line: { color: "6A2E22", width: 0.8 }, rectRadius: 0.08,
  });
  s.addText("The missing primitive", { x: M + 0.22, y: 4.84, w: 2.1, h: 0.24, fontSize: 9, bold: true, color: C.gold, charSpacing: 1.2 });
  s.addText("Payments has card limits, merchant categories, 3-D Secure, mandates. Agentic commerce needs the same idea for software: bounded authority that can be proven afterwards.", {
    x: M + 0.22, y: 5.08, w: CW - 0.44, h: 0.36, fontSize: 10.5, color: "E9D8B8",
  });

  s.addText("“Authority is not a prompt.”", {
    x: M, y: 5.95, w: 6, h: 0.55, fontSize: 22, bold: true, color: C.text, charSpacing: -0.4,
  });
  s.addText("A limit that exists only as text is a suggestion. A limit that exists as arithmetic on a tool argument is an enforcement mechanism.", {
    x: M, y: 6.45, w: 9.8, h: 0.4, fontSize: 10.5, color: C.muted,
  });
  notes(s, "Name the three failure modes quickly. The point is not that models are malicious; it is that they are unpredictable under pressure. The missing primitive is bounded authority: the same thing payments solved with card limits and mandates, expressed for agents.");
}

/* ---------------------------------------------------------------- 03 status quo */
{
  const s = pptx.addSlide();
  base(s, "The status quo", 3);
  heading(s, "Why existing agents break", "Most “AI + PayPal” demos fail the second question", "A chat box, a function call, and a checkout button demos well for ninety seconds. Then a judge asks what happens if the model overspends — and the answer is a prompt.");

  const rows = [
    [
      { text: "Pattern", options: { bold: true, color: C.muted, fill: { color: C.panel2 }, fontSize: 9 } },
      { text: "What it does", options: { bold: true, color: C.muted, fill: { color: C.panel2 }, fontSize: 9 } },
      { text: "Where it breaks", options: { bold: true, color: C.muted, fill: { color: C.panel2 }, fontSize: 9 } },
    ],
    [
      { text: "Chat wrapper", options: { bold: true, color: C.text } },
      { text: "Model writes an order summary; a human clicks a normal button.", options: { color: C.muted } },
      { text: "The agent never touches order state. It is a copywriter with a payment link.", options: { color: C.muted } },
    ],
    [
      { text: "Full toolkit", options: { bold: true, color: C.text } },
      { text: "Create, capture, refund, payout — all exposed to the model.", options: { color: C.muted } },
      { text: "One injected sentence or bad plan moves money. No separation of proposal and settlement.", options: { color: C.muted } },
    ],
    [
      { text: "Prompt-only cap", options: { bold: true, color: C.text } },
      { text: "System prompt says “never spend more than $15”.", options: { color: C.muted } },
      { text: "A model can ignore, forget, or reinterpret it. Etiquette is not a control.", options: { color: C.muted } },
    ],
    [
      { text: "Happy-path demo", options: { bold: true, color: C.text } },
      { text: "One live LLM call, no fallback, no retry.", options: { color: C.muted } },
      { text: "A blip ends the demo. The architecture has no second gear.", options: { color: C.muted } },
    ],
    [
      { text: "Fake approval", options: { bold: true, color: C.text } },
      { text: "A custom modal says “Approve payment”.", options: { color: C.muted } },
      { text: "No authentication, no PayPal consent record, no auditable proof.", options: { color: C.muted } },
    ],
  ];

  s.addTable(rows, {
    x: M, y: 2.15, w: 8.25,
    colW: [1.45, 2.75, 4.05],
    border: { type: "solid", pt: 0.5, color: C.line },
    fill: C.panel, color: C.text, fontFace: "Arial", fontSize: 10,
    valign: "middle", margin: 0.09, rowH: 0.66,
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 9.15, y: 2.15, w: 3.55, h: 2.55, fill: { color: "2A160F" }, line: { color: "6A2E22", width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("THE COMMON MISTAKE", { x: 9.35, y: 2.32, w: 3.1, h: 0.24, fontSize: 8.5, bold: true, color: C.gold, charSpacing: 1.4 });
  s.addText("Treating the model's context as a security boundary.", {
    x: 9.35, y: 2.6, w: 3.1, h: 0.7, fontSize: 14, bold: true, color: C.text, lineSpacingMultiple: 0.98,
  });
  s.addText("The context is exactly what an attacker can influence: the prompt, a product page, a retrieved document, a tool result. If the constraint lives there, it is attack surface — not control.", {
    x: 9.35, y: 3.38, w: 3.1, h: 1.15, fontSize: 9.5, color: "E9D8B8", lineSpacingMultiple: 1.05,
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 9.15, y: 4.9, w: 3.55, h: 1.65, fill: { color: "0C2B21" }, line: { color: "1E6B4E", width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("WHAT GOOD LOOKS LIKE", { x: 9.35, y: 5.06, w: 3.1, h: 0.24, fontSize: 8.5, bold: true, color: C.green, charSpacing: 1.4 });
  s.addText("The model proposes any item. The guard compares name, price, and total to a server-side table. If it fails, no order exists.", {
    x: 9.35, y: 5.34, w: 3.1, h: 1.0, fontSize: 10, color: "B8E9D2", lineSpacingMultiple: 1.05,
  });
  notes(s, "This is the competitive landscape slide. Do not insult other teams; describe the pattern. The key line: a prompt is not a security boundary. That sets up the insight on the next slide.");
}

/* ---------------------------------------------------------------- 04 insight */
{
  const s = pptx.addSlide();
  base(s, "The insight", 4);
  heading(s, "The design move", "Separate autonomy from authority", "The model should do the cognitive work — interpreting intent, choosing an item. It should not hold the irreversible capability. Three actors, three jobs.");

  const cols = [
    ["01", "PROPOSE", "The agent", "Reads the errand, picks one catalog item, creates a PayPal order. It may be wrong.", C.blue],
    ["02", "AUTHORISE", "The guard", "Checks the cap, the merchant, and the price. Refuses before PayPal is called. Deterministic.", C.green],
    ["03", "SETTLE", "The human + server", "The buyer authenticates in PayPal. A server-only route captures. The model has no capture tool.", C.gold],
  ];
  const cw = 3.86;
  cols.forEach(([n, t, who, d, accent], i) => {
    const x = M + i * (cw + 0.24);
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.2, w: cw, h: 2.55, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
    });
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.22, y: 2.38, w: 0.46, h: 0.46, fill: { color: accent }, line: { color: accent },
    });
    s.addText(n, { x: x + 0.22, y: 2.45, w: 0.46, h: 0.26, fontSize: 9, bold: true, color: "06111F", align: "center", fontFace: "Consolas" });
    s.addText(t, { x: x + 0.8, y: 2.42, w: cw - 0.95, h: 0.28, fontSize: 9, bold: true, color: accent, charSpacing: 1.6 });
    s.addText(who, { x: x + 0.22, y: 2.92, w: cw - 0.44, h: 0.32, fontSize: 15, bold: true, color: C.text });
    s.addText(d, { x: x + 0.22, y: 3.3, w: cw - 0.44, h: 1.25, fontSize: 10.2, color: C.muted, lineSpacingMultiple: 1.06 });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 5.05, w: CW, h: 1.05, fill: { color: C.navy }, line: { color: C.line, width: 0.8 }, rectRadius: 0.08,
  });
  s.addText("“The agent proposes, the guard disposes, the human authorises, and PayPal settles.”", {
    x: M + 0.25, y: 5.2, w: CW - 0.5, h: 0.34, fontSize: 17, bold: true, color: C.text, charSpacing: -0.2,
  });
  s.addText("No single actor can complete a transaction alone. That is the whole architecture in one sentence.", {
    x: M + 0.25, y: 5.6, w: CW - 0.5, h: 0.28, fontSize: 10.5, color: C.muted,
  });

  const stats = [
    ["1", "tool exposed to the model"],
    ["4", "independent trust layers"],
    ["2", "checkout paths, one contract"],
    ["0", "captures before approval"],
  ];
  const sw = CW / 4;
  stats.forEach(([n, l], i) => {
    const x = M + i * sw;
    s.addText(n, { x, y: 6.25, w: 0.5, h: 0.4, fontSize: 20, bold: true, color: i === 3 ? C.green : C.blue });
    s.addText(l, { x: x + 0.45, y: 6.31, w: sw - 0.5, h: 0.3, fontSize: 9, color: C.muted, lineSpacingMultiple: 0.9 });
  });

  notes(s, "This is the thesis slide. Pause on the quote. Then explain the three roles with a finance analogy: analyst prepares, controller approves, bank executes. The model is the analyst. It is allowed to be enthusiastic; it is not the controller.");
}

/* ---------------------------------------------------------------- 05 solution flow */
{
  const s = pptx.addSlide();
  base(s, "The solution", 5);
  heading(s, "How it works", "One errand, six steps, two consent points", "The agent only participates in steps 2–3. Everything before is intent; everything after is settlement.");

  const steps = [
    ["01", "Intent", "Human writes the errand and a numeric cap.", C.text],
    ["02", "Reason", "Model picks one item from the allowlisted catalog.", C.blue],
    ["03", "Guard", "Code checks name, price, and total before PayPal.", C.green],
    ["04", "Order", "PayPal returns an order ID and an approve link.", C.cyan],
    ["05", "Approve", "Buyer signs in to PayPal sandbox and consents.", C.gold],
    ["06", "Capture", "Server captures and renders the receipt.", C.green],
  ];
  const bw = 1.84;
  const gap = 0.14;
  steps.forEach(([n, t, d, accent], i) => {
    const x = M + i * (bw + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.25, w: bw, h: 1.7, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.09,
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: 2.25, w: bw, h: 0.06, fill: { color: accent }, line: { color: accent },
    });
    s.addText(n, { x: x + 0.14, y: 2.42, w: 0.4, h: 0.24, fontSize: 9, bold: true, color: accent, fontFace: "Consolas" });
    s.addText(t, { x: x + 0.14, y: 2.68, w: bw - 0.28, h: 0.3, fontSize: 13.5, bold: true, color: C.text });
    s.addText(d, { x: x + 0.14, y: 3.04, w: bw - 0.28, h: 0.78, fontSize: 8.6, color: C.muted, lineSpacingMultiple: 1.02 });
    if (i < 5) {
      arrow(s, x + bw + 0.01, 3.1, gap - 0.02, C.dim);
    }
  });

  // consent bracket
  s.addShape(pptx.ShapeType.line, { x: M + 4 * (bw + gap) + 0.1, y: 4.28, w: bw * 2 + gap - 0.2, h: 0, line: { color: C.gold, width: 1.2 } });
  s.addText("HUMAN CONSENT + SERVER SETTLEMENT", {
    x: M + 4 * (bw + gap) + 0.1, y: 4.35, w: bw * 2 + gap - 0.2, h: 0.24,
    fontSize: 8, bold: true, color: C.gold, align: "center", charSpacing: 1.2,
  });
  s.addShape(pptx.ShapeType.line, { x: M + 0.1, y: 4.28, w: bw * 3 + gap * 2 - 0.2, h: 0, line: { color: C.blue, width: 1.2 } });
  s.addText("AGENT AUTONOMY ENDS AT ORDER CREATION", {
    x: M + 0.1, y: 4.35, w: bw * 3 + gap * 2 - 0.2, h: 0.24,
    fontSize: 8, bold: true, color: C.blue, align: "center", charSpacing: 1.2,
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 4.95, w: CW, h: 1.25, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.08,
  });
  s.addText("What the buyer sees", { x: M + 0.22, y: 5.1, w: 2.2, h: 0.26, fontSize: 9, bold: true, color: C.muted, charSpacing: 1 });
  s.addText("A single sentence, a spend cap, an item, one approval button. No wallet setup in our UI, no card form, no password ever touches the app. The buyer authenticates on PayPal's domain and returns to a receipt.", {
    x: M + 0.22, y: 5.38, w: CW - 0.44, h: 0.7, fontSize: 11, color: C.muted, lineSpacingMultiple: 1.08,
  });

  s.addText("Demo insurance: every step after the model also exists without it.", {
    x: M, y: 6.42, w: CW, h: 0.3, fontSize: 11, bold: true, color: C.gold,
  });
  notes(s, "Walk left to right. Emphasise the two brackets: the agent's autonomy ends at order creation; human consent and server settlement are a separate phase. The buyer never types a card into our app. That is both a UX and a security argument.");
}

/* ---------------------------------------------------------------- 06 architecture */
{
  const s = pptx.addSlide();
  base(s, "Architecture", 6);
  heading(s, "Under the hood", "Two paths, one payment contract", "The agentic path and the deterministic path converge on the same guard and the same Orders v2 calls.");

  const laneLabel = (y, text) => {
    s.addText(text.toUpperCase(), { x: M, y: y + 0.02, w: 1.35, h: 0.5, fontSize: 8, bold: true, color: C.dim, charSpacing: 1.2 });
  };
  laneLabel(2.2, "Client");
  laneLabel(3.15, "Decision");
  laneLabel(4.1, "PayPal");
  laneLabel(5.05, "Result");

  const bx = M + 1.45;
  const bws = 2.62;
  const gap2 = 0.18;

  box(s, { x: bx, y: 2.1, w: bws, h: 0.7, text: "Browser UI", sub: "React client · no secrets", fill: C.panel });
  arrow(s, bx + bws + 0.02, 2.45, gap2 - 0.04);
  box(s, { x: bx + bws + gap2, y: 2.1, w: bws, h: 0.7, text: "POST /api/checkout", sub: "Next.js route handler", fill: C.navy, size: 11 });

  box(s, { x: bx, y: 3.05, w: bws, h: 0.7, text: "Agent path", sub: "AI SDK + Agent Toolkit", fill: "10243F", line: "2B5A9E" });
  arrow(s, bx + bws + 0.02, 3.4, gap2 - 0.04);
  box(s, { x: bx + bws + gap2, y: 3.05, w: bws, h: 0.7, text: "Guard wrapper", sub: "cap + allowlist", fill: "0C2B21", line: "1E6B4E" });
  arrow(s, bx + 2 * (bws + gap2) + 0.02, 3.4, gap2 - 0.04);
  box(s, { x: bx + 2 * (bws + gap2), y: 3.05, w: bws, h: 0.7, text: "create_order", sub: "Orders v2", fill: "082A38", line: "0E6E8C" });

  s.addText("safe path →", { x: bx, y: 3.82, w: 1.7, h: 0.2, fontSize: 7.5, color: C.dim });
  box(s, { x: bx + 0.72, y: 3.85, w: bws - 0.4, h: 0.42, text: "Deterministic picker", sub: "same PayPal calls", fill: C.panel, size: 8.5, subSize: 7 });
  arrow(s, bx + bws + gap2 + 0.24, 3.98, gap2 - 0.28);

  box(s, { x: bx, y: 4.45, w: bws, h: 0.62, text: "Order CREATED", sub: "id + approve link", fill: "082A38", line: "0E6E8C" });
  arrow(s, bx + bws + 0.02, 4.76, gap2 - 0.04, C.cyan);
  box(s, { x: bx + bws + gap2, y: 4.45, w: bws, h: 0.62, text: "Buyer approval", sub: "paypal.com · sandbox login", fill: "2A2410", line: "8A6B14" });
  arrow(s, bx + 2 * (bws + gap2) + 0.02, 4.76, gap2 - 0.04, C.cyan);
  box(s, { x: bx + 2 * (bws + gap2), y: 4.45, w: bws, h: 0.62, text: "Capture", sub: "server-only · COMPLETED", fill: "0C2B21", line: "1E6B4E" });

  box(s, { x: bx, y: 5.4, w: bws, h: 0.62, text: "Receipt page", sub: "server-rendered proof", fill: C.panel });
  arrow(s, bx + bws + 0.02, 5.71, gap2 - 0.04);
  box(s, { x: bx + bws + gap2, y: 5.4, w: bws, h: 0.62, text: "Order + capture IDs", sub: "payer · amount · status", fill: "082A38", line: "0E6E8C" });
  arrow(s, bx + 2 * (bws + gap2) + 0.02, 5.71, gap2 - 0.04);
  box(s, { x: bx + 2 * (bws + gap2), y: 5.4, w: bws, h: 0.62, text: "Audit trail", sub: "timestamped steps", fill: "0C2B21", line: "1E6B4E" });

  s.addText("One contract: CheckoutResult { mode, orderId, approveUrl, item, rationale, steps }", {
    x: M, y: 6.35, w: CW, h: 0.28, fontSize: 9.5, color: C.muted, fontFace: "Consolas",
  });
  s.addText("No database. PayPal owns order and capture state; the order ID is the join key.", {
    x: M, y: 6.63, w: CW, h: 0.28, fontSize: 9.5, color: C.dim,
  });
  notes(s, "Do not read every box. Say: there are two decision paths, one guard, one set of PayPal primitives, and one result shape. The deterministic path is not a stub; it is the reliability story. The app stores no durable state; PayPal is the source of truth.");
}

/* ---------------------------------------------------------------- 07 trust stack */
{
  const s = pptx.addSlide();
  base(s, "Trust model", 7);
  heading(s, "Defence in depth", "Four layers between a sentence and your money", "No single control is trusted to be perfect. Each layer catches a different failure, and each is independently testable.");

  const layers = [
    ["1", "Spend cap", "total = unit × qty × (1 + tax) ≤ cap. Checked before PayPal.", C.blue],
    ["2", "Merchant + price allowlist", "Exact catalog name and exact published price. No drift.", C.green],
    ["3", "Human approval gate", "No capture tool for the model; PayPal authentication required.", C.gold],
    ["4", "Audit trail", "Timestamped decisions; receipt re-reads PayPal's state.", C.cyan],
  ];
  layers.forEach(([n, t, d, accent], i) => {
    const y = 2.15 + i * 0.94;
    s.addShape(pptx.ShapeType.roundRect, {
      x: M, y, w: 7.55, h: 0.8, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.07,
    });
    s.addShape(pptx.ShapeType.ellipse, { x: M + 0.18, y: y + 0.2, w: 0.4, h: 0.4, fill: { color: accent }, line: { color: accent } });
    s.addText(n, { x: M + 0.18, y: y + 0.26, w: 0.4, h: 0.2, fontSize: 9, bold: true, color: "06111F", align: "center", fontFace: "Consolas" });
    s.addText(t, { x: M + 0.72, y: y + 0.12, w: 3.0, h: 0.26, fontSize: 11.5, bold: true, color: C.text });
    s.addText(d, { x: M + 0.72, y: y + 0.38, w: 6.6, h: 0.3, fontSize: 8.8, color: C.muted });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 8.45, y: 2.15, w: 4.25, h: 3.72, fill: { color: C.navy }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("THREAT → LAYER", { x: 8.65, y: 2.3, w: 3.8, h: 0.24, fontSize: 9, bold: true, color: C.blue, charSpacing: 1.4 });
  const threats = [
    ["$49 item, $15 cap", "Layer 1"],
    ["Fake merchant / price", "Layer 2"],
    ["“Capture now” injection", "Layer 3"],
    ["Redirect tampering", "Guard"],
    ["Disputed payment", "Layer 4"],
  ];
  threats.forEach(([t, l], i) => {
    const y = 2.65 + i * 0.52;
    s.addText(t, { x: 8.65, y, w: 2.55, h: 0.24, fontSize: 9.2, color: C.muted });
    s.addText(l, { x: 11.2, y, w: 1.3, h: 0.24, fontSize: 9.2, bold: true, color: C.text, align: "right" });
    if (i < threats.length - 1) {
      s.addShape(pptx.ShapeType.line, { x: 8.65, y: y + 0.38, w: 3.85, h: 0, line: { color: C.line, width: 0.4 } });
    }
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 6.0, w: CW, h: 0.78, fill: { color: "0C2B21" }, line: { color: "1E6B4E", width: 0.8 }, rectRadius: 0.08,
  });
  s.addText("The model is an untrusted planner. The browser is an untrusted display. PayPal is the only trusted source of payment truth.", {
    x: M + 0.22, y: 6.14, w: CW - 0.44, h: 0.5, fontSize: 11, color: "B8E9D2",
  });
  notes(s, "Layer 2 is the one people forget: a cap alone can be bypassed with a fake cheap price. Price equality is what makes the cap meaningful. Layer 3 is the strongest because it is an absence: there is no capture tool to call. Layer 4 is how you prove it afterwards.");
}

/* ---------------------------------------------------------------- 08 toolkit */
{
  const s = pptx.addSlide();
  base(s, "Implementation", 8);
  heading(s, "PayPal Agent Toolkit", "One tool, wrapped in a guard", "The toolkit exposes create_order as an LLM tool. We replace its execute function with a validating wrapper.");

  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 2.15, w: 7.55, h: 3.55, fill: { color: "050B16" }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
  });
  const code = [
    ["const", " toolkit = new PayPalAgentToolkit({"], 
    ["  ", "clientId, clientSecret,"],
    ["  ", "configuration: {"],
    ["    ", "actions: { orders: { create: true } },   // no capture"],
    ["    ", "context: { sandbox: true },"],
    ["  ", "},"],
    ["});"],
    ["", ""],
    ["const", " create = toolkit.getTools().create_order;"],
    ["create", ".execute = async (args, options) => {"],
    ["  ", "assertAllowlisted(args.items);       // name + price"],
    ["  ", "assertWithinCap(args.items, budget); // arithmetic"],
    ["  ", "return original({ ...args,"],
    ["    ", "currencyCode: 'USD',"],
    ["    ", "returnUrl: APP_URL + '/api/paypal/return',"],
    ["    ", "cancelUrl: APP_URL + '/api/paypal/cancel',"],
    ["  ", "}, options);"],
    ["};"],
  ];
  s.addText(
    code.map(([kw, rest]) => ({
      text: kw + (rest || ""),
      options: { color: kw.trim() ? C.gold : "C9D7EE", fontFace: "Consolas", fontSize: 10.2, breakLine: true },
    })),
    { x: M + 0.24, y: 2.32, w: 7.1, h: 3.2, valign: "top", lineSpacingMultiple: 1.02 },
  );

  const right = [
    ["Cap", "The wrapper computes the total from unit cost, quantity, and tax. Above the cap → throw before the network call.", C.blue],
    ["Allowlist", "Every item name must equal a catalog entry and every price must equal the published price.", C.green],
    ["Redirects", "The model never controls return_url or cancel_url. The guard overwrites both.", C.gold],
    ["Version pin", "ai@4 matches the toolkit's maxSteps / toolResults API. v5 needs stopWhen and .output.", C.cyan],
  ];
  right.forEach(([t, d, accent], i) => {
    const y = 2.15 + i * 0.92;
    s.addShape(pptx.ShapeType.roundRect, {
      x: 8.45, y, w: 4.25, h: 0.8, fill: { color: C.panel }, line: { color: C.line, width: 0.7 }, rectRadius: 0.07,
    });
    s.addShape(pptx.ShapeType.rect, { x: 8.45, y, w: 0.06, h: 0.8, fill: { color: accent }, line: { color: accent } });
    s.addText(t, { x: 8.62, y: y + 0.08, w: 3.9, h: 0.22, fontSize: 9.5, bold: true, color: accent });
    s.addText(d, { x: 8.62, y: y + 0.3, w: 3.95, h: 0.46, fontSize: 8, color: C.muted, lineSpacingMultiple: 0.98 });
  });

  s.addText("The agent is deliberately under-powered: no memory, no browsing, no capture, four steps maximum.", {
    x: M, y: 5.95, w: CW, h: 0.3, fontSize: 11, color: C.muted,
  });
  s.addText("A weaker agent is a stronger product here.", {
    x: M, y: 6.3, w: CW, h: 0.4, fontSize: 17, bold: true, color: C.text,
  });
  notes(s, "Show the wrapper, not the whole file. The key lines are the allowlist assertion, the cap assertion, and the URL overwrite. If someone asks about prompt injection: the model can write whatever it wants, but it cannot call a capture tool, and its redirect URLs are ignored.");
}

/* ---------------------------------------------------------------- 09 fallback */
{
  const s = pptx.addSlide();
  base(s, "Reliability", 9);
  heading(s, "The second gear", "If the model fails, the payment still works", "Every LLM call is optional. When the model is missing, slow, or blocked, a deterministic picker calls the same PayPal APIs and returns the same result shape.");

  const chain = [
    ["KEY?", "is OPENAI_API_KEY set?", C.blue],
    ["AGENT", "model calls create_order", C.blue],
    ["GUARD", "name · price · cap", C.green],
    ["ORDER", "PayPal create", C.cyan],
    ["STOP", "human approves", C.gold],
  ];
  const cw = 2.25;
  chain.forEach(([t, d, accent], i) => {
    const x = M + i * (cw + 0.2);
    box(s, { x, y: 2.2, w: cw, h: 1.05, text: t, sub: d, fill: C.panel, line: C.line, size: 10, subSize: 8 });
    s.addShape(pptx.ShapeType.rect, { x, y: 2.2, w: cw, h: 0.05, fill: { color: accent }, line: { color: accent } });
    if (i < chain.length - 1) arrow(s, x + cw + 0.01, 2.72, 0.17, C.dim);
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 3.55, w: 6.05, h: 2.55, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("ANY NO → SAFE CHECKOUT", { x: M + 0.22, y: 3.7, w: 5.6, h: 0.24, fontSize: 9, bold: true, color: C.gold, charSpacing: 1.4 });
  const fails = [
    ["No key", "deterministic picker runs"],
    ["Model error / timeout", "caught, fallback runs"],
    ["Guard rejects item", "pick a legal item instead"],
    ["Model returns no order", "fallback creates one"],
  ];
  fails.forEach(([a, b], i) => {
    const y = 4.05 + i * 0.44;
    s.addText("✕", { x: M + 0.24, y, w: 0.2, h: 0.22, fontSize: 9, color: C.red, bold: true });
    s.addText(a, { x: M + 0.5, y, w: 1.85, h: 0.22, fontSize: 9, bold: true, color: C.text });
    s.addText("→ " + b, { x: M + 2.35, y, w: 3.4, h: 0.22, fontSize: 9, color: C.muted });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.95, y: 3.55, w: 5.75, h: 2.55, fill: { color: C.navy }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("ONE CONTRACT, TWO ENGINES", { x: 7.15, y: 3.7, w: 5.3, h: 0.24, fontSize: 9, bold: true, color: C.blue, charSpacing: 1.4 });
  const cmp = [
    ["mode", "agent | safe"],
    ["item", "model choice | keyword pick"],
    ["rationale", "model sentence | template"],
    ["orderId / approveUrl", "identical PayPal response"],
    ["UI", "identical except the badge"],
  ];
  cmp.forEach(([a, b], i) => {
    const y = 4.06 + i * 0.38;
    s.addText(a, { x: 7.15, y, w: 2.1, h: 0.2, fontSize: 8.6, color: C.muted, fontFace: "Consolas" });
    s.addText(b, { x: 9.3, y, w: 3.2, h: 0.2, fontSize: 8.6, color: C.text });
  });

  s.addText("This is not an apology for using an LLM. It proves the PayPal integration stands on its own.", {
    x: M, y: 6.35, w: CW, h: 0.35, fontSize: 12, bold: true, color: C.gold,
  });
  notes(s, "This is the slide that saves the demo. Say it plainly: pull the API key and the flow still completes. The model is an optional reasoning layer, not a dependency. Judges remember teams that can survive their own demo.");
}

/* ---------------------------------------------------------------- 10 proof */
{
  const s = pptx.addSlide();
  base(s, "Proof", 10);
  heading(s, "It is real", "The receipt is the product", "A success toast proves a 200. A capture ID proves money moved. The receipt is server-rendered from PayPal's order state.");

  // receipt card
  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 2.0, w: 5.0, h: 3.9, fill: { color: C.white }, line: { color: "D8E1EF", width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("AgentCart · Payment captured", { x: M + 0.28, y: 2.2, w: 3.4, h: 0.3, fontSize: 10, bold: true, color: "0B1B33" });
  s.addShape(pptx.ShapeType.roundRect, { x: M + 3.55, y: 2.2, w: 1.15, h: 0.3, fill: { color: "DFF6EA" }, line: { color: "B9E6D1", width: 0.6 }, rectRadius: 0.15 });
  s.addText("COMPLETED", { x: M + 3.57, y: 2.24, w: 1.11, h: 0.22, fontSize: 7.5, bold: true, color: "0A7A55", align: "center" });
  s.addText("USB-C Cable 2m", { x: M + 0.28, y: 2.62, w: 4.2, h: 0.24, fontSize: 9, color: "6B7A94" });
  s.addText("$12.99 USD", { x: M + 0.28, y: 2.86, w: 4.2, h: 0.55, fontSize: 30, bold: true, color: "0B1B33", charSpacing: -1 });

  const rrows = [
    ["Order ID", "4A572180UY881681N"],
    ["Capture ID", "3C679411S8345214V"],
    ["Payer", "sandbox.buyer@example.com"],
    ["Status", "COMPLETED"],
    ["Environment", "SANDBOX"],
  ];
  rrows.forEach(([k, v], i) => {
    const y = 3.55 + i * 0.4;
    s.addText(k, { x: M + 0.28, y, w: 1.4, h: 0.22, fontSize: 7.5, color: "6B7A94" });
    s.addText(v, { x: M + 1.65, y, w: 3.05, h: 0.22, fontSize: 7.5, color: "1E3A5F", fontFace: "Consolas", align: "right" });
    s.addShape(pptx.ShapeType.line, { x: M + 0.28, y: y + 0.31, w: 4.45, h: 0, line: { color: "EEF2F8", width: 0.5 } });
  });

  const proofs = [
    ["Order ID", "the agent created a real PayPal order"],
    ["Capture ID", "a human approved and the server settled"],
    ["Payer", "the consent came from an authenticated buyer"],
    ["Status", "the state is PayPal's, not ours"],
    ["Timestamp", "the event is ordered and auditable"],
  ];
  proofs.forEach(([t, d], i) => {
    const y = 2.05 + i * 0.58;
    s.addText("✓", { x: 6.0, y, w: 0.26, h: 0.24, fontSize: 11, bold: true, color: C.green });
    s.addText(t, { x: 6.3, y, w: 1.7, h: 0.24, fontSize: 9.5, bold: true, color: C.text });
    s.addText(d, { x: 8.0, y, w: 4.6, h: 0.24, fontSize: 9.2, color: C.muted });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.0, y: 5.05, w: 6.7, h: 0.95, fill: { color: "0C2B21" }, line: { color: "1E6B4E", width: 0.8 }, rectRadius: 0.08,
  });
  s.addText("Judge test: open the PayPal sandbox dashboard, find the transaction, compare both IDs. If they match, the integration is real.", {
    x: 6.22, y: 5.18, w: 6.3, h: 0.68, fontSize: 10.5, color: "B8E9D2", lineSpacingMultiple: 1.05,
  });

  s.addText("Keep a completed receipt open in a second tab during the demo.", {
    x: 6.0, y: 6.2, w: 6.7, h: 0.3, fontSize: 10, color: C.gold, bold: true,
  });
  notes(s, "Slow down here. Point at the order ID and capture ID. Explain that the page re-fetches from PayPal on every load, so refreshing cannot fake success. If the live flow fails, this tab still proves the integration.");
}

/* ---------------------------------------------------------------- 11 different */
{
  const s = pptx.addSlide();
  base(s, "Differentiation", 11);
  heading(s, "Why this is different", "Everyone shows an agent paying. We show the boundary.", "The comparison is not “AI vs no AI”. It is “prompt as control” vs “code as control” — and what the user can verify afterwards.");

  const rows = [
    [
      { text: "", options: { fill: { color: C.panel2 } } },
      { text: "Typical AI + PayPal agent", options: { bold: true, color: C.muted, fill: { color: C.panel2 }, fontSize: 10 } },
      { text: "AgentCart", options: { bold: true, color: C.green, fill: { color: "0C2B21" }, fontSize: 10 } },
    ],
    [
      { text: "Safety boundary", options: { bold: true, color: C.text } },
      { text: "System prompt", options: { color: C.muted } },
      { text: "Code guard + missing tool", options: { color: C.text, bold: true } },
    ],
    [
      { text: "Model capability", options: { bold: true, color: C.text } },
      { text: "Create, capture, refund, payout", options: { color: C.muted } },
      { text: "Create order only", options: { color: C.text, bold: true } },
    ],
    [
      { text: "Spend control", options: { bold: true, color: C.text } },
      { text: "“Don't exceed $15”", options: { color: C.muted } },
      { text: "Arithmetic on tool arguments", options: { color: C.text, bold: true } },
    ],
    [
      { text: "Approval", options: { bold: true, color: C.text } },
      { text: "Custom modal checkbox", options: { color: C.muted } },
      { text: "Real PayPal authentication", options: { color: C.text, bold: true } },
    ],
    [
      { text: "Failure mode", options: { bold: true, color: C.text } },
      { text: "Demo dies with the model", options: { color: C.muted } },
      { text: "Deterministic fallback", options: { color: C.text, bold: true } },
    ],
    [
      { text: "Proof", options: { bold: true, color: C.text } },
      { text: "Success toast", options: { color: C.muted } },
      { text: "Capture ID + receipt", options: { color: C.text, bold: true } },
    ],
  ];

  s.addTable(rows, {
    x: M, y: 2.05, w: 8.6,
    colW: [2.0, 3.2, 3.4],
    border: { type: "solid", pt: 0.5, color: C.line },
    fill: C.panel, color: C.text, fontFace: "Arial", fontSize: 10.5,
    valign: "middle", margin: 0.1, rowH: 0.56,
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 9.45, y: 2.05, w: 3.25, h: 3.9, fill: { color: C.navy }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("THE ONE-LINE PITCH", { x: 9.65, y: 2.2, w: 2.85, h: 0.24, fontSize: 8.5, bold: true, color: C.blue, charSpacing: 1.4 });
  s.addText("“The agent shops. You approve the payment.”", {
    x: 9.65, y: 2.5, w: 2.85, h: 1.2, fontSize: 17, bold: true, color: C.text, lineSpacingMultiple: 0.98, charSpacing: -0.3,
  });
  s.addText("It is not a chatbot with a checkout button. It is a bounded delegation with a visible, testable handoff.", {
    x: 9.65, y: 3.72, w: 2.85, h: 0.95, fontSize: 9.5, color: C.muted, lineSpacingMultiple: 1.05,
  });
  s.addText("Built on PayPal's own primitives: Orders v2 + Agent Toolkit.", {
    x: 9.65, y: 4.82, w: 2.85, h: 0.85, fontSize: 9, color: C.gold, lineSpacingMultiple: 1.05,
  });

  s.addText("Other agents demo capability. This one demos restraint.", {
    x: M, y: 6.35, w: CW, h: 0.35, fontSize: 13, bold: true, color: C.text,
  });
  notes(s, "Do not say competitors are bad. Say the pattern is incomplete. Then point at the four rows that matter: model capability, spend control, approval, failure mode. The last one — fallback — is the one judges rarely see and always remember.");
}

/* ---------------------------------------------------------------- 12 verify */
{
  const s = pptx.addSlide();
  base(s, "Judging", 12);
  heading(s, "Two minutes", "What you can verify on stage", "No claims without evidence. Four checks, one live flow, and a fallback you can trigger on purpose.");

  const checks = [
    ["01", "Real order", "The audit trail shows a PayPal order ID created by the agent.", C.blue],
    ["02", "Real constraint", "Prompt an over-cap item; the guard blocks it and the fallback stays legal.", C.green],
    ["03", "Real consent", "Approve in PayPal sandbox as an authenticated buyer.", C.gold],
    ["04", "Real settlement", "The receipt shows COMPLETED with a capture ID and payer.", C.cyan],
  ];
  checks.forEach(([n, t, d, accent], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * 4.15;
    const y = 2.05 + row * 1.32;
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w: 3.95, h: 1.12, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.08,
    });
    s.addText(n, { x: x + 0.18, y: y + 0.14, w: 0.42, h: 0.24, fontSize: 9, bold: true, color: accent, fontFace: "Consolas" });
    s.addText(t, { x: x + 0.62, y: y + 0.12, w: 3.15, h: 0.26, fontSize: 12.5, bold: true, color: C.text });
    s.addText(d, { x: x + 0.18, y: y + 0.46, w: 3.6, h: 0.55, fontSize: 8.8, color: C.muted, lineSpacingMultiple: 1.02 });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: 8.85, y: 2.05, w: 3.85, h: 3.95, fill: { color: C.navy }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
  });
  s.addText("THE 2-MINUTE SCRIPT", { x: 9.05, y: 2.2, w: 3.45, h: 0.24, fontSize: 9, bold: true, color: C.gold, charSpacing: 1.4 });
  const script = [
    ["0:00", "“Everyone is shipping buying agents. Nobody wants to give an LLM their card.”"],
    ["0:15", "Type the errand. Set the cap to $15."],
    ["0:30", "Point at the audit trail and the mode badge."],
    ["0:45", "Approve in PayPal as the sandbox buyer."],
    ["1:10", "Show the receipt and capture ID."],
    ["1:30", "Open the guard code: cap + allowlist."],
    ["1:45", "Pull the model key; show the safe path."],
    ["2:00", "Close on the boundary, not the chatbot."],
  ];
  script.forEach(([t, d], i) => {
    const y = 2.55 + i * 0.42;
    s.addText(t, { x: 9.05, y, w: 0.62, h: 0.22, fontSize: 8, color: C.blue, fontFace: "Consolas" });
    s.addText(d, { x: 9.7, y, w: 2.82, h: 0.38, fontSize: 8, color: C.muted, lineSpacingMultiple: 0.95 });
  });

  s.addText("If the model fails mid-demo, say so. Then show the fallback. Honesty plus a second gear is more convincing than a perfect run.", {
    x: M, y: 6.15, w: CW, h: 0.45, fontSize: 10.5, color: C.gold, lineSpacingMultiple: 1.05,
  });
  notes(s, "This is the rehearsal slide. Run the exact sequence. Keep the guard file open in a tab. Keep a completed receipt in another tab. Know how to disable the agent (AGENT_DISABLED=1 or remove the key) before you walk on stage.");
}

/* ---------------------------------------------------------------- 13 roadmap */
{
  const s = pptx.addSlide();
  base(s, "Roadmap", 13);
  heading(s, "What comes next", "From one errand to a trust primitive", "The hackathon proves the boundary. The product is turning that boundary into reusable, verifiable authority.");

  const cols = [
    ["NOW", "Sandbox demo", ["One catalog, one cap", "Agent + deterministic paths", "Real order + capture", "Timestamped audit trail"], C.blue],
    ["NEXT", "Production hardening", ["PayPal webhooks + signatures", "Signed merchant feed", "Rate limits + structured logs", "Judge/operator runbook"], C.cyan],
    ["LATER", "Delegated mandates", ["Per-merchant authority", "Category + time bounds", "Multi-errand history", "Dispute + refund flows"], C.gold],
    ["VISION", "Agent commerce rail", ["Portable spend mandates", "Verifiable consent receipts", "Marketplace payouts", "Any agent, any merchant"], C.green],
  ];
  const cw = 2.95;
  cols.forEach(([tag, title, items, accent], i) => {
    const x = M + i * (cw + 0.2);
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.1, w: cw, h: 3.85, fill: { color: C.panel }, line: { color: C.line, width: 0.8 }, rectRadius: 0.1,
    });
    s.addShape(pptx.ShapeType.rect, { x, y: 2.1, w: cw, h: 0.06, fill: { color: accent }, line: { color: accent } });
    s.addText(tag, { x: x + 0.2, y: 2.28, w: cw - 0.4, h: 0.24, fontSize: 8.5, bold: true, color: accent, charSpacing: 1.6 });
    s.addText(title, { x: x + 0.2, y: 2.56, w: cw - 0.4, h: 0.58, fontSize: 14, bold: true, color: C.text, lineSpacingMultiple: 0.95 });
    items.forEach((item, j) => {
      s.addText("· " + item, { x: x + 0.2, y: 3.28 + j * 0.46, w: cw - 0.35, h: 0.4, fontSize: 8.8, color: C.muted, lineSpacingMultiple: 0.95 });
    });
  });

  s.addShape(pptx.ShapeType.roundRect, {
    x: M, y: 6.15, w: CW, h: 0.62, fill: { color: C.navy }, line: { color: C.line, width: 0.7 }, rectRadius: 0.07,
  });
  s.addText("The winning idea is not more agent capability. It is authority that can be bounded, delegated, and proven.", {
    x: M + 0.22, y: 6.27, w: CW - 0.44, h: 0.4, fontSize: 11, color: C.text,
  });
  notes(s, "Keep this short. The point is that the architecture generalises beyond the demo: mandates are the real primitive. Do not oversell; say what is built and what is next.");
}

/* ---------------------------------------------------------------- 14 close */
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.addShape(pptx.ShapeType.ellipse, {
    x: 8.4, y: -2.6, w: 7.2, h: 7.2, fill: { color: C.cyan, transparency: 84 }, line: { color: C.cyan, transparency: 100 },
  });
  s.addShape(pptx.ShapeType.ellipse, {
    x: -2.6, y: 4.0, w: 6.0, h: 5.6, fill: { color: C.blue, transparency: 86 }, line: { color: C.blue, transparency: 100 },
  });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.16, h: H, fill: { color: C.blueDeep }, line: { color: C.blueDeep } });

  s.addText("AGENTCART", { x: M, y: 0.8, w: 5, h: 0.3, fontSize: 10, bold: true, color: C.blue, charSpacing: 2.6 });
  s.addText("Autonomy with\na seatbelt.", {
    x: M, y: 1.55, w: 8.6, h: 1.8, fontSize: 46, bold: true, color: C.white, lineSpacingMultiple: 0.92, charSpacing: -1.4,
  });
  s.addText("The agent proposes. The guard disposes. The human authorises. PayPal settles.", {
    x: M, y: 3.35, w: 8.4, h: 0.5, fontSize: 16, color: "9CC0FF",
  });
  s.addText("A real PayPal sandbox order, a real approval, a real capture — and a boundary you can inspect.", {
    x: M, y: 3.9, w: 8.0, h: 0.45, fontSize: 11.5, color: C.muted,
  });

  const proofs = ["Live sandbox payment", "Capture ID on receipt", "Guard code in repo", "Fallback without the model"];
  let cy = 4.75;
  proofs.forEach((p) => {
    s.addShape(pptx.ShapeType.roundRect, {
      x: M, y: cy, w: 3.4, h: 0.36, fill: { color: C.panel }, line: { color: C.line, width: 0.6 }, rectRadius: 0.18,
    });
    s.addText("✓  " + p, { x: M + 0.14, y: cy + 0.05, w: 3.1, h: 0.26, fontSize: 9, color: C.muted });
    cy += 0.45;
  });

  s.addShape(pptx.ShapeType.line, { x: 9.2, y: 1.6, w: 0, h: 4.6, line: { color: C.line, width: 0.8 } });
  s.addText("TRY IT", { x: 9.6, y: 1.7, w: 3.2, h: 0.26, fontSize: 9, bold: true, color: C.gold, charSpacing: 1.6 });
  s.addText("Deployed URL\n+ sandbox buyer\ncredentials in README", {
    x: 9.6, y: 2.0, w: 3.3, h: 0.9, fontSize: 11.5, color: C.text, lineSpacingMultiple: 1.1,
  });
  s.addText("ASK US", { x: 9.6, y: 3.15, w: 3.2, h: 0.26, fontSize: 9, bold: true, color: C.gold, charSpacing: 1.6 });
  s.addText("“What can the agent do\nif it goes rogue?”\n\nAnswer: create an order\nyou can decline.", {
    x: 9.6, y: 3.45, w: 3.3, h: 1.4, fontSize: 10.5, color: C.muted, lineSpacingMultiple: 1.08,
  });

  s.addShape(pptx.ShapeType.line, { x: M, y: 6.55, w: CW, h: 0, line: { color: C.line, width: 0.6 } });
  s.addText("Built with PayPal Orders v2 + Agent Toolkit · sandbox only", { x: M, y: 6.7, w: 7.5, h: 0.24, fontSize: 8.5, color: C.dim });
  s.addText("Thank you", { x: W - M - 2, y: 6.68, w: 2, h: 0.26, fontSize: 10, bold: true, color: C.text, align: "right" });
  notes(s, "End on the one-liner, not on the tech. Invite the hard question: what can it do if it goes rogue? The answer is the architecture: create an order, but never capture. Then point to the repo and the receipt.");
}

const out = "/root/Desktop/docs/AgentCart-Deck.pptx";
pptx.writeFile({ fileName: out })
  .then(() => console.log("wrote", out))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
