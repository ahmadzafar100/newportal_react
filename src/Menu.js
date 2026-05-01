import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router";
import Swal from "sweetalert2";

const Menu = ({ user, setUser, setIsLoggingOut }) => {
  let navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You really want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
      confirmButtonText: "Logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoggingOut(true);
        localStorage.clear();
        setUser(null);
        navigate("/", {
          replace: true,
          state: {
            toast: {
              title: "Success",
              message: "Logged out successfully.",
            },
          },
        });
      }
    });
  };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>React</Navbar.Brand>
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/posts"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Posts
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/crud"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  CRUD
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/data"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Data
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/change-password"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Change Password
                </Nav.Link>
                <Nav.Link role="button" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/signup"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Signup
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  to="/"
                >
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Menu;
