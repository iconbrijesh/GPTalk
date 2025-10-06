import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        inputValue,
        { withCredentials: true }
      );

      console.log("Signup response:", data);

      const success = data?.success;
      const message = data?.message;

      if (success) {
        toast.success("Signup successful. Please verify your email.", {
          position: "bottom-left",
        });
        navigate("/login");
      } else {
        toast.error(message || "Signup failed", { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "bottom-left",
      });
    }

    setInputValue({ email: "", username: "", password: "" });
  };

  return (
    <div className="auth-wrapper">
      <div className="form_container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={inputValue.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={inputValue.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={inputValue.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Signup</button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;