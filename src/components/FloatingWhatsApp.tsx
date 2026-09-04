"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="https://wa.me/6282123496469?text=Halo%20PADU%20Printing%2C%20saya%20ingin%20bertanya%20tentang%20produk%20cetakan."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat via WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <span className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BD5B] rounded-full shadow-lg transition-colors">
        <MessageCircle className="w-7 h-7 text-white" />
      </span>
    </a>
  );
}
