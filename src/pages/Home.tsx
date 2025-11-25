import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import CreateThreadForm from "@/components/FormThread";
import { Outlet, useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  const isThreadDetail = location.pathname.includes("/thread/");
  const isFollowsPage = location.pathname.includes("/follows");

  const hideMainFeed = isThreadDetail || isFollowsPage;
  return (
    <div className="grid grid-cols-12 min-h-screen bg-neutral-950 text-white">
      <div className="col-span-2 p-4 border-r border-neutral-800 posi ">
        <Sidebar />
      </div>
      <div className="col-span-7 p-6 overflow-y-auto">
        {!hideMainFeed && <CreateThreadForm />}
        {!hideMainFeed && <Feed />}
        <Outlet />
      </div>
      <div className="col-span-3 p-4 border-l border-neutral-800">
        <RightSidebar />
      </div>
    </div>
  );
}
