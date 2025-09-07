import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { loginUser } from '../../authService/AuthService';

const LogIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await loginUser(formData);
        console.log('Login result:', result);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };


    return (
        <div>
            <Navbar />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-10 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <Link
                                    to="/forgotPassword"
                                    className="text-sm font-semibold text-logoColor hover:text-indigo-500"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-10 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-medium text-center">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full flex justify-center rounded-lg bg-logoColor px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-logoColor transition"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Need an account?{' '}
                        <Link
                            to="/Register"
                            className="font-semibold text-logoColor hover:text-indigo-500"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogIn;
