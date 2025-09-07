import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { resetPassword } from "../../authService/AuthService";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || "";
    const token = location.state?.token || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Real-time validation state
    const [validationErrors, setValidationErrors] = useState({});

    const validate = () => {
        const errors = {};

        if (!otp.trim()) errors.otp = "OTP is required";
        if (!newPassword) {
            errors.newPassword = "New password is required";
        } else {
            if (newPassword.length < 8) errors.newPassword = "Password must be at least 8 characters";
            if (!/[A-Z]/.test(newPassword)) errors.newPassword = "Password must contain at least one uppercase letter";
            if (!/[a-z]/.test(newPassword)) errors.newPassword = "Password must contain at least one lowercase letter";
            if (!/[0-9]/.test(newPassword)) errors.newPassword = "Password must contain at least one number";
            if (!/[^a-zA-Z0-9]/.test(newPassword)) errors.newPassword = "Password must contain at least one special character";
        }

        if (!confirmPassword) errors.confirmPassword = "Confirm password is required";
        if (confirmPassword && newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");

        if (!validate()) return;

        setLoading(true);
        const result = await resetPassword({
            email,
            otp,
            token,
            newPassword,
            passwordConfirmation: confirmPassword,
        });
        setLoading(false);

        if (result.success) {
            setMessage(result.message);
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-2 mb-2">
                    <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Change Your Password</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter reset code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                            />
                            {validationErrors.otp && <p className="text-red-600 text-sm mt-1">{validationErrors.otp}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                            />
                            {validationErrors.newPassword && <p className="text-red-600 text-sm mt-1">{validationErrors.newPassword}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                            />
                            {validationErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>}
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
                        )}

                        {message && (
                            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">{message}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center rounded-lg bg-logoColor px-4 h-8 text-sm font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-logoColor transition"
                            >
                                {loading ? "Resetting…" : "Reset Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
