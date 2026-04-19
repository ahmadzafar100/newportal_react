import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import DataTable from "react-data-table-component";

function ShowUsers(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [errorData, setErrorData] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    props.getUsersData();
  }, []);

  async function deleteUser(id) {
    try {
      setDeletingId(id);
      const url = `${props.url}/${id}`;
      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.status);
      // response = await response.json();
      if (response.status === 204) {
        props.getUsersData();
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("Network error");
    } finally {
      setDeletingId(null);
    }
  }

  async function editUser(id) {
    try {
      // console.log(id);
      setLoading(true);
      setShow(true);
      const url = `${props.url}/${id}`;
      let response = await fetch(url);
      response = await response.json();
      setName(response.name);
      setEmail(response.email);
      setGender(response.gender);
      setStatus(response.status);
      setUserId(response.id);
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function updateUser() {
    try {
      setLoading(true);
      const url = `${props.url}/${userId}`;
      let response = await fetch(url, {
        method: "PUT",
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
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Table bordered striped responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.loading ? (
            <tr>
              <td colSpan={6} className="text-center">
                <strong className="text-danger">Loading Data...</strong>
              </td>
            </tr>
          ) : null}
          {props.userData &&
            props.userData.map((data, key) => (
              <tr key={key}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>
                  {data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
                </td>
                <td>
                  {
                  data.status === 'active' ? <Badge bg="success">{data.status.charAt(0).toUpperCase() + data.status.slice(1)}</Badge>:
                  <Badge bg="danger">{data.status.charAt(0).toUpperCase() + data.status.slice(1)}</Badge>
                  }
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-1"
                    onClick={() => editUser(data.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(data.id)}
                    disabled={deletingId === data.id}
                  >
                    {deletingId && deletingId === data.id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal size="lg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
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
                    value={name}
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
                    value={email}
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
                    value={gender}
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
                    value={status}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Button variant="primary" onClick={updateUser} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShowUsers;
