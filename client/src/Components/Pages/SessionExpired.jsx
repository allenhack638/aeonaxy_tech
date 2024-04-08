import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassEnd } from "@fortawesome/free-solid-svg-icons";

const SessionExpired = () => {
  useEffect(() => {
    document.title = "Session Expired";
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
            <FontAwesomeIcon icon={faHourglassEnd} color="black" size="2x" />
            <h2>Session Expired</h2>
          </div>

          <p>Your session has expired. Please reload the page to continue.</p>
          <div className="button verify">
            <button onClick={handleReload}>Reload Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
