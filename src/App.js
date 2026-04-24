import "bootstrap/dist/css/bootstrap.min.css";
import Users from "./Users";
import AddUserWithPhoto from "./AddUserWithPhoto";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Menu from "./Menu";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  let navigate = useNavigate();
  function ProtectedRoute({ user }) {
    return user ? (
      <Outlet />
    ) : (
      <Navigate
        to="/login"
        state={{ message: "Session expired. Please login again." }}
        replace
      />
    );
  }
  const isSessionExpired = () => {
    const loginTime = localStorage.getItem("loginTime");

    if (!loginTime) return true;

    const now = Date.now();
    const diff = now - loginTime;

    return diff > 120000; // 2 minutes
  };

  useEffect(() => {
    const checkSession = () => {
      if (isSessionExpired()) {
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");

        // ⚠️ IMPORTANT: only navigate if not already on login
        if (window.location.pathname !== "/login") {
          navigate("/login", {
            replace: true,
            state: { flash: "Session expired" },
          });
        }
      }
    };

    checkSession(); // 🔥 run once immediately

    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [navigate]);
  return (
    <>
      <Menu user={user} setUser={setUser} />
      <Routes>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/crud" element={<Users user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Route>
        <Route index element={<AddUserWithPhoto />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
