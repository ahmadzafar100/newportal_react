import "bootstrap/dist/css/bootstrap.min.css";
import Users from "./Users";
import AddUserWithPhoto from "./AddUserWithPhoto";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { Route, Routes } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<AddUserWithPhoto />} />
        <Route path="/crud" element={<Users />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
