import React from "react";
import { Container } from "react-bootstrap";

const Dashboard = (props) => {
  return (
    <>
      <Container className="py-5">
        <h1>This is Dashboard Page</h1>
        {props.user ? (
          <>
            <h2>
              Hello, <strong>{props.user.name}</strong>
            </h2>
            <h2>
              Email: <strong>{props.user.email}</strong>
            </h2>
          </>
        ) : null}
      </Container>
    </>
  );
};

export default Dashboard;
