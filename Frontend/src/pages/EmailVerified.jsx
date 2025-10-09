import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EmailVerified() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("✅ Email verified successfully!");
    localStorage.removeItem("accessToken"); // optional cleanup
    setTimeout(() => navigate("/login"), 3000);
  }, [navigate]);

  return (
    <div className="verify-container">
      <h2>Email Verified</h2>
      <p>Redirecting to login...</p>
    </div>
  );
}

export default EmailVerified;