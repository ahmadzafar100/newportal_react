import {
  faCoffee,
  faFileExcel,
  faFilePdf,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

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
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    props.getUsersData();
  }, []);

  useEffect(() => {
    if (name !== "" && email !== "" && gender !== "" && status !== "") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [name, email, gender, status]);

  async function deleteUser(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeletingId(id);

          const url = `${props.url}/${id}`;

          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${props.token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.status === 204) {
            Swal.fire("Deleted!", "User has been deleted.", "success");
            props.getUsersData();
          } else {
            Swal.fire("Error!", "Failed to delete user.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        } finally {
          setDeletingId(null);
        }
      }
    });
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

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "users.xlsx");
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();

    const tableColumn = ["ID", "Name", "Email", "Gender", "Status"];
    const tableRows = [];

    data.forEach((user) => {
      const row = [user.id, user.name, user.email, user.gender, user.status];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("users.pdf");
  };

  return (
    <>
      <div className="text-end mb-3">
        <Button
          variant="warning"
          className="me-1"
          onClick={() => exportToPDF(props.userData)}
        >
          <FontAwesomeIcon icon={faFilePdf} />
        </Button>
        <Button variant="warning" onClick={() => exportToExcel(props.userData)}>
          <FontAwesomeIcon icon={faFileExcel} />
        </Button>
      </div>
      <Table bordered responsive hover>
        <thead>
          <tr>
            <th className="bg-dark text-white">ID</th>
            <th className="bg-dark text-white">Name</th>
            <th className="bg-dark text-white">Email</th>
            <th className="bg-dark text-white">Gender</th>
            <th className="bg-dark text-white">Status</th>
            <th className="bg-dark text-white">Action</th>
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
                  {data.status === "active" ? (
                    <Badge bg="success">
                      {data.status.charAt(0).toUpperCase() +
                        data.status.slice(1)}
                    </Badge>
                  ) : (
                    <Badge bg="danger">
                      {data.status.charAt(0).toUpperCase() +
                        data.status.slice(1)}
                    </Badge>
                  )}
                </td>
                <td>
                  <ButtonGroup size="sm">
                    <Button variant="success" onClick={() => editUser(data.id)}>
                      {<FontAwesomeIcon icon={faPencil} />}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteUser(data.id)}
                      disabled={deletingId === data.id}
                    >
                      {deletingId && deletingId === data.id ? (
                        "Deleting..."
                      ) : (
                        <FontAwesomeIcon icon={faTrash} />
                      )}
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
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
            <Button
              variant="primary"
              className="me-1"
              onClick={updateUser}
              disabled={loading || !isValid}
            >
              Update
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Cancel
            </Button>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShowUsers;
