import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/webp"];
const EXT_BY_MIME: Record<string, string> = {
  "image/webp": "webp",
};

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Jenis file tidak didukung" }, { status: 400 });
    }

    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const isWebp =
      head.length >= 12 &&
      String.fromCharCode(...head.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...head.slice(8, 12)) === "WEBP";
    if (!isWebp) {
      return NextResponse.json({ error: "Isi file bukan WebP yang valid" }, { status: 400 });
    }

    const ext = EXT_BY_MIME[file.type] ?? "webp";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
    return NextResponse.json({ url: pub.publicUrl });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error && err.message === "Invalid API key"
            ? "Kredensial Supabase tidak valid"
            : err instanceof Error
              ? err.message
              : "Gagal upload",
      },
      { status: 500 }
    );
  }
}