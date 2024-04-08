import "./Auth.css";
import { useEffect } from "react";
import ErrorMessages from "../ErrorMesaages/ErrorMessages";
import TextInput from "../Inputs/TextInput";
import Button from "../Buttons/Button";

const Login = ({
  errors,
  handleFormSubmit,
  formData,
  handleChange,
  loading,
}) => {
  useEffect(() => {
    document.title = "Login Page";
  }, []);
  return (
    <div className="signup-div">
      <p>Log In to Dribbble</p>
      <ErrorMessages errors={errors} />
      <form onSubmit={handleFormSubmit}>
        <div className="input-div">
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

        <div className="button">
          <Button
            type="submit"
            disabled={
              !formData.email ||
              !formData.password ||
              Object.keys(errors).length > 0
            }
            loading={loading}
            text="Log In"
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

export default Login;
