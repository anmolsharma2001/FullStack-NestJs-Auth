
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      await API.put(
        "/auth/change-password",
        form, // includes oldPassword and newPassword
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Password changed successfully!");
      // optionally clear form or redirect
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="oldPassword" className="block text-gray-700 font-semibold mb-2">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
