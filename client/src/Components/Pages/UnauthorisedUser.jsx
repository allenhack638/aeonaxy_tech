import "./ErrorPages.css";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const UnauthorisedUser = () => {
  useEffect(() => {
    document.title = "Unauthorized";
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="chooseimage-container">
      <div className="chooseimage-outer">
        <p className="logo">dribbble</p>
        <div className="chooseimage-div unauth">
          <div className="unauth-header">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              color="black"
              size="2x"
            />
            <h2>Unauthorized Access</h2>
          </div>

          <p>You are not authorized to access this page.</p>
          <div className="button verify">
            <button onClick={handleReload}>Reload Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorisedUser;
