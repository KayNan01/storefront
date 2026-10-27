import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  // The order confirmation must not be nested inside the checkout page, or customers
  // land back on checkout after placing an order.
  it("shows the confirmation page after placing an order, not the checkout page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const ids = router.matchRoutes("/checkout/return", { order: "demo_1" }).map((m) => m.routeId);

    expect(ids.at(-1)).toBe("/checkout/return");
    expect(ids).not.toContain("/checkout/");
    expect(ids).not.toContain("/checkout");
  });
});
