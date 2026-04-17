import React, { useEffect, useState } from "react";
import AddUsers from "./AddUsers";
import ShowUsers from "./ShowUsers";

function Users() {
  const url = "https://gorest.co.in/public/v2/users/";
  const token =
    "d78ef047181b3a3395e1d61d60ed7daad4ad085c958b215718578dba15bcc48a";
  const [userData, setUserData] = useState([]);

  async function getUsersData() {
    let response = await fetch(url);
    response = await response.json();
    // console.log(response);
    setUserData(response);
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
      />
    </div>
  );
}

export default Users;
