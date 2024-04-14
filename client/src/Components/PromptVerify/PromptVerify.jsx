import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { API_URL, DEV_MODE, API_URL_DEV_MODE } from "../../utils";
import toast from "react-hot-toast";
import "./PromptVerify.css";

const PromptVerify = ({ userData, handleComponentChange, setUserData }) => {
  const [cookies] = useCookies(["token"]);
  const { otpCount, email } = userData;
  const [loading, setLoading] = useState(false);
  const url = DEV_MODE ? API_URL_DEV_MODE : API_URL;

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
      const resp = await axios.get(`${url}/api/send-mail`, {
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
    <div className="container">
      <div className="outer-div">
        <p className="dribbble-heading">dribbble</p>
        <div>
          <div className="inner-div verify-div">
            <p>Send Verification Email</p>
            <span className="email-id">{email || "NA"}</span>
            <span>
              We will send a verification email to your address. Please check
              your inbox and click the link to verify your account.
            </span>
            <div className="button verify">
              <button disabled={loading} onClick={handleVerify}>
                <span>{loading ? "Sending..." : "Send Mail"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptVerify;
