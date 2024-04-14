import React from "react";

const LoadingPage = () => {
  return (
    <div className="container">
      <div className="outer-div">
        <p className="dribbble-heading">dribbble</p>
        <div className="inner-div unauth">
          <p>Verifying your request...</p>
          <span>Please wait while we confirm your access.</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
