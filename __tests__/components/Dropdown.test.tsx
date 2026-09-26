import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "../../components/ui/Dropdown";
import React from "react";

describe("Dropdown Component Accessibility and Navigation", () => {
  const options = [
    { label: "Todo", value: "Todo" },
    { label: "Doing", value: "Doing" },
    { label: "Done", value: "Done" },
  ];

  it("renders trigger button with current selected value", () => {
    render(
      <Dropdown
        label="Status"
        options={options}
        value="Todo"
        onChange={() => {}}
      />
    );

    expect(screen.getByText("Status")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /todo/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("opens listbox when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        label="Status"
        options={options}
        value="Todo"
        onChange={() => {}}
      />
    );

    const button = screen.getByRole("button", { name: /todo/i });
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  it("selects an option on click and calls onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Dropdown
        label="Status"
        options={options}
        value="Todo"
        onChange={handleChange}
      />
    );

    const button = screen.getByRole("button", { name: /todo/i });
    await user.click(button);

    const doingOption = screen.getByRole("option", { name: "Doing" });
    await user.click(doingOption);

    expect(handleChange).toHaveBeenCalledWith("Doing");
  });

  it("navigates options via keyboard ArrowDown / ArrowUp", () => {
    const handleChange = vi.fn();
    render(
      <Dropdown
        label="Status"
        options={options}
        value="Todo"
        onChange={handleChange}
      />
    );

    const button = screen.getByRole("button", { name: /todo/i });
    // First arrow down opens dropdown
    fireEvent.keyDown(button, { key: "ArrowDown" });
    expect(button).toHaveAttribute("aria-expanded", "true");

    // Second arrow down changes to next option
    fireEvent.keyDown(button, { key: "ArrowDown" });
    expect(handleChange).toHaveBeenCalledWith("Doing");
  });
});
