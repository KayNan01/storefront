import { describe, expect, it } from "vitest";
import { passwordStrength } from "@/lib/password-strength";

describe("passwordStrength", () => {
  it("short passwords are weak", () => expect(passwordStrength("Ab1!").label).toBe("Weak"));
  it("single character kind is weak", () =>
    expect(passwordStrength("abcdefghij").label).toBe("Weak"));
  it("8+ chars with two kinds is medium", () =>
    expect(passwordStrength("abcdefg1").label).toBe("Medium"));
  it("12+ chars with three kinds is strong", () =>
    expect(passwordStrength("Abcdefghij12").label).toBe("Strong"));
});
