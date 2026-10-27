import { Lock, RotateCcw, Truck } from "lucide-react";

const BADGES = [
  { icon: Lock, label: "Secure checkout", sub: "Simulated in this demo" },
  { icon: RotateCcw, label: "30-day guarantee", sub: "Easy returns, full refund" },
  { icon: Truck, label: "Free US shipping", sub: "On orders over $50" },
];

export function TrustBadges() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {BADGES.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1 rounded-2xl border bg-card px-2 py-3 text-center"
        >
          <Icon className="h-5 w-5 text-primary" />
          <p className="text-xs font-bold">{label}</p>
          <p className="text-[11px] leading-tight text-muted-foreground">{sub}</p>
        </div>
      ))}
    </div>
  );
}
