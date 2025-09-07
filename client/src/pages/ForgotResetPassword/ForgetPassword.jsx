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
        setError("");
        setMessage("");
        setLoading(true);

        const result = await forgetPassword(email);
        setLoading(false);

        if (result.success) {
            setMessage(result.message);
            navigate("/resetPassword", { state: { email, token: result.data } });
        } else {
            setError(result.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-2 mb-2">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-4">
                        Forgot Password
                    </h2>

                    <p className="text-center text-sm text-gray-600 mb-6">
                        Enter your user account's verified email address and we will send you the code to reset password.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="example@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-10 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                                {Array.isArray(error) ? (
                                    <ul className="list-disc list-inside">
                                        {error.map((err, idx) => (
                                            <li key={idx}>{err}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{error}</p>
                                )}
                            </div>
                        )}

                        {message && (
                            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                                {message}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center rounded-lg bg-logoColor px-4 h-10 text-sm font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-logoColor transition"
                            >
                                {loading ? "Sending…" : "Send Reset Code"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
