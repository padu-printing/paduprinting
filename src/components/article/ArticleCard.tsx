import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";

interface ArticleCardProps {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage: string;
  author: string;
  date: string;
  readTime: number;
  coverClassName?: string;
  showExcerpt?: boolean;
  compact?: boolean;
}

export default function ArticleCard({
  slug,
  title,
  category,
  excerpt,
  coverImage,
  author,
  date,
  readTime,
  coverClassName = "aspect-[16/10]",
  showExcerpt = true,
  compact = false,
}: ArticleCardProps) {
  return (
    <Link
      href={`/artikel/${slug}`}
      className="group flex flex-col overflow-hidden rounded-[14px] bg-white ring-1 ring-[#EEEEF0] transition-shadow hover:shadow-[0_10px_30px_rgba(17,24,39,0.08)]"
    >
      <div className={`relative ${coverClassName} overflow-hidden bg-[#F3F3F5]`}>
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-col ${compact ? "p-4" : "p-5"} flex-1`}>
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B2C91]">
          {category}
        </span>
        <h3
          className={`mt-2 font-bold leading-snug text-[#1A2340] transition-colors group-hover:text-[#6B2C91] line-clamp-2 ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          {title}
        </h3>
        {showExcerpt && (
          <p className="mt-2 text-sm leading-relaxed text-[#52525B] line-clamp-2">{excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-3 text-xs text-[#A1A1AA]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
        </div>
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6B2C91]">
          Baca
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}