import prisma from "../connection/client";

export async function getFollowersService(user_id: number) {
  const followers = await prisma.follow.findMany({
    where: { following_id: user_id },
    include: {
      follower_user: true,
    },
  });

  return Promise.all(
    followers.map(async (f) => {
      // CEK apakah user login follow balik?
      const check = await prisma.follow.findFirst({
        where: {
          follower_id: user_id, // user login follow siapa
          following_id: f.follower_user.id, // target
        },
      });

      return {
        id: f.follower_user.id,
        username: f.follower_user.username,
        full_name: f.follower_user.full_name,
        photo_profile: f.follower_user.photo_profile,
        is_following: Boolean(check), // ⬅️ TRUE jika follow balik
      };
    })
  );
}

export async function getFollowingService(user_id: number) {
  const followings = await prisma.follow.findMany({
    where: { follower_id: user_id },
    include: {
      following_user: true,
    },
  });

  return followings.map((f) => ({
    id: f.following_user.id,
    username: f.following_user.username,
    full_name: f.following_user.full_name,
    photo_profile: f.following_user.photo_profile,
    is_following: true, // sudah pasti true, karena ini daftar yang kamu follow
  }));
}

export async function followUserService(follower_id: number, followed_user_id: number) {
  if (follower_id === followed_user_id) throw new Error("Cannot follow yourself");

  // Prevent duplicate
  const exists = await prisma.follow.findFirst({
    where: { follower_id, following_id: followed_user_id },
  });
  if (exists) return false;

  await prisma.follow.create({
    data: { follower_id, following_id: followed_user_id },
  });

  return true;
}

export async function unfollowUserService(follower_id: number, followed_id: number) {
  const deleted = await prisma.follow.deleteMany({
    where: { follower_id, following_id: followed_id },
  });

  return deleted.count > 0;
}

export async function countFollowData(user_id: number) {
  const follower_count = await prisma.follow.count({ where: { following_id: user_id } });
  const following_count = await prisma.follow.count({ where: { follower_id: user_id } });
  return { follower_count, following_count };
}
