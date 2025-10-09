import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Add toast for feedback
import './VerifyEmailPending.css'; // ✅ Add styling

function VerifyEmailPending() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResend = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("You must be logged in to resend verification.");
      toast.error("Missing access token.");
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

      const msg = res.data.message || "Verification email resent successfully.";
      setMessage(msg);
      toast.success(msg);
    } catch (err) {
      console.error("Resend failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to resend verification email.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="verify-page-wrapper">
    <div className="verify-email-pending">
      <h2>Please verify your email</h2>
      <p>We've sent a verification link to your inbox. Click it to activate your account.</p>

      <button className="verify-btn" onClick={handleResend} disabled={loading}>
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>

      {message && <p className="status-message">{message}</p>}

      <button className="verify-btn secondary" onClick={() => navigate("/login")}>
        Back to Login
      </button>
    </div>
  </div>
);
}

export default VerifyEmailPending;