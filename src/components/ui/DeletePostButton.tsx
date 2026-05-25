"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/app/actions/post";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface DeletePostButtonProps {
  id: string;
}

export default function DeletePostButton({ id }: DeletePostButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deletePost(id);
        if (result?.success) {
          toast.success("🗑️ Artikel berhasil dihapus permanen.");
          setIsOpen(false);
        } else {
          toast.error("Gagal menghapus artikel", {
            description: result?.error || "Terjadi kesalahan yang tidak diketahui.",
          });
        }
      } catch (error: any) {
        toast.error("Gagal memproses penghapusan", {
          description: error.message || "Terjadi kesalahan internal.",
        });
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer hover:scale-105"
        title="Hapus Artikel"
      >
        <Trash2 size={15} />
      </button>

      {/* Premium Confirm Modal with elastic blur */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setIsOpen(false)}
              className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 md:p-8 rounded-3xl max-w-sm w-full shadow-2xl space-y-6 z-10"
            >
              {/* Close Button */}
              <button
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Icon Alert banner */}
              <div className="flex gap-4">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl shrink-0 h-fit">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    Hapus Artikel?
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                    Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 font-sans">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleDelete}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isPending ? (
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
