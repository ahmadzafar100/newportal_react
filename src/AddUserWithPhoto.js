import { faCheck, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

const AddUserWithPhoto = () => {
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState("");
  const [message, setMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [preview, setPreview] = useState(null);

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
    if (errors.name) setFocus("name");
    else if (errors.email) setFocus("email");
    else if (errors.gender) setFocus("gender");
  }, [errors]);

  const checkEmail = async (email) => {
    try {
      const url = `http://localhost/testapi/check_email.php?email=${email}`;
      let response = await fetch(url);
      let data = await response.json();
      if (response.ok) {
        // console.log(data);
        setEmailMessage(data);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (data, e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("gender", data.gender);
    formData.append("status", data.status);
    formData.append("photo", data.photo[0]);

    try {
      setLoading(true);
      const url = "http://localhost/testapi/add_user.php";
      const urlIp = "http://192.168.1.5/testapi/add_user.php";
      let response = await fetch(url, {
        method: "POST",
        /* headers: {
          "Content-Type": "application/json",
        }, */
        body: formData,
      });
      let data = await response.json();
      if (response.ok) {
        if (data.status) {
          // console.log(data);
          reset();
          setPreview(null);
          setMessage(data);
        } else {
          setMessage(data);
        }
      } else {
        console.log(data);
        setErrorData(data);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Container className="py-5">
        <Card>
          <Card.Body>
            <form onSubmit={handleSubmit(addUser)}>
              {Object.keys(errors).length > 0 && (
                <Alert variant="danger">
                  <ul className="mb-0">
                    {Object.values(errors).map((err, index) => (
                      <li key={index}>{err.message}</li>
                    ))}
                  </ul>
                </Alert>
              )}
              {message && message.status ? (
                <Alert variant="success">{message.message}</Alert>
              ) : message && !message.status ? (
                <Alert variant="danger">{message.message}</Alert>
              ) : null}
              <Row>
                <Col md={4} sm={6}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>
                      Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className={errors.name ? "is-invalid" : null}
                      {...register("name", {
                        required: "Name is required.",
                        maxLength: {
                          value: 50,
                          message: "Name must not exceed 50 characters.",
                        },
                      })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(
                          /[^A-Za-z\s]/g,
                          "",
                        );
                      }}
                    />
                    {errors.name && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.name.message}
                      </span>
                    )}
                  </Form.Group>
                </Col>
                <Col md={4} sm={6}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>
                      Email<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
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
                      onBlur={(e) => checkEmail(e.target.value)}
                    />
                    {errors.email && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.email.message}
                      </span>
                    )}
                    <span
                      className={`d-block ${
                        emailMessage.status ? "text-success" : "text-danger"
                      }`}
                      style={{ fontSize: "14px" }}
                    >
                      {emailMessage.message}
                    </span>
                  </Form.Group>
                </Col>
                <Col md={4} sm={6}>
                  <Form.Group controlId="formGender" className="mb-3">
                    <Form.Label>
                      Gender<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      className={errors.gender ? "is-invalid" : null}
                      {...register("gender", {
                        required: "Gender is required.",
                      })}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Form.Select>
                    {errors.gender && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.gender.message}
                      </span>
                    )}
                  </Form.Group>
                </Col>
                <Col md={4} sm={6}>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>
                      Photo<span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        className={errors.photo ? "is-invalid" : null}
                        accept="image/*"
                        {...register("photo", {
                          required: "Photo is required.",
                          validate: {
                            isImage: (files) =>
                              files[0]?.type.startsWith("image/") ||
                              "Only image files allowed.",
                            maxSize: (files) =>
                              files[0]?.size < 1 * 1024 * 1024 ||
                              "Max size is 1MB.",
                          },
                        })}
                        onChange={(e) =>
                          setPreview(URL.createObjectURL(e.target.files[0]))
                        }
                      />
                      {preview !== null ? (
                        <>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>Preview</Tooltip>}
                          >
                            <Button
                              variant="info"
                              href={preview}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip>Remove</Tooltip>}
                          >
                            <Button
                              onClick={() => {
                                setPreview(null);
                                resetField("photo");
                              }}
                              variant="dark"
                              id="button-addon2"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </Button>
                          </OverlayTrigger>
                        </>
                      ) : null}
                    </InputGroup>
                    {errors.photo && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.photo.message}
                      </span>
                    )}
                  </Form.Group>
                </Col>
                <Col md={4} sm={6}>
                  <Form.Group controlId="formStatus" className="mb-3">
                    <Form.Label>
                      Status<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      className={errors.status ? "is-invalid" : null}
                      {...register("status", {
                        required: "Status is required.",
                      })}
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                    {errors.status && (
                      <span
                        className="text-danger"
                        style={{ fontSize: "14px" }}
                      >
                        {errors.status.message}
                      </span>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                className="me-1"
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting" : "Submit"}
              </Button>
              <Button variant="danger" type="reset" className="me-1">
                Reset
              </Button>
              {isValid ? (
                <span className="text-success">
                  All fields are filled properly.
                </span>
              ) : (
                <span className="text-secondary">
                  Please fill all fields properly.
                </span>
              )}
            </form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AddUserWithPhoto;
