import { prisma } from "@/lib/prisma";
import RealtimeBlogList from "@/components/blog/RealtimeBlogList";
import { calculateReadTime } from "@/lib/blogUtils";

export const revalidate = 0; // Dynamic rendering to always show freshest list, relying on revalidatePath

export default async function HomePage() {
  // Fetch published posts from Postgres
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  // Dynamic formatting for reader experiences
  const serializedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    createdAt: post.createdAt.toISOString(),
    readTime: calculateReadTime(post.content),
    author: {
      name: post.author?.name || "Guslan Batalipu",
    },
  }));

  return (
    <div className="space-y-16">
      {/* Premium Minimal Storytelling Hero */}
      <section className="py-12 md:py-20 border-b border-gray-100 dark:border-gray-800/60">
        <div className="max-w-3xl space-y-6">
          {/* <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] animate-fade-in">
            Ruang untuk kata-kata, ide, dan cerita yang bermakna.
          </h1> */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] animate-fade-in">
            Ceritaku
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-sans leading-relaxed max-w-2xl font-light">
            Catatan kecil tentang hidup, belajar, dan hal-hal yang aku temui di perjalanan.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
              Topik populer:
            </span>
            {["Cerita", "Pengalaman", "Belajar", "Perjalanan"].map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors duration-300 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Realtime Stories */}
      <RealtimeBlogList initialPosts={serializedPosts} />
    </div>
  );
}
