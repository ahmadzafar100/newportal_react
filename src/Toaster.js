import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const Toaster = ({ show, setShow, title, msg }) => {
  return (
    <>
      <ToastContainer
        className="p-3"
        position={"top-end"}
        style={{ zIndex: 1 }}
      >
        <Toast
          show={show}
          onClose={() => setShow(false)}
          bg={title.toLowerCase()}
          delay={5000}
          autohide
        >
          <Toast.Header closeButton={true}>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">{title}</strong>
            {/* <small>11 mins ago</small> */}
          </Toast.Header>
          <Toast.Body
            className={
              (title === "Danger" || title === "Success") && "text-white"
            }
          >
            {msg}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Toaster;
