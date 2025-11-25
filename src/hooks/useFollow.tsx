import { useContext } from "react";
import { FollowContext } from "@/contex/FollowContext";

export const useFollows = () => {
  const ctx = useContext(FollowContext);
  if (!ctx) throw new Error("useFollows must be used inside FollowProvider");
  return ctx;
};
