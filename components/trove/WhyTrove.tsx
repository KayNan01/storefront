import { Reveal } from "@/components/trove/Reveal";
import { BadgeCheck, Headphones, ShieldCheck, Truck } from "lucide-react";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Picked, not bulk-dumped",
    text: "We only list things we'd actually want in our own homes. No endless pages of filler.",
  },
  {
    icon: Truck,
    title: "Tracked US shipping",
    text: "You get tracking on every order, from checkout to your door. Free over $50.",
  },
  {
    icon: BadgeCheck,
    title: "30 days to try it",
    text: "If it doesn't fit your routine, send it back for a full refund. No back-and-forth.",
  },
  {
    icon: Headphones,
    title: "A real inbox",
    text: "Questions? Write to support@trove.example and a real person replies within 24h (Mon–Fri).",
  },
];

export function WhyTrove() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-black font-display tracking-tight sm:text-4xl">
          How <span className="highlight-pop">Trove</span> works
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          A small shop with a simple promise: useful stuff, honest service.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="wiggle-hover h-full rounded-2xl border bg-card p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
                <span className="wiggle-target mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/25 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold font-display">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
