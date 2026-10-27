import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Privacy Policy | Trove" },
      {
        name: "description",
        content:
          "How Trove collects, uses and protects your personal information, including cookies, checkout data and your privacy rights.",
      },
      { property: "og:title", content: "Privacy Policy | Trove" },
      {
        property: "og:description",
        content:
          "How Trove collects, uses and protects your personal information, including cookies, checkout data and your privacy rights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
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
        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 14, 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-xl font-bold">1. Overview</h2>
            <p className="mt-3">
              Trove ("we", "us") respects your privacy. This policy explains what personal
              information we collect when you visit our store at trove.example or place an order,
              how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Information We Collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Order information:</strong> name, email, shipping address and phone number
                when you check out.
              </li>
              <li>
                <strong>Payment details:</strong> handled entirely by our payment providers — we
                never see or store your full card number.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, device and browser type, and approximate
                location, collected through cookies and similar technologies.
              </li>
              <li>
                <strong>Communications:</strong> messages you send to support and your email address
                if you contact us.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. How We Use Your Information</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>To process and ship your orders and handle returns and refunds.</li>
              <li>To provide customer support and respond to your questions.</li>
              <li>To improve our store, product pages and marketing.</li>
              <li>
                To send order confirmations and shipping updates. Marketing emails are only sent
                with your consent, and every one includes an unsubscribe link.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. Sharing</h2>
            <p className="mt-3">
              We share information only with service providers who help us run the store — payment
              processors, our commerce platform, shipping carriers and analytics tools — each under
              their own privacy safeguards. We do not sell your personal information. We may
              disclose it if required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. Cookies</h2>
            <p className="mt-3">
              We use essential cookies to keep the store working (for example, remembering your
              cart) and optional analytics cookies to understand how visitors use the site. You can
              block or delete cookies in your browser settings; the store will still work, though
              some features may be limited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Data Retention</h2>
            <p className="mt-3">
              We keep order records for as long as needed for accounting, tax and legal purposes,
              and delete other personal information when it is no longer necessary for the purposes
              above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Your Rights</h2>
            <p className="mt-3">
              You can request a copy of the personal information we hold about you, ask us to
              correct or delete it, or object to marketing emails at any time. Residents of states
              with consumer privacy laws (such as California) may have additional rights. To
              exercise any of these, email{" "}
              <a href="mailto:support@trove.example" className="font-medium text-primary underline">
                support@trove.example
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">8. Security</h2>
            <p className="mt-3">
              Our store uses 256-bit SSL encryption in transit, and access to customer data is
              restricted to trained team members who need it to serve you. No method of transmission
              is 100% secure, but we work hard to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">9. Changes</h2>
            <p className="mt-3">
              We may update this policy as our store evolves; the date above shows the latest
              revision. Questions about privacy? Email{" "}
              <a href="mailto:support@trove.example" className="font-medium text-primary underline">
                support@trove.example
              </a>
              .
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
