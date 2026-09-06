import SiteChrome from "@/components/SiteChrome";
import VisitTracker from "@/components/VisitTracker";
import { ContentProvider } from "@/data/content";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <SiteChrome>{children}</SiteChrome>
      <VisitTracker />
    </ContentProvider>
  );
}