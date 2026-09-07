export async function pingSitemap(): Promise<void> {
  try {
    await fetch("/api/ping-sitemap", { method: "POST" });
  } catch {
    // Non-blokir; kegagalan ping tidak menghentikan penyimpanan data.
  }
}
