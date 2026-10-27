// Editorial helpers: "moment of use" filters and short, honest use-case lines.
// Lines describe where a product fits, never performance claims we can't verify.
type ProductLike = {
  title: string;
  tags: string[];
  productType: string;
  priceRange: { minVariantPrice: { amount: string } };
};

export const MOMENTS = ["Desk & Focus", "On the Go", "Home & Chill", "Under $25"] as const;
export type Moment = (typeof MOMENTS)[number];

const MOMENT_KEYWORDS: Record<Exclude<Moment, "Under $25">, string[]> = {
  "Desk & Focus": [
    "desk",
    "office",
    "keyboard",
    "mouse",
    "monitor",
    "laptop",
    "usb",
    "fan",
    "lamp",
    "organizer",
    "charger",
  ],
  "On the Go": [
    "portable",
    "travel",
    "mini",
    "bottle",
    "bag",
    "car",
    "wireless",
    "rechargeable",
    "pocket",
  ],
  "Home & Chill": [
    "home",
    "decor",
    "light",
    "led",
    "kitchen",
    "bedroom",
    "smart",
    "halloween",
    "candle",
    "wall",
  ],
};

function haystack(p: ProductLike) {
  return [p.title, p.productType, ...p.tags].join(" ").toLowerCase();
}

export function productMatchesMoment(p: ProductLike, moment: Moment | null): boolean {
  if (!moment) return true;
  if (moment === "Under $25") return parseFloat(p.priceRange.minVariantPrice.amount) < 25;
  const text = haystack(p);
  return MOMENT_KEYWORDS[moment].some((k) => text.includes(k));
}

export function useCaseLine(p: ProductLike): string | null {
  const text = haystack(p);
  if (MOMENT_KEYWORDS["On the Go"].some((k) => text.includes(k)))
    return "Made to come along with you";
  if (MOMENT_KEYWORDS["Desk & Focus"].some((k) => text.includes(k)))
    return "A small upgrade for your desk";
  if (MOMENT_KEYWORDS["Home & Chill"].some((k) => text.includes(k)))
    return "Easy win for your space";
  return null;
}
