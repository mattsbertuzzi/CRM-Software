import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/auth.css";
import { UserContext } from "../context/userContext";

const Login = () => {
  const { handleLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear field-specific error on change
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));

    setAuthError("");
  };

  // Simple validation
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setAuthError("");

      const userInfo = await handleLogin(formData);

      if (userInfo) {
        navigate("/");
      } else {
        setAuthError("Invalid email or password");
      }
    } catch (err) {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to manage your CRM</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="auth-error">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span className="auth-error">{errors.password}</span>
            )}
          </div>

          {/* Auth error */}
          {authError && (
            <div className="auth-error auth-error-global">
              {authError}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
