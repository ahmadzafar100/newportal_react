import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const ChangePassword = ({ user, setUser }) => {
  const [message, setMessage] = useState(null);
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

  const navigate = useNavigate();

  useEffect(() => {
    if (errors.oldPassword) setFocus("oldPassword");
    else if (errors.password) setFocus("newPassword");
    else if (errors.password) setFocus("confirmPassword");
  }, [errors]);

  const change = async (data, e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("old_password", data.oldPassword);
      formData.append("new_password", data.newPassword);
      formData.append("confirm_password", data.confirmPassword);
      formData.append("_method", "PUT");
      const url = `http://localhost/testapi/change_password.php?id=${user.id}`;
      let response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      let result = await response.json();
      if (response.ok) {
        setMessage(result);
        // console.log(result);
        if (result.status) {
          localStorage.removeItem("user");
          setUser(null);
          navigate("/login", {
            replace: true,
            state: {
              toast: {
                title: "Success",
                message: "Password changed successfully. Please login again.",
              },
            },
          });
        } else {
          setMessage(result);
        }
      }
    } catch (error) {
      console.error("Error", error);
    }
  };
  return (
    <>
      <Container className="py-5">
        <h3>Change Password</h3>
        <Form onSubmit={handleSubmit(change)}>
          {message && message.status ? (
            <Alert variant="success">{message.message}</Alert>
          ) : message && !message.status ? (
            <Alert variant="danger">{message.message}</Alert>
          ) : null}
          <Row>
            <Col md={4} sm={6}>
              <Form.Group className="mb-3">
                <FloatingLabel
                  controlId="floatingOldPassword"
                  label="Old Password"
                >
                  <Form.Control
                    type="password"
                    placeholder="Old Password"
                    maxLength={15}
                    className={errors.oldPassword ? "is-invalid" : null}
                    {...register("oldPassword", {
                      required: "Old password is required.",
                      maxLength: {
                        value: 15,
                        message: "Old password must not exceed 15 characters.",
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
                {errors.oldPassword && (
                  <span className="text-danger" style={{ fontSize: "14px" }}>
                    {errors.oldPassword.message}
                  </span>
                )}
              </Form.Group>
            </Col>
            <Col md={4} sm={6}>
              <Form.Group className="mb-3">
                <FloatingLabel
                  controlId="floatingNewPassword"
                  label="New Password"
                >
                  <Form.Control
                    type="password"
                    placeholder="New Password"
                    maxLength={15}
                    className={errors.oldPassword ? "is-invalid" : null}
                    {...register("newPassword", {
                      required: "New password is required.",
                      maxLength: {
                        value: 15,
                        message: "New password must not exceed 15 characters.",
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
                {errors.newPassword && (
                  <span className="text-danger" style={{ fontSize: "14px" }}>
                    {errors.newPassword.message}
                  </span>
                )}
              </Form.Group>
            </Col>
            <Col md={4} sm={6}>
              <Form.Group className="mb-3">
                <FloatingLabel
                  controlId="floatingConfirmPassword"
                  label="Confirm Password"
                >
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    maxLength={15}
                    className={errors.oldPassword ? "is-invalid" : null}
                    {...register("confirmPassword", {
                      required: "Confirm password is required.",
                      maxLength: {
                        value: 15,
                        message:
                          "Confirm password must not exceed 15 characters.",
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
                {errors.confirmPassword && (
                  <span className="text-danger" style={{ fontSize: "14px" }}>
                    {errors.confirmPassword.message}
                  </span>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" disabled={!isValid}>
            Change
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default ChangePassword;
