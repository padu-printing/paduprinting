"use client";

import { useEffect } from "react";

const VISITOR_COOKIE = "pp_visitor";
const COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

function getOrCreateVisitorId(): string {
  const existing = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${VISITOR_COOKIE}=`));
  if (existing) return existing.split("=")[1];
  const id = crypto.randomUUID();
  document.cookie = `${VISITOR_COOKIE}=${id}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  return id;
}

export default function VisitTracker() {
  useEffect(() => {
    try {
      if (window.location.hostname !== "www.paduprinting.com") return;

      const visitorId = getOrCreateVisitorId();
      const payload = JSON.stringify({
        visitorId,
        path: window.location.pathname,
        referrer: document.referrer.slice(0, 500),
      });
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" })
      );
    } catch {
      // Tracking dilarang mengganggu pengalaman pengunjung.
    }
  }, []);

  return null;
}