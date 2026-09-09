import type { Metadata } from "next";
import { Suspense } from "react";
import EventScanClient from "./EventScanClient";

export const metadata: Metadata = {
  title: "Verifikasi",
  robots: { index: false, follow: false, nocache: true },
};

export default function EventPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-neutral-500">Memuat...</p>}>
      <EventScanClient />
    </Suspense>
  );
}