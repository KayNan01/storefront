import { createFileRoute } from "@tanstack/react-router";
import { SupportPage } from "@/components/trove/SupportPage";
import { SUPPORT_EMAIL, SUPPORT_RESPONSE_TIME } from "@/lib/support";

export const Route = createFileRoute("/shipping")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Shipping Policy | Trove" },
      {
        name: "description",
        content:
          "Shipping information for Trove at trove.example, including US delivery, free shipping over $50 and order support.",
      },
      { property: "og:title", content: "Shipping Policy | Trove" },
      {
        property: "og:description",
        content: "US shipping rates, delivery estimates and order assistance for Trove.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shipping,
});

function Shipping() {
  return (
    <SupportPage title="Shipping Policy">
      <p className="text-sm text-muted-foreground">Last updated: October 14, 2026</p>
      <p>
        This policy applies to orders placed with Trove at{" "}
        <a href="https://trove.example" className="text-primary underline">
          trove.example
        </a>
        .
      </p>
      <section>
        <h2 className="text-xl font-bold">US Shipping</h2>
        <p className="mt-3">
          Trove serves customers in the United States. Shipping is free on orders over $50;
          otherwise the standard shipping rates shown at checkout apply.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Processing and Delivery</h2>
        <p className="mt-3">
          As stated in our Terms of Service, orders ship from our U.S. warehouse within 24 hours and
          typically arrive in 3–5 business days. Delivery times are estimates and may be affected by
          carrier delays.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Order Assistance</h2>
        <p className="mt-3">
          For questions about delivery or a missing shipment, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          with your order number. {SUPPORT_RESPONSE_TIME}
        </p>
      </section>
    </SupportPage>
  );
}
