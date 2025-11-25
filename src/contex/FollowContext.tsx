// src/contex/FollowContext.tsx
import { createContext } from "react";
import type { FollowItem } from "@/types/Type";

export type FollowContextType = {
  list: FollowItem[];
  loadList: (type: "followers" | "following") => Promise<void>;
  toggleFollow: (userId: number, currentlyFollowing?: boolean) => Promise<void>;
};

export const FollowContext = createContext<FollowContextType | null>(null);
