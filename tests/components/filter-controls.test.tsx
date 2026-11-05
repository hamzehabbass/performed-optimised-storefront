import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterControls } from "@/components/filter-controls";
import { DEFAULT_FILTERS } from "@/lib/filters";

describe("FilterControls", () => {
  it("exposes labelled, working category, rating and stock controls", () => {
    const onChange = vi.fn();
    render(
      <FilterControls
        filters={DEFAULT_FILTERS}
        idPrefix="test"
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Collection"), { target: { value: "beauty" } });
    fireEvent.change(screen.getByLabelText("Minimum rating"), { target: { value: "4" } });
    fireEvent.click(screen.getByLabelText("In stock only"));

    expect(onChange).toHaveBeenNthCalledWith(1, { category: "beauty" });
    expect(onChange).toHaveBeenNthCalledWith(2, { minRating: 4 });
    expect(onChange).toHaveBeenNthCalledWith(3, { inStock: true });
  });
});
