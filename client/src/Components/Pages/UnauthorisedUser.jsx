import "./ErrorPages.css";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const UnauthorisedUser = () => {
  useEffect(() => {
    document.title = "Unauthorized";
  }, []);

  const handleReload = () => {
    window.location.href = "/";
  };

  return (
    <div className="container">
      <div className="outer-div">
        <p className="dribbble-heading">dribbble</p>
        <div className="inner-div unauth">
          <div className="unauth-header">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              color="black"
              size="2x"
            />
            <h2>Unauthorized Access</h2>
          </div>

          <span>You are not authorized to access this page.</span>
          <div className="button verify">
            <button onClick={handleReload}>Go to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorisedUser;
