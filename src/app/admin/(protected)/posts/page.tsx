import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit3, Eye, FileText, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PublishToggleButton from "@/components/ui/PublishToggleButton";
import DeletePostButton from "@/components/ui/DeletePostButton";

export const revalidate = 0; // Dynamic rendering to always show freshest lists

export default async function ManagePostsPage() {
  const posts = await prisma.post.findMany({
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Kelola Cerita ({posts.length})
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mt-1">
            Daftar lengkap seluruh artikel Anda. Ubah status terbit, edit konten, atau hapus.
          </p>
        </div>
        <div>
          <Link
            href="/admin/write"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/10 font-sans transition-all duration-300 cursor-pointer"
          >
            <Plus size={16} />
            Tulis Baru
          </Link>
        </div>
      </div>

      {/* Posts List table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden font-sans shadow-xl shadow-gray-100/30 dark:shadow-none">
        {posts.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="text-4xl text-gray-300">📄</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Belum ada artikel cerita.
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm">
              Mulailah membagikan pemikiran dan cerita inspiratif Anda dengan menulis draf baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-6">Artikel</th>
                  <th className="py-4 px-6 hidden md:table-cell">Tanggal Pembuatan</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-55/20 dark:hover:bg-gray-950/30 transition-colors"
                  >
                    {/* Title & Cover */}
                    <td className="py-4 px-6 min-w-[280px]">
                      <div className="flex items-center gap-4">
                        {post.coverImage ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-150 dark:border-gray-800 shrink-0">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 dark:border-gray-850">
                            <FileText size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={post.published ? `/blog/${post.slug}` : `/admin/edit/${post.id}`}
                            className="text-sm font-bold text-gray-900 dark:text-white hover:text-rose-600 transition-colors block line-clamp-1"
                            target={post.published ? "_blank" : undefined}
                          >
                            {post.title}
                          </Link>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-sans block truncate">
                            Oleh {post.author?.name || "Anonim"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date Created */}
                    <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {format(post.createdAt, "dd MMMM yyyy HH:mm", { locale: id })}
                    </td>

                    {/* Published Status tag */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${post.published
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                            }`}
                        ></span>
                        {post.published ? "Terbit" : "Draf"}
                      </span>
                    </td>

                    {/* Actions buttons */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <PublishToggleButton id={post.id} isPublished={post.published} />
                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all hover:scale-105"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </Link>
                        <DeletePostButton id={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
