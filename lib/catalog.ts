export type Product = {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
  keywords: string[];
};

/**
 * This catalog is also the merchant allowlist. The agent can only create
 * orders for items in this list, at exactly these prices.
 */
export const CATALOG: Product[] = [
  {
    id: "usb-c-2m",
    name: "USB-C Cable 2m",
    price: 12.99,
    emoji: "🔌",
    description: "Braided 100W USB-C charging cable, two meters.",
    keywords: ["usb", "usb-c", "cable", "charger", "charging", "cord"],
  },
  {
    id: "phone-stand",
    name: "Aluminum Phone Stand",
    price: 11.25,
    emoji: "📱",
    description: "Adjustable desk stand for phones and small tablets.",
    keywords: ["phone", "stand", "holder", "desk"],
  },
  {
    id: "notebook-a5",
    name: "A5 Dot-Grid Notebook",
    price: 8.75,
    emoji: "📓",
    description: "160 pages, lay-flat binding, dotted grid.",
    keywords: ["notebook", "journal", "paper", "notes", "diary"],
  },
  {
    id: "coffee-beans",
    name: "Single-Origin Coffee Beans",
    price: 14.2,
    emoji: "☕",
    description: "250g medium roast, whole bean, ethically sourced.",
    keywords: ["coffee", "beans", "espresso", "roast"],
  },
  {
    id: "desk-lamp",
    name: "Warm LED Desk Lamp",
    price: 24.5,
    emoji: "💡",
    description: "Dimmable 2700K lamp with a USB charging port.",
    keywords: ["lamp", "light", "desk", "led"],
  },
  {
    id: "earbuds",
    name: "Noise-Cancelling Earbuds",
    price: 49.0,
    emoji: "🎧",
    description: "ANC earbuds with 24h battery and USB-C case.",
    keywords: ["earbuds", "headphones", "audio", "music", "anc"],
  },
];

export function catalogLine(product: Product): string {
  return `- ${product.name} — $${product.price.toFixed(2)} — ${product.description}`;
}

function score(product: Product, text: string): number {
  const haystack = `${product.name} ${product.description}`.toLowerCase();
  let total = 0;
  for (const keyword of product.keywords) {
    if (text.includes(keyword)) total += keyword.length;
  }
  for (const word of product.name.toLowerCase().split(/\s+/)) {
    if (word.length > 2 && text.includes(word)) total += 2;
  }
  if (haystack.includes(text)) total += 5;
  return total;
}

/**
 * Deterministic picker. Used when the LLM is unavailable or when the agent's
 * choice gets blocked by the spend cap / allowlist guard.
 */
export function pickProduct(prompt: string, budget: number): Product | null {
  const text = prompt.toLowerCase();
  const affordable = CATALOG.filter((product) => product.price <= budget);
  if (affordable.length === 0) return null;

  const ranked = affordable
    .map((product) => ({ product, score: score(product, text) }))
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price);

  if (ranked[0] && ranked[0].score > 0) return ranked[0].product;

  // No keyword match: buy the cheapest thing that fits, which is the most
  // defensible behavior for a spending agent.
  return [...affordable].sort((a, b) => a.price - b.price)[0];
}
