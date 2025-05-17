import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      const response = await axios.post("/api/auth/send-reset-code", { email });
      setCodeSent(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("/api/auth/verify-reset-code", { email, code });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Code verification failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Forgot Password</h3>
      <p className="text-muted">Enter your email to receive a reset code.</p>

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={codeSent}
      />

      {codeSent ? (
        <>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={handleVerifyCode}>
            Verify Code
          </button>
        </>
      ) : (
        <button className="btn btn-primary w-100" onClick={handleSendCode}>
          Send Reset Code
        </button>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}


export default ForgotPasswordPage