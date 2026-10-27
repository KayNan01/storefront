import { passwordStrength } from "@/lib/password-strength";

const COLORS = ["bg-muted", "bg-destructive", "bg-star", "bg-primary"];

export function PasswordStrength({ password }: { password: string }) {
  const { score, label } = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="space-y-1" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? COLORS[score] : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength: <span className="font-semibold text-foreground">{label}</span>
        {score === 1 && " — use 8+ characters mixing letters, numbers or symbols"}
      </p>
    </div>
  );
}
