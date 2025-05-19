import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import { VerificationEmailPage } from "./pages/VerificationEmailPage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import DashboardPage from "./pages/DashboardPage";
import Home from "./pages/Home";
import './index.css';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage"; // ✅ New import

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated && !user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthenticatedUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, logout, user } = useAuthStore();

  useEffect(() => {
    const init = async () => await checkAuth();
    init();
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container-fluid p-0 m-0">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <AuthenticatedUserRoute>
              <SignUpPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticatedUserRoute>
              <LoginPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route path="/verify-email" element={<VerificationEmailPage />} />

        {/* 🛠 Public Routes */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectRoute>
              <ChangePasswordPage />
            </ProtectRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
