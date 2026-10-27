import { getCatalog } from "@/lib/catalog";
import type { Product } from "@/lib/catalog";

// Local keyword matcher — no AI calls, zero credits.

export interface RecommendInput {
  need: string;
  budget: number | null;
  preferences: string;
}
export type RecommendResult =
  | { ok: true; summary: string; picks: { product: Product; reason: string }[] }
  | { ok: false; error: string };

const STOP = new Set(
  "a an the and or for to of in on with my me i im i'm is it that this some something want need looking find gift present who which under over up about like love".split(
    " ",
  ),
);

const SYNONYMS: Record<string, string[]> = {
  skincare: ["skin", "face", "facial", "beauty", "massage", "led", "microcurrent"],
  skin: ["facial", "face", "beauty"],
  beauty: ["skin", "facial", "face", "makeup"],
  mom: ["beauty", "skin", "facial"],
  clothes: ["top", "shirt", "tank", "wear", "clothing"],
  clothing: ["top", "shirt", "tank", "wear"],
  summer: ["ice", "silk", "tank", "cool"],
  workout: ["tank", "top", "pads"],
  tech: ["gadget", "led", "electric", "device"],
  gadget: ["tech", "device", "electric", "led"],
  relax: ["massage", "vibration"],
};

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export async function recommendProducts(input: RecommendInput): Promise<RecommendResult> {
  try {
    const catalog = await getCatalog();
    if (catalog.length === 0)
      return { ok: true, summary: "Our catalog is empty right now — check back soon!", picks: [] };

    const base = tokens(`${input.need} ${input.preferences}`);
    const words = new Set(base.flatMap((w) => [w, ...(SYNONYMS[w] ?? [])]));

    const scored = catalog
      .filter((p) => p.availableForSale)
      .filter((p) => !input.budget || Number(p.priceRange.minVariantPrice.amount) <= input.budget)
      .map((p) => {
        const title = p.title.toLowerCase();
        const tags = p.tags.join(" ").toLowerCase();
        const rest =
          `${p.productType} ${p.description} ${p.options.flatMap((o) => o.values).join(" ")}`.toLowerCase();
        const hits: string[] = [];
        let score = 0;
        for (const w of words) {
          const direct = base.includes(w) ? 1 : 0.5;
          if (title.includes(w)) {
            score += 3 * direct;
            hits.push(w);
          } else if (tags.includes(w)) {
            score += 2 * direct;
            hits.push(w);
          } else if (rest.includes(w)) {
            score += 1 * direct;
            hits.push(w);
          }
        }
        return { p, score, hits };
      })
      .sort((a, b) => b.score - a.score);

    const matched = scored.filter((s) => s.score > 0).slice(0, 4);
    const price = (p: Product) => `$${Number(p.priceRange.minVariantPrice.amount).toFixed(2)}`;

    if (matched.length > 0) {
      return {
        ok: true,
        summary: `Here ${matched.length === 1 ? "is a pick" : `are ${matched.length} picks`} that match what you described${input.budget ? ` within your $${input.budget} budget` : ""}.`,
        picks: matched.map(({ p, hits }) => ({
          product: p,
          reason: `Matches "${hits.slice(0, 3).join(", ")}" — from ${price(p)}.`,
        })),
      };
    }

    const fallback = scored.slice(0, 4);
    if (fallback.length === 0) {
      return {
        ok: true,
        summary: "Nothing in our catalog fits that budget right now. Try raising it a little.",
        picks: [],
      };
    }
    return {
      ok: true,
      summary: "We didn't find an exact match, but here are popular items you might like.",
      picks: fallback.map(({ p }) => ({ product: p, reason: `Available now from ${price(p)}.` })),
    };
  } catch (e) {
    console.error("Recommendation failed:", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
