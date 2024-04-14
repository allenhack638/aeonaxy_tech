import React from "react";
import "./ErrorMessages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const ErrorMessages = ({ errors }) => {
  return (
    <div className="error-messages">
      {Object.keys(errors).length > 0 && (
        <>
          <FontAwesomeIcon icon={faCircle} color="red" size="2xs" />{" "}
          <p className="error-message">{Object.values(errors)[0]}</p>
        </>
      )}
    </div>
  );
};

export default ErrorMessages;
