import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OptionsMenu } from "../../components/modals/OptionsMenu";
import React from "react";

describe("OptionsMenu Component", () => {
  it("renders ellipsis trigger button with aria-haspopup and aria-label", () => {
    render(
      <OptionsMenu
        items={[
          { label: "Edit Task", onClick: () => {} },
          { label: "Delete Task", onClick: () => {} },
        ]}
        ariaLabel="Task options"
      />
    );

    const button = screen.getByRole("button", { name: "Task options" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-haspopup", "menu");
  });

  it("opens menu and handles edit and delete clicks", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <OptionsMenu
        items={[
          { label: "Edit Board", onClick: handleEdit },
          { label: "Delete Board", onClick: handleDelete, isDestructive: true },
        ]}
        ariaLabel="Board options"
      />
    );

    const trigger = screen.getByRole("button", { name: "Board options" });

    // Test Edit
    await user.click(trigger);
    const editBtn = screen.getByRole("menuitem", { name: "Edit Board" });
    await user.click(editBtn);
    expect(handleEdit).toHaveBeenCalledTimes(1);

    // Test Delete after reopening
    await user.click(trigger);
    const deleteBtn = screen.getByRole("menuitem", { name: "Delete Board" });
    await user.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
