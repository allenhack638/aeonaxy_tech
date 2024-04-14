import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassEnd } from "@fortawesome/free-solid-svg-icons";

const SessionExpired = () => {
  useEffect(() => {
    document.title = "Session Expired";
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
            <FontAwesomeIcon icon={faHourglassEnd} color="black" size="2x" />
            <h2>Session Expired</h2>
          </div>

          <span>
            Your session has expired. Please reload the page to continue.
          </span>
          <div className="button verify">
            <button onClick={handleReload}>Go to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
