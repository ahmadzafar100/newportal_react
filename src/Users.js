import React, { useEffect, useState } from "react";
import AddUsers from "./AddUsers";
import ShowUsers from "./ShowUsers";

function Users() {
  return (
    <div className="container py-5">
      <h1>
        <strong>Users</strong>
      </h1>
      <AddUsers />
      <ShowUsers />
    </div>
  );
}

export default Users;
