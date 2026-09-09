import { ZipArchive } from "archiver";
import { Readable } from "stream";

export function fileNameFromCode(code: string): string {
  return code;
}

export function sanitizeFilePart(name: string): string {
  return (name || "event")
    .replace(/[^a-z0-9\-_ ]/gi, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function zipResponse({
  filename,
  files,
}: {
  filename: string;
  files: { name: string; data: Buffer | Uint8Array }[];
}): Response {
  const archive = new ZipArchive({
    zlib: { level: 9 },
  });

  const stream = new Readable({
    read() {},
  });
  archive.on("data", (chunk: Buffer) => stream.push(chunk));
  archive.on("end", () => stream.push(null));
  archive.on("error", (err: Error) => stream.destroy(err));

  for (const f of files) {
    archive.append(Buffer.from(f.data), { name: f.name });
  }
  archive.finalize();

  return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}.zip"`,
    },
  });
}
