import { followUser, getFollows, unfollowUser } from "@/services/Services";
import type { FollowItem } from "@/types/Type";
import { useCallback, useState } from "react";
import { FollowContext } from "./FollowContext";

export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [list, setList] = useState<FollowItem[]>([]);

  const loadList = useCallback(async (type: "followers" | "following") => {
    try {
      const res = await getFollows(type);
      // API returns data.followers or data.following
      const arr = res.data?.followers ?? res.data?.following ?? [];
      setList(arr);
    } finally {
    }
  }, []);

  const toggleFollow = useCallback(async (userId: number, currentlyFollowing?: boolean) => {
    try {
      if (currentlyFollowing) {
        await unfollowUser(userId);
        setList((prev) => prev.map((p) => (p.id === userId ? { ...p, is_following: false } : p)));
      } else {
        await followUser(userId);
        setList((prev) => prev.map((p) => (p.id === userId ? { ...p, is_following: true } : p)));
      }
    } catch (err) {
      console.error("toggleFollow error:", err);
    }
  }, []);

  return <FollowContext.Provider value={{ list, loadList, toggleFollow }}>{children}</FollowContext.Provider>;
};
