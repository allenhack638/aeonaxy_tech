import React, { useEffect } from "react";
import "./UserProfile.css";
import Avatar from "react-avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const UserProfile = ({ userData }) => {
  useEffect(() => {
    document.title = "User Profile";
  }, []);
  const { username, name, imageUrl, location, created_at } = userData;
  return (
    <div className="chooseimage-container">
      <div className="chooseimage-outer">
        <p>dribbble</p>
        <div>
          <div className="chooseimage-div select-interest">
            <p>Welcome! {name}</p>
            <div>
              <div className="user-profile-photo">
                {imageUrl ? (
                  <img src={imageUrl} alt="user_profile" />
                ) : (
                  <Avatar
                    name={name}
                    maxInitials={1}
                    alt="Not Specified"
                    className="avatar-style"
                  />
                )}
              </div>
            </div>

            <div className="user-profile-info">
              <p>
                <span>Username:</span>
                <span>
                  {username || "Not Specified"}{" "}
                  <FontAwesomeIcon icon={faCircleCheck} color="green" />
                </span>
              </p>
              <p>
                <span>Location:</span>
                <span>{location || "Not Specified"}</span>
              </p>
              <p>
                <span>Joined on:</span>
                <span>{new Date(created_at).toDateString()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
