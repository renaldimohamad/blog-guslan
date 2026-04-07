// src/components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-transparent mt-12 md:mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {" "}
        {/* Padding dikurangi dari 12 ke 8 */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          {/* Sisi Kiri: Copyright */}
          <div className="text-[13px] text-gray-500 dark:text-gray-400 font-medium order-2 md:order-1">
            © {currentYear}{" "}
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              Guslan Batalipu
            </span>
            .
          </div>

          {/* Sisi Tengah: Navigasi (Dibuat lebih rapat) */}
          {/* <div className="flex gap-6 text-[13px] font-medium order-1 md:order-2">
            <Link
              href="/"
              className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors">
              Blog
            </Link>
            <Link
              href="/about"
              className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors">
              Tentang
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-500 transition-colors">
              Privasi
            </Link>
          </div> */}

          {/* Sisi Kanan: Kredit */}
          {/* <div className="text-[12px] text-gray-400 dark:text-gray-500 order-3">
            Powered by{" "}
            <span className="font-bold text-gray-500 dark:text-gray-300">
              Ladorm
            </span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
