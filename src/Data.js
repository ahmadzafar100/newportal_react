import React, { useEffect, useState } from "react";
import { Badge, Container, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

function Data() {
  const url = "https://gorest.co.in/public/v2/users?per_page=100";
  const token =
    "d78ef047181b3a3395e1d61d60ed7daad4ad085c958b215718578dba15bcc48a";
  const [userData, setUserData] = useState([]);

  async function getUsersData() {
    try {
      let response = await fetch(url + "?page=1");
      response = await response.json();
      // console.log(response);
      setUserData(response);
    } catch (error) {
      console.error("Network Error:", error);
    }
  }

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];

  return (
    <Container className="py-5">
      <DataTable
        title="Users"
        columns={columns}
        data={userData}
        pagination
        highlightOnHover
      />
    </Container>
  );
}

export default Data;
