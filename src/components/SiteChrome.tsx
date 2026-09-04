"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EXCLUDED_PATHS = ["/login"];
const EXCLUDED_PREFIXES = ["/admin"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded =
    EXCLUDED_PATHS.includes(pathname) ||
    EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isExcluded) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
