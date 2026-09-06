import SiteChrome from "@/components/SiteChrome";
import { ContentProvider } from "@/data/content";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <SiteChrome>{children}</SiteChrome>
    </ContentProvider>
  );
}