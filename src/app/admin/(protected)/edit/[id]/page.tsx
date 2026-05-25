import { prisma } from "@/lib/prisma";
import PostEditorForm from "@/components/ui/PostEditorForm";
import { notFound } from "next/navigation";

export const revalidate = 0; // Dynamic rendering to fetch fresh post content

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const initialData = {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    published: post.published,
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Edit Artikel Cerita
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mt-1">
          Ubah konten, perbarui draf, atau sesuaikan gambar sampul cerita Anda.
        </p>
      </div>

      <PostEditorForm initialData={initialData} />
    </div>
  );
}
