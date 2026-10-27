import { Info } from "lucide-react";

/** Thin notice shown on every page: the portfolio build uses fictional data only. */
export function DemoBanner() {
  return (
    <div className="bg-foreground text-background">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-1.5 px-4 py-1.5 text-center text-[11px] font-medium sm:text-xs">
        <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Portfolio demo — products, orders and metrics are fictional mock data. No real payments.
      </p>
    </div>
  );
}
