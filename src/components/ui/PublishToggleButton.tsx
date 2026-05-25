"use client";

import { useState, useTransition } from "react";
import { togglePublishPost } from "@/app/actions/post";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface PublishToggleButtonProps {
  id: string;
  isPublished: boolean;
}

export default function PublishToggleButton({ id, isPublished }: PublishToggleButtonProps) {
  const [isPending, startTransition] = useTransition();
  // Optimistic UI state
  const [optimisticPublished, setOptimisticPublished] = useState(isPublished);

  const handleToggle = async () => {
    // Optimistically toggle state
    setOptimisticPublished((prev) => !prev);

    startTransition(async () => {
      try {
        const result = await togglePublishPost(id);
        if (result.success && result.post) {
          toast.success(
            result.post.published
              ? "✨ Artikel berhasil diterbitkan!"
              : "📁 Artikel diarsipkan ke draf."
          );
        }
      } catch (error: any) {
        // Rollback state if error occurs
        setOptimisticPublished(isPublished);
        toast.error("Gagal mengubah status artikel", {
          description: error.message || "Terjadi kesalahan internal.",
        });
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-xl border transition-all duration-350 cursor-pointer ${optimisticPublished
        ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/70 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-950/40"
        : "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/70 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-950/40"
        } ${isPending ? "opacity-60 cursor-not-allowed scale-95" : "hover:scale-105"}`}
      title={optimisticPublished ? "Arsipkan ke Draf" : "Terbitkan Artikel"}
    >
      {optimisticPublished ? <Eye size={15} /> : <EyeOff size={15} />}
    </button>
  );
}
