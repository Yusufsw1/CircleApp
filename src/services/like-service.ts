// import prisma from "../connection/client";

// export async function likeThreadService({ thread_id, user_id }: { thread_id: number; user_id: number }) {
//   const isLiked = await prisma.likes.findFirst({
//     where: { thread_id, user_id },
//   });

//   if (isLiked) throw new Error("User already liked this thread");

//   await prisma.likes.create({
//     data: {
//       thread_id,
//       user_id,
//     },
//   });

//   const totalLikes = await prisma.likes.count({
//     where: { thread_id },
//   });

//   return { totalLikes };
// }

// export async function unlikeThreadService({ thread_id, user_id }: { thread_id: number; user_id: number }) {
//   const isLiked = await prisma.likes.findFirst({
//     where: { thread_id, user_id },
//   });

//   if (!isLiked) throw new Error("User has not liked this thread");

//   await prisma.likes.delete({
//     where: { id: isLiked.id },
//   });

//   const totalLikes = await prisma.likes.count({
//     where: { thread_id },
//   });

//   return { totalLikes };
// }
