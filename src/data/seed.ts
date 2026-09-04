// ===== TYPES =====

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}

export interface VariantOption {
  label: string;
  value: string;
  priceModifier: number;
}

export interface VariantGroup {
  name: string;
  options: VariantOption[];
}

export interface PriceTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

export interface Product {
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  basePrice: number;
  productionTime: string;
  variantGroups: VariantGroup[];
  priceTiers: PriceTier[];
  specifications: { label: string; value: string }[];
  isBestSeller: boolean;
  clickCount: number;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  category: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

// ===== CATEGORIES =====

export const categories: Category[] = [
  {
    slug: "banner-spanduk",
    name: "Banner & Spanduk",
    description: "Cetak banner dan spanduk berkualitas tinggi untuk promosi bisnis Anda.",
    icon: "Megaphone",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
  {
    slug: "kartu-nama",
    name: "Kartu Nama",
    description: "Kartu nama profesional dengan desain elegan dan bahan premium.",
    icon: "CreditCard",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
  {
    slug: "stiker-label",
    name: "Stiker & Label",
    description: "Stiker dan label custom untuk produk Anda. Waterproof dan tahan lama.",
    icon: "Tag",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
  {
    slug: "souvenir-promosi",
    name: "Souvenir Promosi",
    description: "Souvenir promosi seperti mug, tumbler, dan tote bag dengan sablon custom.",
    icon: "Gift",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
  {
    slug: "undangan-kartu",
    name: "Undangan & Kartu",
    description: "Cetak undangan pernikahan, ulang tahun, dan berbagai kartu ucapan.",
    icon: "Mail",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
  {
    slug: "packaging-label",
    name: "Packaging & Label",
    description: "Kemasan produk custom seperti box, paper bag, dan label untuk branding Anda.",
    icon: "Package",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
  {
    slug: "seragam-kaos",
    name: "Seragam & Kaos",
    description: "Sablon dan bordir kaos, jersey, dan seragam untuk tim atau komunitas.",
    icon: "Shirt",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
  {
    slug: "mug-tumbler",
    name: "Mug & Tumbler",
    description: "Cetak custom pada mug, tumbler, dan gelas. Hadiah sempurna untuk bisnis.",
    icon: "Coffee",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
  },
];

// ===== PRODUCTS =====

export const products: Product[] = [
  {
    slug: "banner-vinyl",
    name: "Banner Vinyl Indoor",
    categorySlug: "banner-spanduk",
    description: "Banner vinyl indoor dengan kualitas cetak resolusi tinggi. Cocok untuk display indoor, pameran, dan toko.",
    shortDescription: "Banner indoor resolusi tinggi untuk display profesional",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg", "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 35000,
    productionTime: "2-3 hari kerja",
    variantGroups: [
      {
        name: "Ukuran",
        options: [
          { label: "60x160 cm", value: "60x160", priceModifier: 0 },
          { label: "80x200 cm", value: "80x200", priceModifier: 25000 },
          { label: "100x250 cm", value: "100x250", priceModifier: 50000 },
        ],
      },
      {
        name: "Finishing",
        options: [
          { label: "Glossy", value: "glossy", priceModifier: 0 },
          { label: "Doff", value: "doff", priceModifier: 5000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 1, maxQty: 4, pricePerUnit: 35000 },
      { minQty: 5, maxQty: 10, pricePerUnit: 32000 },
      { minQty: 11, maxQty: null, pricePerUnit: 28000 },
    ],
    specifications: [
      { label: "Bahan", value: "Vinyl 280gsm" },
      { label: "Cetak", value: "Digital Printing Full Color" },
      { label: "Resolusi", value: "720 x 1440 dpi" },
    ],
    isBestSeller: true,
    clickCount: 1250,
  },
  {
    slug: "x-banner",
    name: "X-Banner",
    categorySlug: "banner-spanduk",
    description: "X-Banner standar dengan bingkai aluminium ringan. Mudah dipasang dan dibongkar.",
    shortDescription: "X-Banner portable untuk display indoor",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 120000,
    productionTime: "2-3 hari kerja",
    variantGroups: [
      {
        name: "Ukuran",
        options: [
          { label: "60x160 cm", value: "60x160", priceModifier: 0 },
          { label: "80x180 cm", value: "80x180", priceModifier: 30000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 1, maxQty: 3, pricePerUnit: 120000 },
      { minQty: 4, maxQty: 10, pricePerUnit: 110000 },
      { minQty: 11, maxQty: null, pricePerUnit: 100000 },
    ],
    specifications: [
      { label: "Bahan Banner", value: "Vinyl 280gsm" },
      { label: "Frame", value: "Aluminium ringan" },
      { label: "Include", value: "Tas carry bag" },
    ],
    isBestSeller: false,
    clickCount: 430,
  },
  {
    slug: "kartu-nama-standar",
    name: "Kartu Nama Standar",
    categorySlug: "kartu-nama",
    description: "Kartu nama standar dengan bahan art carton. Cetak full color dua sisi.",
    shortDescription: "Kartu nama profesional bahan art carton",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 25000,
    productionTime: "1-2 hari kerja",
    variantGroups: [
      {
        name: "Bahan",
        options: [
          { label: "Art Carton 260gsm", value: "art-carton", priceModifier: 0 },
          { label: "Art Carton 310gsm", value: "art-carton-310", priceModifier: 5000 },
          { label: "Ivory 250gsm", value: "ivory", priceModifier: 8000 },
        ],
      },
      {
        name: "Finishing",
        options: [
          { label: "Glossy", value: "glossy", priceModifier: 0 },
          { label: "Doff", value: "doff", priceModifier: 3000 },
          { label: "Spot UV", value: "spot-uv", priceModifier: 15000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 100, maxQty: 299, pricePerUnit: 25000 },
      { minQty: 300, maxQty: 499, pricePerUnit: 22000 },
      { minQty: 500, maxQty: null, pricePerUnit: 18000 },
    ],
    specifications: [
      { label: "Ukuran", value: "9 x 5.5 cm" },
      { label: "Cetak", value: "Digital Full Color 2 Sisi" },
    ],
    isBestSeller: true,
    clickCount: 980,
  },
  {
    slug: "stiker-vinyl",
    name: "Stiker Vinyl Cutting",
    categorySlug: "stiker-label",
    description: "Stiker vinyl cutting untuk branding kendaraan, etalase, dan berbagai keperluan.",
    shortDescription: "Stiker vinyl tahan air untuk branding",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 15000,
    productionTime: "1-2 hari kerja",
    variantGroups: [
      {
        name: "Ukuran",
        options: [
          { label: "10x10 cm", value: "10x10", priceModifier: 0 },
          { label: "20x20 cm", value: "20x20", priceModifier: 10000 },
          { label: "30x30 cm", value: "30x30", priceModifier: 25000 },
        ],
      },
      {
        name: "Warna",
        options: [
          { label: "Putih", value: "putih", priceModifier: 0 },
          { label: "Hitam", value: "hitam", priceModifier: 0 },
          { label: "Silver", value: "silver", priceModifier: 8000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 10, maxQty: 49, pricePerUnit: 15000 },
      { minQty: 50, maxQty: 199, pricePerUnit: 12000 },
      { minQty: 200, maxQty: null, pricePerUnit: 10000 },
    ],
    specifications: [
      { label: "Bahan", value: "Vinyl Outdoor" },
      { label: "Ketahanan", value: "Outdoor 3-5 tahun" },
    ],
    isBestSeller: true,
    clickCount: 720,
  },
  {
    slug: "tote-bag",
    name: "Tote Bag Kanvas Sablon",
    categorySlug: "souvenir-promosi",
    description: "Tote bag kanvas dengan sablon. Cocok untuk souvenir promosi dan seminar.",
    shortDescription: "Tote bag kanvas sablon custom",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 25000,
    productionTime: "3-5 hari kerja",
    variantGroups: [
      {
        name: "Ukuran",
        options: [
          { label: "Kecil (30x40 cm)", value: "small", priceModifier: 0 },
          { label: "Sedang (35x45 cm)", value: "medium", priceModifier: 5000 },
          { label: "Besar (40x50 cm)", value: "large", priceModifier: 10000 },
        ],
      },
      {
        name: "Warna Kain",
        options: [
          { label: "Putih", value: "putih", priceModifier: 0 },
          { label: "Hitam", value: "hitam", priceModifier: 3000 },
          { label: "Cream", value: "cream", priceModifier: 3000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 20, maxQty: 49, pricePerUnit: 25000 },
      { minQty: 50, maxQty: 199, pricePerUnit: 22000 },
      { minQty: 200, maxQty: null, pricePerUnit: 18000 },
    ],
    specifications: [
      { label: "Bahan", value: "Kanvas 12oz" },
      { label: "Sablon", value: "Screen Print 1-2 Warna" },
    ],
    isBestSeller: true,
    clickCount: 560,
  },
  {
    slug: "undangan-pernikahan",
    name: "Undangan Pernikahan",
    categorySlug: "undangan-kartu",
    description: "Undangan pernikahan elegan dengan berbagai pilihan desain.",
    shortDescription: "Undangan pernikahan elegan dan premium",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 3000,
    productionTime: "5-7 hari kerja",
    variantGroups: [
      {
        name: "Ukuran",
        options: [
          { label: "10x15 cm (Standar)", value: "standard", priceModifier: 0 },
          { label: "12x17 cm (Hardcover)", value: "hardcover", priceModifier: 2000 },
        ],
      },
      {
        name: "Bahan",
        options: [
          { label: "Art Paper 260gsm", value: "art-paper", priceModifier: 0 },
          { label: "Art Carton 310gsm", value: "art-carton", priceModifier: 1500 },
          { label: "Ivory 250gsm", value: "ivory", priceModifier: 3000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 100, maxQty: 299, pricePerUnit: 3000 },
      { minQty: 300, maxQty: 499, pricePerUnit: 2700 },
      { minQty: 500, maxQty: null, pricePerUnit: 2400 },
    ],
    specifications: [
      { label: "Cetak", value: "Digital Full Color 2 Sisi" },
      { label: "Include", value: "Amplop + Desain" },
      { label: "Min Order", value: "100 pcs" },
    ],
    isBestSeller: true,
    clickCount: 890,
  },
  {
    slug: "box-custom",
    name: "Box Custom / Packaging",
    categorySlug: "packaging-label",
    description: "Box custom untuk produk Anda. Tersedia berbagai ukuran dan bahan.",
    shortDescription: "Box packaging custom untuk produk",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 5000,
    productionTime: "5-7 hari kerja",
    variantGroups: [
      {
        name: "Bahan",
        options: [
          { label: "Kraft 300gsm", value: "kraft", priceModifier: 0 },
          { label: "Art Carton 350gsm", value: "art-carton", priceModifier: 3000 },
        ],
      },
      {
        name: "Finishing",
        options: [
          { label: "Cetak Offset", value: "offset", priceModifier: 0 },
          { label: "Laminating Glossy", value: "glossy", priceModifier: 2000 },
          { label: "Laminating Doff", value: "doff", priceModifier: 2000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 100, maxQty: 299, pricePerUnit: 5000 },
      { minQty: 300, maxQty: 999, pricePerUnit: 4000 },
      { minQty: 1000, maxQty: null, pricePerUnit: 3000 },
    ],
    specifications: [
      { label: "Ukuran", value: "Custom (sesuai produk)" },
      { label: "Cetak", value: "Offset / Digital" },
    ],
    isBestSeller: false,
    clickCount: 340,
  },
  {
    slug: "kaos-sablon",
    name: "Kaos Sablon Custom",
    categorySlug: "seragam-kaos",
    description: "Kaos cotton combed dengan sablon rubber atau plastisol.",
    shortDescription: "Kaos cotton combed sablon custom",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 65000,
    productionTime: "5-7 hari kerja",
    variantGroups: [
      {
        name: "Ukuran",
        options: [
          { label: "S", value: "S", priceModifier: 0 },
          { label: "M", value: "M", priceModifier: 0 },
          { label: "L", value: "L", priceModifier: 0 },
          { label: "XL", value: "XL", priceModifier: 0 },
          { label: "XXL", value: "XXL", priceModifier: 5000 },
        ],
      },
      {
        name: "Warna",
        options: [
          { label: "Hitam", value: "hitam", priceModifier: 0 },
          { label: "Putih", value: "putih", priceModifier: 0 },
          { label: "Navy", value: "navy", priceModifier: 0 },
        ],
      },
      {
        name: "Jenis Sablon",
        options: [
          { label: "Rubber", value: "rubber", priceModifier: 0 },
          { label: "Plastisol", value: "plastisol", priceModifier: 5000 },
          { label: "DTG", value: "dtg", priceModifier: 10000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 10, maxQty: 29, pricePerUnit: 65000 },
      { minQty: 30, maxQty: 99, pricePerUnit: 58000 },
      { minQty: 100, maxQty: null, pricePerUnit: 50000 },
    ],
    specifications: [
      { label: "Bahan", value: "Cotton Combed 30s" },
      { label: "Sablon", value: "Rubber / Plastisol / DTG" },
    ],
    isBestSeller: true,
    clickCount: 1100,
  },
  {
    slug: "mug-sablon",
    name: "Mug Sablon Custom",
    categorySlug: "mug-tumbler",
    description: "Mug keramik dengan sablon logo atau desain custom.",
    shortDescription: "Mug keramik sablon custom",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 20000,
    productionTime: "3-5 hari kerja",
    variantGroups: [
      {
        name: "Tipe",
        options: [
          { label: "Mug Putih Standar", value: "putih-standar", priceModifier: 0 },
          { label: "Mug Panas Berubah Warna", value: "magic", priceModifier: 25000 },
          { label: "Mug Panjang", value: "panjang", priceModifier: 10000 },
        ],
      },
      {
        name: "Cetak",
        options: [
          { label: "1 Warna", value: "1-warna", priceModifier: 0 },
          { label: "Full Color", value: "full-color", priceModifier: 5000 },
        ],
      },
    ],
    priceTiers: [
      { minQty: 10, maxQty: 49, pricePerUnit: 20000 },
      { minQty: 50, maxQty: 99, pricePerUnit: 18000 },
      { minQty: 100, maxQty: null, pricePerUnit: 15000 },
    ],
    specifications: [
      { label: "Bahan", value: "Keramik Putih" },
      { label: "Kapasitas", value: "300 ml" },
    ],
    isBestSeller: true,
    clickCount: 650,
  },

  // ===== BANNER & SPANDUK (4 more) =====
  {
    slug: "banner-outdoor",
    name: "Banner Outdoor Vinyl",
    categorySlug: "banner-spanduk",
    description: "Banner vinyl outdoor tahan cuaca untuk promosi bisnis Anda.",
    shortDescription: "Banner outdoor tahan cuaca",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 45000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "100x200 cm", value: "100x200", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 1, maxQty: 5, pricePerUnit: 45000 }, { minQty: 6, maxQty: null, pricePerUnit: 40000 }],
    specifications: [{ label: "Bahan", value: "Vinyl 440gsm" }],
    isBestSeller: false,
    clickCount: 320,
  },
  {
    slug: "spanduk-bendera",
    name: "Spanduk Bendera",
    categorySlug: "banner-spanduk",
    description: "Spanduk bendera untuk event dan promosi outdoor.",
    shortDescription: "Spanduk bendera event outdoor",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 85000,
    productionTime: "3-4 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "50x150 cm", value: "50x150", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 1, maxQty: 5, pricePerUnit: 85000 }, { minQty: 6, maxQty: null, pricePerUnit: 75000 }],
    specifications: [{ label: "Bahan", value: "Banner Flexi" }],
    isBestSeller: false,
    clickCount: 180,
  },
  {
    slug: "x-banner-large",
    name: "X-Banner Large",
    categorySlug: "banner-spanduk",
    description: "X-Banner ukuran besar untuk display indoor yang lebih menonjol.",
    shortDescription: "X-Banner ukuran besar indoor",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 180000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "80x200 cm", value: "80x200", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 1, maxQty: 3, pricePerUnit: 180000 }, { minQty: 4, maxQty: null, pricePerUnit: 160000 }],
    specifications: [{ label: "Frame", value: "Aluminium" }],
    isBestSeller: false,
    clickCount: 250,
  },
  {
    slug: "roll-banner",
    name: "Roll Banner",
    categorySlug: "banner-spanduk",
    description: "Roll banner portable untuk display ringan dan mudah dibawa.",
    shortDescription: "Roll banner portable ringan",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 95000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "80x200 cm", value: "80x200", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 1, maxQty: 5, pricePerUnit: 95000 }, { minQty: 6, maxQty: null, pricePerUnit: 85000 }],
    specifications: [{ label: "Bahan", value: "Synpaper" }],
    isBestSeller: false,
    clickCount: 210,
  },

  // ===== KARTU NAMA (5 more) =====
  {
    slug: "kartu-nama-premium",
    name: "Kartu Nama Premium",
    categorySlug: "kartu-nama",
    description: "Kartu nama premium dengan finishing laminating doff.",
    shortDescription: "Kartu nama premium laminating doff",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 35000,
    productionTime: "1-2 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Art Carton 310gsm", value: "art-carton-310", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 299, pricePerUnit: 35000 }, { minQty: 300, maxQty: null, pricePerUnit: 28000 }],
    specifications: [{ label: "Ukuran", value: "9 x 5.5 cm" }],
    isBestSeller: false,
    clickCount: 420,
  },
  {
    slug: "kartu-nama-spot-uv",
    name: "Kartu Nama Spot UV",
    categorySlug: "kartu-nama",
    description: "Kartu nama dengan efek Spot UV yang elegan dan mewah.",
    shortDescription: "Kartu nama efek Spot UV elegan",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 55000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Ivory 250gsm", value: "ivory", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 299, pricePerUnit: 55000 }, { minQty: 300, maxQty: null, pricePerUnit: 45000 }],
    specifications: [{ label: "Ukuran", value: "9 x 5.5 cm" }],
    isBestSeller: false,
    clickCount: 380,
  },
  {
    slug: "kartu-nama-kertas",
    name: "Kartu Nama Kertas",
    categorySlug: "kartu-nama",
    description: "Kartu nama bahan kertas art paper ekonomis.",
    shortDescription: "Kartu nama bahan kertas ekonomis",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 18000,
    productionTime: "1-2 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Art Paper 260gsm", value: "art-paper", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 299, pricePerUnit: 18000 }, { minQty: 300, maxQty: null, pricePerUnit: 15000 }],
    specifications: [{ label: "Ukuran", value: "9 x 5.5 cm" }],
    isBestSeller: false,
    clickCount: 290,
  },
  {
    slug: "kartu-nama-plastik",
    name: "Kartu Nama Plastik",
    categorySlug: "kartu-nama",
    description: "Kartu nama bahan plastik tahan air dan tahan lama.",
    shortDescription: "Kartu nama bahan plastik tahan air",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 65000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "PVC 0.76mm", value: "pvc", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 299, pricePerUnit: 65000 }, { minQty: 300, maxQty: null, pricePerUnit: 55000 }],
    specifications: [{ label: "Ukuran", value: "8.5 x 5.5 cm" }],
    isBestSeller: false,
    clickCount: 310,
  },
  {
    slug: "kartu-nama-qr",
    name: "Kartu Nama QR Code",
    categorySlug: "kartu-nama",
    description: "Kartu nama dengan QR code untuk networking digital.",
    shortDescription: "Kartu nama dengan QR code",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 30000,
    productionTime: "1-2 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Art Carton 260gsm", value: "art-carton", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 299, pricePerUnit: 30000 }, { minQty: 300, maxQty: null, pricePerUnit: 25000 }],
    specifications: [{ label: "Ukuran", value: "9 x 5.5 cm" }],
    isBestSeller: false,
    clickCount: 350,
  },

  // ===== STIKER & LABEL (5 more) =====
  {
    slug: "stiker-transparent",
    name: "Stiker Transparent",
    categorySlug: "stiker-label",
    description: "Stiker transparent untuk kaca dan botol.",
    shortDescription: "Stiker transparent untuk kaca",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 12000,
    productionTime: "1-2 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "10x10 cm", value: "10x10", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 12000 }, { minQty: 200, maxQty: null, pricePerUnit: 9000 }],
    specifications: [{ label: "Bahan", value: "Transparent Vinyl" }],
    isBestSeller: false,
    clickCount: 280,
  },
  {
    slug: "stiker-kertas",
    name: "Stiker Kertas",
    categorySlug: "stiker-label",
    description: "Stiker kertas untuk label produk dan packaging.",
    shortDescription: "Stiker kertas untuk label produk",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 8000,
    productionTime: "1-2 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "5x5 cm", value: "5x5", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 499, pricePerUnit: 8000 }, { minQty: 500, maxQty: null, pricePerUnit: 6000 }],
    specifications: [{ label: "Bahan", value: "Stiker Kertas" }],
    isBestSeller: false,
    clickCount: 190,
  },
  {
    slug: "stiker-metallik",
    name: "Stiker Metallik",
    categorySlug: "stiker-label",
    description: "Stiker metallik untuk tampilan mewah dan premium.",
    shortDescription: "Stiker metallik tampilan mewah",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 18000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "10x10 cm", value: "10x10", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 18000 }, { minQty: 200, maxQty: null, pricePerUnit: 14000 }],
    specifications: [{ label: "Bahan", value: "Metallic Vinyl" }],
    isBestSeller: false,
    clickCount: 160,
  },
  {
    slug: "label-botol",
    name: "Label Botol",
    categorySlug: "stiker-label",
    description: "Label botol custom untuk minuman dan produk cair.",
    shortDescription: "Label botol custom produk",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 10000,
    productionTime: "1-2 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "8x4 cm", value: "8x4", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 499, pricePerUnit: 10000 }, { minQty: 500, maxQty: null, pricePerUnit: 7500 }],
    specifications: [{ label: "Bahan", value: "Vinyl Waterproof" }],
    isBestSeller: false,
    clickCount: 230,
  },
  {
    slug: "stiker-round",
    name: "Stiker Bulat",
    categorySlug: "stiker-label",
    description: "Stiker bulat untuk branding dan dekorasi produk.",
    shortDescription: "Stiker bulat branding produk",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 12000,
    productionTime: "1-2 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "Diameter 7cm", value: "7cm", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 12000 }, { minQty: 200, maxQty: null, pricePerUnit: 9000 }],
    specifications: [{ label: "Bahan", value: "Vinyl Putih" }],
    isBestSeller: false,
    clickCount: 200,
  },

  // ===== SOUVENIR PROMOSI (5 more) =====
  {
    slug: "tumbler-custom",
    name: "Tumbler Custom",
    categorySlug: "souvenir-promosi",
    description: "Tumbler custom dengan sablon logo untuk souvenir promosi.",
    shortDescription: "Tumbler custom sablon logo",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 35000,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Kapasitas", options: [{ label: "350ml", value: "350ml", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 20, maxQty: 49, pricePerUnit: 35000 }, { minQty: 50, maxQty: null, pricePerUnit: 30000 }],
    specifications: [{ label: "Bahan", value: "Stainless Steel" }],
    isBestSeller: false,
    clickCount: 340,
  },
  {
    slug: "mug-souvenir",
    name: "Mug Souvenir",
    categorySlug: "souvenir-promosi",
    description: "Mug souvenir custom untuk seminar dan event.",
    shortDescription: "Mug souvenir custom seminar",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 18000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Tipe", options: [{ label: "Mug Putih", value: "putih", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 20, maxQty: 49, pricePerUnit: 18000 }, { minQty: 50, maxQty: null, pricePerUnit: 15000 }],
    specifications: [{ label: "Kapasitas", value: "300 ml" }],
    isBestSeller: false,
    clickCount: 270,
  },
  {
    slug: "payung-custom",
    name: "Payung Custom",
    categorySlug: "souvenir-promosi",
    description: "Payung custom dengan sablon logo untuk souvenir promosi.",
    shortDescription: "Payung custom sablon logo",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 45000,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Tipe", options: [{ label: "Payung Lipat", value: "lipat", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 49, pricePerUnit: 45000 }, { minQty: 50, maxQty: null, pricePerUnit: 38000 }],
    specifications: [{ label: "Bahan", value: "Polyester" }],
    isBestSeller: false,
    clickCount: 150,
  },
  {
    slug: "blocknote-custom",
    name: "Blocknote Custom",
    categorySlug: "souvenir-promosi",
    description: "Blocknote custom dengan cover sablon untuk seminar.",
    shortDescription: "Blocknote custom cover sablon",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 15000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "A5", value: "a5", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 20, maxQty: 99, pricePerUnit: 15000 }, { minQty: 100, maxQty: null, pricePerUnit: 12000 }],
    specifications: [{ label: "Isi", value: "100 lembar" }],
    isBestSeller: false,
    clickCount: 180,
  },
  {
    slug: "pin-custom",
    name: "Pin Custom",
    categorySlug: "souvenir-promosi",
    description: "Pin custom untuk identitas komunitas dan event.",
    shortDescription: "Pin custom identitas komunitas",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 8000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "Diameter 4.4cm", value: "4.4cm", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 8000 }, { minQty: 200, maxQty: null, pricePerUnit: 6000 }],
    specifications: [{ label: "Bahan", value: "Logam" }],
    isBestSeller: false,
    clickCount: 210,
  },

  // ===== UNDANGAN & KARTU (5 more) =====
  {
    slug: "undangan-ulang-tahun",
    name: "Undangan Ulang Tahun",
    categorySlug: "undangan-kartu",
    description: "Undangan ulang tahun custom dengan desain menarik.",
    shortDescription: "Undangan ulang tahun custom",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 2500,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Art Paper 260gsm", value: "art-paper", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 2500 }, { minQty: 200, maxQty: null, pricePerUnit: 2000 }],
    specifications: [{ label: "Ukuran", value: "10x15 cm" }],
    isBestSeller: false,
    clickCount: 320,
  },
  {
    slug: "undangan-sunatan",
    name: "Undangan Sunatan",
    categorySlug: "undangan-kartu",
    description: "Undangan sunatan dengan desain tradisional dan modern.",
    shortDescription: "Undangan sunatan tradisional modern",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 2500,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Art Paper 260gsm", value: "art-paper", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 2500 }, { minQty: 200, maxQty: null, pricePerUnit: 2000 }],
    specifications: [{ label: "Ukuran", value: "10x15 cm" }],
    isBestSeller: false,
    clickCount: 190,
  },
  {
    slug: "kartu-ucapan",
    name: "Kartu Ucapan",
    categorySlug: "undangan-kartu",
    description: "Kartu ucapan untuk berbagai momen spesial.",
    shortDescription: "Kartu ucapan momen spesial",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 5000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "A6", value: "a6", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 20, maxQty: 99, pricePerUnit: 5000 }, { minQty: 100, maxQty: null, pricePerUnit: 4000 }],
    specifications: [{ label: "Bahan", value: "Art Carton 260gsm" }],
    isBestSeller: false,
    clickCount: 160,
  },
  {
    slug: "wedding-card",
    name: "Wedding Card",
    categorySlug: "undangan-kartu",
    description: "Kartu pernikahan elegan dengan desain modern.",
    shortDescription: "Kartu pernikahan elegan modern",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 5000,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Art Carton 310gsm", value: "art-carton-310", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 299, pricePerUnit: 5000 }, { minQty: 300, maxQty: null, pricePerUnit: 4000 }],
    specifications: [{ label: "Include", value: "Amplop + Desain" }],
    isBestSeller: false,
    clickCount: 280,
  },
  {
    slug: "undangan-hardcover",
    name: "Undangan Hardcover",
    categorySlug: "undangan-kartu",
    description: "Undangan hardcover mewah untuk pernikahan.",
    shortDescription: "Undangan hardcover mewah",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 8000,
    productionTime: "7-10 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Ivory 250gsm", value: "ivory", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 299, pricePerUnit: 8000 }, { minQty: 300, maxQty: null, pricePerUnit: 6500 }],
    specifications: [{ label: "Include", value: "Amplop + Desain + Laminating" }],
    isBestSeller: false,
    clickCount: 240,
  },

