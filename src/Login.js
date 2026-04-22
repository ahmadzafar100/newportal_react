import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router";

const Login = () => {
  const [message, setMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange", // 👈 important for real-time validation
  });

  useEffect(() => {
    if (errors.email) setFocus("email");
    else if (errors.password) setFocus("password");
  }, [errors]);

  const userLogin = async (data, e) => {
    try {
      //   console.log(data);
      e.preventDefault();
      const url = "http://localhost/testapi/login.php";
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
      let result = await response.json();
      if (response.ok) {
        setMessage(result);
        console.log(result);
        if (result.status) {
          localStorage.setItem("user", JSON.stringify(result.data));
          Navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <>
      <Container className="py-5">
        <Row>
          <Col md={5} sm={6} className="mx-auto">
            <Card>
              <Card.Header as={"h3"} className="bg-dark text-white">
                LOGIN
              </Card.Header>
              <Card.Body>
                {message && message.status ? (
                  <Alert variant="success">{message.message}</Alert>
                ) : message && !message.status ? (
                  <Alert variant="danger">{message.message}</Alert>
                ) : null}
                <Form onSubmit={handleSubmit(userLogin)}>
                  <Form.Group className="mb-3">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Email address"
                    >
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        className={errors.email ? "is-invalid" : null}
                        {...register("email", {
                          required: "Email is required.",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format.",
                          },
                          maxLength: {
                            value: 100,
                            message: "Email must not exceed 100 characters.",
                          },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^A-Za-z0-9@.\-\_]/g,
                            "",
                          );
                        }}
                      />
                    </FloatingLabel>
                    {errors.email && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.email.message}
                      </span>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Password"
                    >
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        className={errors.password ? "is-invalid" : null}
                        {...register("password", {
                          required: "Password is required.",
                          maxLength: {
                            value: 15,
                            message: "password must not exceed 100 characters.",
                          },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^A-Za-z0-9!@#$%&*()\s]/g,
                            "",
                          );
                        }}
                      />
                    </FloatingLabel>
                    {errors.password && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.password.message}
                      </span>
                    )}
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg">
                      Login
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
