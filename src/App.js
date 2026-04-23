import "bootstrap/dist/css/bootstrap.min.css";
import Users from "./Users";
import AddUserWithPhoto from "./AddUserWithPhoto";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { Navigate, Outlet, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import Menu from "./Menu";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
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
  return (
    <>
      <Menu user={user} setUser={setUser} />
      <Routes>
        <Route element={<ProtectedRoute user={user} />}>
          <Route index element={<AddUserWithPhoto />} />
          <Route path="/crud" element={<Users user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Route>
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
