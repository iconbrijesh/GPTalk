import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MyContext } from "../MyContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useContext(MyContext);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleError = (err) =>
    toast.error(err, { position: "bottom-left" });

  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-left" });

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/login`,
      inputValue,
      { withCredentials: true }
    );

    console.log("Login response:", data);

    const success = data?.success;
    const message = data?.message;
    const accessToken = data?.data?.accessToken;

    if (success && accessToken) {
      handleSuccess(message || "Login successful");
      setAuthToken(accessToken);
      localStorage.setItem("token", accessToken);
      navigate("/chat");
    } else {
      handleError(message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    handleError(error?.response?.data?.message || "Something went wrong");
  }

  setInputValue({ email: "", password: "" });
};

  return (
    <div className="auth-wrapper">
      <div className="form_container">
        <h2>Login Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={inputValue.email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={inputValue.password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
          <span>
            Don't have an account? <Link to="/signup">Signup</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;