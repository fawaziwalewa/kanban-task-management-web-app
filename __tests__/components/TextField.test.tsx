import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextField, TextArea } from "../../components/ui/TextField";
import React from "react";

describe("TextField and TextArea Accessibility", () => {
  it("renders TextField with label and accessible input associations", () => {
    render(
      <TextField
        id="task-title"
        label="Title"
        placeholder="e.g. Plan sprint"
      />
    );

    const input = screen.getByLabelText("Title");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "e.g. Plan sprint");
  });

  it("renders TextField with error state, aria-invalid, and role alert", () => {
    render(
      <TextField
        id="task-title"
        label="Title"
        error={true}
        errorMessage="Can't be empty"
      />
    );

    const input = screen.getByLabelText("Title");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorAlert = screen.getByRole("alert");
    expect(errorAlert).toHaveTextContent("Can't be empty");
    expect(input).toHaveAttribute("aria-describedby", "task-title-error");
  });

  it("renders TextArea with error state and aria-describedby", () => {
    render(
      <TextArea
        id="task-desc"
        label="Description"
        error="Invalid length"
      />
    );

    const textarea = screen.getByLabelText("Description");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    const errorAlert = screen.getByRole("alert");
    expect(errorAlert).toHaveTextContent("Invalid length");
    expect(textarea).toHaveAttribute("aria-describedby", "task-desc-error");
  });
});
