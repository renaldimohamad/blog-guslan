import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl animate-pulse space-y-4">
      <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
      <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
        Memuat Data...
      </h3>
      <p className="text-gray-400 text-sm font-sans max-w-xs text-center">
        Sedang menyinkronkan data admin Anda dari server, mohon tunggu sebentar.
      </p>
    </div>
  );
}
