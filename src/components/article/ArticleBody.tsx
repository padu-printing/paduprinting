import type { TocHeading } from "@/lib/article";
import { addHeadingIds } from "@/lib/article";

export default function ArticleBody({
  content,
  headings,
}: {
  content: string;
  headings: TocHeading[];
}) {
  const html = addHeadingIds(content, headings);

  return (
    <div
      className={[
        "article-content",
        "text-[#3F3F46]",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#1A2340] [&_h2]:sm:text-[28px]",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-28 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1A2340]",
        "[&_p]:mb-5 [&_p]:text-[17px] [&_p]:leading-[1.85]",
        "[&_strong]:font-semibold [&_strong]:text-[#1A2340]",
        "[&_a]:text-[#6B2C91] [&_a]:underline [&_a]:decoration-[#6B2C91]/30 hover:[&_a]:decoration-[#6B2C91]",
        "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2.5",
        "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2.5",
        "[&_li]:text-[#52525B] [&_li_p]:mb-0 [&_li_p]:text-inherit",
        "[&_blockquote]:my-6 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-[#6B2C91] [&_blockquote]:bg-[#FAFAFA] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:text-[#52525B]",
        "[&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#EEEEF0]",
        "[&_img]:rounded-[14px]",
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
