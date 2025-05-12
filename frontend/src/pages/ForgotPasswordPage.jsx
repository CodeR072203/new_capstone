import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { forgotPassword, message } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear error message when the user starts typing a new email.
    setErrorMessage("");
  }, [email]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await forgotPassword(email);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="card-header text-center">
          <h5 className="card-title mb-0">Forgot Password</h5>
          <p className="text-muted mb-0">Enter your email to reset your password.</p>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Reset Password
            </button>
          </form>
        </div>
        <div className="card-footer text-center">
          {message && <p className="text-success small mb-2">{message}</p>}
          {errorMessage && <p className="text-danger small mb-2">{errorMessage}</p>}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={handleBackToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
