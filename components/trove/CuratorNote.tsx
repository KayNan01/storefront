import { Reveal } from "@/components/trove/Reveal";

export function CuratorNote() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <Reveal>
        <div className="relative rounded-3xl border-2 border-dashed border-primary/40 bg-card p-8 shadow-card sm:p-10">
          <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
            Curator's note
          </span>
          <p className="text-xl font-bold leading-snug font-display sm:text-2xl">
            "One rule for everything here: if it doesn't fix a small daily annoyance or make your
            space nicer, it doesn't make it into Trove."
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            — The Trove team
          </p>
        </div>
      </Reveal>
    </section>
  );
}
