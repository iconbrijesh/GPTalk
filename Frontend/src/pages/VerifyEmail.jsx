import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail } from '../services/authService';
import { toast } from 'react-toastify';
import './VerifyEmail.css'; // optional styling

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    console.log("🔍 VerifyEmail mounted with token:", token);

    const handleVerify = async () => {
      if (!token) {
        setMessage('❌ Verification token is missing.');
        toast.error('Missing verification token.');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        setMessage('✅ Email verified successfully!');
        toast.success('Email verified! Redirecting to login...');
        localStorage.removeItem('accessToken'); // cleanup
        setTimeout(() => navigate('/login'), 3000); // smoother UX
      } catch (err) {
        const errorMsg = err.response?.data?.message || '❌ Verification failed.';
        setMessage(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    handleVerify();
  }, [token, navigate]);

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      toast.success('Verification email resent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-container">
      <h2>Email Verification</h2>
      <p>{loading ? '🔄 Verifying your email...' : message}</p>

      {!loading && message.includes('❌') && (
        <button onClick={handleResend} disabled={resending}>
          {resending ? 'Resending...' : 'Resend Verification Email'}
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;