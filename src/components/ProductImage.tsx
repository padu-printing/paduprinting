"use client";

import { useState } from "react";
import { Package } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  iconClassName?: string;
}

export default function ProductImage({
  src,
  alt,
  className = "absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
  iconClassName = "h-8 w-8 text-neutral-400",
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  return (
    <>
      {!errored && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={className}
          onError={() => setErrored(true)}
        />
      )}
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
          <Package className={iconClassName} />
        </div>
      )}
    </>
  );
}
