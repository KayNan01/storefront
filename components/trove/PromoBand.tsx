import { Sparkle } from "lucide-react";

const PHRASES = [
  "Free US shipping over $50",
  "30-day easy returns",
  "Real human support",
  "Secure checkout",
  "Useful stuff only",
];

/** Bold tilted ticker band between sections. */
export function PromoBand() {
  const loop = [...PHRASES, ...PHRASES, ...PHRASES, ...PHRASES];
  return (
    <div aria-hidden className="relative overflow-hidden py-6">
      <div className="bg-band -mx-4 -rotate-2 py-3 shadow-elevated">
        <div className="marquee-fast flex w-max items-center gap-6">
          {loop.map((text, i) => (
            <span
              key={i}
              className="flex items-center gap-6 whitespace-nowrap text-lg font-black uppercase tracking-tight text-primary-foreground font-display sm:text-2xl"
            >
              {text}
              <Sparkle className="h-5 w-5 fill-current" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
