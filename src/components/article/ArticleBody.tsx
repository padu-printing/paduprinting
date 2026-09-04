import type { ReactNode } from "react";
import type { TocHeading } from "@/lib/article";

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: { n: number; text: string }[] };

export default function ArticleBody({
  content,
  headings,
}: {
  content: string;
  headings: TocHeading[];
}) {
  const blocks = parseBlocks(content);

  const idFor = (text: string) => {
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const match = headings.find((h) => h.id === base || h.text === text);
    return match ? match.id : base;
  };

  return (
    <div>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={idFor(b.text)}
                className="mt-12 mb-4 scroll-mt-28 text-2xl font-extrabold text-[#1A2340] sm:text-[28px]"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                id={idFor(b.text)}
                className="mt-8 mb-3 scroll-mt-28 text-xl font-bold text-[#1A2340]"
              >
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mb-5 text-[17px] leading-[1.85] text-[#3F3F46]">
                {inline(b.text)}
              </p>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-6 rounded-r-lg border-l-4 border-[#6B2C91] bg-[#FAFAFA] px-5 py-4 text-lg italic text-[#52525B]"
              >
                {b.text}
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i} className="my-5 space-y-2.5">
                {b.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[#52525B]">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B2C91]" />
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-5 space-y-2.5">
                {b.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-[#52525B]">
                    <span className="mt-0.5 shrink-0 text-sm font-bold text-[#6B2C91]">
                      {item.n}.
                    </span>
                    <span>{inline(item.text)}</span>
                  </li>
                ))}
              </ol>
            );
        }
      })}
    </div>
  );
}

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let ulItems: string[] = [];
  let olItems: { n: number; text: string }[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  };
  const flushUl = () => {
    if (ulItems.length) {
      blocks.push({ type: "ul", items: ulItems });
      ulItems = [];
    }
  };
  const flushOl = () => {
    if (olItems.length) {
      blocks.push({ type: "ol", items: olItems });
      olItems = [];
    }
  };

  for (const raw of lines) {
    const t = raw.trim();
    if (!t) {
      flushPara();
      flushUl();
      flushOl();
      continue;
    }
    if (t.startsWith("## ")) { flushPara(); flushUl(); flushOl(); blocks.push({ type: "h2", text: t.replace("## ", "") }); continue; }
    if (t.startsWith("### ")) { flushPara(); flushUl(); flushOl(); blocks.push({ type: "h3", text: t.replace("### ", "") }); continue; }
    if (t.startsWith("> ")) { flushPara(); flushUl(); flushOl(); blocks.push({ type: "quote", text: t.replace("> ", "") }); continue; }
    if (t.startsWith("- ")) { flushPara(); flushOl(); ulItems.push(t.replace("- ", "")); continue; }
    const om = t.match(/^(\d+)\.\s+(.*)$/);
    if (om) { flushPara(); flushUl(); olItems.push({ n: Number(om[1]), text: om[2] }); continue; }
    flushUl();
    flushOl();
    para.push(t);
  }
  flushPara();
  flushUl();
  flushOl();
  return blocks;
}

function inline(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#1A2340]">
        {part}
      </strong>
    ) : (
      part
    )
  );
}