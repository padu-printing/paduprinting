export function readTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function shortDate(date: string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export interface TocHeading {
  id: string;
  level: number;
  text: string;
}

export function extractHeadings(content: string): TocHeading[] {
  return content
    .split("\n")
    .map((line) => {
      const m = line.trim().match(/^(#{2,3})\s+(.+)$/);
      if (!m) return null;
      const text = m[2].trim();
      return {
        id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        level: m[1].length,
        text,
      };
    })
    .filter((h): h is TocHeading => h !== null)
    .map((h, i) => ({ ...h, id: h.id || `section-${i}` }));
}