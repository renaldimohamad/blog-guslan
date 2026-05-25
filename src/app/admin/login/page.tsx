"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Format input salah", {
        description: "Email dan password wajib diisi.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Gagal Masuk", {
          description: "Email atau password yang Anda masukkan salah.",
        });
      } else {
        toast.success("Berhasil Masuk!", {
          description: "Selamat datang kembali, Admin.",
        });
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi beberapa saat lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[420px] mx-auto my-12 md:my-20">
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 md:p-10 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-none space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-xl font-bold font-serif">
            G
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Masuk Admin
          </h1>
          <p className="text-xs text-gray-400 font-sans uppercase tracking-widest font-semibold">
            Portal Storytelling Guslan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@blog.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:focus:bg-gray-950 dark:text-white transition-all font-sans"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:focus:bg-gray-950 dark:text-white transition-all font-sans"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/60 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-600/10 flex items-center justify-center gap-2 font-sans cursor-pointer group"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Masuk ke Dashboard
                <ArrowRight size={16} className="transform group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400 font-sans">
            Gunakan kredensial default untuk pengujian lokal.
          </p>
        </div>
      </div>
    </div>
  );
}
