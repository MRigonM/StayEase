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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");

        if (!otp.trim()) return setError("OTP is required");
        if (!newPassword) return setError("New password is required");
        if (newPassword !== confirmPassword) return setError("Passwords do not match");

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
            <div className="flex min-h-screen flex-col items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <h2 className="text-center text-2xl font-bold mb-6">Reset Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full rounded-md border px-3 py-2"
                        />

                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        {message && <p className="text-green-600 text-sm">{message}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-indigo-600 text-white py-2"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
