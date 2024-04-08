import "./Auth.css";
import { useEffect } from "react";
import ErrorMessages from "../ErrorMesaages/ErrorMessages";
import TextInput from "../Inputs/TextInput";
import Button from "../Buttons/Button";

const Signup = ({
  errors,
  handleFormSubmit,
  formData,
  handleChange,
  loading,
  handleCheckboxChange,
  agree,
}) => {
  useEffect(() => {
    document.title = "Signup Page";
  }, []);
  return (
    <div className="signup-div">
      <p>Sign up to Dribbble</p>
      <ErrorMessages errors={errors} />
      <form onSubmit={handleFormSubmit}>
        <div className="input-div">
          <div className="name-username-div">
            <TextInput
              type="name"
              value={formData.name}
              handleChange={handleChange}
              error={errors.name}
              loading={loading}
            />
            <TextInput
              type="username"
              value={formData.username}
              handleChange={handleChange}
              error={errors.username}
              loading={loading}
            />
          </div>
          <TextInput
            type="email"
            value={formData.email}
            handleChange={handleChange}
            error={errors.email}
            loading={loading}
          />
          <TextInput
            type="password"
            value={formData.password}
            handleChange={handleChange}
            error={errors.password}
            loading={loading}
          />
        </div>
        <div className="accept-policy-div">
          <div>
            <input
              type="checkbox"
              id="agree"
              name="agree"
              required
              checked={agree}
              onChange={handleCheckboxChange}
              disabled={loading}
            />
          </div>

          <span>
            Creating an account means you're okay with our{" "}
            <a className="btn-style">Terms of Service,</a>{" "}
            <a className="btn-style">Privacy Policy,</a> and our default{" "}
            <a className="btn-style">Notification Settings</a>
          </span>
        </div>

        <div className="button">
          <Button
            type="submit"
            disabled={
              !agree ||
              !formData.name ||
              !formData.username ||
              !formData.email ||
              !formData.password ||
              Object.keys(errors).length > 0
            }
            loading={loading}
            text="Create Account"
            onClick={handleFormSubmit}
          />
        </div>
      </form>
      <span className="term-conditions">
        This site is protected by reCAPTCHA and the Google{" "}
        <a className="btn-style">Privacy Policy</a> and{" "}
        <a className="btn-style">Terms of Service</a> apply.
      </span>
    </div>
  );
};

export default Signup;
