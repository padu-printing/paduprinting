export const SITE_URL = "https://www.paduprinting.com";
export const BRAND = "PADU Printing";
export const PHONE = "+6282123496469";

export const WHATSAPP_PHONE = "6282123496469";
export const ADDRESS = {
  streetAddress: "Jl. Otista Raya No. 161A, RT.2/RW.8",
  addressLocality: "Jakarta Timur",
  addressRegion: "DKI Jakarta",
  postalCode: "13330",
  addressCountry: "ID",
};

export const LOGO_URL = `${SITE_URL}/logo-icon.png`;
export const LOGO_HORIZONTAL_URL = `${SITE_URL}/logo-horizontal.png`;

export const OPENING_HOURS_SPEC = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "00:00",
  closes: "23:59",
} as const;

export function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    telephone: PHONE,
    address: {
      "@type": "PostalAddress",
      ...ADDRESS,
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: BRAND,
    url: `${SITE_URL}/`,
    telephone: PHONE,
    priceRange: "$$",
    currenciesAccepted: "IDR",
    address: {
      "@type": "PostalAddress",
      ...ADDRESS,
    },
    openingHoursSpecification: [OPENING_HOURS_SPEC],
    areaServed: [
      { "@type": "AdministrativeArea", name: "Jakarta Timur" },
      { "@type": "City", name: "Jakarta" },
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: BRAND,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "id-ID",
  };
}

export function getWebPageSchema({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#business` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "id-ID",
  };
}

export function getProductSchema({
  name,
  description,
  url,
  image,
  price,
  sku,
}: {
  name: string;
  description: string;
  url: string;
  image: string[];
  price?: number;
  sku?: string;
}) {
  const schema: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${url}#product`,
    name,
    description,
    image,
    url,
    brand: { "@type": "Brand", name: BRAND },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
  };
  if (sku) schema.sku = sku;
  if (price !== undefined) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: String(price),
      url,
    };
  }
  return schema;
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getBlogPostingSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
}) {
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    description,
    image: [image],
    datePublished,
    dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: author },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function getFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
