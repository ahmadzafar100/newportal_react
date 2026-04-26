import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
  Button,
  FloatingLabel,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function Captcha({ onValidate, register, setValue, watch, errors }) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [captchaImage, setCaptchaImage] = useState(null);

  const captchaValue = watch("captcha");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";

    for (let i = 0; i < 6; i++) {
      text += chars[Math.floor(Math.random() * chars.length)];
    }

    setCaptchaText(text);

    // canvas image
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "20px Poppins";
    ctx.fillStyle = "#333";
    ctx.fillText(text, 20, 25);

    setCaptchaImage(canvas.toDataURL());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // validate on input change
  useEffect(() => {
    const isValid = captchaValue && captchaValue.toUpperCase() === captchaText;

    onValidate(isValid);
  }, [captchaValue, captchaText]);

  return (
    <div>
      <img src={captchaImage} alt="captcha" />

      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Refresh Captcha</Tooltip>}
      >
        <Button variant="secondary" onClick={generateCaptcha} className="ms-2">
          <FontAwesomeIcon icon={faRefresh} />
        </Button>
      </OverlayTrigger>

      <FloatingLabel controlId="floatingCaptcha" label="Captcha">
        <Form.Control
          type="text"
          className={`mt-2 ${errors.captcha ? "is-invalid" : null}`}
          maxLength={6}
          placeholder="Captcha"
          {...register("captcha", {
            required: "Captcha is required.",
            validate: (value) =>
              value.toUpperCase() === captchaText || "Captcha does not match.",
          })}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^A-Za-z0-9\s]/g, "");
          }}
        />
      </FloatingLabel>
    </div>
  );
}

export default Captcha;
