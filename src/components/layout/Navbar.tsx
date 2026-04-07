import Link from "next/link";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* <img
            src="/images/guslan_photo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 border border-gray-200 dark:border-gray-700"
          /> */}

          <img
            src="/images/guslan_photo_3.jpeg"
            alt="Logo"
            /* Hapus grayscale dan group-hover:grayscale-0 di bawah ini */
            className="w-10 h-10 rounded-full object-cover transition-all duration-500 border border-gray-200 dark:border-gray-700 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tighter dark:text-white leading-none">
              Guslan Batalipu
            </span>
            {/* <span className="font-sans text-[10px] tracking-[0.2em] text-rose-600 font-bold uppercase"></span> */}
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {/* <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Blog
            </Link>
            <Link
              href="/about"
              className="hover:text-rose-600 transition-colors">
              Tentang
            </Link>
          </div> */}
          <ThemeToggle />
          <Link
            href="/login"
            className="bg-rose-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">
            Masuk
          </Link>
        </div>
      </div>
    </nav>
  );
}
