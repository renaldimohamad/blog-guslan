"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  coverImage: string | null;
  createdAt: Date | string;
  readTime?: string;
  author?: {
    name: string | null;
  };
}

export default function PostCard({
  title,
  excerpt,
  slug,
  coverImage,
  createdAt,
  readTime = "3 mnt baca",
  author,
}: PostCardProps) {
  const formattedDate = typeof createdAt === "string"
    ? new Date(createdAt)
    : createdAt;

  const timeAgo = formatDistanceToNow(formattedDate, {
    addSuffix: true,
    locale: id,
  });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group grid grid-cols-1 md:grid-cols-4 gap-6 py-8 border-b border-gray-100 dark:border-gray-800/60 first:pt-0 last:border-0 hover:bg-gray-50/30 dark:hover:bg-gray-900/10 p-4 -mx-4 rounded-2xl transition-colors duration-300"
    >
      <div className="md:col-span-3 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Author info & Metadata */}
          <div className="flex items-center gap-2 text-xs font-sans text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white hover:underline">
              {author?.name || "Anonim"}
            </span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span>{timeAgo}</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="text-rose-600 dark:text-rose-400 font-medium">{readTime}</span>
          </div>

          {/* Title */}
          <Link href={`/blog/${slug}`} className="block group-hover:text-rose-600 transition-colors duration-300">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              {title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 font-sans">
            {excerpt || "Tidak ada deskripsi singkat untuk artikel ini."}
          </p>
        </div>

        {/* Read More Link */}
        <div>
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-1 text-sm font-sans font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline transition-all"
          >
            Baca selengkapnya
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      {coverImage && (
        <div className="md:col-span-1 order-first md:order-last">
          <Link href={`/blog/${slug}`} className="block overflow-hidden rounded-xl aspect-[16/10] md:aspect-square bg-gray-100 dark:bg-gray-800">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>
        </div>
      )}
    </motion.article>
  );
}
