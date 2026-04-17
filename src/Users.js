import React, { useEffect, useState } from "react";
import AddUsers from "./AddUsers";
import ShowUsers from "./ShowUsers";

function Users() {
  const url = "https://gorest.co.in/public/v2/users";
  const token =
    "d78ef047181b3a3395e1d61d60ed7daad4ad085c958b215718578dba15bcc48a";
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function getUsersData() {
    try {
      setLoading(true);
      let response = await fetch(url + "?page=1");
      response = await response.json();
      // console.log(response);
      setUserData(response);
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="container py-5">
      <h1>
        <strong>Users</strong>
      </h1>
      <AddUsers token={token} getUsersData={getUsersData} url={url} />
      <ShowUsers
        token={token}
        getUsersData={getUsersData}
        userData={userData}
        url={url}
        loading={loading}
      />
    </div>
  );
}

export default Users;
