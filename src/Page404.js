import { faSadCry } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Container, Image } from "react-bootstrap";
import { Link } from "react-router";

const Page404 = () => {
  return (
    <Container className="text-center">
      <Image src="./404.jpg" className="mb-3" style={{ width: "35%" }} fluid />
      <h1 className="text-uppercase text-danger mb-3">
        <strong>
          <FontAwesomeIcon icon={faSadCry} />
          404 Page Not Found
        </strong>
      </h1>
      <Button as={Link} to="/">
        Go to Home
      </Button>
    </Container>
  );
};

export default Page404;
