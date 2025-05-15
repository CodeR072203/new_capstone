import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { forgotPassword, verifyResetCode, resetPassword, message, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setErrorMessage("");
  }, [email, code, newPassword]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStep(2);
    } catch {
      setErrorMessage("Could not send verification code. Try again.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      await verifyResetCode(email, code);
      setStep(3);
    } catch {
      setErrorMessage("Invalid or expired code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, newPassword);
    } catch {
      setErrorMessage("Password reset failed. Try again.");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-header text-center">
          <h5 className="card-title mb-0">Reset Password</h5>
        </div>
        <div className="card-body">
          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-100">
                Send Verification Code
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                maxLength="6"
                className="form-control mb-3"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-100">
                Verify Code
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <input
                type="password"
                className="form-control mb-3"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          {message && <div className="alert alert-success mt-3">{message}</div>}
        </div>

        {/* ✅ Only show "Back to Login" if password reset succeeded */}
        {step === 3 && message && (
          <div className="card-footer text-center">
            <button className="btn btn-link" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
