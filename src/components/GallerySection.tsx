interface GalleryItem {
  src: string;
  title: string;
  tall?: boolean;
}

const galleryItems: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    title: "Banner Besar",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80",
    title: "Print Premium",
  },
  {
    src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    title: "Brosur",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    title: "Katalog Produk",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
    title: "Digital Printing",
  },
  {
    src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    title: "Desain Custom",
  },
  {
    src: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80",
    title: "Merchandise",
  },
  {
    src: "https://images.unsplash.com/photo-1524582390515-e3cdf3d20732?w=600&q=80",
    title: "Kemasan",
  },
  {
    src: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80",
    title: "Sablon Kaos",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    title: "Editing",
  },
];

export default function GallerySection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-padu-navy">Galeri Hasil Cetak</h2>
          <p className="mt-2 text-neutral-500">
            Beberapa hasil karya kami untuk pelanggan
          </p>
        </div>

        {/* Masonry layout */}
        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-5 [column-fill:_balance]">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="mb-4 break-inside-avoid">
              <div className="group relative overflow-hidden rounded-xl">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    item.tall ? "aspect-[4/5]" : "aspect-square"
                  }`}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="p-3 text-sm font-medium text-white">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
