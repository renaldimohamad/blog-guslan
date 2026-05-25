"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  createdAt: string | Date;
  readTime?: string;
  author?: {
    name: string | null;
  };
}

interface RealtimeBlogListProps {
  initialPosts: Post[];
}

export default function RealtimeBlogList({ initialPosts }: RealtimeBlogListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    // TEMPORARILY DISABLED PUSHER REALTIME TO PREVENT DUPLICATES/BUGS
    // We rely purely on Next.js server component caching & revalidatePath.

    // const pusher = getPusherClient();
    // if (!pusher) return;
    // ...
  }, []);

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="space-y-16">
      {/* Realtime Status Indicator Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800/60">
        <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-gray-500">
          Artikel Pilihan & Terbaru
        </h2>
        {/* Realtime Status Hidden Temporarily */}
      </div>

      {/* Featured Article Section with beautiful animation */}
      <AnimatePresence mode="popLayout">
        {featuredPost && (
          <motion.div
            key={`featured-${featuredPost.id}`}
            layoutId={`featured-container-${featuredPost.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-gray-100 dark:border-gray-800/60"
          >
            {/* Featured Image */}
            <div className="lg:col-span-7">
              <Link href={`/blog/${featuredPost.slug}`} className="block overflow-hidden rounded-2xl aspect-[16/10] bg-gray-100 dark:bg-gray-800 border border-gray-100/50 dark:border-gray-800/30">
                <img
                  src={featuredPost.coverImage || "/images/guslan_photo_3.jpeg"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700 ease-out"
                />
              </Link>
            </div>

            {/* Featured Content Info */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
              <div className="flex items-center gap-2 text-xs font-sans text-gray-500 dark:text-gray-400">
                <span className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
                  Artikel Pilihan
                </span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {featuredPost.author?.name || "Guslan Batalipu"}
                </span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span>
                  {formatDistanceToNow(new Date(featuredPost.createdAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </span>
              </div>

              <Link href={`/blog/${featuredPost.slug}`} className="block group-hover:text-rose-600 transition-colors duration-300">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {featuredPost.title}
                </h3>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-sans line-clamp-4">
                {featuredPost.excerpt || "Tidak ada deskripsi singkat untuk artikel ini."}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-sans font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline transition-all"
                >
                  Mulai Membaca
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <span className="text-xs font-sans text-gray-400 font-medium">
                  {featuredPost.readTime || "3 mnt baca"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Latest Stories Section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Cerita Terbaru
        </h3>

        <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
          <AnimatePresence mode="popLayout">
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center space-y-4"
              >
                <div className="text-4xl">✍️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Belum ada cerita yang dipublikasikan.
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm">
                  Kembali lagi nanti untuk menikmati konten storytelling premium dari kami.
                </p>
              </motion.div>
            ) : remainingPosts.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-400 dark:text-gray-600 font-sans">
                Tidak ada cerita tambahan.
              </div>
            ) : (
              remainingPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  slug={post.slug}
                  coverImage={post.coverImage}
                  createdAt={post.createdAt}
                  readTime={post.readTime}
                  author={post.author}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
