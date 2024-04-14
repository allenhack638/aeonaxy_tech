import "./ChooseImage.css";
import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faAngleRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";

const MAX_FILE_SIZE_MB = 5;

const ChooseImage = ({
  image,
  setImage,
  location,
  setLocation,
  handleComponentChange,
}) => {
  const fileInputRef = useRef(null);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    document.title = "Add Image";
  }, []);

  if (!cookies.token) {
    return handleComponentChange("unauth");
  }

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert("File size exceeds the limit.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
      }
      setImage(file);
    }
  };

  const handleNextClick = () => {
    if (location.trim() === "") return;
    if (!cookies.token) {
      return handleComponentChange("unauth");
    }

    handleComponentChange("selectInterest");
  };

  const handleImageRemove = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container">
      <div className="outer-div">
        <p className="dribbble-heading">dribbble</p>
        <div>
          <div className="inner-div">
            <p>Welcome! Lets create your profile.</p>
            <span className="latter-message">
              Let other get to know better! You can do this later
            </span>
            <div className="add-avatar-div">
              <span>Add an avatar</span>

              <div className="choose-photo-div">
                <div className="camera-icon">
                  {image ? (
                    <img src={URL.createObjectURL(image)} alt="Preview" />
                  ) : (
                    <FontAwesomeIcon icon={faCamera} color="#888888b0" />
                  )}
                </div>

                <div className="avatar-section">
                  <label
                    htmlFor="avatar-upload"
                    className={`avatar-upload-label ${image ? "disabled" : ""}`}
                  >
                    Choose image
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="avatar-upload-input"
                    onChange={handleImageUpload}
                    accept="image/*"
                    ref={fileInputRef}
                  />

                  <div className="choose-image-div">
                    <FontAwesomeIcon icon={faAngleRight} color="#888" />
                    {image && image.name ? (
                      <span>
                        {image.name}
                        <button
                          onClick={handleImageRemove}
                          className="remove-image-btn"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </span>
                    ) : (
                      "or choose a default image"
                    )}
                  </div>
                </div>
              </div>

              <div className="add-location-div">
                <span>Add your location</span>
                <input
                  type="text"
                  placeholder="Enter your location"
                  onChange={handleLocationChange}
                />
              </div>

              <div className="button next">
                <button
                  disabled={location.trim() === ""}
                  onClick={handleNextClick}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseImage;
