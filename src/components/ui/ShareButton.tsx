"use client";

import { Link2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Baca tulisan menarik ini: ${title}`,
      url: window.location.href,
    };

    // Cek apakah browser mendukung Web Share API (Mobile & Modern Browser)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share dibatalkan atau error:", err);
      }
    } else {
      // Fallback: Jika tidak support Share API, otomatis Copy Link ke Clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("Gagal menyalin link.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ml-1 
        ${
          copied
            ? "bg-green-500 text-white scale-110"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      title={copied ? "Link Tersalin!" : "Bagikan"}>
      {copied ? <Check size={18} /> : <Link2 size={18} />}
    </button>
  );
}
