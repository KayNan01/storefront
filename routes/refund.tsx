import { createFileRoute } from "@tanstack/react-router";
import { SupportPage } from "@/components/trove/SupportPage";
import { SUPPORT_EMAIL, SUPPORT_RESPONSE_TIME } from "@/lib/support";

export const Route = createFileRoute("/refund")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Refund Policy | Trove" },
      {
        name: "description",
        content:
          "Trove's return and refund policy for trove.example orders, including the 30-day guarantee and support contact.",
      },
      { property: "og:title", content: "Refund Policy | Trove" },
      {
        property: "og:description",
        content: "Returns, refund timing and support for Trove orders at trove.example.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Refund,
});

function Refund() {
  return (
    <SupportPage title="Refund Policy">
      <p className="text-sm text-muted-foreground">Last updated: October 14, 2026</p>
      <p>
        This policy applies to purchases from Trove at{" "}
        <a href="https://trove.example" className="text-primary underline">
          trove.example
        </a>
        .
      </p>
      <section>
        <h2 className="text-xl font-bold">30-Day Guarantee</h2>
        <p className="mt-3">
          You may return any Trove product within 30 days of delivery for a full refund — no
          questions asked.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Start a Return</h2>
        <p className="mt-3">
          Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          with your order number and the item you would like to return. Our team will provide return
          instructions. {SUPPORT_RESPONSE_TIME}
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Refunds</h2>
        <p className="mt-3">
          Refunds are issued to the original payment method within 5–10 business days after we
          receive the returned item.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold">Damaged or Defective Items</h2>
        <p className="mt-3">
          If an item arrives damaged or defective, contact {SUPPORT_EMAIL} within 30 days of
          delivery so we can help resolve the issue.
        </p>
      </section>
    </SupportPage>
  );
}
