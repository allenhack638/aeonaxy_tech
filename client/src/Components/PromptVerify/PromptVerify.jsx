import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { API_URL } from "../../utils";
import toast from "react-hot-toast";
import "./PromptVerify.css";

const PromptVerify = ({ userData, handleComponentChange, setUserData }) => {
  const [cookies] = useCookies(["token"]);
  const { otpCount, email } = userData;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Verify Account";
  }, []);

  if (!email) return handleComponentChange("unauth");

  const handleVerify = async () => {
    try {
      if (loading) return;
      setLoading(true);
      if (!cookies.token || otpCount === 0) {
        return handleComponentChange("unauth");
      }
      const resp = await axios.get(`${API_URL}/api/send-mail`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (resp.data.success === "verficationEmailSend") {
        handleComponentChange("verfiyEmail");
      } else if (resp.data.success === "alreadyVerified") {
        setUserData(resp.data.data);
        handleComponentChange("loginSuccesAndVerified");
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (error.response && error.response.data) {
        const { error: errorCode } = error.response.data;
        if (errorCode === "TokenExpiredError") {
          return handleComponentChange("sessionTimeout");
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
      setLoading(false);
    }
  };

  return (
    <div className="chooseimage-container">
      <div className="chooseimage-outer">
        <p>dribbble</p>
        <div>
          <div className="chooseimage-div verify-div">
            <p>Please verify your email </p>
            <span>{email || "NA"}</span>

            <div className="button verify">
              <button disabled={loading} onClick={handleVerify}>
                <span>{loading ? "Verifing..." : "Verify"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptVerify;
