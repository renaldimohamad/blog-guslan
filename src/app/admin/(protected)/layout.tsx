import { auth } from "@/auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  PenTool, 
  FileText, 
  Home, 
  User as UserIcon,
  BookOpen
} from "lucide-react";
import SignOutButton from "@/components/ui/SignOutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const adminName = session?.user?.name || "Guslan Batalipu";
  const adminEmail = session?.user?.email || "admin@blog.com";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
      {/* Premium Admin Sidebar */}
      <aside className="lg:col-span-3 space-y-6">
        {/* Profile Card */}
        <div className="bg-gray-50/80 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-850 p-5 rounded-3xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold font-sans">
            G
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {adminName}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-sans truncate">
              {adminEmail}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-4 rounded-3xl space-y-1">
          <span className="block px-3 py-2 text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400">
            Navigasi Admin
          </span>

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 dark:text-gray-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/15 transition-all duration-200"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          <Link
            href="/admin/write"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 dark:text-gray-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/15 transition-all duration-200"
          >
            <PenTool size={17} />
            Tulis Cerita
          </Link>

          <Link
            href="/admin/posts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 dark:text-gray-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/15 transition-all duration-200"
          >
            <FileText size={17} />
            Kelola Cerita
          </Link>

          <hr className="my-2 border-gray-100 dark:border-gray-800" />

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-gray-600 hover:text-rose-600 hover:bg-rose-50/50 dark:text-gray-300 dark:hover:text-rose-400 dark:hover:bg-rose-950/15 transition-all duration-200"
          >
            <Home size={17} />
            Kembali ke Web
          </Link>
        </nav>

        {/* Quick Sign Out Box */}
        <div className="bg-rose-50/10 dark:bg-rose-950/5 border border-rose-100/10 dark:border-rose-950/10 p-4 rounded-3xl flex justify-center">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Admin Workspace Content Area */}
      <main className="lg:col-span-9 space-y-6">
        {children}
      </main>
    </div>
  );
}
