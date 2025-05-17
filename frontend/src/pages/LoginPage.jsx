import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from "@/store/authStore";
import { useNavigate, Link } from 'react-router-dom';
import trialImg from '../assets/trial3.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const success = await login(email, password);

  if (success) {
    navigate("/dashboard");
  } else {
    console.warn("Login failed or unauthorized");
  }
};

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div
        className="row shadow overflow-hidden bg-white rounded"
        style={{ height: '70vh', width: '70vw' }}
      >

        {/* Left Image Panel */}
        <div className="col-md-6 d-none d-md-flex p-0">
          <img
            src={trialImg}
            alt="Login Illustration"
            className="img-fluid w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right Form Panel */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="p-5 w-100" style={{ maxWidth: '400px' }}>
            <h2 className="fw-bold mb-3 text-dark text-center">Welcome Back</h2>
            <p className="text-muted text-center mb-4">Please enter your login details</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Mail size={18} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4 text-end">
                <Link to="/forgot-password" className="text-decoration-none text-secondary">
                  Forgot Password?
                </Link>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </motion.div>

              {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}

              <p className="mt-3">
                <Link to="/" className="text-secondary">Back</Link>
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
