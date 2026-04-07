// src/components/blog/PostCard.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PostCard({ title, date, excerpt, slug }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col space-y-3">
      <Link
        href={`/blog/${slug}`}
        className="absolute inset-0 z-10"
        aria-label={title}
      />

      <h3 className="text-[1.25rem] md:text-[1.5rem] leading-tight text-gray-900 dark:text-white transition-colors duration-500 antialiased group-hover:text-primary">
        {title}
      </h3>

      <div className="flex items-center gap-3 text-[11px] md:text-xs font-sans font-bold uppercase tracking-widest">
        <span className="text-primary bg-primary/10 px-2 py-0.5 rounded">
          Ceritaku
        </span>
        <span className="text-gray-400 dark:text-gray-500">{date}</span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-[0.95rem] md:text-[1.05rem] leading-relaxed line-clamp-3">
        {excerpt}
      </p>
    </motion.div>
  );
}
