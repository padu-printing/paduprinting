export function readTime(content: string): number {
  const plain = content.replace(/<[^>]*>/g, " ").trim();
  const words = plain.split(/\s+/).filter(Boolean).length;
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
  const headings: TocHeading[] = [];
  const regex = /<h([23])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = Number(match[1]);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    if (!text) continue;
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    headings.push({ id, level, text });
  }
  return headings;
}

export function addHeadingIds(html: string, headings: TocHeading[]): string {
  const headingMap = new Map<string, TocHeading>();
  for (const h of headings) {
    headingMap.set(h.text, h);
  }

  return html.replace(
    /<h([23])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (fullMatch, level, inner) => {
      const text = inner.replace(/<[^>]*>/g, "").trim();
      const h = headingMap.get(text);
      if (!h) return fullMatch;
      if (/id=/.test(fullMatch)) return fullMatch;
      return fullMatch.replace(/<h([23])/, `<h$1 id="${h.id}"`);
    }
  );
}