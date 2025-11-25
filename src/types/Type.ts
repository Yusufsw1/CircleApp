export type User = {
  [x: string]: any;
  id: number;
  username: string;
  name: string;
  full_name?: string;
  profile_picture: string | null;
  bio?: string;
  follower_count: number;
  following_count: number;
};

export type Thread = {
  id: number;
  content: string;
  user_id: number;
  image?: string | null;
  created_at: string;
  replies: number;
  likes: number;
  user: User;
  userLiked: boolean;
};

export type Reply = {
  id: number;
  content: string;
  created_at: string;
  user: User;
  image?: string | null;
};

export type ThreadDetailType = {
  id: number;
  content: string;
  image?: string | null;
  user: User;
  replies: number;
  likes: number;
  userLiked: boolean;
};

export type FollowItem = {
  id: number;
  username: string;
  full_name: string;
  photo_profile?: string | null;
  is_following?: boolean;
};
