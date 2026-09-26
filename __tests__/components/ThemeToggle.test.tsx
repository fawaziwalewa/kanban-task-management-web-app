import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import React from "react";

describe("ThemeToggle Component", () => {
  it("renders switch button with aria-label and toggles theme", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const switchBtn = screen.getByRole("switch", { name: "Toggle dark mode" });
    expect(switchBtn).toBeInTheDocument();

    const initialChecked = switchBtn.getAttribute("aria-checked") === "true";
    await user.click(switchBtn);

    const updatedChecked = switchBtn.getAttribute("aria-checked") === "true";
    expect(updatedChecked).toBe(!initialChecked);
  });
});
