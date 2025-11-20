import prisma from "../connection/client";

export async function getThreads(limit: number, currentUserId: number) {
  const threads = await prisma.threads.findMany({
    take: limit || 25,
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      likes: true,
      replies: true,
    },
  });

  return threads.map((thread) => {
    return {
      id: thread.id,
      content: thread.content,
      image: thread.image,
      created_at: thread.created_at,

      user: {
        id: thread.user.id,
        username: thread.user.username,
        name: thread.user.full_name,
        profile_picture: thread.user.photo_profile,
      },

      likes: thread.likes.length,
      reply: thread.replies.length,

      isLiked: thread.likes.some((like) => like.user_id === currentUserId),
    };
  });
}
