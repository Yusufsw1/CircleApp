import { Home, UserSearch, CircleUser, LogOut, PenSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-6 fixed">
      <h1 className="text-5xl font-bold text-green-500">circle</h1>

      <div className="flex flex-col gap-3">
        <Link to="/home">
          <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-amber-50 ">
            <Home /> Home
          </Button>
        </Link>
        <Link to="/home/follows?type=followers">
          <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-amber-50">
            <Heart /> Follower
          </Button>
        </Link>
        <Link to="/home/search">
          <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-amber-50">
            <UserSearch /> Search
          </Button>
        </Link>
        <Link to="/home/profile">
          <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-amber-50">
            <CircleUser /> Profile
          </Button>
        </Link>
      </div>

      <Button className="bg-green-600 hover:bg-green-700 rounded-full font-semibold">
        <PenSquare className="mr-2" /> Create Post
      </Button>

      <Button variant="ghost" className="text-white  hover:bg-red-800 mt-auto " onClick={logout}>
        <LogOut className="mr-2" /> Logout
      </Button>
    </div>
  );
}
