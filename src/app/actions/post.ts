"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer, hasPusherCredentials } from "@/lib/pusher";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import { calculateReadTime, generateExcerpt } from "@/lib/blogUtils";

// Generate unique slug
async function generateUniqueSlug(title: string, postId?: string): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findFirst({
      where: {
        slug,
        ...(postId ? { NOT: { id: postId } } : {}),
      },
    });

    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function createPost(formData: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" };
    }

    const { title, content, excerpt, coverImage, published } = formData;

    const generatedSlug = await generateUniqueSlug(title);
    const finalExcerpt = excerpt || generateExcerpt(content);

    const post = await prisma.post.create({
      data: {
        title,
        slug: generatedSlug,
        content,
        excerpt: finalExcerpt,
        coverImage: coverImage || null,
        published,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Disabled Pusher triggering for stability
    /*
    if (published && hasPusherCredentials) {
      try {
        await pusherServer.trigger("blog-channel", "post-published", {
          ...post,
          readTime: calculateReadTime(post.content),
        });
      } catch (error) {
        console.error("Failed to trigger Pusher event:", error);
      }
    }
    */

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    revalidatePath("/admin/dashboard");

    return { success: true, post };
  } catch (error: any) {
    console.error("Error creating post:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat membuat artikel." };
  }
}

export async function updatePost(
  id: string,
  formData: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" };
    }

    const { title, content, excerpt, coverImage, published } = formData;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { success: false, error: "Artikel tidak ditemukan" };
    }

    const generatedSlug = await generateUniqueSlug(title, id);
    const finalExcerpt = excerpt || generateExcerpt(content);

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug: generatedSlug,
        content,
        excerpt: finalExcerpt,
        coverImage: coverImage || null,
        published,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Disabled Pusher triggers for stability
    /*
    if (hasPusherCredentials) {
      ...
    }
    */

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/posts");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/admin/edit/${id}`);

    return { success: true, post };
  } catch (error: any) {
    console.error("Error updating post:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat menyimpan artikel." };
  }
}

export async function deletePost(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { success: false, error: "Artikel tidak ditemukan" };
    }

    await prisma.post.delete({
      where: { id },
    });

    // Disabled Pusher event
    /*
    if (existingPost.published && hasPusherCredentials) {
      ...
    }
    */

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat menghapus artikel." };
  }
}

export async function togglePublishPost(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized - Admin access required" };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!existingPost) {
      return { success: false, error: "Artikel tidak ditemukan" };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        published: !existingPost.published,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Disabled Pusher event
    /*
    if (hasPusherCredentials) {
      ...
    }
    */

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath("/admin/posts");
    revalidatePath("/admin/dashboard");

    return { success: true, post: updatedPost };
  } catch (error: any) {
    console.error("Error toggling publish post:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat mengubah status artikel." };
  }
}
