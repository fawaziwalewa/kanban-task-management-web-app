"use client";

import { useId } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  id,
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <label
      htmlFor={inputId}
      className={`group flex items-center gap-4 p-3 rounded transition-colors cursor-pointer select-none
        bg-light-grey dark:bg-very-dark-grey hover:bg-primary/25 dark:hover:bg-primary/25
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={`w-4 h-4 rounded-xs flex items-center justify-center transition-colors shrink-0
          ${checked
            ? "bg-primary"
            : "bg-white dark:bg-dark-grey border border-medium-grey/25"
          }`}
      >
        {checked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.27588 3.06593L3.65651 5.44656L8.72239 0.380676"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-[12px] font-bold leading-3.75 transition-colors ${checked
            ? "line-through text-black-main/50 dark:text-white/50"
            : "text-black-main dark:text-white"
          }`}
      >
        {label}
      </span>
    </label>
  );
}
