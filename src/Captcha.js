import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";

function Captcha({ onValidate, register, setValue, watch }) {
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

      <Button variant="secondary" onClick={generateCaptcha} className="ms-2">
        <FontAwesomeIcon icon={faRefresh} />
      </Button>

      <FloatingLabel controlId="floatingCaptcha" label="Captcha">
        <Form.Control
          type="text"
          className="mt-2"
          placeholder="Captcha"
          {...register("captcha", {
            required: "Captcha is required.",
            validate: (value) =>
              value.toUpperCase() === captchaText || "Captcha does not match.",
          })}
        />
      </FloatingLabel>
    </div>
  );
}

export default Captcha;
