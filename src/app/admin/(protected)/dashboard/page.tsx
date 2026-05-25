import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  FileText,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Clock,
  Layers
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import PublishToggleButton from "@/components/ui/PublishToggleButton";
import DeletePostButton from "@/components/ui/DeletePostButton";

export const revalidate = 0; // Dynamic rendering to always show freshest dashboard stats

export default async function AdminDashboardPage() {
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

  const drafts = posts.filter((p) => !p.published);
  const published = posts.filter((p) => p.published);

  // Simple analytics stats
  const totalWords = posts.reduce((sum, p) => sum + p.content.trim().split(/\s+/).length, 0);
  const avgReadTime = posts.length
    ? Math.ceil(totalWords / (posts.length * 200))
    : 0;

  return (
    <div className="space-y-8">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard Utama
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mt-1">
            Pantau performa, edit draf, dan buat artikel storytelling baru secara instan.
          </p>
        </div>
        <div>
          <Link
            href="/admin/write"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/10 font-sans transition-all duration-300 cursor-pointer"
          >
            <Plus size={16} />
            Tulis Cerita Baru
          </Link>
        </div>
      </div>

      {/* Modern Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        {/* Total Posts */}
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Cerita
            </span>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              <Layers size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {posts.length}
            </span>
            <span className="text-xs text-gray-400">artikel</span>
          </div>
        </div>

        {/* Published Posts */}
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
              Diterbitkan
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
              <Eye size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {published.length}
            </span>
            <span className="text-xs text-gray-400">aktif</span>
          </div>
        </div>

        {/* Draft Posts */}
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Draf Artikel
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400">
              <EyeOff size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {drafts.length}
            </span>
            <span className="text-xs text-gray-400">draf</span>
          </div>
        </div>

        {/* Reading Time stats */}
        <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              Rata-rata Baca
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {avgReadTime}
            </span>
            <span className="text-xs text-gray-400">menit/artikel</span>
          </div>
        </div>
      </div>

      {/* Main Lists Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Draft Posts Column */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850/60 pb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <EyeOff size={18} className="text-amber-500" />
              Draf Terbaru ({drafts.length})
            </h2>
            <Link
              href="/admin/posts"
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold font-sans hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {drafts.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-600 font-sans">
                Tidak ada draf tulisan.
              </div>
            ) : (
              drafts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-950/50 border border-gray-100/50 dark:border-gray-850/30 flex items-center justify-between gap-4 font-sans hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-rose-600">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      Dibuat pada {format(post.createdAt, "dd MMMM yyyy", { locale: id })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PublishToggleButton id={post.id} isPublished={false} />
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <DeletePostButton id={post.id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published Posts Column */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850/60 pb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye size={18} className="text-emerald-500" />
              Telah Terbit ({published.length})
            </h2>
            <Link
              href="/admin/posts"
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold font-sans hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {published.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-600 font-sans">
                Belum ada tulisan terbit.
              </div>
            ) : (
              published.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-950/50 border border-gray-100/50 dark:border-gray-850/30 flex items-center justify-between gap-4 font-sans hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-bold text-gray-900 dark:text-white truncate hover:text-rose-600 block"
                      target="_blank"
                    >
                      {post.title}
                    </Link>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      Terbit pada {format(post.createdAt, "dd MMMM yyyy", { locale: id })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PublishToggleButton id={post.id} isPublished={true} />
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <DeletePostButton id={post.id} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
