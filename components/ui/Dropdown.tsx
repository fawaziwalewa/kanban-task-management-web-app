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

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

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
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
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
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full h-10 px-4 rounded border text-[13px] leading-[23px] font-medium flex items-center justify-between transition-colors text-left outline-none cursor-pointer
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
          role="listbox"
          className="absolute top-[calc(100%+8px)] left-0 w-full z-50 p-4 rounded-lg flex flex-col gap-3 shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] bg-white dark:bg-very-dark-grey border border-medium-grey/10 animate-in fade-in-50 zoom-in-95 duration-150"
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
              }}
              className={`text-[13px] leading-[23px] font-medium text-left cursor-pointer transition-colors outline-none
                ${option.value === value
                  ? "text-black-main dark:text-white font-bold"
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
