import prisma from "../connection/client";

type CreateReplyArgs = {
  thread_id: number;
  user_id: number;
  content: string;
  image: string | null;
};

export async function getRepliesByThread(threadId: number, limit: number) {
  const replies = await prisma.replies.findMany({
    where: { thread_id: threadId },
    take: limit,
    orderBy: { created_at: "desc" },
    include: {
      user: true,
    },
  });

  return replies.map((reply) => ({
    id: reply.id,
    content: reply.content,
    created_at: reply.created_at.toISOString(),
    image: reply.image,

    user: {
      id: reply.user.id,
      username: reply.user.username,
      full_name: reply.user.full_name,
      profile_picture: reply.user.photo_profile,
    },
  }));
}
