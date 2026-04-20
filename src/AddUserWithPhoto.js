import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";

const AddUserWithPhoto = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorData, setErrorData] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (
      name !== "" &&
      email !== "" &&
      gender !== "" &&
      status !== "" &&
      photo !== ""
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [name, email, gender, status, photo]);

  const addUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("status", status);
    formData.append("photo", photo);

    try {
      setIsValid(true);
      setLoading(true);
      let response = await fetch("http://localhost/testapi/add_user.php", {
        method: "POST",
        /* headers: {
          "Content-Type": "application/json",
        }, */
        body: formData,
      });
      let data = await response.json();
      if (response.ok) {
        setName("");
        setEmail("");
        setGender("");
        setStatus("");
        fileRef.current.value = "";
        setPhoto("");
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
        <form onSubmit={addUser}>
          <Row>
            <Col md={6} sm={6}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </Form.Group>
            </Col>
            <Col md={6} sm={6}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                />
              </Form.Group>
            </Col>
            <Col md={6} sm={6}>
              <Form.Group controlId="formGender" className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} sm={6}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control
                  type="file"
                  ref={fileRef}
                  onChange={(event) => setPhoto(event.target.files[0])}
                />
              </Form.Group>
            </Col>
            <Col md={6} sm={6}>
              <Form.Group controlId="formStatus" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant="primary"
            className="me-1"
            type="submit"
            disabled={loading || !isValid}
          >
            Add
          </Button>
        </form>
      </Container>
    </>
  );
};

export default AddUserWithPhoto;
