"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Tags,
  Newspaper,
  BookMarked,
  Images,
  ShieldCheck,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { createClient } from "@/lib/supabase/client";

type Range = 7 | 30 | 90;

type DailyPoint = { key: string; label: string; Kunjungan: number; "Pengunjung unik": number };

function localKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayLabel(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(d);
}

function buildDays(range: Range): DailyPoint[] {
  const days: DailyPoint[] = [];
  const today = new Date();
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ key: localKey(d), label: dayLabel(d), Kunjungan: 0, "Pengunjung unik": 0 });
  }
  return days;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  const [range, setRange] = useState<Range>(30);
  const [chartData, setChartData] = useState<DailyPoint[]>([]);
  const [topPaths, setTopPaths] = useState<{ path: string; count: number }[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalUnique, setTotalUnique] = useState(0);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const tables = ["products", "categories", "articles", "article_categories", "gallery_items", "trusted_brands", "faqs"];
      const result: Record<string, number> = {};
      for (const t of tables) {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        result[t] = count ?? 0;
      }
      setCounts(result);
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setAnalyticsReady(false);
      const supabase = createClient();
      const start = new Date();
      start.setDate(start.getDate() - (range - 1));
      start.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("pageviews")
        .select("visitor_id, path, created_at")
        .gte("created_at", start.toISOString())
        .order("created_at", { ascending: true })
        .limit(20000);

      if (cancelled) return;

      const days = buildDays(range);
      const byKey = new Map(days.map((d) => [d.key, d]));
      const uniques = new Map<string, Set<string>>();
      const paths = new Map<string, number>();
      const allVisitors = new Set<string>();

      if (data && !error) {
        for (const row of data as { visitor_id: string; path: string; created_at: string }[]) {
          const d = new Date(row.created_at);
          const key = localKey(d);
          const point = byKey.get(key);
          if (point) {
            point.Kunjungan += 1;
            let set = uniques.get(key);
            if (!set) {
              set = new Set();
              uniques.set(key, set);
            }
            set.add(row.visitor_id);
          }
          allVisitors.add(row.visitor_id);
          const clean = row.path || "/";
          paths.set(clean, (paths.get(clean) ?? 0) + 1);
        }
        for (const [key, set] of uniques) {
          const point = byKey.get(key);
          if (point) point["Pengunjung unik"] = set.size;
        }
      }

      if (cancelled) return;
      setChartData(days);
      setTotalVisits((data ?? []).length);
      setTotalUnique(allVisitors.size);
      setTopPaths(
        [...paths.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([path, count]) => ({ path, count }))
      );
      setHasData((data?.length ?? 0) > 0);
      setAnalyticsReady(true);
    }

    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const cards = [
    { key: "products", label: "Produk", icon: Package, href: "/admin/products" },
    { key: "categories", label: "Kategori", icon: Tags, href: "/admin/categories" },
    { key: "articles", label: "Artikel", icon: Newspaper, href: "/admin/articles" },
    { key: "article_categories", label: "Kategori Artikel", icon: BookMarked, href: "/admin/article-categories" },
    { key: "gallery_items", label: "Galeri Hasil Cetak", icon: Images, href: "/admin/gallery" },
    { key: "trusted_brands", label: "Dipercaya Oleh", icon: ShieldCheck, href: "/admin/trusted-brands" },
    { key: "faqs", label: "FAQ", icon: HelpCircle, href: "/admin/faqs" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A2340]">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Kelola konten website PADU Printing dari sini.
      </p>

      {/* Grafik kunjungan */}
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#6B2C91]" />
              <h2 className="text-lg font-bold text-[#1A2340]">Kunjungan Website</h2>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">
              Total kunjungan & pengunjung unik per hari.
            </p>
          </div>
          <div className="flex overflow-hidden rounded-xl border border-neutral-200">
            {([7, 30, 90] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  range === r
                    ? "bg-[#6B2C91] text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {r} hari
              </button>
            ))}
          </div>
        </div>

        {analyticsReady && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-medium text-neutral-500">Kunjungan</p>
              <p className="mt-1 text-2xl font-bold text-[#1A2340]">{totalVisits}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-medium text-neutral-500">Pengunjung Unik</p>
              <p className="mt-1 text-2xl font-bold text-[#1A2340]">{totalUnique}</p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-medium text-neutral-500">Rata-rata / Hari</p>
              <p className="mt-1 text-2xl font-bold text-[#1A2340]">
                {(totalVisits / range).toFixed(1)}
              </p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-medium text-neutral-500">Halaman Dikunjungi</p>
              <p className="mt-1 text-2xl font-bold text-[#1A2340]">{topPaths.length}</p>
            </div>
          </div>
        )}

        {analyticsReady && hasData ? (
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#71717A" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E4E4E7" }}
                  interval="preserveStartEnd"
                  minTickGap={28}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#71717A" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(107,44,145,0.06)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E4E4E7",
                    fontSize: 13,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Kunjungan" fill="#6B2C91" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar
                  dataKey="Pengunjung unik"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          analyticsReady &&
          !hasData && (
            <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <p className="text-sm text-neutral-500">
                Belum ada data kunjungan. Data mulai tercatat otomatis setiap pengunjung
                membuka halaman website.
              </p>
            </div>
          )
        )}

        {analyticsReady && hasData && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[#1A2340]">Halaman Terpopuler</h3>
            <div className="mt-3 space-y-2">
              {topPaths.map((p) => (
                <div
                  key={p.path}
                  className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-2.5"
                >
                  <span className="truncate font-mono text-sm text-neutral-700">
                    {p.path === "/" ? "/ (Beranda)" : p.path}
                  </span>
                  <span className="ml-4 shrink-0 rounded-full bg-[#6B2C91]/10 px-2.5 py-0.5 text-xs font-semibold text-[#6B2C91]">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6B2C91]/10 text-[#6B2C91]">
              <c.icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-3xl font-bold text-[#1A2340]">
              {loaded ? (counts[c.key] ?? 0) : "..."}
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-600">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}