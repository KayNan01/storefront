import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { formatMoney } from "@/lib/catalog";
import { useDemoStore } from "@/stores/demoStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/return")({
  staticData: { sitemap: false },
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { order?: string | undefined } => ({
    order: typeof search["order"] === "string" ? search["order"] : undefined,
  }),
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Order confirmed — Trove" },
      { name: "description", content: "Confirmation for your Trove demo order." },
      { property: "og:title", content: "Order confirmed — Trove" },
      { property: "og:description", content: "Confirmation for your Trove demo order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutReturnPage,
});

function CheckoutReturnPage() {
  const { order: orderId } = Route.useSearch();
  const order = useDemoStore((s) => s.orders.find((o) => o.id === orderId));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <CheckCircle2 className="mb-4 h-16 w-16 text-primary" />
      <h1 className="font-display text-3xl font-black tracking-tight">
        {order ? "Thank you for your order!" : "Order not found"}
      </h1>
      {order ? (
        <div className="mt-4 w-full max-w-sm rounded-2xl border bg-card p-5 text-left text-sm">
          <p className="font-bold">Order {order.number}</p>
          <ul className="mt-2 space-y-1">
            {order.items.map((i, idx) => (
              <li key={idx}>
                {i.quantity} × {i.title}
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-0.5 border-t pt-3">
            <p className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</span>
            </p>
            <p className="flex justify-between font-black">
              <span>Total</span>
              <span>{formatMoney(order.total)}</span>
            </p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This is a simulated order: no payment was taken and no email was sent.
          </p>
        </div>
      ) : (
        <p className="mt-2 max-w-md text-muted-foreground">
          We couldn't find that demo order in this browser.
        </p>
      )}
      <div className="mt-8 flex gap-2">
        <Button className="rounded-full" asChild>
          <Link to="/">Back to Trove</Link>
        </Button>
        <Button variant="outline" className="rounded-full" asChild>
          <Link to="/account">My orders</Link>
        </Button>
      </div>
    </div>
  );
}
