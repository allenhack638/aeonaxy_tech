import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL, DEV_MODE, API_URL_DEV_MODE } from "../../utils";
import axios from "axios";
import toast from "react-hot-toast";
import UnauthorisedUser from "../Pages/UnauthorisedUser";
import SessionExpired from "../Pages/SessionExpired";
import SuccessPage from "../SuccessPages/SuccessPage";
import LoadingPage from "../Pages/LoadingPage";

const VerifyPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const url = DEV_MODE ? API_URL_DEV_MODE : API_URL;

  useEffect(() => {
    document.title = "Verify Account";
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${url}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("The response is:-", response);
        if (response.status === 200) {
          setSuccess(true);
        } else {
          setError("Unauthorized");
        }
      } catch (error) {
        console.log("the error us:", error);
        if (error.response && error.response.status === 429) {
          return toast.error("Too many requests. Please try again later.");
        }
        if (error.response && error.response.data) {
          if (error.response.data.error === "TokenExpiredError") {
            setError("TokenExpired");
          } else {
            setError("Unauthorized");
          }
        } else {
          setError("Unauthorized");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError("Unauthorized");
      setLoading(false);
    }
  }, [token, navigate]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error === "Unauthorized") {
    return <UnauthorisedUser />;
  }

  if (error === "TokenExpired") {
    return <SessionExpired />;
  }

  if (error === "Error") {
    return <UnauthorisedUser />;
  }

  if (success) {
    return <SuccessPage />;
  }

  return null;
};

export default VerifyPage;
