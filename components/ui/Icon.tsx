"use client";

import Image from "next/image";

export type IconName =
  | "add-task-mobile"
  | "board"
  | "check"
  | "chevron-down"
  | "chevron-up"
  | "cross"
  | "dark-theme"
  | "hide-sidebar"
  | "light-theme"
  | "show-sidebar"
  | "vertical-ellipsis";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  alt?: string;
}

const iconDimensions: Record<IconName, { width: number; height: number }> = {
  "add-task-mobile": { width: 12, height: 12 },
  board: { width: 16, height: 16 },
  check: { width: 10, height: 8 },
  "chevron-down": { width: 10, height: 7 },
  "chevron-up": { width: 10, height: 7 },
  cross: { width: 15, height: 15 },
  "dark-theme": { width: 16, height: 16 },
  "hide-sidebar": { width: 18, height: 16 },
  "light-theme": { width: 19, height: 19 },
  "show-sidebar": { width: 16, height: 11 },
  "vertical-ellipsis": { width: 5, height: 20 },
};

export function Icon({ name, className = "", size, alt = "" }: IconProps) {
  const defaultDim = iconDimensions[name];
  const width = size || defaultDim.width;
  const height = size || defaultDim.height;

  return (
    <Image
      src={`/icon-${name}.svg`}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      width={width}
      height={height}
      className={`inline-block w-auto h-auto ${className}`}
    />
  );
}
