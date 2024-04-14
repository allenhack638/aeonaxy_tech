import React from "react";
import "./Button.css";
import { SvgSpinner } from "../../assets/SvgSpinners180Ring";

const Button = ({ type, disabled, loading, loadingText, text, onClick }) => {
  return (
    <div className="button">
      <button type={type} disabled={disabled || loading} onClick={onClick}>
        {loading ? (
          <>
            <span>{loadingText}</span>
            <SvgSpinner color="white" size="1.5em" />
          </>
        ) : (
          text
        )}
      </button>
    </div>
  );
};

export default Button;
