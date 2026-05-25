"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/actions/post";
import { calculateReadTime } from "@/lib/blogUtils";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, EyeOff, Sparkles, Bold, Italic, List } from "lucide-react";
import Link from "next/link";

interface PostData {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
}

interface PostEditorFormProps {
  initialData?: PostData;
}

export default function PostEditorForm({ initialData }: PostEditorFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (syntax: string, isList = false) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newText = "";
    if (isList) {
      newText = `\n- ${selectedText || "list item"}\n`;
    } else {
      newText = `${syntax}${selectedText || "text"}${syntax}`;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      if (selectedText.length === 0) {
        if (isList) {
          textarea.setSelectionRange(start + 3, start + 3 + 9);
        } else {
          textarea.setSelectionRange(start + syntax.length, start + syntax.length + 4);
        }
      } else {
        textarea.setSelectionRange(start + newText.length, start + newText.length);
      }
    }, 0);
  };

  // Word count & Read time calculation
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTimeStr = calculateReadTime(content);

  const handleSubmit = async (e: React.FormEvent, forcePublishState?: boolean) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Format input salah", {
        description: "Judul dan isi artikel wajib diisi.",
      });
      return;
    }

    const finalPublished = forcePublishState !== undefined ? forcePublishState : published;

    startTransition(async () => {
      try {
        const formData = {
          title,
          content,
          excerpt: excerpt.trim() || undefined,
          coverImage: coverImage.trim() || undefined,
          published: finalPublished,
        };

        let result;
        if (initialData?.id) {
          result = await updatePost(initialData.id, formData);
        } else {
          result = await createPost(formData);
        }

        if (result?.success) {
          toast.success(
            finalPublished
              ? "✨ Artikel berhasil diterbitkan!"
              : "📁 Draf artikel berhasil disimpan."
          );
          router.push("/admin/posts");
          router.refresh();
        } else {
          toast.error("Gagal menyimpan artikel", {
            description: result?.error || "Terjadi kesalahan yang tidak diketahui.",
          });
        }
      } catch (error: any) {
        toast.error("Gagal memproses", {
          description: error.message || "Terjadi kesalahan internal.",
        });
      }
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="max-w-[700px] mx-auto space-y-8 font-sans pb-20">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-5">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          Kembali
        </Link>
        <div className="flex items-center gap-2.5">
          {/* Save as Draft Button */}
          <button
            type="button"
            disabled={isPending}
            onClick={(e) => {
              setPublished(false);
              handleSubmit(e, false);
            }}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 border border-gray-150 dark:border-gray-850 text-gray-700 dark:text-gray-300 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <EyeOff size={13} />
            Simpan Draf
          </button>

          {/* Publish / Save Changes Button */}
          <button
            type="button"
            disabled={isPending}
            onClick={(e) => {
              setPublished(true);
              handleSubmit(e, true);
            }}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/10 disabled:opacity-50"
          >
            {isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Sparkles size={13} />
                {initialData?.id ? "Simpan & Terbitkan" : "Terbitkan Realtime"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="space-y-6">

        {/* Title Input (Premium Serif) */}
        <div className="space-y-1.5">
          <textarea
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Auto grow
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Masukkan Judul Cerita Indah Anda..."
            rows={1}
            className="w-full bg-transparent text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white outline-none resize-none border-b border-transparent focus:border-gray-100 dark:focus:border-gray-800/80 pb-2 leading-tight placeholder-gray-300 dark:placeholder-gray-700 transition-colors"
            required
            onFocus={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        </div>

        {/* Excerpt Input (Sub-title / Deskripsi Singkat) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400">
            Deskripsi Singkat (Otomatis dibuat jika dikosongkan)
          </span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Tulis ringkasan satu kalimat yang memikat pembaca..."
            rows={2}
            className="w-full bg-transparent border-0 outline-none text-gray-500 dark:text-gray-400 text-base resize-none font-sans placeholder-gray-300 dark:placeholder-gray-700"
          />
        </div>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Markdown Toolbar */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800 w-fit">
          <button
            type="button"
            onClick={() => insertMarkdown("**")}
            className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("*")}
            className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <button
            type="button"
            onClick={() => insertMarkdown("-", true)}
            className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List size={16} />
          </button>
        </div>

        {/* Comfortable Writing Area */}
        <div className="space-y-1.5 min-h-[400px]">
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Mulailah mengalirkan kata-kata dan menuangkan cerita berharga Anda di sini (Mendukung tulisan Markdown)..."
            className="w-full min-h-[450px] bg-transparent border-0 outline-none resize-none text-[17px] md:text-[18px] text-gray-800 dark:text-gray-200 leading-[1.85] font-sans placeholder-gray-300 dark:placeholder-gray-700"
            required
          />
        </div>
      </div>

      {/* Dynamic bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800/60 transition-colors duration-300">
        <div className="max-w-[700px] mx-auto px-6 h-12 flex items-center justify-between text-xs font-sans text-gray-400">
          <div className="flex items-center gap-4">
            <span>{wordCount} kata</span>
            <span>•</span>
            <span className="text-rose-600 dark:text-rose-400 font-medium">{readTimeStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {published ? "Siap Terbit" : "Draf"}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
