import React, { useEffect } from "react";
import VerifiedTick from "./VerifiedTick";
import "./SuccessPage.css";

const SuccessPage = () => {
  useEffect(() => {
    document.title = "Success";
  }, []);
  return (
    <div className="container">
      <div className="outer-div">
        <p className="dribbble-heading">dribbble</p>
        <div>
          <div className="inner-div success-page">
            <VerifiedTick />
            <h2>Your Account Verified Successfully</h2>
            <span>
              Congratulations! You have successfully verified your account.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
