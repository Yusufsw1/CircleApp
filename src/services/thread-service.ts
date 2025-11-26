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
        full_name: thread.user.full_name,
        photo_profile: thread.user.photo_profile,
      },

      likes: thread.likes.length,
      reply: thread.replies.length,
      userLiked: true,
    };
  });
}

export async function getThreadDetail(threadId: number, currentUserId: number) {
  const thread = await prisma.threads.findUnique({
    where: { id: threadId },
    include: {
      user: true,
      likes: true,
      replies: {
        include: {
          user: true,
        },
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!thread) return null;

  return {
    id: thread.id,
    content: thread.content,
    image: thread.image,

    user: {
      id: thread.user.id,
      username: thread.user.username,
      full_name: thread.user.full_name,
      photo_profile: thread.user.photo_profile,
    },

    created_at: thread.created_at,
    likes: thread.likes.length,
    replies: thread.replies.length,
    userLiked: true,
  };
}
