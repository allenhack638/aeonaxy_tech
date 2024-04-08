import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SvgSpinner } from "../../assets/SvgSpinners180Ring";

const Button = ({ type, disabled, loading, text, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={loading ? "loading" : ""}
    >
      {loading ? (
        <>
          <span>Loading...</span>
          <SvgSpinner color="white" size="1.5em" />
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
