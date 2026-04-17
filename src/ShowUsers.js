import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";

function ShowUsers() {
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    getUsersData();
  }, []);

  async function getUsersData() {
    const url = "https://gorest.co.in/public/v2/users";
    let response = await fetch(url);
    response = await response.json();
    // console.log(response);
    setUserData(response);
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
          {userData &&
            userData.map((data, key) => (
              <tr key={key}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.gender}</td>
                <td>{data.status}</td>
                <td>
                  <Button variant="success" size="sm" className="me-1">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}

export default ShowUsers;
