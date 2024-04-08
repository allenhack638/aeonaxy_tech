import React, { useState } from "react";
import Signup from "../Authentication/Signup";
import Login from "../Authentication/Login";

const RightSide = ({
  formData,
  handleLoginChange,
  handleSignupChange,
  errors,
  setErrors,
  handleLoginSubmit,
  handleSignupSubmit,
  agree,
  setAgree,
}) => {
  const [loading, setloading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toogleShowSignin = () => {
    if (loading) return;
    setShowLogin(!showLogin);
    setErrors({});
  };
  const handleCheckboxChange = (e) => {
    setAgree(e.target.checked);
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      setloading(true);
      if (showLogin) {
        await handleLoginSubmit();
      } else {
        await handleSignupSubmit();
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="rightside">
      <div className="exsisting-user">
        <span>{showLogin ? "Not a member yet? " : "Already a member? "}</span>
        <button
          className="btn-style"
          disabled={loading}
          onClick={toogleShowSignin}
        >
          {showLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>
      <div className="rightside-container">
        {showLogin ? (
          <Login
            errors={errors}
            handleFormSubmit={handleFormSubmit}
            formData={formData}
            handleChange={handleLoginChange}
            loading={loading}
          />
        ) : (
          <Signup
            errors={errors}
            handleFormSubmit={handleFormSubmit}
            formData={formData}
            handleChange={handleSignupChange}
            loading={loading}
            handleCheckboxChange={handleCheckboxChange}
            agree={agree}
          />
        )}
      </div>
    </div>
  );
};

export default RightSide;
