import "./LandingPage.css";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  API_URL,
  DEV_MODE,
  CRYPTO_JS_KEY,
  API_URL_DEV_MODE,
} from "../../utils";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import ChooseImage from "../ChooseImage/ChooseImage";
import SelectInterest from "../SelectInterest/SelectInterest";
import VerifyEmail from "../VerifyEmail/VerifyEmail";
import UserProfile from "../UserProfile/UserProfile";
import PromptVerify from "../PromptVerify/PromptVerify";
import UnauthorisedUser from "../Pages/UnauthorisedUser";
import SessionExpired from "../Pages/SessionExpired";
import SuccessPage from "../SuccessPages/SuccessPage";
import { useCookies } from "react-cookie";
import CryptoJS from "crypto-js";

const LandingPage = () => {
  const [_, setCookie, removeCookie] = useCookies(["token"]);
  const [currentComponent, setCurrentComponent] = useState("landingpage");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const url = DEV_MODE ? API_URL_DEV_MODE : API_URL;

  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCards, setSelectedCards] = useState([]);

  const [userData, setUserData] = useState(null);

  const resetState = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    setImage(null);
    setLocation("");
    setAgree(false);
    setErrors({});
    setSelectedCards([]);
    setUserData(null);
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    delete errors?.general;

    let newErrors = { ...errors };

    if (name === "name") {
      if (value.trim() === "") {
        newErrors.name = "Name cannot be empty";
      } else if (value.length > 15) {
        newErrors.name = "Name cannot exceed 15 characters";
      } else {
        delete newErrors.name;
      }
    }

    if (name === "username") {
      if (value.trim() === "") {
        newErrors.username = "Username cannot be empty";
      } else if (/\s/.test(value)) {
        newErrors.username = "Username cannot contain spaces";
      } else if (value.length > 12) {
        newErrors.username = "Username cannot exceed 12 characters";
      } else {
        delete newErrors.username;
      }
    }

    if (name === "email") {
      if (value.trim() === "") {
        newErrors.email = "Email cannot be empty";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        newErrors.email = "Invalid email address";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      if (value.trim() === "") {
        newErrors.password = "Password cannot be empty";
      } else if (value.length < 8 || value.length > 24) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (/\s/.test(value)) {
        newErrors.password = "Password cannot contain spaces";
      } else {
        delete newErrors.password;
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors(newErrors);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    delete errors?.general;

    let newErrors = { ...errors };

    switch (name) {
      case "email":
        if (value.trim() === "") {
          newErrors.email = "Email cannot be empty";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Invalid email address";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (value.trim() === "") {
          newErrors.password = "Password cannot be empty";
        } else if (value.length < 8 || value.length > 24) {
          newErrors.password = "Password must be between 8 and 24 characters";
        } else if (/\s/.test(value)) {
          newErrors.password = "Password cannot contain spaces";
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors(newErrors);
  };

  const handleSignupSubmit = async () => {
    const { name, username, email, password } = formData;

    const newErrors = { ...errors };

    if (!agree) {
      newErrors.checked = "You must agree to the terms";
    } else {
      delete newErrors.checked;
    }
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const axiosConfig = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          CRYPTO_JS_KEY
        ).toString();
        const response = await axios.post(
          `${url}/api/signup`,
          { email, username, password: encryptedPassword, name },
          axiosConfig
        );

        const token = response?.data?.token || "";

        setCookie("token", token, {
          path: "/",
          maxAge: 3600,
          secure: true,
          sameSite: "strict",
        });

        setCurrentComponent("chooseimage");
      } catch (error) {
        if (error.response && error.response.status === 429) {
          return toast.error("Too many requests. Please try again later.");
        }
        let errorMessages = {};
        const { email, username } = error.response?.data ?? {};
        if (email || username) {
          if (email) {
            errorMessages.email = "Email already exists.";
          }
          if (username) {
            errorMessages.username = "Username already exists.";
          }
        } else {
          errorMessages.general = "An error occurred. Please try again later.";
        }

        setErrors({ ...errors, ...errorMessages });
      }
    }
  };

  const handleLoginSubmit = async () => {
    const { email, password } = formData;
    const newErrors = { ...errors };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const axiosConfig = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          CRYPTO_JS_KEY
        ).toString();
        const response = await axios.post(
          `${url}/api/login`,
          { email, password: encryptedPassword },
          axiosConfig
        );

        if (
          response.data &&
          response.data.isVerified !== undefined &&
          !response.data.isVerified
        ) {
          const token = response.data.data.token;
          setCookie("token", token, {
            path: "/",
            maxAge: 3600,
            secure: true,
            sameSite: "strict",
          });
          setUserData(response.data.data);
          setCurrentComponent("promptVerify");
        } else if (
          response.data &&
          response.data.isVerified !== undefined &&
          response.data.isVerified
        ) {
          const userData = response.data.data;
          setUserData(userData);
          setCurrentComponent("loginSuccesAndVerified");
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          return toast.error("Too many requests. Please try again later.");
        }
        if (error.response && error.response.data) {
          const { data } = error.response;
          if (data?.email === "Invalid email or password") {
            setErrors({
              email: "Invalid email or password.",
              password: "Invalid email or password.",
            });
          } else {
            setErrors({
              general: "Something went wrong!",
            });
          }
        } else {
          setErrors({
            general: "Something went wrong!",
          });
        }
      }
    }
  };

  const handleComponentChange = (type) => {
    switch (type) {
      case "unauth":
      case "sessionTimeout":
        resetState();
        removeCookie("token");
        setCurrentComponent(type);
        break;
      case "selectInterest":
        setCurrentComponent(type);
        break;
      case "chooseimage":
        setCurrentComponent(type);
        break;
      case "verfiyEmail":
        setCurrentComponent(type);
        break;
      case "loginSuccesAndVerified":
        setCurrentComponent(type);
        break;

      default:
        break;
    }
  };

  return (
    <div className="landingpage">
      {currentComponent === "landingpage" ? (
        <>
          <LeftSide />
          <RightSide
            formData={formData}
            handleLoginChange={handleLoginChange}
            handleSignupChange={handleSignupChange}
            errors={errors}
            setErrors={setErrors}
            handleLoginSubmit={handleLoginSubmit}
            handleSignupSubmit={handleSignupSubmit}
            agree={agree}
            setAgree={setAgree}
          />
        </>
      ) : currentComponent === "chooseimage" ? (
        <ChooseImage
          image={image}
          setImage={setImage}
          location={location}
          setLocation={setLocation}
          handleComponentChange={handleComponentChange}
        />
      ) : currentComponent === "selectInterest" ? (
        <SelectInterest
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
          handleComponentChange={handleComponentChange}
          location={location}
          image={image}
        />
      ) : currentComponent === "verfiyEmail" ? (
        <VerifyEmail formData={formData} />
      ) : currentComponent === "loginSuccesAndVerified" ? (
        <UserProfile userData={userData} />
      ) : currentComponent === "promptVerify" ? (
        <PromptVerify
          userData={userData}
          handleComponentChange={handleComponentChange}
          setUserData={setUserData}
        />
      ) : currentComponent === "unauth" ? (
        <UnauthorisedUser />
      ) : currentComponent === "success" ? (
        <SuccessPage />
      ) : (
        <SessionExpired />
      )}
    </div>
  );
};

export default LandingPage;
