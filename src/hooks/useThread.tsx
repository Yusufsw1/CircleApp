import { useContext } from "react";
import { ThreadContext } from "@/contex/ThreadContex";

export const useThread = () => {
  const ctx = useContext(ThreadContext);
  if (!ctx) {
    throw new Error("ThreadContext tidak ditemukan. Pastikan dibungkus oleh ThreadProvider");
  }
  return ctx;
};
