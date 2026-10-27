import { Link } from "@tanstack/react-router";
import { Lock, ShieldCheck } from "lucide-react";

import { BUSINESS_NAME, STORE_DOMAIN, SUPPORT_EMAIL, SITE_URL } from "@/lib/support";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-2xl font-black font-display tracking-tight">
              Trove<span className="text-primary">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The internet's most-wanted finds, hand-picked and delivered to your door.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" /> SSL Secure Checkout
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Buyer Protection
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" hash="shop" className="text-muted-foreground hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/" hash="shop" className="text-muted-foreground hover:text-primary">
                  Gadgets & Tech
                </Link>
              </li>
              <li>
                <Link to="/" hash="shop" className="text-muted-foreground hover:text-primary">
                  Beauty & Style
                </Link>
              </li>
              <li>
                <Link to="/" hash="shop" className="text-muted-foreground hover:text-primary">
                  Smart Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Support</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/account" className="text-muted-foreground hover:text-primary">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-primary">
                  Ops Dashboard (demo)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="break-all text-muted-foreground hover:text-primary"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <Link to="/refund" className="text-muted-foreground hover:text-primary">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BUSINESS_NAME} — fictional portfolio demo.{" "}
          <a href={SITE_URL} className="hover:text-primary">
            {STORE_DOMAIN}
          </a>
        </div>
      </div>
    </footer>
  );
}
