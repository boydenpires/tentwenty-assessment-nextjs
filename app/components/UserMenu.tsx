"use client";

import { useRef, useState } from "react";
import Dropdown from "@/app/components/Dropdown";

interface UserMenuProps {
  name: string;
  onLogout: () => void;
}

export default function UserMenu({ name, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[16px] font-medium leading-[150%] text-gray-500 transition-colors cursor-pointer hover:text-gray-700"
      >
        {name}
        <span className="material-symbols-outlined text-[20px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <Dropdown
          className="mt-2 w-40 border border-gray-200 z-50"
          triggerRef={triggerRef}
          onClose={() => setOpen(false)}
          items={[{ label: "Log out", onClick: onLogout, danger: true }]}
        />
      )}
    </div>
  );
}
