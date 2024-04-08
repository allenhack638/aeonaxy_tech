import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faCircle,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const TextInput = ({ type, error, formData, handleChange, loading }) => {
  return (
    <div className="input">
      <div>
        {error && <FontAwesomeIcon icon={faTriangleExclamation} color="red" />}

        <label htmlFor={type} className="labels">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </label>
      </div>

      <input
        type={type !== "password" ? "text" : "password"}
        id={type}
        name={type}
        required
        placeholder={type !== "password" ? type : "8+ characters"}
        value={formData}
        onChange={handleChange}
        disabled={loading}
      />
    </div>
  );
};

export default TextInput;
