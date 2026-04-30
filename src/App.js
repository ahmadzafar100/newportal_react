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
  const [warningShown, setWarningShown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();
  function ProtectedRoute({ user }) {
    const existingToast = location.state?.toast;

    if (!user) {
      if (isExpiring) return null;
      if (isLoggingOut) return null;
      return (
        <Navigate
          to="/"
          replace
          state={
            existingToast
              ? location.state // ✅ keep existing message
              : {
                  toast: {
                    title: "Warning",
                    message: "Please login first.",
                  },
                }
          }
        />
      );
    }

    return <Outlet />;
  }
  /* const isSessionExpired = () => {
    const loginTime = localStorage.getItem("loginTime");

    if (!loginTime) return true;

    const now = Date.now();
    const diff = now - loginTime;

    return diff > 30000; // 10 minutes
  }; */

  const updateActivity = () => {
    localStorage.setItem("lastActivity", Date.now());
    setWarningShown(false);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  /* const isIdle = () => {
    const last = localStorage.getItem("lastActivity");

    if (!last) return false;

    const diff = Date.now() - last;

    return diff > 30000; // 10 minutes
  }; */

  useEffect(() => {
    const checkIdle = () => {
      const last = localStorage.getItem("lastActivity");
      if (!last) return;

      const diff = Date.now() - last;

      if (diff > 540000 && diff < 600000 && !warningShown) {
        setWarningShown(true);

        navigate(location.pathname, {
          replace: true,
          state: {
            toast: {
              title: "Warning",
              message: "Session will expire in 1 minute!",
            },
          },
        });
      }

      if (diff >= 600000) {
        setIsExpiring(true);
        localStorage.clear();
        setUser(null);

        navigate("/", {
          replace: true,
          state: {
            toast: {
              title: "Danger",
              message: "Session expired due to inactivity.",
            },
          },
        });
      }
    };

    const interval = setInterval(checkIdle, 5000);
    return () => clearInterval(interval);
  }, [navigate, warningShown]);

  /* useEffect(() => {
    const checkSession = () => {
      if (isSessionExpired()) {
        setIsExpiring(true);
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
        setUser(null);

        if (
          window.location.pathname !== "/" &&
          window.location.pathname !== "/signup"
        ) {
          navigate("/", {
            replace: true,
            state: {
              toast: {
                title: "Danger",
                message: "Session expired. Please login again.",
              },
            },
          });
        }
      }
    };

    checkSession(); // 🔥 run once immediately

    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [navigate]); */
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
          progress: 100, // 🔥 MUST
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
      <Menu user={user} setUser={setUser} setIsLoggingOut={setIsLoggingOut} />
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
        <Route path="/signup" element={<AddUserWithPhoto />} />
        <Route index element={<Login user={user} setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
