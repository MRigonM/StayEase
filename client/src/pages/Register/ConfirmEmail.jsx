import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // email e marrim nga navigate state
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const resp = await axios.post(
        `http://localhost:5000/api/Account/EmailConfirmation?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(code)}`
      );

      if (resp.data?.succeeded) {
        // nëse backend kthen succeeded
        navigate("/logIn");
      } else {
        setError(resp.data?.message || "Confirmation failed");
      }
    } catch (err) {
      console.error("Email confirmation error:", err.response);
      setError(err.response?.data?.message || "Error confirming email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Confirm your email
          </h2>
          <p className="text-center text-sm text-gray-600">
            We have sent a confirmation code to <b>{email}</b>.
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-900"
              >
                Confirmation Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="code"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full justify-center rounded-md bg-logoColor px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {submitting ? "Confirming…" : "Confirm Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
