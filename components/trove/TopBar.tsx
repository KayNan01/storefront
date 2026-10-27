import { useEffect, useState } from "react";
import { Flame, Zap } from "lucide-react";

const MESSAGES = [
  { Icon: Flame, text: "GRAND OPENING SALE: FREE shipping on all US orders over $50" },
  { Icon: Zap, text: "10% OFF your first order — use code TROVE10 at checkout" },
];

export function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const { Icon, text } = MESSAGES[index]!;

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex min-h-10 max-w-6xl items-center justify-center px-4 py-2">
        <p
          key={index}
          className="animate-in fade-in flex items-center justify-center gap-1.5 text-center text-xs font-semibold tracking-wide sm:text-sm"
        >
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{text}</span>
        </p>
      </div>
    </div>
  );
}
