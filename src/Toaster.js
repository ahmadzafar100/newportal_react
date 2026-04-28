import {
  faCheck,
  faCheckCircle,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const Toaster = ({ show, setShow, title, msg, toasts, removeToast }) => {
  const getIcon = (type) => {
    if (type === "Success") return <FontAwesomeIcon icon={faCheckCircle} />;
    else if (type === "Danger") return <FontAwesomeIcon icon={faTimes} />;
    else if (type === "Warning")
      return <FontAwesomeIcon icon={faExclamationCircle} />;
  };
  return (
    <>
      <ToastContainer className="p-3" position={"top-end"}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            bg={toast.title.toLowerCase()}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">
                {toast.title === "Danger" ? "Error" : toast.title}
              </strong>
            </Toast.Header>
            <Toast.Body
              className={
                (toast.title === "Danger" || toast.title === "Success") &&
                "text-white"
              }
            >
              <span className="me-1">{getIcon(toast.title)}</span>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
};

export default Toaster;
