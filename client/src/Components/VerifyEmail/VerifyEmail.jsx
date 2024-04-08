import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./VerifyEmail.css";

const VerifyEmail = ({ formData }) => {
  useEffect(() => {
    document.title = "Verify Email";
  }, []);
  return (
    <div className="chooseimage-container">
      <div className="chooseimage-outer">
        <p>dribbble</p>
        <div>
          <div className="chooseimage-div select-interest">
            <p>Please verify your email...</p>

            <div>
              <FontAwesomeIcon
                icon={faEnvelopeCircleCheck}
                size="6x"
                color="#888"
              />
            </div>
            <span className="latter-message">
              Please verify you email address, We've sent a confirmation email
              to:
            </span>

            <span className="email-id">{formData.email}</span>

            <span>
              Click the confirmation link in that email to begin using Dribbble.
            </span>

            <span>
              Didn't receive the email? Check your Spam folder, it may have been
              caught by a filter.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
