// Derived KPIs for the demo operations dashboard, computed from src/data/mockData.json.
import mockData from "@/data/mockData.json";

export type MockOrder = (typeof mockData.orders)[number];
export type InventoryRow = (typeof mockData.inventory)[number];

export const SHIPMENT_STATUSES = [
  "processing",
  "label_created",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "exception",
] as const;

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function summarize(daily = mockData.dailyMetrics, orders = mockData.orders) {
  const revenue = daily.reduce((s, d) => s + d.revenue, 0);
  const orderCount = daily.reduce((s, d) => s + d.orders, 0);
  const visitors = daily.reduce((s, d) => s + d.visitors, 0);
  const delivered = orders.filter((o) => o.status === "delivered" && o.transitDays != null);
  const onTime = delivered.filter((o) => (o.transitDays ?? 99) <= 5).length;
  return {
    revenue: Math.round(revenue * 100) / 100,
    orders: orderCount,
    aov: orderCount ? Math.round((revenue / orderCount) * 100) / 100 : 0,
    conversion: visitors ? Math.round((orderCount / visitors) * 1000) / 10 : 0,
    onTimeRate: delivered.length ? Math.round((onTime / delivered.length) * 100) : 0,
    avgTransit: delivered.length
      ? Math.round(
          (delivered.reduce((s, o) => s + (o.transitDays ?? 0), 0) / delivered.length) * 10,
        ) / 10
      : 0,
  };
}

export function shipmentsByStatus(orders = mockData.orders) {
  return SHIPMENT_STATUSES.map((status) => ({
    status: statusLabel(status),
    count: orders.filter((o) => o.status === status).length,
  }));
}

export function lowStock(inventory = mockData.inventory): InventoryRow[] {
  return inventory.filter((r) => r.onHand <= r.reorderPoint).sort((a, b) => a.onHand - b.onHand);
}