  // ===== PACKAGING & LABEL (5 more) =====
  {
    slug: "paper-bag",
    name: "Paper Bag Custom",
    categorySlug: "packaging-label",
    description: "Paper bag custom untuk branding toko dan retail.",
    shortDescription: "Paper bag custom branding toko",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 3500,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Kraft Coklat", value: "kraft", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 499, pricePerUnit: 3500 }, { minQty: 500, maxQty: null, pricePerUnit: 2800 }],
    specifications: [{ label: "Ukuran", value: "25x35x10 cm" }],
    isBestSeller: false,
    clickCount: 290,
  },
  {
    slug: "box-makanan",
    name: "Box Makanan",
    categorySlug: "packaging-label",
    description: "Box makanan custom untuk restoran dan catering.",
    shortDescription: "Box makanan custom restoran",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 4000,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Kraft 300gsm", value: "kraft", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 499, pricePerUnit: 4000 }, { minQty: 500, maxQty: null, pricePerUnit: 3200 }],
    specifications: [{ label: "Ukuran", value: "Custom" }],
    isBestSeller: false,
    clickCount: 230,
  },
  {
    slug: "sachet-label",
    name: "Sachet & Label",
    categorySlug: "packaging-label",
    description: "Sachet dan label produk untuk kemasan retail.",
    shortDescription: "Sachet label produk retail",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 2000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "Kecil", value: "kecil", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 200, maxQty: 999, pricePerUnit: 2000 }, { minQty: 1000, maxQty: null, pricePerUnit: 1500 }],
    specifications: [{ label: "Bahan", value: "Aluminium Foil" }],
    isBestSeller: false,
    clickCount: 170,
  },
  {
    slug: "box-gift",
    name: "Box Gift Custom",
    categorySlug: "packaging-label",
    description: "Box gift custom untuk hadiah dan promosi.",
    shortDescription: "Box gift custom hadiah",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 8000,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Bahan", options: [{ label: "Art Carton 350gsm", value: "art-carton", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 8000 }, { minQty: 200, maxQty: null, pricePerUnit: 6500 }],
    specifications: [{ label: "Ukuran", value: "Custom" }],
    isBestSeller: false,
    clickCount: 200,
  },
  {
    slug: "kraft-envelope",
    name: "Kraft Envelope",
    categorySlug: "packaging-label",
    description: "Kraft envelope untuk packaging produk dan dokumen.",
    shortDescription: "Kraft envelope packaging produk",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 3000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "C4", value: "c4", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 100, maxQty: 499, pricePerUnit: 3000 }, { minQty: 500, maxQty: null, pricePerUnit: 2500 }],
    specifications: [{ label: "Bahan", value: "Kraft Paper" }],
    isBestSeller: false,
    clickCount: 140,
  },

  // ===== SERAGAM & KAOS (5 more) =====
  {
    slug: "kaos-polos",
    name: "Kaos Polos",
    categorySlug: "seragam-kaos",
    description: "Kaos polos cotton combed untuk sablon custom.",
    shortDescription: "Kaos polos cotton combed",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 45000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "M", value: "M", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 29, pricePerUnit: 45000 }, { minQty: 30, maxQty: null, pricePerUnit: 40000 }],
    specifications: [{ label: "Bahan", value: "Cotton Combed 30s" }],
    isBestSeller: false,
    clickCount: 380,
  },
  {
    slug: "jersey-custom",
    name: "Jersey Custom",
    categorySlug: "seragam-kaos",
    description: "Jersey custom untuk team sports dan komunitas.",
    shortDescription: "Jersey custom team sports",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 85000,
    productionTime: "7-10 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "M", value: "M", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 29, pricePerUnit: 85000 }, { minQty: 30, maxQty: null, pricePerUnit: 75000 }],
    specifications: [{ label: "Bahan", value: "Dry Fit" }],
    isBestSeller: false,
    clickCount: 290,
  },
  {
    slug: "seragam-kantor",
    name: "Seragam Kantor",
    categorySlug: "seragam-kaos",
    description: "Seragam kantor dengan bordir logo perusahaan.",
    shortDescription: "Seragam kantor bordir logo",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 75000,
    productionTime: "7-10 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "M", value: "M", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 29, pricePerUnit: 75000 }, { minQty: 30, maxQty: null, pricePerUnit: 65000 }],
    specifications: [{ label: "Bahan", value: "Twill" }],
    isBestSeller: false,
    clickCount: 250,
  },
  {
    slug: "kaos-tim",
    name: "Kaos Tim",
    categorySlug: "seragam-kaos",
    description: "Kaos tim untuk komunitas dan acara.",
    shortDescription: "Kaos tim komunitas acara",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 55000,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "M", value: "M", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 29, pricePerUnit: 55000 }, { minQty: 30, maxQty: null, pricePerUnit: 48000 }],
    specifications: [{ label: "Bahan", value: "Cotton Combed 30s" }],
    isBestSeller: false,
    clickCount: 310,
  },
  {
    slug: "kaos-distro",
    name: "Kaos Distro",
    categorySlug: "seragam-kaos",
    description: "Kaos distro dengan desain eksklusif dan bahan premium.",
    shortDescription: "Kaos distro desain eksklusif",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 75000,
    productionTime: "5-7 hari kerja",
    variantGroups: [{ name: "Ukuran", options: [{ label: "M", value: "M", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 29, pricePerUnit: 75000 }, { minQty: 30, maxQty: null, pricePerUnit: 65000 }],
    specifications: [{ label: "Bahan", value: "Cotton Combed 24s" }],
    isBestSeller: false,
    clickCount: 270,
  },

  // ===== MUG & TUMBLER (5 more) =====
  {
    slug: "mug-magic",
    name: "Mug Magic",
    categorySlug: "mug-tumbler",
    description: "Mug magic yang berubah warna saat diisi air panas.",
    shortDescription: "Mug magic berubah warna",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 45000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Cetak", options: [{ label: "Full Color", value: "full-color", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 49, pricePerUnit: 45000 }, { minQty: 50, maxQty: null, pricePerUnit: 38000 }],
    specifications: [{ label: "Kapasitas", value: "300 ml" }],
    isBestSeller: false,
    clickCount: 410,
  },
  {
    slug: "mug-keramik",
    name: "Mug Keramik",
    categorySlug: "mug-tumbler",
    description: "Mug keramik standar dengan sablon logo.",
    shortDescription: "Mug keramik sablon logo",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 15000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Cetak", options: [{ label: "1 Warna", value: "1-warna", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 20, maxQty: 99, pricePerUnit: 15000 }, { minQty: 100, maxQty: null, pricePerUnit: 12000 }],
    specifications: [{ label: "Kapasitas", value: "300 ml" }],
    isBestSeller: false,
    clickCount: 280,
  },
  {
    slug: "tumbler-insert",
    name: "Tumbler Insert Paper",
    categorySlug: "mug-tumbler",
    description: "Tumbler insert paper untuk minuman kekinian.",
    shortDescription: "Tumbler insert paper kekinian",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 8000,
    productionTime: "2-3 hari kerja",
    variantGroups: [{ name: "Kapasitas", options: [{ label: "16oz", value: "16oz", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 50, maxQty: 199, pricePerUnit: 8000 }, { minQty: 200, maxQty: null, pricePerUnit: 6000 }],
    specifications: [{ label: "Bahan", value: "Paper" }],
    isBestSeller: false,
    clickCount: 350,
  },
  {
    slug: "gelas-custom",
    name: "Gelas Custom",
    categorySlug: "mug-tumbler",
    description: "Gelas custom dengan sablon untuk souvenir dan promosi.",
    shortDescription: "Gelas custom sablon souvenir",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 12000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Tipe", options: [{ label: "Gelas Kaca", value: "kaca", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 20, maxQty: 99, pricePerUnit: 12000 }, { minQty: 100, maxQty: null, pricePerUnit: 10000 }],
    specifications: [{ label: "Kapasitas", value: "250 ml" }],
    isBestSeller: false,
    clickCount: 190,
  },
  {
    slug: "tumbler-sport",
    name: "Tumbler Sport",
    categorySlug: "mug-tumbler",
    description: "Tumbler sport untuk aktivitas outdoor dan gym.",
    shortDescription: "Tumbler sport outdoor gym",
    image: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    gallery: ["https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg"],
    basePrice: 55000,
    productionTime: "3-5 hari kerja",
    variantGroups: [{ name: "Kapasitas", options: [{ label: "500ml", value: "500ml", priceModifier: 0 }] }],
    priceTiers: [{ minQty: 10, maxQty: 49, pricePerUnit: 55000 }, { minQty: 50, maxQty: null, pricePerUnit: 48000 }],
    specifications: [{ label: "Bahan", value: "Stainless Steel" }],
    isBestSeller: false,
    clickCount: 220,
  },
];

// ===== ARTICLES =====

export const articles: Article[] = [
  {
    slug: "tips-desain-banner-efektif",
    title: "Tips Desain Banner yang Efektif untuk Promosi Bisnis",
    excerpt: "Pelajari tips dan trik desain banner yang menarik perhatian dan meningkatkan konversi.",
    content: "Banner yang efektif harus memiliki headline yang jelas, warna kontras, logo yang baik, dan CTA yang jelas.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-12-15",
    author: "Tim PADU Printing",
    category: "Tips Desain",
  },
  {
    slug: "panduan-memesan-kartu-nama",
    title: "Panduan Lengkap Memesan Kartu Nama yang Profesional",
    excerpt: "Semua yang perlu Anda ketahui tentang memesan kartu nama, dari bahan hingga desain.",
    content: "Kartu nama masih menjadi alat networking paling penting. Pilih bahan yang tepat dan finishing yang sesuai.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-12-10",
    author: "Tim PADU Printing",
    category: "Panduan",
  },
  {
    slug: "cara-memilih-bahan-stiker",
    title: "Cara Memilih Bahan Stiker yang Tepat untuk Produk Anda",
    excerpt: "Panduan memilih jenis stiker yang sesuai dengan kebutuhan dan budget Anda.",
    content: "Vinyl cocok untuk outdoor, transparent untuk botol, dan kertas untuk indoor.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-12-05",
    author: "Tim PADU Printing",
    category: "Tips Desain",
  },
  {
    slug: "tren-souvenir-promosi-2025",
    title: "Tren Souvenir Promosi 2025 yang Wajib Diketahui",
    excerpt: "Ikuti tren souvenir promosi terbaru untuk tahun 2025.",
    content: "Eco-friendly products, personalisasi, dan produk multi-function menjadi tren utama.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-11-28",
    author: "Tim PADU Printing",
    category: "Promotion",
  },
  {
    slug: "mengapa-branding-penting-untuk-umkm",
    title: "Mengapa Branding Penting untuk Pertumbuhan UMKM",
    excerpt: "Branding yang kuat membantu UMKM membedakan diri dan membangun kepercayaan pelanggan.",
    content: "Branding bukan sekadar logo. Ini adalah keseluruhan persepsi pelanggan terhadap bisnis Anda.\n\n## Mulai dari Identitas Visual\nIdentitas visual yang konsisten membantu pelanggan mengenali bisnis Anda di mana pun.\n\n- Logo yang mudah diingat\n- Pemilihan warna yang konsisten\n- Tipografi yang dipakai berulang\n\n## Bangun Kepercayaan\nMeski kecil, bisnis dengan branding rapi terlihat lebih profesional di mata pelanggan.\n\n## Tips Praktis\n1. Tentukan kepribadian brand\n2. Susun panduan visual sederhana\n3. Terapkan pada semua materi cetak dan digital\n\nKonsistensi adalah kunci utama membangun brand yang kuat.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-11-20",
    author: "Tim PADU Printing",
    category: "Business",
  },
  {
    slug: "strategi-pemasaran-cetak-digital",
    title: "Strategi Pemasaran Efektif dengan Media Cetak Digital",
    excerpt: "Gabungkan media cetak dan digital untuk menjangkau lebih banyak pelanggan.",
    content: "Media cetak dan digital bisa berjalan beriringan untuk hasil terbaik.\n\n## Kenapa Kombinasi Itu Penting\nSetiap saluran punya kekuatan masing-masing. Brosur dan flyer menjangkau secara fisik, sedangkan digital mempermudah pengukuran.\n\n## Ide Kombinasi Media\n1. Banner toko dengan QR code\n2. Kartu nama terhubung ke profil online\n3. Stiker kemasan dengan media sosial\n\n## Ukur Hasilnya\nGunakan link atau kode yang terukur untuk mengetahui mana yang paling efektif.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-11-12",
    author: "Tim PADU Printing",
    category: "Marketing",
  },
  {
    slug: "cara-printing-bahan-dan-teknik",
    title: "Panduan Memilih Bahan dan Teknik Printing yang Tepat",
    excerpt: "Kenali berbagai bahan dan teknik cetak agar hasilnya sesuai kebutuhan.",
    content: "Pemilihan bahan menentukan hasil akhir dan umur cetakan Anda.\n\n## Jenis Bahan Umum\n- Art Carton untuk brosur dan kartu nama\n- Vinyl untuk banner outdoor\n- Stiker kertas untuk label indoor\n\n## Teknik Finishing\nLaminasi, spot UV, dan emboss dapat menambah nilai pada produk cetak.\n\nTanyakan pada tim kami bila ragu memilih bahan yang paling sesuai.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-11-05",
    author: "Tim PADU Printing",
    category: "Printing",
  },
  {
    slug: "desain-kemasan-yang-menarik",
    title: "Prinsip Desain Kemasan yang Menarik Pembeli",
    excerpt: "Kemasan yang bagus bukan sekadar pelindung, tapi juga alat penjualan.",
    content: "Kemasan adalah media promosi pertama yang dilihat calon pembeli.\n\n## Elemen Kemasan yang Efektif\n1. Nama produk yang jelas\n2. Visual yang mencerminkan kualitas\n3. Informasi penting yang mudah dibaca\n\n## Pentingnya Material\nMaterial kemasan yang berkualitas mencerminkan isi produk di dalamnya.\n\nPilih desain kemasan yang membuat produk Anda tampil menonjol di rak.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-10-28",
    author: "Tim PADU Printing",
    category: "Design",
  },
  {
    slug: "tips-meningkatkan-penjualan-dengan-banner",
    title: "Tips Meningkatkan Penjualan Toko dengan Banner Menarik",
    excerpt: "Banner yang tepat dapat menjadi magnet pengunjung dan meningkatkan penjualan.",
    content: "Banner toko membantu menarik perhatian orang yang lewat.\n\n## Buat Pesan Jelas dan Singkat\nGunakan headline besar dengan kata kunci promosi yang mudah dipahami.\n\n## Gunakan Warna Kontras\nWarna yang kontras membuat banner tampak jelas dari jarak jauh.\n\n## Letakkan di Lokasi Strategis\nPastikan banner terpasang pada posisi yang terlihat dari arah lalu lintas pengunjung.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-10-15",
    author: "Tim PADU Printing",
    category: "Marketing",
  },
  {
    slug: "pentingnya-konsistensi-identitas-visual",
    title: "Pentingnya Konsistensi Identitas Visual dalam Bisnis",
    excerpt: "Identitas visual yang konsisten memperkuat citra merek Anda.",
    content: "Konsistensi visual membantu pelanggan mengingat dan mempercayai bisnis Anda.\n\n## Apa itu Identitas Visual\nIdentitas visual mencakup logo, warna, tipografi, dan gaya desain yang dipakai secara konsisten.\n\n## Manfaat Konsistensi\n- Lebih mudah dikenali\n- Terlihat lebih profesional\n- Membangun kepercayaan\n\nMulai dari hal kecil seperti kartu nama dan amplop hingga banner promosi.",
    coverImage: "https://i.pinimg.com/736x/8a/e6/ab/8ae6ab3540d57cadca6565df2ea3b795.jpg",
    date: "2024-10-08",
    author: "Tim PADU Printing",
    category: "Design",
  },
];

// ===== FAQ =====

export const faqs: FAQ[] = [
  {
    question: "Berapa lama proses cetak?",
    answer: "Waktu proses cetak bervariasi. Kartu nama: 1-2 hari kerja. Banner: 2-3 hari kerja. Kaos: 5-7 hari kerja.",
    category: "Umum",
  },
  {
    question: "Apakah bisa pesan dalam quantity kecil?",
    answer: "Tergantung jenis produk. Beberapa produk minimal order 100 pcs, kaos minimal 10 pcs.",
    category: "Umum",
  },
  {
    question: "Bagaimana cara pemesanan?",
    answer: "Pilih produk, tentukan spesifikasi, lalu klik 'Pesan via WhatsApp'. Admin akan mengkonfirmasi.",
    category: "Pemesanan",
  },
  {
    question: "Apakah bisa desain custom?",
    answer: "Ya! Kirim desain dalam format AI, PSD, PDF, atau PNG dengan resolusi minimal 300dpi.",
    category: "Desain",
  },
  {
    question: "Metode pembayaran apa yang diterima?",
    answer: "Transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, Dana), dan tunai.",
    category: "Pembayaran",
  },
  {
    question: "Apakah ada garansi?",
    answer: "Ya, garansi cetak ulang jika terjadi kesalahan dari pihak kami.",
    category: "Umum",
  },
  {
    question: "Bisa kirim ke seluruh Indonesia?",
    answer: "Ya, via JNE, J&T, SiCepat, dan ekspedisi lainnya.",
    category: "Pengiriman",
  },
  {
    question: "Apakah bisa urgent order?",
    answer: "Bisa dengan tambahan biaya 30-50%. Hubungi admin untuk ketersediaan.",
    category: "Pemesanan",
  },
];

// ===== HELPER FUNCTIONS =====

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductByCategoryAndSlug(categorySlug: string, productSlug: string): Product | undefined {
  return products.find((p) => p.categorySlug === categorySlug && p.slug === productSlug);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, category: string, limit = 3): Article[] {
  return articles.filter((a) => a.slug !== currentSlug && a.category === category).slice(0, limit);
}

export function getFAQCategories(): string[] {
  return [...new Set(faqs.map((f) => f.category))];
}

export function calculatePrice(product: Product, selectedVariants: Record<string, string>, quantity: number): number {
  let price = product.basePrice;

  for (const group of product.variantGroups) {
    const selectedValue = selectedVariants[group.name];
    if (selectedValue) {
      const option = group.options.find((o) => o.value === selectedValue);
      if (option) {
        price += option.priceModifier;
      }
    }
  }

  const tier = product.priceTiers.find(
    (t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );

  if (tier) {
    return tier.pricePerUnit * quantity;
  }

  return price * quantity;
}

export function getWhatsAppPhoneNumber(): string {
  return "6281234567890";
}
