import { Cpu, Flame, Home, Sparkles, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/trove/Reveal";

const TILES: { name: string; blurb: string; icon: LucideIcon; tint: string }[] = [
  {
    name: "Gadgets & Tech",
    blurb: "Small upgrades for your desk and bag",
    icon: Cpu,
    tint: "bg-accent/25",
  },
  {
    name: "Beauty & Style",
    blurb: "Everyday self-care, no fuss",
    icon: Sparkles,
    tint: "bg-pop/40",
  },
  { name: "Smart Home", blurb: "Little fixes around the house", icon: Home, tint: "bg-primary/15" },
  { name: "TikTok Finds", blurb: "The viral ones that hold up", icon: Flame, tint: "bg-secondary" },
];

export function CategoryTiles({ onPick }: { onPick: (category: string) => void }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14">
      <Reveal>
        <h2 className="text-2xl font-black font-display tracking-tight sm:text-3xl">
          Shop by vibe
        </h2>
      </Reveal>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {TILES.map(({ name, blurb, icon: Icon, tint }, i) => (
          <Reveal key={name} delay={i * 90}>
            <button
              onClick={() => {
                onPick(name);
                document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`wiggle-hover group relative flex h-full w-full flex-col items-start overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-elevated sm:p-5 ${tint}`}
            >
              <span className="wiggle-target flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary shadow-card sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <span className="mt-6 text-base font-black font-display leading-tight sm:mt-8 sm:text-lg">
                {name}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{blurb}</span>
              <Icon
                aria-hidden
                className="absolute -bottom-4 -right-4 h-24 w-24 text-foreground/5 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12"
              />
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
