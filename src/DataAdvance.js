import React, { useEffect, useState } from "react";
import { Badge, Container, Table } from "react-bootstrap";
import $ from "jquery";
import "jquery-highlight";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import "datatables.net-buttons-bs5";
import "datatables.net-buttons/js/buttons.html5"; // Excel, CSV, PDF
import "datatables.net-buttons/js/buttons.print"; // Print
import JSZip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "datatables.net-plugins/features/searchHighlight/dataTables.searchHighlight";
import "datatables.net-plugins/features/searchHighlight/dataTables.searchHighlight.css";

DataTable.use(DT);

function DataAdvance() {
  const url = "https://gorest.co.in/public/v2/users?per_page=100";
  const token =
    "d78ef047181b3a3395e1d61d60ed7daad4ad085c958b215718578dba15bcc48a";
  const [userData, setUserData] = useState([]);
  const [tableData, setTableData] = useState([]);

  async function getUsersData() {
    try {
      let response = await fetch(url);
      response = await response.json();
      // console.log(response);
      // setUserData(response);
      const formatted = response.map((user) => [
        user.id,
        user.name,
        user.email,
        user.gender.charAt(0).toUpperCase() + user.gender.slice(1),
        user.status.charAt(0).toUpperCase() + user.status.slice(1),
      ]);

      setTableData(formatted);
      console.log(tableData);
    } catch (error) {
      console.error("Network Error:", error);
    }
  }

  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <Container className="py-5">
      <DataTable
        data={tableData}
        className="table table-bordered display"
        options={{
          dom:
            "<'row mb-3'<'col-md-9'B><'col-md-3'f>>" +
            "<'row'<'col-12'tr>>" +
            "<'row mt-3'<'col-md-5'i><'col-md-7 d-flex justify-content-end'p>>", // 🔥 important
          buttons: ["copy", "csv", "excel", "pdf", "print"],
          searchHighlight: true,
          columnDefs: [
            {
              targets: [2], // column index
              orderable: false,
            },
          ],
        }}
      >
        <thead>
          <tr>
            <th className="bg-dark text-white">ID</th>
            <th className="bg-dark text-white">Name</th>
            <th className="bg-dark text-white">Email</th>
            <th className="bg-dark text-white">Gender</th>
            <th className="bg-dark text-white">Status</th>
          </tr>
        </thead>
      </DataTable>
    </Container>
  );
}

export default DataAdvance;
