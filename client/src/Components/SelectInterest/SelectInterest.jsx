import "./SelectInterest.css";
import { useState, useEffect } from "react";
import SelectableCard from "./SelectableCard";
import designerImage from "../../assets/designer.jpg";
import hireDesigner from "../../assets/hire-designer.jpg";
import designInspiration from "../../assets/design-inspiration.jpg";
import { API_URL } from "../../utils";
import { useCookies } from "react-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const SelectInterest = ({
  selectedCards,
  setSelectedCards,
  handleComponentChange,
  location,
  image,
}) => {
  const [cookies] = useCookies(["token"]);
  const [genImageUrl, setGenImageUrl] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    document.title = "Choose an option";
  }, []);

  if (!cookies.token) {
    return handleComponentChange("unauth");
  }

  const handleCardClick = (cardTitle) => {
    if (selectedCards.includes(cardTitle)) {
      setSelectedCards(selectedCards.filter((title) => title !== cardTitle));
    } else {
      setSelectedCards([...selectedCards, cardTitle]);
    }
  };

  const handleFinishClick = async () => {
    try {
      if (loading) return;

      if (!cookies.token || selectedCards.length === 0) {
        return handleComponentChange("unauth");
      }

      let imageUrlToSend = null;
      if (image && !genImageUrl) {
        setLoading("Uploading Image...");
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "czuitiib");
        formData.append("cloud_name", "dmzxfmkfs");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dmzxfmkfs/image/upload",
          formData
        );
        imageUrlToSend = response?.data?.secure_url || null;
        setGenImageUrl(imageUrlToSend);
      }
      setLoading("Finishing up...");
      const resp = await axios.post(
        `${API_URL}/api/addData`,
        {
          imageUrl: imageUrlToSend || genImageUrl,
          location: location,
          selectedCards,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      console.log(resp);
      handleComponentChange("verfiyEmail");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (error.response && error.response.data) {
        const { error: errorCode, message } = error.response.data;
        if (errorCode === "TokenExpiredError") {
          console.log("The tkoen espores");
          handleComponentChange("sessionTimeout");
        } else if (errorCode === "Unauthorized") {
          return handleComponentChange("unauth");
        } else {
          return toast.error("Something went wrong!");
        }
      } else {
        console.error("Network or server error:", error);
        return toast.error("Something went wrong!");
      }
    } finally {
      setLoading(null);
    }
  };

  const handlePrevClick = () => {
    handleComponentChange("chooseimage");
  };
  return (
    <div className="chooseimage-container">
      <div className="chooseimage-outer">
        <p>dribbble</p>
        <div>
          <div className="chooseimage-div select-interest">
            <p>What brings you to dribbble ?</p>
            <span className="latter-message">
              Select an option that describes you best. Don't worry, you can
              explore other options later
            </span>

            <div className="select-interest-div">
              <SelectableCard
                imageSrc={designerImage}
                title="I'm a designer looking to share my work"
                id="share-my-work"
                isSelected={selectedCards.includes("share-my-work")}
                onClick={() => handleCardClick("share-my-work")}
                disabled={loading}
              />
              <SelectableCard
                imageSrc={hireDesigner}
                title="I'm looking to hire a designer"
                id="hire-a-designer"
                isSelected={selectedCards.includes("hire-a-designer")}
                onClick={() => handleCardClick("hire-a-designer")}
                disabled={loading}
              />
              <SelectableCard
                imageSrc={designInspiration}
                title="I'm looking for design inspiration"
                id="looking-for-design-inspiration"
                isSelected={selectedCards.includes(
                  "looking-for-design-inspiration"
                )}
                onClick={() =>
                  handleCardClick("looking-for-design-inspiration")
                }
                disabled={loading}
              />
            </div>

            <span
              className={
                "select-mulitple-message" +
                (selectedCards.length !== 0 && selectedCards.length < 3
                  ? "visible"
                  : "")
              }
            >
              Anything else you can select multiple?
            </span>

            <div className="button finish">
              <button
                disabled={selectedCards.length === 0 || loading}
                onClick={handleFinishClick}
              >
                {loading ? (
                  <div>
                    <span>{loading || "Loading..."}</span>
                  </div>
                ) : (
                  "Finish"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectInterest;
