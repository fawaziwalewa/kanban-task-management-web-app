"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = options[selectedIndex] || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const nextIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        onChange(options[nextIndex].value);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        onChange(options[prevIndex].value);
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      if (options.length > 0) onChange(options[0].value);
    } else if (e.key === "End") {
      e.preventDefault();
      if (options.length > 0) onChange(options[options.length - 1].value);
    }
  };

  return (
    <div className={`relative flex flex-col gap-2 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[12px] font-bold text-medium-grey dark:text-white">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full h-10 px-4 rounded border text-[13px] leading-[23px] font-medium flex items-center justify-between transition-colors text-left outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-primary
          bg-white dark:bg-dark-grey text-black-main dark:text-white
          ${isOpen
            ? "border-primary"
            : "border-medium-grey/25 hover:border-primary focus:border-primary"
          }`}
      >
        <span className="truncate">{selectedOption?.label || "Select an option"}</span>
        <div
          className={`transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <Icon name="chevron-down" />
        </div>
      </button>

      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          className="absolute top-[calc(100%+8px)] left-0 w-full z-50 p-4 rounded-lg flex flex-col gap-3 shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] bg-white dark:bg-very-dark-grey border border-medium-grey/10 animate-in fade-in-50 zoom-in-95 duration-150 focus:outline-none"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              className={`text-[13px] leading-[23px] font-medium text-left cursor-pointer transition-colors outline-none focus-visible:text-primary
                ${option.value === value
                  ? "text-primary font-bold"
                  : "text-medium-grey hover:text-black-main dark:hover:text-white"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
