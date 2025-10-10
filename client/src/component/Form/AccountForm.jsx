import React, { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AccountForm = ({ onClose, isLoginForm, setIsLoginForm }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginErrors({});
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        "https://sierra-catalogue.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginForm),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      login(data.token, data.user);
      toast.success("Login successful");

      switch (data.user.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "vendor":
          navigate("/dashboard/vendor");
          break;
        default:
          navigate("/shop");
      }

      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState({});

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    setSignupErrors({});
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        "https://sierra-catalogue.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(signupForm),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      toast.success("Signup successful! Please login.");
      setIsLoginForm(true);
      setSignupForm({
        firstName: "",
        lastName: "",
        tel: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      {isLoginForm ? (
        <LoginForm
          onSubmit={handleLoginSubmit}
          onClose={onClose}
          onChange={handleLoginChange}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          errors={loginErrors}
          setErrors={setLoginErrors}
          loading={loading}
          setIsLoginForm={setIsLoginForm}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignupSubmit}
          onClose={onClose}
          onChange={handleSignupChange}
          signupForm={signupForm}
          setSignupForm={setSignupForm}
          errors={signupErrors}
          setErrors={setSignupErrors}
          loading={loading}
          setIsLoginForm={setIsLoginForm}
        />
      )}
    </div>
  );
};

export default AccountForm;
