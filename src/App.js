import "bootstrap/dist/css/bootstrap.min.css";
import Users from "./Users";
import AddUserWithPhoto from "./AddUserWithPhoto";
import Dashboard from "./Dashboard";
import Login from "./Login";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import Posts from "./Posts";
import ChangePassword from "./ChangePassword";
import Toaster from "./Toaster";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isExpiring, setIsExpiring] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();
  function ProtectedRoute({ user }) {
    const existingToast = location.state?.toast;

    if (!user) {
      if (isExpiring) return null;
      return (
        <Navigate
          to="/login"
          replace
          state={
            existingToast
              ? location.state // ✅ keep existing message
              : {
                  toast: {
                    title: "Warning",
                    message: "Please login first",
                  },
                }
          }
        />
      );
    }

    return <Outlet />;
  }
  const isSessionExpired = () => {
    const loginTime = localStorage.getItem("loginTime");

    if (!loginTime) return true;

    const now = Date.now();
    const diff = now - loginTime;

    return diff > 30000; // 10 minutes
  };

  useEffect(() => {
    const checkSession = () => {
      if (isSessionExpired()) {
        setIsExpiring(true);
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
        setUser(null);

        if (window.location.pathname !== "/login") {
          navigate("/login", {
            replace: true,
            state: {
              toast: {
                title: "Danger",
                message: "Session expired.",
              },
            },
          });
        }
      }
    };

    checkSession(); // 🔥 run once immediately

    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [navigate]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const toastData = location.state?.toast;

    if (toastData) {
      const id = Date.now(); // unique id
      setToasts((prev) => [
        ...prev,
        {
          id,
          title: toastData.title,
          message: toastData.message,
          icon: toastData.icon,
        },
      ]);
      setShow(true); // 🔥 show toast

      // clear state after showing
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return (
    <>
      <Toaster
        show={show}
        setShow={setShow}
        title={title}
        msg={msg}
        toasts={toasts}
        removeToast={removeToast}
      />
      <Menu user={user} setUser={setUser} />
      <Routes>
        <Route element={<ProtectedRoute user={user} isExpiring={isExpiring} />}>
          <Route path="/crud" element={<Users user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/posts" element={<Posts user={user} />} />
          <Route
            path="/change-password"
            element={<ChangePassword user={user} setUser={setUser} />}
          />
        </Route>
        <Route index element={<AddUserWithPhoto />} />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
      </Routes>
    </>
  );
}

export default App;
