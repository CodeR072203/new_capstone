import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await axios.post("/api/auth/reset-password", { email, newPassword });
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/"), 2000); // go back to login
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Reset Password</h3>
      <p className="text-muted">Enter your new password for {email}</p>

      <input
        type="password"
        className="form-control mb-3"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="btn btn-success w-100" onClick={handleResetPassword}>
        Reset Password
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">Password reset successfully</div>}
    </div>
  );
}
