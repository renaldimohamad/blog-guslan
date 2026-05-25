"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Menu, X } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import SignOutButton from "../ui/SignOutButton";

export default function NavbarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-[#0F1115]/85 backdrop-blur-md border-b border-gray-100 dark:border-gray-850/60 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/guslan_photo_3.jpeg"
            alt="Logo"
            className="w-10 h-10 rounded-full object-cover transition-all duration-500 border border-gray-200 dark:border-gray-800 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tighter dark:text-white leading-none">
              Guslan Batalipu
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/60 dark:hover:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all font-sans"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="bg-rose-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/10 font-sans"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-[#0F1115]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          {isLoggedIn ? (
            <>
              <Link
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/60 dark:hover:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all font-sans w-full"
              >
                <LayoutDashboard size={16} />
                Dashboard Admin
              </Link>
              <div onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                <SignOutButton className="w-full justify-center py-3" />
              </div>
            </>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-rose-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-rose-700 transition-all text-center shadow-lg shadow-rose-600/10 font-sans w-full"
            >
              Masuk ke Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
