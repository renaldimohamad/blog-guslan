import PostEditorForm from "@/components/ui/PostEditorForm";

export default function WritePostPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Tulis Cerita Baru
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mt-1">
          Bagikan pemikiran, tulisan teknis, atau esai sastra Anda ke dalam lembaran digital.
        </p>
      </div>

      <PostEditorForm />
    </div>
  );
}
