"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader, Button, Field, TextInput } from "../components/ui";

const KEYS = [
  { key: "whatsapp_phone", label: "Nomor WhatsApp (format internasional)", hint: "Contoh: 6282123496469" },
  { key: "phone", label: "Nomor Telepon", hint: "Contoh: 6282123496469" },
  { key: "email", label: "Email", hint: "Contoh: halo@paduprinting.com" },
  { key: "address", label: "Alamat", hint: "Contoh: Jl. Otista Raya No. 161A, Jakarta Timur" },
];

export default function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("*");
    const map: Record<string, string> = {};
    (data ?? []).forEach((r) => (map[(r as { key: string }).key] = (r as { value: string }).value));
    setValues(map);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    for (const { key } of KEYS) {
      const existing = await supabase.from("site_settings").select("key").eq("key", key).maybeSingle();
      if (existing.data) {
        await supabase.from("site_settings").update({ value: values[key] ?? "" }).eq("key", key);
      } else {
        await supabase.from("site_settings").insert({ key, value: values[key] ?? "" });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <p className="text-sm text-neutral-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader title="Pengaturan" description="Nomor kontak & info yang muncul di website." />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
        {KEYS.map((k) => (
          <Field key={k.key} label={k.label} hint={k.hint}>
            <TextInput
              value={values[k.key] ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setValues({ ...values, [k.key]: e.target.value })}
            />
          </Field>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
          {saved && <span className="text-sm text-green-600">Tersimpan!</span>}
        </div>
      </form>
    </div>
  );
}
