import type { Thread, Reply } from "@/types/Type";
import { createContext } from "react";
import type { QueryParams } from "@/services/Services";

export type ThreadContextType = {
  threads: Thread[];
  addThread: (t: Thread) => void;
  loadThreads: () => Promise<void>;
  getReplies: (queryparams: QueryParams) => Promise<Reply[]>;
  addReply: (queryparams: QueryParams, formdata: FormData) => Promise<Reply>;
  getThreadById: (id: number) => Thread | null; // ✅ tambahkan ini
  loadThreadById: (id: number) => Promise<Thread>;
  toggleLike: (threadId: number, isLiked: boolean) => Promise<void>;
};
export const ThreadContext = createContext<ThreadContextType | null>(null);
