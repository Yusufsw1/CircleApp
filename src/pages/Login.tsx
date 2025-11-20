import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ identifier, password });
      navigate("/home");
    } catch (err) {
      console.log(err);
      alert("Login gagal!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-6">
      <div className="w-full max-w-sm text-white">
        <h1 className="text-green-500 text-3xl font-bold mb-10">circle</h1>

        <h2 className="text-2xl font-semibold mb-6">Login to Circle</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input type="text" placeholder="Email/Username *" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </div>

          <div>
            <input
              type="password" // FIXED !!!
              placeholder="Password *"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end -mt-2">
            <button type="button" className="text-sm text-neutral-400 hover:underline">
              Forgot password?
            </button>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-full font-semibold">Login</button>
        </form>

        <p className="text-sm text-neutral-400 mt-4 text-center">
          Don’t have an account yet?
          <Link to="/register" className="text-green-500 ml-1 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
