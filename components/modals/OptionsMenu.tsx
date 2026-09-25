"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "../ui/Icon";

export interface OptionMenuItem {
  label: string;
  onClick: () => void;
  isDestructive?: boolean;
}

interface OptionsMenuProps {
  items: OptionMenuItem[];
  triggerClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export function OptionsMenu({
  items,
  triggerClassName = "",
  menuClassName = "",
  disabled = false,
  ariaLabel = "Options menu",
}: OptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-2 rounded hover:bg-light-grey dark:hover:bg-very-dark-grey transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-medium-grey hover:text-black-main dark:hover:text-white flex items-center justify-center outline-none ${triggerClassName}`}
      >
        <Icon name="vertical-ellipsis" />
      </button>

      {isOpen && (
        <div
          className={`absolute top-[calc(100%+8px)] sm:top-[calc(100%+16px)] right-0 z-50 w-48 p-4 rounded-lg bg-white dark:bg-very-dark-grey shadow-[0px_10px_20px_0px_rgba(54,78,126,0.25)] border border-medium-grey/10 flex flex-col gap-4 animate-in fade-in-50 zoom-in-95 duration-150 ${menuClassName}`}
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={`text-[13px] leading-[23px] font-medium text-left cursor-pointer transition-colors outline-none
                ${item.isDestructive
                  ? "text-destructive hover:opacity-80 font-bold"
                  : "text-medium-grey hover:text-black-main dark:hover:text-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
