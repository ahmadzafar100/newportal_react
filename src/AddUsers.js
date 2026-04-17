import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
} from "react-bootstrap";

function AddUsers(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [errorData, setErrorData] = useState("");

  async function addUser() {
    try {
      let response = await fetch(props.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, gender, status }),
      });
      let data = await response.json();
      if (response.ok) {
        setMessage("Added Successfully.");
        setName("");
        setEmail("");
        setGender("");
        setStatus("");
        setShow(false);
        props.getUsersData();
      } else {
        console.log(data);
        setErrorData(data);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("Network error");
    }
  }
  return (
    <>
      <div className="mb-3 text-end">
        <Button variant="primary" onClick={handleShow}>
          Add User
        </Button>
      </div>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {errorData ? (
              <Alert variant="danger">
                {errorData.map((err, key) => (
                  <p className="mb-0">
                    <span className="text-capitalize">{err.field}</span>{" "}
                    {err.message}.
                  </p>
                ))}
              </Alert>
            ) : (
              ""
            )}
            <Row>
              <Col md={6} sm={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Name"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    onChange={(event) => setName(event.target.value)}
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} sm={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email"
                  className="mb-3"
                >
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </FloatingLabel>
              </Col>
              <Col md={6} sm={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Gender"
                  className="mb-3"
                >
                  <Form.Select
                    onChange={(event) => setGender(event.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md={6} sm={6}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Status"
                  className="mb-3"
                >
                  <Form.Select
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Button variant="primary" onClick={addUser}>
              Add
            </Button>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddUsers;
