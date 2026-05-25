import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { MoveLeft, Calendar, User, Clock } from "lucide-react";
import { SiThreads } from "react-icons/si";
import { RiFacebookFill, RiTwitterXFill } from "react-icons/ri";
import ShareButton from "@/components/ui/ShareButton";
import { calculateReadTime } from "@/lib/blogUtils";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const revalidate = 0; // Dynamic to ensure fresh reads or update dynamically

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch post from PostgreSQL database
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  // Handle post not found or not published
  if (!post || !post.published) {
    notFound();
  }

  const readTimeStr = calculateReadTime(post.content);
  const formattedDate = format(post.createdAt, "dd MMMM yyyy", { locale: id });

  // Fetch related posts (latest 3 posts excluding current)
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      NOT: { id: post.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <article className="max-w-[720px] mx-auto px-4 py-8 md:py-12">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-sans font-medium text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 mb-10 transition-colors group"
      >
        <MoveLeft
          size={16}
          className="group-hover:-translate-x-1.5 transition-transform"
        />
        Kembali ke Beranda
      </Link>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-10 rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header Info */}
      <header className="mb-10 pb-8 border-b border-gray-100 dark:border-gray-800/80">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] text-gray-900 dark:text-white mb-6 tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-sans">
          <div className="flex items-center gap-2">
            <User size={15} className="text-gray-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              {post.author?.name || "Guslan Batalipu"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400 animate-pulse text-rose-500" />
            <span className="text-rose-600 dark:text-rose-400 font-medium">{readTimeStr}</span>
          </div>
        </div>

        {/* Share buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400 mr-2">
            Bagikan cerita:
          </span>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.href : ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:scale-105 transition-all duration-300"
            aria-label="Bagikan ke Facebook"
          >
            <RiFacebookFill size={16} />
          </a>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white hover:scale-105 transition-all duration-300"
            aria-label="Bagikan ke Twitter/X"
          >
            <RiTwitterXFill size={14} />
          </a>

          {/* Threads */}
          <a
            href={`https://threads.net/intent/post?text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black dark:bg-white dark:text-black text-white hover:scale-105 transition-all duration-300"
            aria-label="Bagikan ke Threads"
          >
            <SiThreads size={14} />
          </a>

          <ShareButton title={post.title} />
        </div>
      </header>

      {/* Main Content Body */}
      <div
        className="
          prose prose-rose dark:prose-invert 
          max-w-none 
          text-[17px] md:text-[18px] 
          font-sans
          text-gray-800 dark:text-gray-200
          leading-[1.8] md:leading-[1.9]
          prose-p:mb-6 
          prose-li:my-2
          prose-ul:list-disc prose-ul:pl-5
          prose-ol:list-decimal prose-ol:pl-5
          prose-blockquote:border-l-4 
          prose-blockquote:border-rose-600 
          prose-blockquote:bg-rose-50/30
          dark:prose-blockquote:bg-rose-950/10
          prose-blockquote:py-1 
          prose-blockquote:px-6
          prose-blockquote:rounded-r-lg
          prose-blockquote:italic
          prose-headings:font-serif
          prose-headings:font-extrabold
          prose-headings:tracking-tight
          prose-a:text-rose-600
          dark:prose-a:text-rose-400
          prose-a:underline
          prose-strong:text-gray-900
          dark:prose-strong:text-white
        "
      >
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800/80">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            Cerita Terkait
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => {
              const relatedReadTime = calculateReadTime(related.content);
              return (
                <div
                  key={related.id}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100/50 dark:border-gray-850/50 hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-none hover:border-gray-200/50 dark:hover:border-gray-805 transition-all duration-300"
                >
                  <div className="space-y-3">
                    {related.coverImage && (
                      <Link
                        href={`/blog/${related.slug}`}
                        className="block rounded-lg overflow-hidden aspect-[16/10] bg-gray-100 dark:bg-gray-800 mb-2"
                      >
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                        />
                      </Link>
                    )}
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {relatedReadTime}
                    </span>
                    <Link href={`/blog/${related.slug}`}>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
                        {related.title}
                      </h4>
                    </Link>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100/60 dark:border-gray-800/60 flex items-center justify-between text-[11px] font-sans text-gray-400">
                    <span>{related.author?.name || "Anonim"}</span>
                    <span>
                      {format(new Date(related.createdAt), "dd MMM yyyy", {
                        locale: id,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
