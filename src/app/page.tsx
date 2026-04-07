import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/blog/PostCard";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="py-10">
      <header className="mb-10">
        <h2 className="text-4xl font-bold mb-4 dark:text-white">Ceritaku</h2>

        <div className="h-1.5 w-12 bg-primary rounded-full"></div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {posts.map((post: any) => (
          <PostCard
            key={post.slug}
            title={post.title}
            date={post.date}
            excerpt={post.excerpt}
            slug={post.slug}
          />
        ))}
      </div>
    </div>
  );
}
