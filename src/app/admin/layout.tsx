"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Newspaper,
  BookMarked,
  Images,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/categories", label: "Kategori", icon: Tags },
  { href: "/admin/articles", label: "Artikel", icon: Newspaper },
  { href: "/admin/article-categories", label: "Kategori Artikel", icon: BookMarked },
  { href: "/admin/gallery", label: "Galeri Hasil Cetak", icon: Images },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-svh overflow-hidden bg-neutral-100">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="flex h-16 shrink-0 items-center border-b border-neutral-200 px-5">
          <img src="/logo-horizontal.png" alt="PADU Printing Admin" className="h-full max-h-16 w-auto py-2 object-contain" />
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#6B2C91] text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="my-2 border-t border-neutral-200" />
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            <ExternalLink className="h-4 w-4" />
            Lihat Website
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
