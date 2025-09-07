import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { forgetPassword } from "../../authService/AuthService";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage(""); setLoading(true);

        const result = await forgetPassword(email);
        setLoading(false);

        if (result.success) {
            setMessage(result.message);
            // Navigate to ResetPassword page with token and email
            navigate("/resetPassword", { state: { email, token: result.data } });
        } else {
            setError(result.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <h2 className="text-center text-2xl font-bold mb-6">Forgot Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full rounded-md border px-3 py-2"
                        />
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        {message && <p className="text-green-600 text-sm">{message}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-indigo-600 text-white py-2"
                        >
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
