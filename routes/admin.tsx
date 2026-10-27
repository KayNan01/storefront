import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AlertTriangle, DollarSign, Info, Package, ShoppingCart, Timer, Truck } from "lucide-react";

import mockData from "@/data/mockData.json";
import { formatMoney } from "@/lib/catalog";
import { lowStock, shipmentsByStatus, statusLabel, summarize } from "@/lib/ops-metrics";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Operations Dashboard — Trove Demo" },
      {
        name: "description",
        content: "Demo sales, shipping and inventory dashboard powered by fictional mock data.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Operations Dashboard — Trove Demo" },
      {
        property: "og:description",
        content: "Demo sales, shipping and inventory dashboard powered by fictional mock data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OpsDashboard,
});

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--color-primary)" },
} satisfies ChartConfig;

const shipmentConfig = {
  count: { label: "Shipments", color: "var(--color-primary)" },
} satisfies ChartConfig;

const STATUS_TONE: Record<string, string> = {
  delivered: "bg-primary/15 text-primary",
  exception: "bg-destructive/15 text-destructive",
  in_transit: "bg-accent/30 text-foreground",
  out_for_delivery: "bg-accent/30 text-foreground",
};

function OpsDashboard() {
  const kpis = summarize();
  const shipments = shipmentsByStatus();
  const low = lowStock();
  const [warehouse, setWarehouse] = useState("all");
  const orders = useMemo(
    () =>
      mockData.orders
        .filter((o) => warehouse === "all" || o.warehouseId === warehouse)
        .slice(0, 12),
    [warehouse],
  );
  const chartData = mockData.dailyMetrics.map((d) => ({ ...d, label: d.date.slice(5) }));
  const whName = (id: string) => mockData.warehouses.find((w) => w.id === id)?.name ?? id;

  const cards = [
    { icon: DollarSign, label: "Revenue (30d)", value: formatMoney(kpis.revenue) },
    { icon: ShoppingCart, label: "Orders (30d)", value: kpis.orders.toLocaleString("en-US") },
    { icon: Package, label: "Avg. order value", value: formatMoney(kpis.aov) },
    { icon: Truck, label: "On-time delivery", value: `${kpis.onTimeRate}%` },
    { icon: Timer, label: "Avg. transit", value: `${kpis.avgTransit} days` },
    { icon: AlertTriangle, label: "Low-stock SKUs", value: String(low.length) },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-2xl font-black font-display tracking-tight">
            Trove<span className="text-primary">.</span>{" "}
            <span className="text-sm font-semibold text-muted-foreground">Ops</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-primary">
            View store
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">Operations dashboard</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 text-primary" /> All figures are fictional mock data from{" "}
            <code>src/data/mockData.json</code>.
          </p>
        </div>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {cards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border bg-card p-4 shadow-card">
              <Icon className="h-4 w-4 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">{label}</p>
              <p className="font-display text-xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="font-bold">Daily revenue</h2>
            <ChartContainer config={revenueConfig} className="mt-4 h-64 w-full">
              <AreaChart data={chartData} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval={4} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="var(--color-revenue)"
                  fillOpacity={0.2}
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-card">
            <h2 className="font-bold">Shipments by status</h2>
            <ChartContainer config={shipmentConfig} className="mt-4 h-64 w-full">
              <BarChart data={shipments} layout="vertical" margin={{ left: 8, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={6} />
              </BarChart>
            </ChartContainer>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold">Recent orders & shipments</h2>
            <Tabs value={warehouse} onValueChange={setWarehouse}>
              <TabsList className="rounded-full">
                <TabsTrigger value="all" className="rounded-full">
                  All hubs
                </TabsTrigger>
                {mockData.warehouses.map((w) => (
                  <TabsTrigger key={w.id} value={w.id} className="rounded-full">
                    {w.name.replace(" (fictional)", "")}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-semibold">{o.number}</TableCell>
                    <TableCell>{o.createdAt}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell>
                      {o.city}, {o.state}
                    </TableCell>
                    <TableCell>
                      <span className="block">{o.carrier}</span>
                      <span className="text-xs text-muted-foreground">{o.trackingNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_TONE[o.status] ?? "bg-muted text-foreground"}`}
                      >
                        {statusLabel(o.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatMoney(o.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="font-bold">Inventory at or below reorder point</h2>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Hub</TableHead>
                  <TableHead className="text-right">On hand</TableHead>
                  <TableHead className="text-right">Inbound</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {low.map((r) => (
                  <TableRow key={`${r.sku}-${r.warehouseId}`}>
                    <TableCell className="font-mono text-xs">{r.sku}</TableCell>
                    <TableCell>
                      {r.title}
                      {r.variant !== "Default Title" ? ` — ${r.variant}` : ""}
                    </TableCell>
                    <TableCell>{whName(r.warehouseId)}</TableCell>
                    <TableCell
                      className={`text-right font-semibold ${r.onHand === 0 ? "text-destructive" : ""}`}
                    >
                      {r.onHand}
                    </TableCell>
                    <TableCell className="text-right">{r.inbound}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </div>
  );
}
