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
      const resp = await axios.post('http://localhost:5000/api/Account/Register', fd, {
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

        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                  First Name
                </label>
                <div className="mt-2">
                  <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-900">
                  Middle Name
                </label>
                <div className="mt-2">
                  <input
                      type="text"
                      name="middleName"
                      id="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-900">
                  Address
                </label>
                <div className="mt-2">
                  <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+383 123123123"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                      type="text"
                      name="userName"
                      id="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                  Role
                </label>
                <div className="mt-2">
                  <select
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  >
                    <option value="owner">owner</option>
                    <option value="customer">customer</option>
                  </select>
                </div>
              </div>

              {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
              )}

              <div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full justify-center rounded-md bg-logoColor px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {submitting ? 'Signing up…' : 'Sign up'}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/logIn" className="font-semibold text-logoColor hover:opacity-90">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Register;
