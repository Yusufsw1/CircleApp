import prisma from "../connection/client";
import redis from "../connection/redis";

export async function getThreads(limit: number, currentUserId: number) {
  const cacheKey = `threads:limit=${limit}:user=${currentUserId}`;

  // 1. Cek cache Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("THREAD LIST FROM CACHE");
    return JSON.parse(cached);
  }

  const threads = await prisma.threads.findMany({
    take: limit || 25,
    orderBy: { created_at: "desc" },
    include: {
      user: true,
      likes: true,
      replies: true,
    },
  });

  const formatted = threads.map((thread) => {
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
      userLiked: thread.likes.some((l) => l.user_id === currentUserId),
    };
  });
  await redis.set(cacheKey, JSON.stringify(formatted), { EX: 30 });

  return formatted;
}

export async function getThreadDetail(threadId: number, currentUserId: number) {
  const cacheKey = `thread-detail:${threadId}:user=${currentUserId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("THREAD DETAIL FROM CACHE");
    return JSON.parse(cached);
  }

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

  const result = {
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
    userLiked: thread.likes.some((l) => l.user_id === currentUserId),
  };
  await redis.set(cacheKey, JSON.stringify(result), { EX: 60 });

  return result;
}
