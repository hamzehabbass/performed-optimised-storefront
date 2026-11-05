import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckoutForm } from "@/components/checkout-form";
import { products } from "@/lib/catalog";
import { useCartStore } from "@/stores/cart-store";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  cleanup();
});

beforeEach(async () => {
  localStorage.clear();
  await useCartStore.persist.rehydrate();
  useCartStore.setState({ items: [], announcement: "" });
  push.mockClear();
});

describe("CheckoutForm", () => {
  it("announces field errors, links them to inputs and focuses the first invalid field", async () => {
    const product = products.find((item) => item.stock > 0)!;
    useCartStore.getState().addItem(product);
    const user = userEvent.setup();
    render(<CheckoutForm />);

    await screen.findByRole("button", { name: /Place demo order/i });
    await user.click(screen.getByRole("button", { name: /Place demo order/i }));

    const nameInput = screen.getByLabelText(/^Full name/);
    await waitFor(() => expect(nameInput).toHaveFocus());
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby", "fullName-error");
    expect(screen.getByText("Enter your full name.")).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });
});
