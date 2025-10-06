import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MyContext } from "../MyContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useContext(MyContext);
  const [inputValue, setInputValue] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        inputValue,
        { withCredentials: true }
      );

      console.log("Login response:", data);

      const success = data?.success;
      const message = data?.message;
      const accessToken = data?.data?.accessToken;

      if (success && accessToken) {
        toast.success(message || "Login successful", { position: "bottom-left" });
        setAuthToken(accessToken);
        localStorage.setItem("token", accessToken);
        navigate("/chat");
      } else {
        toast.error(message || "Login failed", { position: "bottom-left" });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "bottom-left",
      });
    }

    setInputValue({ email: "", password: "" });
  };

  return (
    <div className="auth-wrapper">
      <div className="form_container">
        <h2>Login Account</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;