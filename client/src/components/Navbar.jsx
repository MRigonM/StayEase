import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Search, User } from "lucide-react";
import { getAccessToken, clearTokens } from "../authService/TokenService";
import { getCurrentUserName } from "../authService/UserService";

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoggedIn(!!getAccessToken());
      if (!getAccessToken()) {
        if (mounted) setUserName(null);
        return;
      }

      try {
        const name = await getCurrentUserName();
        if (mounted) setUserName(name || null);
      } catch (e) {
        console.error("Failed to fetch current user name:", e);
        if (mounted) setUserName(null);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    clearTokens();
    setIsLoggedIn(false);
    setUserName(null);
    window.location.href = "/";
  };

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
        <span className="text-3xl font-semibold tracking-tight text-rose-500">
          StayEase
        </span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
                to="/explore"
                className="text-lg font-medium text-gray-700 hover:text-rose-500"
            >
              Explore
            </Link>
            <Link
                to="/bookings"
                className="text-lg font-medium text-gray-700 hover:text-rose-500"
            >
              Bookings
            </Link>
            <Link
                to="/host"
                className="text-lg font-medium text-gray-700 hover:text-rose-500"
            >
              Host Your Home
            </Link>
          </nav>

          <nav className="hidden items-center gap-6 md:flex">
            <button className="text-sm font-medium text-gray-700 hover:text-rose-500">
              <Globe className="h-6 w-6" />
              <span className="sr-only">Select language</span>
            </button>

            {isLoggedIn ? (
                <div className="relative">
                  <button
                      onClick={() => setIsUserMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-rose-500"
                  >
                    <span className="text-base">{userName ?? "Account"}</span>
                    <User className="h-6 w-6" />
                  </button>

                  {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-50">
                        <ul className="py-1 text-sm text-gray-700">
                          <li>
                            <Link
                                to="/profile"
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                                to="/settings"
                                className="block px-4 py-2 hover:bg-gray-100"
                            >
                              Settings
                            </Link>
                          </li>
                          <li>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left block px-4 py-2 hover:bg-gray-100"
                            >
                              Logout
                            </button>
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
        </div>
      </header>
  );

}
