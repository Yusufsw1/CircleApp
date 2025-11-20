import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./lib/ProtectedRoute";
import { AuthProvider } from "./contex/AuthProvider";
import { ThreadProvider } from "./contex/ThreadProvider";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThreadProvider>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThreadProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
