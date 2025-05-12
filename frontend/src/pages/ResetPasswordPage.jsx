"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { Eye, EyeOff, Check, X } from "react-feather"
import { useAuthStore } from "@/store/authStore"

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validations, setValidations] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  })

  const { token } = useParams()
  const { resetPassword, message } = useAuthStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const { password, confirmPassword } = formData
    const newValidations = {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      passwordsMatch: password === confirmPassword && password !== "",
    }
    setValidations(newValidations)

    let strength = 0
    Object.values(newValidations).slice(0, 5).forEach(valid => {
      if (valid) strength += 20
    })
    setPasswordStrength(strength)
  }, [formData])

  const getStrengthClass = () => {
    if (passwordStrength < 40) return "danger"
    if (passwordStrength < 80) return "warning"
    return "success"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allValid = Object.values(validations).every(Boolean)

    if (!allValid) {
      setResetError("Please fix the errors before submitting")
      return
    }

    setIsSubmitting(true)
    setResetError("")
    try {
      await resetPassword(token, formData.password)
      setResetSuccess(true)
      setFormData({ password: "", confirmPassword: "" })
    } catch (err) {
      setResetError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Reset Password</h4>
            </div>
            <div className="card-body">
              {resetSuccess || message ? (
                <div className="alert alert-success">
                  <h5 className="alert-heading">Success!</h5>
                  <p>{message || "Your password has been reset."}</p>
                </div>
              ) : (
                <>
                  {resetError && (
                    <div className="alert alert-danger">{resetError}</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    {/* Password */}
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mb-3">
                        <label>Password Strength</label>
                        <div className="progress">
                          <div
                            className={`progress-bar bg-${getStrengthClass()}`}
                            role="progressbar"
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    <div className="mb-3">
                      <ul className="list-group">
                        {[
                          ["At least 8 characters", validations.hasMinLength],
                          ["Uppercase letter", validations.hasUppercase],
                          ["Lowercase letter", validations.hasLowercase],
                          ["Number", validations.hasNumber],
                          ["Special character", validations.hasSpecialChar],
                        ].map(([label, valid], i) => (
                          <li
                            key={i}
                            className={`list-group-item d-flex justify-content-between align-items-center ${
                              valid ? "text-success" : "text-muted"
                            }`}
                          >
                            {label}
                            {valid ? <Check size={16} /> : <X size={16} className="text-danger" />}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-group has-validation">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-control ${
                            formData.confirmPassword
                              ? validations.passwordsMatch
                                ? "is-valid"
                                : "is-invalid"
                              : ""
                          }`}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {formData.confirmPassword && !validations.passwordsMatch && (
                        <div className="invalid-feedback">Passwords do not match</div>
                      )}
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Resetting...
                          </>
                        ) : (
                          "Reset Password"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            <div className="card-footer text-center">
              <a href="#" className="text-decoration-none">Back to Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
