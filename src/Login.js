import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { NavLink, useLocation, useNavigate } from "react-router";
import Captcha from "./Captcha";

const Login = ({ setUser }) => {
  const [message, setMessage] = useState(null);
  let navigate = useNavigate();
  const location = useLocation();
  const loginTime = Date.now();
  const [captchaValid, setCaptchaValid] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setFocus,
    setValue,
    watch,
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
      e.preventDefault();
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const url = "http://localhost/testapi/login.php";
      let response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      let result = await response.json();
      if (response.ok) {
        setMessage(result);
        // console.log(result);
        if (result.status) {
          localStorage.setItem("user", JSON.stringify(result.data));
          localStorage.setItem("loginTime", loginTime);
          setUser(result.data);
          navigate("/dashboard");
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
              <Card.Header as={"h5"} className="bg-dark text-white">
                <strong>
                  LOGIN <FontAwesomeIcon icon={faSignIn} />
                </strong>
              </Card.Header>
              <Card.Body>
                {location.state?.message && (
                  <Alert variant="danger">{location.state.message}</Alert>
                )}
                {message && message.status ? (
                  <Alert variant="success">{message.message}</Alert>
                ) : message && !message.status ? (
                  <Alert variant="danger">{message.message}</Alert>
                ) : null}
                <form onSubmit={handleSubmit(userLogin)}>
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
                  <Form.Group className="mb-3">
                    <div className="text-center">
                      <Captcha
                        register={register}
                        setValue={setValue}
                        onValidate={setCaptchaValid}
                        watch={watch}
                        errors={errors}
                      />
                    </div>
                    {errors.captcha && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.captcha.message}
                      </span>
                    )}
                  </Form.Group>
                  <div className="d-grid gap-2 mb-3">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={!isValid}
                    >
                      Login
                    </Button>
                  </div>
                  <NavLink variant="link" to="/">
                    New User? Register Here...
                  </NavLink>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
