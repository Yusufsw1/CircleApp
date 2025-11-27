import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./lib/ProtectedRoute";
import { AuthProvider } from "./contex/AuthProvider";
import { ThreadProvider } from "./contex/ThreadProvider";
import ThreadDetail from "./pages/ThreadDetail";
import { ProfileProvider } from "./contex/ProfileProvider";
import { FollowProvider } from "./contex/FollowProvider";
import FollowsPage from "./pages/FollowsPage";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThreadProvider>
          <ProfileProvider>
            <FollowProvider>
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
                >
                  <Route path="thread/:id" element={<ThreadDetail />} />
                  <Route path="follows" element={<FollowsPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="search" element={<Search />} />
                </Route>
              </Routes>
            </FollowProvider>
          </ProfileProvider>
        </ThreadProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
