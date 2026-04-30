import {
  faCheck,
  faCheckCircle,
  faExclamationCircle,
  faPause,
  faPlay,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Toast, ToastContainer, ProgressBar } from "react-bootstrap";

const Toaster = ({ show, setShow, title, msg, toasts, removeToast }) => {
  const getIcon = (type) => {
    if (type === "Success") return <FontAwesomeIcon icon={faCheckCircle} />;
    else if (type === "Danger") return <FontAwesomeIcon icon={faTimes} />;
    else if (type === "Warning")
      return <FontAwesomeIcon icon={faExclamationCircle} />;
  };
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    if (!show) return;

    setProgress(100); // reset

    const totalTime = 1900; // 5 sec
    const intervalTime = 100; // update every 100ms
    const step = 100 / (totalTime / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [show]);

  useEffect(() => {
    if (show) {
      setProgress(100);
    }
  }, [show]);
  return (
    <>
      <ToastContainer className="p-3" position={"top-end"}>
        {toasts.map((toast) => (
          <>
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <Toast
                key={toast.id}
                onClose={() => removeToast(toast.id)}
                bg={toast.title.toLowerCase()}
                delay={2500}
                className="mb-1"
                autohide={!paused}
              >
                <Toast.Header>
                  <strong className="me-auto">
                    {toast.title === "Danger" ? "Error" : toast.title}
                  </strong>

                  <small>
                    {paused ? (
                      <FontAwesomeIcon icon={faPause} />
                    ) : (
                      <FontAwesomeIcon icon={faPlay} />
                    )}
                  </small>
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
            </div>
          </>
        ))}
      </ToastContainer>
    </>
  );
};

export default Toaster;
