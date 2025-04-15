import React , { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../components/Navbar.css'
import { getAccessToken, clearTokens } from '../authService/TokenService';
const Navbar = () => {


  const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = getAccessToken();
      setIsLoggedIn(!!token); // true if token exists
    }, []);

  return (
    <>
     <nav className="bg-white nav">
  <div className="px-2 sm:px-6 lg:px-8 ">
    <div className="relative flex h-16 items-center justify-between">
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
          <span className="absolute -inset-0.5"></span>
          <span className="sr-only">Open main menu</span>

          <svg className="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>

          <svg className="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="logoLinks">
      {/* flex shrink-0 items-center" */}
        <div className="logoBox">
          <Link to="/" className='logo'>Stay<span className='ease'>Ease</span></Link>
        </div>
        <div className="hidden sm:ml-6 sm:block">
        {/* flex space-x-4 */}
          <div className="links"> 
            <Link  className="link rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-black">Dashboard</Link>
            <Link  className="link rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-black">Team</Link>
            <Link  className="link rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-black">Projects</Link>
            <Link  className="link rounded-md px-3 py-2 text-sm font-medium text-gray-300  hover:text-black">Calendar</Link>
          </div>
        </div>
      </div>

      {isLoggedIn ? (
       <button
       onClick={() => {
         clearTokens();
         setIsLoggedIn(false);
         window.location.href = '/'; // refresh or redirect to home
       }}
       className="w-[150px] text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
     >
       Log Out
     </button>
      ) : (
        <div className='loginSignup'>
        <Link to="/logIn" type="button" className="w-[150px] text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          Log In
        </Link>

      <Link to="/register" type="button" className="w-[150px] text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        Sign Up
      </Link>
    </div>
      )}
     
     
    </div>
  </div>

  <div className="sm:hidden" id="mobile-menu">
    <div className="space-y-1 px-2 pt-2 pb-3">
      <a href="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
      <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
    </div>
  </div>
</nav>
    </>
  )
}

export default Navbar
