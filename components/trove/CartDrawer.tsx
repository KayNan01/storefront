import { useNavigate } from "@tanstack/react-router";
import { CreditCard, Loader2, Minus, Plus, ShoppingBasket, Trash2, Truck } from "lucide-react";

import { formatMoney, FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { items, isLoading, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    onOpenChange(false);
    navigate({ to: "/checkout" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-md">
        <SheetHeader className="shrink-0">
          <SheetTitle className="text-xl font-black font-display">Your Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Your cart is empty"
              : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col pt-4">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingBasket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="space-y-3">
                  {items.map((item) => {
                    const image = item.product.images.edges[0]?.node;
                    return (
                      <div key={item.variantId} className="flex gap-3 rounded-2xl border p-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          {image && (
                            <img
                              src={image.url}
                              alt={item.product.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-semibold">{item.product.title}</h4>
                          {item.selectedOptions?.length > 0 &&
                            item.variantTitle !== "Default Title" && (
                              <p className="truncate text-xs text-muted-foreground">
                                {item.selectedOptions.map((option) => option.value).join(" • ")}
                              </p>
                            )}
                          <p className="text-sm font-bold text-primary">
                            {formatMoney(item.price.amount, item.price.currencyCode)}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            aria-label={`Remove ${item.product.title}`}
                            onClick={() => removeItem(item.variantId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <div className="flex items-center rounded-full border">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-8 w-8 items-center justify-center"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex h-8 w-8 items-center justify-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="shrink-0 space-y-3 border-t bg-background pt-4">
                <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-xs">
                  <Truck className="h-4 w-4 shrink-0 text-primary" />
                  {remaining > 0 ? (
                    <p>
                      Add <span className="font-bold">{formatMoney(remaining)}</span> more for{" "}
                      <span className="font-bold">FREE shipping</span>
                    </p>
                  ) : (
                    <p className="relative">
                      <FreeShippingConfetti />
                      🎉 You've unlocked <span className="font-bold">FREE shipping</span>!
                    </p>
                  )}
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="bar-shimmer h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-black font-display">
                    {formatMoney(subtotal, items[0]?.price.currencyCode ?? "USD")}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-full py-6 text-base font-bold"
                  size="lg"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" /> Checkout
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo checkout — no real payment is taken
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const CONFETTI = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return {
    dx: `${Math.cos(angle) * 70}px`,
    dy: `${Math.sin(angle) * 45 - 20}px`,
    color: ["bg-primary", "bg-accent", "bg-pop"][i % 3] ?? "bg-primary",
  };
});

/** One-shot burst shown when the cart crosses the free-shipping threshold. */
function FreeShippingConfetti() {
  return (
    <span aria-hidden className="pointer-events-none absolute left-2 top-1/2">
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className={`confetti-bit absolute h-1.5 w-1.5 rounded-sm ${c.color}`}
          style={{ "--dx": c.dx, "--dy": c.dy } as React.CSSProperties}
        />
      ))}
    </span>
  );
}
