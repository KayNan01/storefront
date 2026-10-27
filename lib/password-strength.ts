export type Strength = { score: 0 | 1 | 2 | 3; label: "" | "Weak" | "Medium" | "Strong" };

/** Weak: under 8 chars or only one kind of character. Strong: 12+ chars with 3+ kinds. */
export function passwordStrength(pw: string): Strength {
  if (!pw) return { score: 0, label: "" };
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
  if (pw.length < 8 || kinds < 2) return { score: 1, label: "Weak" };
  if (pw.length >= 12 && kinds >= 3) return { score: 3, label: "Strong" };
  return { score: 2, label: "Medium" };
}
