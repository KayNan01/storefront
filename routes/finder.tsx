import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2 } from "lucide-react";

import { getRecommendations } from "@/lib/recommend.functions";
import type { Product } from "@/lib/catalog";
import { TopBar } from "@/components/trove/TopBar";
import { SiteHeader } from "@/components/trove/SiteHeader";
import { SiteFooter } from "@/components/trove/SiteFooter";
import { ProductCard } from "@/components/trove/ProductCard";
import { QuickView } from "@/components/trove/QuickView";
import { CartDrawer } from "@/components/trove/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const TITLE = "Gift & Product Finder — Trove";
const DESC =
  "Tell us what you're looking for and your budget — Trove's finder picks the best matches from our catalog.";

export const Route = createFileRoute("/finder")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FinderPage,
});

type Pick = { product: Product; reason: string };

function FinderPage() {
  const recommend = useServerFn(getRecommendations);
  const addItem = useCartStore((s) => s.addItem);
  const [need, setNeed] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ summary: string; picks: Pick[] } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (need.trim().length < 3)
      return setError("Tell us a bit more about what you're looking for.");
    const b = budget.trim() ? Number(budget) : null;
    if (b !== null && (!Number.isFinite(b) || b <= 0))
      return setError("Budget must be a positive number.");
    setLoading(true);
    setError(null);
    try {
      const res = await recommend({
        data: { need: need.trim(), budget: b, preferences: preferences.trim() },
      });
      if (res.ok) setResult({ summary: res.summary, picks: res.picks });
      else setError(res.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SiteHeader compact onOpenCart={() => setCartOpen(true)} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Smart match
          </span>
          <h1 className="mt-3 text-3xl font-black font-display md:text-4xl">
            Find your perfect pick
          </h1>
          <p className="mt-2 text-muted-foreground">
            Describe what you need, set a budget, and we'll match you with products from our
            catalog.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <div className="grid gap-2">
            <Label htmlFor="need">What are you looking for?</Label>
            <Textarea
              id="need"
              value={need}
              maxLength={500}
              onChange={(e) => setNeed(e.target.value)}
              placeholder="e.g. A gift for my sister who loves skincare"
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget per item (USD)</Label>
              <Input
                id="budget"
                type="number"
                min="1"
                step="1"
                inputMode="decimal"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Any"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prefs">Preferences (optional)</Label>
              <Input
                id="prefs"
                value={preferences}
                maxLength={300}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Color, size, style…"
              />
            </div>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding matches…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Get recommendations
              </>
            )}
          </Button>
        </form>

        {result && (
          <section className="mt-10">
            <p className="mx-auto max-w-2xl text-center text-lg">{result.summary}</p>
            {result.picks.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {result.picks.map((pk) => (
                  <div key={pk.product.id} className="flex flex-col gap-2">
                    <ProductCard
                      product={pk.product}
                      onQuickView={setQuick}
                      onAdded={() => setCartOpen(true)}
                    />
                    <p className="text-sm text-muted-foreground">{pk.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-center text-muted-foreground">
                No matching products right now — try adjusting your budget or description.
              </p>
            )}
          </section>
        )}
      </main>
      <SiteFooter />
      <QuickView
        product={quick}
        open={!!quick}
        onClose={() => setQuick(null)}
        onAdd={async (product, variant, quantity) => {
          await addItem({
            product,
            variantId: variant.id,
            variantTitle: variant.title,
            price: variant.price,
            quantity,
            selectedOptions: variant.selectedOptions ?? [],
          });
          toast.success("Added to cart", { description: product.title });
          setCartOpen(true);
        }}
      />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
