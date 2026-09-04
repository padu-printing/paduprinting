"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";
import type { TocHeading } from "@/lib/article";

export default function ArticleToc({ headings }: { headings: TocHeading[] }) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  return (
    <div className="rounded-[14px] border border-[#EEEEF0] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 lg:pointer-events-none lg:cursor-default"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-base font-extrabold text-[#1A2340]">
          <List className="h-4 w-4 text-[#6B2C91]" />
          Daftar Isi
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#A1A1AA] transition-transform lg:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div className={`px-3 pb-4 ${open ? "block" : "hidden"} lg:block`}>
        <nav className="border-t border-[#F0F0F2] pt-3">
          <ol className="space-y-1">
            {headings.map((h, i) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={`flex items-start gap-2 rounded-lg px-3 py-1.5 text-sm text-[#52525B] transition-colors hover:bg-[#FAFAFA] hover:text-[#6B2C91] ${
                    h.level === 3 ? "ml-4 text-[13px]" : "font-medium text-[#1A2340]"
                  }`}
                >
                  <span className="text-[#A1A1AA]">{i + 1}.</span>
                  <span className="line-clamp-1">{h.text}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}