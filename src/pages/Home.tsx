import Feed from "@/components/ui/Feed";
import Sidebar from "@/components/ui/Sidebar";
import RightSidebar from "@/components/ui/RightSidebar";
import CreateThreadForm from "@/components/ui/FormThread";

export default function Home() {
  return (
    <div className="grid grid-cols-12 min-h-screen bg-neutral-950 text-white">
      <div className="col-span-2 p-4 border-r border-neutral-800 posi ">
        <Sidebar />
      </div>
      <div className="col-span-7 p-6 overflow-y-auto">
        <CreateThreadForm />
        <Feed />
      </div>
      <div className="col-span-3 p-4 border-l border-neutral-800">
        <RightSidebar />
      </div>
    </div>
  );
}
