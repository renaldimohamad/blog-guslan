// src/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

// Helper untuk mengubah nama bulan Indonesia ke Inggris agar bisa di-parse Date
const parseIndonesianDate = (dateStr: string) => {
  const months: { [key: string]: string } = {
    Januari: "January",
    Februari: "February",
    Maret: "March",
    April: "April",
    Mei: "May",
    Juni: "June",
    Juli: "July",
    Agustus: "August",
    September: "September",
    Oktober: "October",
    November: "November",
    Desember: "December",
  };

  let formattedDate = dateStr;
  Object.keys(months).forEach((key) => {
    formattedDate = formattedDate.replace(key, months[key]);
  });
  return new Date(formattedDate);
};

export function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: data,
    content,
  };
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPosts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      ...(data as {
        title: string;
        date: string;
        author: string;
        excerpt: string;
        readTime: string;
      }),
    };
  });

  // SORTING DISINI: Tanggal terbaru (descending)
  return allPosts.sort((a, b) => {
    const dateA = parseIndonesianDate(a.date).getTime();
    const dateB = parseIndonesianDate(b.date).getTime();

    return dateB - dateA; // Hasil positif berarti B lebih baru, taruh di atas
  });
}
