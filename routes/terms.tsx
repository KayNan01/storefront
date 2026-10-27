import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Terms of Service | Trove" },
      {
        name: "description",
        content:
          "The terms that govern your use of the Trove store, including orders, shipping, returns and liability.",
      },
      { property: "og:title", content: "Terms of Service | Trove" },
      {
        property: "og:description",
        content:
          "The terms that govern your use of the Trove store, including orders, shipping, returns and liability.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-5 py-5">
          <Link to="/" className="text-xl font-black tracking-tight">
            Trove<span className="text-primary">.</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 14, 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-xl font-bold">1. Agreement</h2>
            <p className="mt-3">
              These Terms of Service ("Terms") govern your access to and use of the Trove website at
              trove.example and your purchase of Trove products. By placing an order or using this
              site, you agree to these Terms. If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Products and Orders</h2>
            <p className="mt-3">
              We try to display product colors, features and prices as accurately as possible, but
              we cannot guarantee that your screen shows them exactly. All orders are subject to
              acceptance and availability. We reserve the right to limit quantities, cancel orders
              (with a full refund of any amount charged), or correct pricing errors at any time,
              even after an order is placed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Pricing and Payment</h2>
            <p className="mt-3">
              Prices are shown in U.S. dollars and are payable at checkout through our secure
              payment providers. Applicable sales tax is calculated at checkout. Promotional
              discounts, including our promotional codes, are limited-time offers that may end
              without notice and cannot be combined unless stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Shipping</h2>
            <p className="mt-3">
              Orders ship from our U.S. warehouse within 24 hours and typically arrive in 3–5
              business days. Shipping is free on orders over $50; otherwise standard shipping rates
              shown at checkout apply. Risk of loss passes to you upon delivery to the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Returns and 30-Day Guarantee</h2>
            <p className="mt-3">
              You may return any Trove product within 30 days of delivery for a full refund — no
              questions asked. Contact us at{" "}
              <a href="mailto:support@trove.example" className="font-medium text-primary underline">
                support@trove.example
              </a>{" "}
              to start a return. Refunds are issued to the original payment method within 5–10
              business days after we receive the returned item.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Product Safety</h2>
            <p className="mt-3">
              Products sold on Trove are general consumer goods. Always read and follow the
              manufacturer's instructions included with your item before use. If a product arrives
              damaged or defective, contact us within 30 days of delivery and we will make it right.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Intellectual Property</h2>
            <p className="mt-3">
              All content on this site — including the Trove name, logo, product photos and copy —
              is owned by Trove and may not be copied, reproduced or used without our written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">8. Limitation of Liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, Trove is not liable for indirect, incidental
              or consequential damages arising from your use of the site or products. Our total
              liability for any claim is limited to the amount you paid for the product giving rise
              to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">9. Governing Law</h2>
            <p className="mt-3">
              These Terms are governed by the laws of the State of Texas, USA, without regard to
              conflict-of-law principles. Any dispute will be resolved in the state or federal
              courts located in Travis County, Texas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">10. Changes and Contact</h2>
            <p className="mt-3">
              We may update these Terms from time to time; the date above shows the latest revision.
              Questions? Email{" "}
              <a href="mailto:support@trove.example" className="font-medium text-primary underline">
                support@trove.example
              </a>{" "}
              . Our support team typically responds within 24 hours (Mon-Fri).
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link to="/" className="font-semibold text-primary hover:underline">
            ← Back to store
          </Link>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground md:flex-row">
          <span>© 2026 Trove All rights reserved.</span>
          <nav className="flex gap-6">
            <Link to="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <a href="mailto:support@trove.example" className="hover:text-foreground">
              Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
