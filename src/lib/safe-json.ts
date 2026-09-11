export async function safeJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Server mengembalikan response non-JSON (${res.status})`);
  }
}
