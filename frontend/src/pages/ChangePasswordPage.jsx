// src/pages/ChangePasswordPage.jsx
import React, { useState } from "react";
import axios from "../api/axios"; // Adjust path as needed
import { toast } from "react-toastify";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.error || "Failed to change password"
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
