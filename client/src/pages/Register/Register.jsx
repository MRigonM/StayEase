import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    image: null,
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files?.[0] ?? null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      firstName,
      middleName,
      lastName,
      address,
      phoneNumber,
      email,
      userName,
      password,
      confirmPassword,
      role,
      image,
    } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!email || !userName) {
      setError('Email and Username are required');
      return;
    }

    if (phoneNumber) {
      const trimmed = phoneNumber.trim();
      const allowedCharsRe = /^[0-9+() \-]+$/;
      if (!allowedCharsRe.test(trimmed)) {
        setError('Phone number contains invalid characters');
        return;
      }
      if (trimmed.length < 12) {
        setError('Phone number must be at least 12 characters');
        return;
      }
    }

    const roleEnum = (role || 'customer').toLowerCase() === 'owner' ? 'Owner' : 'Customer';

    // Build FormData (multipart/form-data) matching RegisterDTO property names (PascalCase)
    const fd = new FormData();
    fd.append('FirstName', firstName ?? '');
    fd.append('MiddlName', middleName ?? '');
    fd.append('LastName', lastName ?? '');
    fd.append('Address', address ?? '');
    fd.append('PhoneNumber', phoneNumber ?? '');
    fd.append('Email', email ?? '');
    fd.append('UserName', userName ?? '');
    fd.append('Password', password ?? '');
    // roles: append as one value; model binder should bind single value to IEnumerable<Role> as a single element
    // If needed you can instead do fd.append('roles[0]', roleEnum)
    fd.append('roles', roleEnum);

    // If you want to send an image later:
    if (image) {
      fd.append('Image', image);
    }

    try {
      setSubmitting(true);
      // IMPORTANT: do NOT set Content-Type header; let axios set multipart boundary automatically
      const resp = await axios.post('https://localhost:5000/api/Account/Register', fd, {
        withCredentials: true,
      });

      // success
      // navigate('/logIn');
      navigate("/confirmEmail", { state: { email: email } });
    } catch (err) {
      console.error('Registration error full response:', err.response);
      const serverData = err.response?.data;
      let apiMessage = 'Registration failed';

      if (serverData) {
        if (serverData.errors && typeof serverData.errors === 'object') {
          apiMessage = Object.values(serverData.errors)
              .flat()
              .map((v) => (typeof v === 'string' ? v : JSON.stringify(v)))
              .join(' | ');
        } else if (Array.isArray(serverData)) {
          apiMessage = serverData.map((x) => x.errorMessage || x).join(' | ');
        } else if (serverData.message || serverData.title || serverData.detail) {
          apiMessage = serverData.message || serverData.title || serverData.detail;
        } else {
          try {
            apiMessage = JSON.stringify(serverData);
          } catch {
            apiMessage = err.message || apiMessage;
          }
        }
      } else {
        apiMessage = err.message || apiMessage;
      }

      setError(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-2 mb-2">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>

            <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+383 123123123"
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@example.com"
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 h-8 px-3 text-gray-900 shadow-sm focus:border-logoColor focus:ring-logoColor sm:text-sm"
                >
                  <option value="owner">Owner</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              {error && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                    {error}
                  </div>
              )}

              <div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center rounded-lg bg-logoColor px-4 h-8 text-sm font-semibold
                  text-white shadow-md hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2
                    focus:ring-offset-2 focus:ring-logoColor transition mt-6"
                  >
                  {submitting ? 'Signing up…' : 'Sign up'}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/logIn" className="font-semibold text-logoColor hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

  );
};

export default Register;
