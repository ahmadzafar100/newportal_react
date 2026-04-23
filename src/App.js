import "bootstrap/dist/css/bootstrap.min.css";
import Users from "./Users";
import AddUserWithPhoto from "./AddUserWithPhoto";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { Navigate, Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import Menu from "./Menu";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  function ProtectedRoute({ user, children }) {
    return user ? children : <Navigate to="/login" />;
  }
  return (
    <>
      <Menu user={user} setUser={setUser} />
      <Routes>
        <Route index element={<AddUserWithPhoto />} />
        <Route path="/crud" element={<Users user={user} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
