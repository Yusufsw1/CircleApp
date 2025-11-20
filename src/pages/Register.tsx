import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);
      navigate("/home");
    } catch (err) {
      console.log(err);
      alert("Register gagal!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-6">
      <div className="w-full max-w-sm text-white">
        <h1 className="text-green-500 text-3xl font-bold mb-10">circle</h1>
        <h2 className="text-2xl font-semibold mb-6">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" type="text" placeholder="Username *" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg" onChange={handleChange} />

          <input name="name" type="text" placeholder="Full Name *" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg" onChange={handleChange} />

          <input name="email" type="email" placeholder="Email *" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg" onChange={handleChange} />

          <input name="password" type="password" placeholder="Password *" className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg" onChange={handleChange} />

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-full font-semibold">
            Register
          </button>
        </form>

        <p className="text-sm text-neutral-400 mt-4 text-center">
          Already have an account?
          <Link to="/" className="text-green-500 ml-1 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
