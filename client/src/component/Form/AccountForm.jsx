import React, { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";

const AccountForm = ({ onClose, isLoginForm, setIsLoginForm }) => {
  const { login } = useAuth();

  /* Loading state */
  const [loading, setLoading] = useState(false);

  /* Login */
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginErrors({ email: "", password: "", general: "" });

    let hasError = false;
    const newErrors = { email: "", password: "", general: "" };

    if (!loginForm.email) {
      newErrors.email = "Email is required.";
      hasError = true;
    }
    if (!loginForm.password) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    if (hasError) {
      setLoginErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes("email")) {
          setLoginErrors({ email: data.message, password: "", general: "" });
        } else if (data.message?.includes("password")) {
          setLoginErrors({ email: "", password: data.message, general: "" });
        } else {
          setLoginErrors({ email: "", password: "", general: data.message });
        }
        return;
      }

      localStorage.setItem("token", data.token);
      setLoginForm({ email: "", password: "" });
      setLoginErrors({ email: "", password: "", general: "" });

      login(data.token);
      toast.success("Login successful");
      onClose();
    } catch (err) {
      setLoginErrors({ email: "", password: "", general: err.message });
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* Signup */
  const initialSignupState = {
    firstName: "",
    lastName: "",
    otherNames: "",
    tel: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  };

  const [signupForm, setSignupForm] = useState(initialSignupState);
  const [signupErrors, setSignupErrors] = useState({
    ...initialSignupState,
    general: "",
  });

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    setSignupErrors({ ...signupErrors, [e.target.name]: "", general: "" });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupErrors({ ...initialSignupState, general: "" });

    const newErrors = { ...initialSignupState, general: "" };
    let hasError = false;

    if (!signupForm.firstName) {
      newErrors.firstName = "First name is required.";
      hasError = true;
    }
    if (!signupForm.lastName) {
      newErrors.lastName = "Last name is required.";
      hasError = true;
    }
    if (!signupForm.email) {
      newErrors.email = "Email is required.";
      hasError = true;
    }
    if (!signupForm.address) {
      newErrors.address = "Address is required.";
      hasError = true;
    }
    if (!signupForm.tel) {
      newErrors.tel = "Enter a valid phone number.";
      hasError = true;
    }
    if (!signupForm.password) {
      newErrors.password = "Password is required.";
      hasError = true;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    if (hasError) {
      setSignupErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes("email")) {
          setSignupErrors((prev) => ({ ...prev, email: data.message }));
        } else if (data.message?.includes("Passwords")) {
          setSignupErrors((prev) => ({
            ...prev,
            confirmPassword: data.message,
          }));
        } else {
          setSignupErrors((prev) => ({ ...prev, general: data.message }));
        }
        return;
      }

      localStorage.setItem("token", data.token);
      setSignupForm(initialSignupState);
      setSignupErrors({ ...initialSignupState, general: "" });

      toast.success("Signup successful");
      onClose();
    } catch (err) {
      setSignupErrors((prev) => ({
        ...prev,
        general: err.message || "Something went wrong",
      }));
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen fixed top-0 w-full flex items-center justify-center z-50 backdrop-blur-sm">
      {isLoginForm ? (
        <LoginForm
          onSubmit={handleLoginSubmit}
          onClose={onClose}
          onChange={handleLoginChange}
          loginForm={loginForm}
          setIsLoginForm={setIsLoginForm}
          errors={loginErrors}
          setErrors={setLoginErrors}
          setLoginForm={setLoginForm}
          loading={loading}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignupSubmit}
          onClose={onClose}
          onChange={handleSignupChange}
          signupForm={signupForm}
          setIsLoginForm={setIsLoginForm}
          errors={signupErrors}
          setErrors={setSignupErrors}
          setSignupForm={setSignupForm}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AccountForm;
