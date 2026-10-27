import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, LogOut, Package, UserRound } from "lucide-react";
import { toast } from "sonner";

import { productsQueryOptions, formatMoney } from "@/lib/catalog";
import { useAuth } from "@/hooks/useAuth";
import { useDemoStore, type DemoAddress, type DemoProfile } from "@/stores/demoStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mockData from "@/data/mockData.json";

export const Route = createFileRoute("/_authenticated/account")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "My account — Trove" },
      { name: "description", content: "Your Trove demo orders, profile and saved favorites." },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "My account — Trove" },
      {
        property: "og:description",
        content: "Your Trove demo orders, profile and saved favorites.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AccountPage,
});

const PROFILE_FIELDS = [
  ["name", "Full name"],
  ["phone", "Phone"],
  ["line1", "Address"],
  ["line2", "Apt, suite (optional)"],
  ["city", "City"],
  ["state", "State"],
  ["postal_code", "ZIP code"],
] as const;

type OrderView = {
  id: string;
  number: string;
  createdAt: string;
  status: string;
  items: { title: string; quantity: number }[];
  total: number;
  shippingAddress: DemoAddress | null;
};

function AccountPage() {
  const { user } = useAuth();
  const signOutDemo = useDemoStore((s) => s.signOut);
  const navigate = useNavigate();

  const signOut = () => {
    signOutDemo();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="text-2xl font-black font-display tracking-tight">
            Trove<span className="text-primary">.</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <main className="fade-up mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-black">
          Hi{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
        <Tabs defaultValue="orders" className="mt-8">
          <TabsList className="rounded-full">
            <TabsTrigger value="orders" className="gap-1.5 rounded-full">
              <Package className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1.5 rounded-full">
              <UserRound className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-1.5 rounded-full">
              <Heart className="h-4 w-4" /> Favorites
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders">{user && <Orders email={user.email} />}</TabsContent>
          <TabsContent value="profile">{user && <Profile name={user.name} />}</TabsContent>
          <TabsContent value="wishlist">
            <Favorites />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Orders({ email }: { email: string }) {
  const placed = useDemoStore((s) => s.orders);
  const isDemoCustomer = email === mockData.customer.email;
  const history: OrderView[] = isDemoCustomer
    ? mockData.orders
        .filter((o) => mockData.customer.orderIds.includes(o.id))
        .map((o) => ({
          id: o.id,
          number: o.number,
          createdAt: o.createdAt,
          status: o.status.replace(/_/g, " "),
          items: o.items,
          total: o.total,
          shippingAddress: { name: mockData.customer.name, ...mockData.customer.address },
        }))
    : [];
  const orders: OrderView[] = [...placed.filter((o) => o.email === email), ...history];

  if (!orders.length)
    return (
      <div className="mt-6 rounded-2xl border bg-card p-8 text-center">
        <p className="font-semibold">No orders yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Place a demo order and it shows up here.
        </p>
        <Button asChild className="mt-4 rounded-full">
          <Link to="/">Start shopping</Link>
        </Button>
      </div>
    );
  return (
    <ul className="mt-6 space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold">Order {o.number}</p>
            <span className="rounded-full bg-accent/25 px-3 py-0.5 text-xs font-bold capitalize">
              {o.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(o.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {o.items.map((it, i) => (
              <li key={i}>
                {it.quantity} × {it.title}
              </li>
            ))}
          </ul>
          <ShippingTo address={o.shippingAddress} />
          <p className="mt-3 font-black text-primary">{formatMoney(o.total)} USD</p>
        </li>
      ))}
    </ul>
  );
}

function Profile({ name }: { name: string }) {
  const stored = useDemoStore((s) => s.profile);
  const saveProfile = useDemoStore((s) => s.saveProfile);
  const [form, setForm] = useState<DemoProfile>(
    stored ?? { name, phone: "", line1: "", line2: "", city: "", state: "", postal_code: "" },
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
    toast.success("Profile saved in this browser");
  };

  return (
    <form
      onSubmit={save}
      className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 shadow-card sm:grid-cols-2"
    >
      {PROFILE_FIELDS.map(([key, label]) => (
        <div
          key={key}
          className={
            key === "line1" || key === "line2" ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"
          }
        >
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            value={form[key]}
            maxLength={200}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
      <Button type="submit" className="rounded-full sm:col-span-2 sm:justify-self-start">
        Save profile
      </Button>
    </form>
  );
}

function Favorites() {
  const ids = useWishlistStore((s) => s.ids);
  const { data: products = [] } = useQuery(productsQueryOptions());
  const saved = products.filter((p) => ids.includes(p.id));
  if (!saved.length)
    return (
      <p className="mt-6 rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
        No favorites yet — tap the heart on any product.
      </p>
    );
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {saved.map((p) => (
        <Link
          key={p.id}
          to="/product/$handle"
          params={{ handle: p.handle }}
          className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card transition-transform hover:-translate-y-1"
        >
          {p.images.edges[0] && (
            <img
              src={p.images.edges[0].node.url}
              alt={p.title}
              className="h-16 w-16 rounded-xl object-cover"
            />
          )}
          <div>
            <p className="text-sm font-semibold">{p.title}</p>
            <p className="text-sm font-black text-primary">
              {formatMoney(p.priceRange.minVariantPrice.amount)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ShippingTo({ address: a }: { address: DemoAddress | null }) {
  if (!a) return null;
  const cityLine = [a.city, [a.state, a.postal_code].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  return (
    <div className="mt-3 rounded-xl bg-secondary p-3 text-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Shipping to</p>
      {a.name && <p className="mt-1 font-semibold">{a.name}</p>}
      {a.line1 && (
        <p>
          {a.line1}
          {a.line2 ? `, ${a.line2}` : ""}
        </p>
      )}
      {cityLine && <p>{cityLine}</p>}
    </div>
  );
}
