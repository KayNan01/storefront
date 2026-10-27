import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { toast } from "sonner";

import { useDemoStore } from "@/stores/demoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "@/components/trove/PasswordStrength";
import { passwordStrength } from "@/lib/password-strength";
import mockData from "@/data/mockData.json";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Sign in — Trove" },
      {
        name: "description",
        content: "Sign in to the Trove demo account to see orders, profile and favorites.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Sign in — Trove" },
      { property: "og:description", content: "Access the Trove demo account." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const signIn = useDemoStore((s) => s.signIn);
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const finish = (mail: string, displayName?: string) => {
    signIn(mail, displayName);
    toast.success(mode === "signup" ? "Demo account created" : "Welcome back!");
    navigate({ to: "/account" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    finish(email, mode === "signup" ? name : undefined);
  };

  const useDemo = () => finish(mockData.customer.email, mockData.customer.name);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-secondary px-4">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-96 w-96 animate-pulse rounded-full bg-accent/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="fade-up relative w-full max-w-sm rounded-3xl border bg-card p-8 shadow-elevated">
        <Link to="/" className="text-2xl font-black font-display tracking-tight">
          Trove<span className="text-primary">.</span>
        </Link>
        <h1 className="mt-6 text-2xl font-black">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track orders, save favorites and check out faster.
        </p>

        <div className="mt-4 flex gap-2 rounded-xl bg-accent/20 p-3 text-xs">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Demo mode: sign-in is simulated and stays in this browser. Any email and password work —
            nothing is sent or stored on a server.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              minLength={mode === "signup" ? 8 : 1}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === "signup" && <PasswordStrength password={password} />}
          </div>
          <Button
            type="submit"
            disabled={mode === "signup" && passwordStrength(password).score < 2}
            className="w-full rounded-full"
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <Button variant="outline" onClick={useDemo} className="mt-3 w-full rounded-full">
          Continue as demo customer
        </Button>
        <div className="mt-5 text-center text-sm">
          {mode === "signin" ? (
            <p>
              New to Trove?{" "}
              <button className="font-semibold text-primary" onClick={() => setMode("signup")}>
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button className="font-semibold text-primary" onClick={() => setMode("signin")}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
