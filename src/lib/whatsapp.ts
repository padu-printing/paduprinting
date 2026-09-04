export interface WhatsAppOrderData {
  name: string;
  category: string;
  tipe?: string;
  bahan?: string;
  laminating?: string;
  tinta?: string;
  sisiCetak?: string;
  ukuran?: string;
  qty: number;
  estimasiTotal: number;
  catatan?: string;
}

export function buildWhatsAppMessage(data: WhatsAppOrderData): string {
  const lines: string[] = [];

  lines.push("Halo Admin PADU Printing 👋");
  lines.push("");
  lines.push("Saya ingin melakukan pemesanan:");
  lines.push(`• *Kategori:* ${data.category}`);
  lines.push(`• *Produk:* ${data.tipe || "-"}`);

  if (data.bahan) {
    lines.push(`• *Bahan:* ${data.bahan}`);
  }
  if (data.laminating) {
    lines.push(`• *Laminating:* ${data.laminating}`);
  }
  if (data.tinta) {
    lines.push(`• *Tinta:* ${data.tinta}`);
  }
  if (data.sisiCetak) {
    lines.push(`• *Sisi Cetak:* ${data.sisiCetak}`);
  }
  if (data.ukuran) {
    lines.push(`• *Ukuran:* ${data.ukuran}`);
  }

  lines.push(`• *Qty:* ${data.qty.toLocaleString("id-ID")}`);
  lines.push(`• *Estimasi Total:* Rp ${data.estimasiTotal.toLocaleString("id-ID")}`);

  if (data.catatan) {
    lines.push("");
    lines.push(`Catatan: ${data.catatan}`);
  }

  lines.push("");
  lines.push("Mohon info lebih lanjut mengenai detail dan proses order. Terima kasih!");

  return lines.join("\n");
}

export function getWhatsAppLink(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function getGenericWhatsAppMessage(): string {
  return encodeURIComponent("Halo Admin PADU Printing, saya mau tanya-tanya seputar produk.");
}
