import { permanentRedirect } from "next/navigation";

export default async function KategoriRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/produk/${slug}`);
}