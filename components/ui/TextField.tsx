"use client";

import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  errorMessage?: string;
  containerClassName?: string;
}

export function TextField({
  label,
  error,
  errorMessage = "Can't be empty",
  containerClassName = "",
  className = "",
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const isError = Boolean(error);
  const displayErrorText = typeof error === "string" ? error : isError ? errorMessage : null;

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-bold text-medium-grey dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          aria-invalid={isError ? "true" : undefined}
          aria-describedby={isError && displayErrorText ? errorId : undefined}
          className={`w-full h-10 px-4 rounded border text-[13px] leading-[23px] font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary
            bg-white dark:bg-dark-grey text-black-main dark:text-white placeholder:text-black-main/25 dark:placeholder:text-white/25
            ${isError
              ? "border-destructive pr-32"
              : "border-medium-grey/25 hover:border-primary focus:border-primary"
            }
            ${className}`}
          {...props}
        />
        {isError && displayErrorText && (
          <span
            id={errorId}
            role="alert"
            className="absolute right-4 text-[13px] leading-[23px] font-medium text-destructive pointer-events-none select-none"
          >
            {displayErrorText}
          </span>
        )}
      </div>
    </div>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | boolean;
  errorMessage?: string;
  containerClassName?: string;
}

export function TextArea({
  label,
  error,
  errorMessage = "Can't be empty",
  containerClassName = "",
  className = "",
  id,
  rows = 4,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const isError = Boolean(error);
  const displayErrorText = typeof error === "string" ? error : isError ? errorMessage : null;

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-bold text-medium-grey dark:text-white"
        >
          {label}
        </label>
      )}
      <div className="relative flex flex-col">
        <textarea
          id={inputId}
          rows={rows}
          aria-invalid={isError ? "true" : undefined}
          aria-describedby={isError && displayErrorText ? errorId : undefined}
          className={`w-full p-4 rounded border text-[13px] leading-[23px] font-medium transition-colors outline-none resize-none focus-visible:ring-1 focus-visible:ring-primary
            bg-white dark:bg-dark-grey text-black-main dark:text-white placeholder:text-black-main/25 dark:placeholder:text-white/25
            ${isError
              ? "border-destructive"
              : "border-medium-grey/25 hover:border-primary focus:border-primary"
            }
            ${className}`}
          {...props}
        />
        {isError && displayErrorText && (
          <span
            id={errorId}
            role="alert"
            className="mt-1 text-[13px] leading-5.75 font-medium text-destructive self-end"
          >
            {displayErrorText}
          </span>
        )}
      </div>
    </div>
  );
}
