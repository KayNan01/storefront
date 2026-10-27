import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Info, ShoppingBasket } from "lucide-react";

import { formatMoney, FREE_SHIPPING_THRESHOLD, shippingFor } from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { useDemoStore, type DemoAddress } from "@/stores/demoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import mockData from "@/data/mockData.json";

export const Route = createFileRoute("/checkout/")({
  staticData: { sitemap: false },
  ssr: false,
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Checkout — Trove" },
      { name: "description", content: "Simulated checkout for the Trove storefront demo." },
      { property: "og:title", content: "Checkout — Trove" },
      { property: "og:description", content: "Simulated checkout for the Trove storefront demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

const FIELDS: [keyof DemoAddress, string][] = [
  ["name", "Full name"],
  ["line1", "Address"],
  ["line2", "Apt, suite (optional)"],
  ["city", "City"],
  ["state", "State"],
  ["postal_code", "ZIP code"],
];

function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useDemoStore((s) => s.user);
  const profile = useDemoStore((s) => s.profile);
  const placeOrder = useDemoStore((s) => s.placeOrder);
  const navigate = useNavigate();

  const sample = { name: mockData.customer.name, ...mockData.customer.address };
  const [email, setEmail] = useState(user?.email ?? mockData.customer.email);
  const [address, setAddress] = useState<DemoAddress>(profile ? { ...profile } : sample);

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const shipping = shippingFor(subtotal);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder({ email, items, address });
    clearCart();
    navigate({ to: "/checkout/return", search: { order: order.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="font-display text-2xl font-black tracking-tight">
            Trove<span className="text-primary">.</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to store
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {items.length === 0 ? (
          <div className="py-24 text-center">
            <ShoppingBasket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h1 className="font-display text-2xl font-black">Your cart is empty</h1>
            <p className="mt-2 text-muted-foreground">Add some products before checking out.</p>
            <Button className="mt-6 rounded-full" asChild>
              <Link to="/">Browse products</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="mb-2 font-display text-3xl font-black tracking-tight">Checkout</h1>
            <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 text-primary" /> Demo checkout — no payment is taken and no
              data leaves your browser.
            </p>
            <div className="grid gap-8 md:grid-cols-[1fr_340px]">
              <form
                id="checkout-form"
                onSubmit={submit}
                className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2"
              >
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {FIELDS.map(([key, label]) => (
                  <div
                    key={key}
                    className={
                      key === "line1" || key === "line2" || key === "name"
                        ? "space-y-1.5 sm:col-span-2"
                        : "space-y-1.5"
                    }
                  >
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      value={address[key]}
                      required={key !== "line2"}
                      onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </form>

              <aside className="h-fit space-y-3 rounded-2xl border bg-secondary p-6">
                <h2 className="font-display text-lg font-black">Order summary</h2>
                <ul className="space-y-2 text-sm">
                  {items.map((i) => (
                    <li key={i.variantId} className="flex justify-between gap-3">
                      <span className="min-w-0 truncate">
                        {i.quantity} × {i.product.title}
                      </span>
                      <span className="shrink-0 font-semibold">
                        {formatMoney(parseFloat(i.price.amount) * i.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-1 border-t pt-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free US shipping on orders over {formatMoney(FREE_SHIPPING_THRESHOLD)}.
                    </p>
                  )}
                </div>
                <div className="flex justify-between border-t pt-3 text-lg font-black">
                  <span>Total</span>
                  <span>{formatMoney(subtotal + shipping)}</span>
                </div>
                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full rounded-full py-6 text-base font-bold"
                >
                  Place demo order
                </Button>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
