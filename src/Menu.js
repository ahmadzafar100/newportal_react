import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

const Menu = ({ user, setUser }) => {
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
        localStorage.removeItem("user");
        setUser(null);
        // navigate("/login", { replace: true }); // important
        navigate("/login", {
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
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/posts">
                  Posts
                </Nav.Link>
                <Nav.Link as={Link} to="/crud">
                  CRUD
                </Nav.Link>
                <Nav.Link as={Link} to="/change-password">
                  Change Password
                </Nav.Link>
                <Nav.Link role="button" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
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
