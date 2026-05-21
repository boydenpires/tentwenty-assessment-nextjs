"use client";

import clsx from "clsx";
import { useEffect, useRef, type RefObject } from "react";

export interface DropdownItem {
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  triggerRef?: RefObject<HTMLElement | null>;
  className?: string;
  onClose: () => void;
}

export default function Dropdown({
  items,
  triggerRef,
  className,
  onClose,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (triggerRef?.current?.contains(target)) return;
      onClose();
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, triggerRef]);

  return (
    <div
      ref={ref}
      role="menu"
      className={clsx(
        "absolute right-0 top-full bg-white rounded-lg shadow-card py-1",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.label}
          role="menuitem"
          type="button"
          onClick={() => {
            onClose();
            item.onClick?.();
          }}
          className={clsx(
            "w-full py-2 px-4 text-left leading-[150%] text-sm hover:bg-gray-50 transition-colors cursor-pointer",
            item.danger ? "text-red-600" : "text-gray-700",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
