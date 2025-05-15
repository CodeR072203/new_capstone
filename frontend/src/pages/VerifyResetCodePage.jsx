import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const VerifyResetCodePage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { verifyResetCode, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const inputVal = e.target.value;
    if (!/^\d?$/.test(inputVal)) return; 
    const newCode = code.split("");
    newCode[index] = inputVal;
    setCode(newCode.join(""));

    if (inputVal && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await verifyResetCode(email, code);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.message || "Verification failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Enter the 6-digit Reset Code</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-3"
          required
        />

        <div className="d-flex justify-content-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="form-control text-center"
              style={{ width: "40px", height: "40px", fontSize: "1.5rem" }}
              value={code[i] || ""}
              onChange={(e) => handleChange(e, i)}
            />
          ))}
        </div>

        <button type="submit" className="btn btn-primary mt-3" disabled={isLoading || code.length < 6}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default VerifyResetCodePage;
