import { getPostBySlug } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Link2, MoveLeft } from "lucide-react";
import { SiThreads } from "react-icons/si";
import { SlSocialTwitter } from "react-icons/sl";
import { RiFacebookFill, RiTwitterXFill } from "react-icons/ri";
import ShareButton from "@/components/ui/ShareButton";

// Tambahkan async di depan fungsi
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // WAJIB: Await params sebelum digunakan
  const { slug } = await params;

  const post = getPostBySlug(slug);
  const { title, author, date, readTime } = post.metadata;

  return (
    <article className="max-w-3xl mx-auto px-5 py-10 md:py-4">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-12 transition-colors group">
        <MoveLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Kembali
      </Link>

      <header className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] dark:text-white mb-6">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
          <span className="text-gray-900 dark:text-gray-200">{author}</span>
          <span>•</span>
          <span>{date}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>

        <hr className="my-10 border-gray-200 dark:border-gray-800" />

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
            Bagikan:
          </p>

          {/* Facebook */}
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:scale-110 transition-all duration-300">
            <RiFacebookFill size={18} />
          </a>

          {/* Twitter / X */}
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white hover:scale-110 transition-all duration-300">
            <RiTwitterXFill size={16} />
          </a>

          {/* Threads */}
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white hover:scale-110 transition-all duration-300">
            <SiThreads size={18} />
          </a>

          {/* Instagram
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:scale-110 transition-all duration-300">
            <SiInstagram size={18} />
          </a> */}

          {/* Copy Link */}
          {/* <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ml-1">
            <Link2 size={18} />
          </button> */}

          <ShareButton title={title} />
        </div>
      </header>

      <div
        className="
  /* 1. Aktifkan mode artikel */
  prose prose-rose dark:prose-invert 
  /* 2. Hilangkan batas lebar default agar mengikuti container kita */
  max-w-none 
  /* 3. Atur Font Dasar */
  /* 4. Atur ukuran teks yang adaptif (HP ke Desktop) */
  text-[17px] md:text-[17px] 
  /* 5. Jarak antar elemen (li, p, blockquote) */
  prose-p:leading-[1.8] md:prose-p:leading-[1.9]
  prose-p:mb-6 
  /* 6. Pastikan List (ul/li) terlihat */
  prose-li:my-2
  prose-ul:list-disc prose-ul:pl-5
  prose-ol:list-decimal prose-ol:pl-5
  /* 7. Styling Blockquote */
  prose-blockquote:border-l-4 
  prose-blockquote:border-primary 
  prose-blockquote:bg-gray-50 
  dark:prose-blockquote:bg-white/5 
  prose-blockquote:py-1 
  prose-blockquote:px-6
">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
