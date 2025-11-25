import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Search() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200" asChild>
          <Link to="/home" className="flex items-center gap-2 text-white hover:text-gray-300">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Search</h1>
      </div>
    </div>
  );
}
