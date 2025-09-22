import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../authService/AxiosInstance";

const Settings = () => {
  const [step, setStep] = useState(1); // 1 = Forget, 2 = Reset
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    passwordConfirmation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/Account/ForgetPassword", {
        email: formData.email,
      });

      if (res.data.isSuccess) {
        const resetToken = res.data.data;
        localStorage.setItem("resetToken", resetToken);

        setMessage("📩 Verification code has been sent to your email.");
        setStep(2);
      } else {
        setError(res.data.message || "Failed to send reset code.");
      }
    } catch (err) {
      setError("Error sending reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("resetToken");

      const payload = {
        email: formData.email,
        otp: formData.code,
        token: token,
        newPassword: formData.newPassword,
        passwordConfirmation: formData.passwordConfirmation,
      };

      const res = await api.put("/Account/ResetPassword", payload);

      if (res.data.isSuccess) {
        setMessage("✅ Password updated successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-logoColor to-purple-600 text-white rounded-t-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold">
            {step === 1 ? "🔒 Forgot Password" : "🔑 Reset Password"}
          </h1>
          <p className="text-sm text-gray-100 mt-1">
            {step === 1
              ? "Enter your email to receive a reset code."
              : "Enter the verification code and your new password."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-lg rounded-b-2xl p-8 space-y-6">
          {message && (
            <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleForgetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-logoColor text-white py-3 rounded-lg shadow hover:opacity-90 transition font-semibold"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-logoColor focus:border-logoColor"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-logoColor to-purple-600 text-white py-3 rounded-lg shadow hover:opacity-90 transition font-semibold"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
