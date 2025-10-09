// src/pages/VerifyEmailPending.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmailPending() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResend = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("You must be logged in to resend verification.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-email-verification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setMessage(res.data.message || "Verification email resent successfully.");
    } catch (err) {
      console.error("Resend failed:", err);
      setMessage("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-pending">
      <h2>Please verify your email</h2>
      <p>We've sent a verification link to your inbox. Click it to activate your account.</p>

      <button onClick={handleResend} disabled={loading}>
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>

      {message && <p className="status-message">{message}</p>}

      <button onClick={() => navigate("/login")} style={{ marginTop: "1rem" }}>
        Back to Login
      </button>
    </div>
  );
}

export default VerifyEmailPending;