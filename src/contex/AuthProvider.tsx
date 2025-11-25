/* eslint-disable react-hooks/set-state-in-effect */
import { loginService, registerService } from "../services/Services";
import { useState, useEffect } from "react";
import { AuthContext, type User } from "./AuthContex";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // REGISTER
  const register = async (data: { username: string; name: string; email: string; password: string }) => {
    const response = await registerService(data);

    // response.data harus berisi token + user
    const userData = {
      user_id: response.data.user_id,
      username: response.data.username,
      name: response.data.name,
      email: response.data.email,
      avatar: response.data.avatar,
    };

    setUser(userData);
    setToken(response.data.token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", response.data.token);

    return response;
  };

  // LOGIN
  const login = async (data: { identifier: string; password: string }) => {
    const response = await loginService(data);

    const userData = {
      user_id: response.data.user_id,
      username: response.data.username,
      name: response.data.name,
      email: response.data.email,
      avatar: response.data.avatar,
    };

    setUser(userData);
    setToken(response.data.token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", response.data.token);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
