// src/app/layout.tsx
import { Open_Sans, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next"; // Tambahkan import type Metadata

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// Konfigurasi Metadata Lengkap
export const metadata: Metadata = {
  title: "Guslan Batalipu - Blog Pribadi",
  description:
    "Selamat datang di blog pribadi Guslan Batalipu! Di sini saya berbagi pemikiran, pengalaman, dan wawasan tentang teknologi, pengembangan web, dan literasi.",

  // Open Graph (Untuk WA, FB, LinkedIn)
  openGraph: {
    title: "Guslan Batalipu - Blog Pribadi",
    description:
      "Berbagi pemikiran, pengalaman, dan wawasan tentang teknologi dan literasi.",
    url: "https://guslanbatalipu.com", // Ganti dengan domain asli nanti
    siteName: "Guslan Batalipu",
    images: [
      {
        url: "/images/guslan_photo_3.jpeg", // Image yang kamu minta
        width: 1200,
        height: 630,
        alt: "Guslan Batalipu",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Guslan Batalipu - Blog Pribadi",
    description:
      "Berbagi pemikiran, pengalaman, dan wawasan tentang teknologi dan literasi.",
    images: ["/images/guslan_photo_3.jpeg"], // Image yang sama
  },

  // Icon browser
  icons: {
    icon: "/images/guslan_photo_3.jpeg", // Ini akan jadi favicon kecil
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${openSans.variable} ${serif.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-5xl mx-auto px-5 md:px-6 py-8 md:py-16 w-full">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
