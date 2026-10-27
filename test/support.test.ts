import { describe, expect, it } from "vitest";
import { BUSINESS_NAME, STORE_DOMAIN, SUPPORT_EMAIL, contactEmailUrl } from "@/lib/support";

describe("Store identity defaults", () => {
  it("sends contact drafts to the fictional support inbox", () => {
    const url = contactEmailUrl({
      name: "Customer",
      email: "customer@example.com",
      subject: "Order",
      message: "Please help with my order.",
    });
    expect(url.split("?")[0]).toBe("mailto:support@trove.example");
    expect(SUPPORT_EMAIL).toBe("support@trove.example");
    expect(new URLSearchParams(url.split("?")[1]).get("body")).toContain(
      "Please help with my order.",
    );
  });
  it("uses a reserved example domain", () => {
    expect(STORE_DOMAIN).toBe("trove.example");
  });
  it("uses the fictional brand name", () => {
    expect(BUSINESS_NAME).toBe("Trove");
  });
});
