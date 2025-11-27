import { useContext } from "react";
import { LikeContext } from "../contex/LikeContex";

export const useLike = () => {
  const context = useContext(LikeContext);
  if (!context) throw new Error("useLike must be used within a LikeProvider");
  return context;
};
