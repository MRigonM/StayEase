import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Menu, Search, User } from "lucide-react";
import { getAccessToken, clearTokens } from "../authService/TokenService";

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    clearTokens();
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold tracking-tight text-rose-500">
            StayEase
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:block md:flex-1 md:px-12">
          <div
            className={`relative mx-auto flex max-w-md items-center rounded-full border px-4 py-2 shadow-sm transition-all ${
              isSearchFocused ? "ring-2 ring-rose-500" : ""
            }`}
          >
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations"
              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {
            isLoggedIn ? (
              <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-rose-500"
          >
            Dashboard
          </Link>
            ) : null
          }
       
          <Link
            to="/explore"
            className="text-sm font-medium text-gray-700 hover:text-rose-500"
          >
            Explore
          </Link>
          <Link
            to="/bookings"
            className="text-sm font-medium text-gray-700 hover:text-rose-500"
          >
            Bookings
          </Link>
          <Link
            to="/host"
            className="text-sm font-medium text-gray-700 hover:text-rose-500"
          >
            Host Your Home
          </Link>

          <button className="text-sm font-medium text-gray-700 hover:text-rose-500">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Select language</span>
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="text-sm font-medium text-gray-700 hover:text-rose-500"
              >
                <User className="h-5 w-5 text-gray-700" />
                <span className="sr-only">User menu</span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-50">
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <Link to="/profilePage" className="block px-4 py-2">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/account" className="block px-4 py-2">
                        Account
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" className="block px-4 py-2">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <a
                        href="/logout"
                        onClick={handleLogout}
                        className="block px-4 py-2"
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-rose-500 border-2 rounded-full px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-gray-700 hover:text-rose-500 border-2 rounded-full px-4 py-2"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <button className="text-sm font-medium text-gray-700 hover:text-rose-500">
            <User className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </button>
          <button
            className="text-sm font-medium text-gray-700 hover:text-rose-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
              <div className="absolute top-0 right-0 w-[250px] bg-white h-full p-6 space-y-6">
                <div className="relative flex items-center rounded-full border px-4 py-2">
                  <Search className="mr-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search destinations"
                    className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                <nav className="flex flex-col gap-4">
                  <Link
                    to="/explore"
                    className="text-base font-medium text-gray-700 hover:text-rose-500"
                  >
                    Explore
                  </Link>
                  <Link
                    to="/bookings"
                    className="text-base font-medium text-gray-700 hover:text-rose-500"
                  >
                    Bookings
                  </Link>
                  <Link
                    to="/host"
                    className="text-base font-medium text-gray-700 hover:text-rose-500"
                  >
                    Host Your Home
                  </Link>
                </nav>

                {isLoggedIn ? (
                  <nav className="flex flex-col gap-2">
                    <Link to="/profile" className="text-sm text-gray-700">
                      Profile
                    </Link>
                    <Link to="/account" className="text-sm text-gray-700">
                      Account
                    </Link>
                    <Link to="/settings" className="text-sm text-gray-700">
                      Settings
                    </Link>
                    <a
                      href="/logout"
                      onClick={handleLogout}
                      className="text-sm text-gray-700"
                    >
                      Logout
                    </a>
                  </nav>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="w-full text-center font-medium text-gray-700 hover:text-rose-500 border-2 rounded-full py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center font-medium text-gray-700 hover:text-rose-500 border-2 rounded-full py-2"
                    >
                      Register
                    </Link>
                  </div>
                )}

                <button
                  className="absolute top-2 right-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
