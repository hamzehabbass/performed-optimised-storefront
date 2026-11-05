import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/lib/validation";

describe("demo checkout validation", () => {
  it("accepts a complete order without any payment details", () => {
    expect(checkoutSchema.safeParse({
      fullName: "Sam Taylor",
      email: "sam@example.com",
      phone: "+1 555 0100",
      address: "123 Example Street",
      city: "Portland",
      country: "United States",
      shippingMethod: "standard",
    }).success).toBe(true);
  });

  it("rejects incomplete contact and delivery details", () => {
    const result = checkoutSchema.safeParse({
      fullName: "A",
      email: "not-an-email",
      phone: "",
      address: "road",
      city: "",
      country: "",
      shippingMethod: "same-day",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["fullName", "email", "phone", "address", "city", "country", "shippingMethod"]),
      );
    }
  });
});
