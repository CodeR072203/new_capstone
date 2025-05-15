import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function VerificationEmailPage() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { verifyEmail, isLoading, error, user } = useAuthStore();

  const handleChange = (e, index) => {
    const inputVal = e.target.value;
    if (!/^\d?$/.test(inputVal)) return; 
    const newValue = value.split("");
    newValue[index] = inputVal;
    setValue(newValue.join(""));
    // Move to next input if value is entered
    if (inputVal && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleSubmit = async () => {
    await verifyEmail(value);
    if (!error && !isLoading) {
      toast.success("Your email has been verified successfully", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    } else {
      toast.error("Verification failed. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center gap-3">
        <div className="d-flex justify-content-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="form-control text-center"
              style={{ width: "40px", height: "40px", fontSize: "1.5rem" }}
              value={value[i] || ""}
              onChange={(e) => handleChange(e, i)}
            />
          ))}
        </div>
        <div className="text-center text-muted small">
          {value === "" ? "Enter your verification email code." : `You entered: ${value}`}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading || value.length < 6}
        >
          {isLoading ? "Verifying..." : "Verify Email Now"}
        </button>
      </div>
    </div>
  );
}
