import React from 'react';

const TopNavbar = () => {
  return (
    <div className="py-2 px-6 bg-[#f8f4f3] flex items-center shadow-md shadow-black/5 sticky top-0 left-0 z-30">
      <button type="button" className="text-lg text-gray-900 font-semibold sidebar-toggle">
        <i className="ri-menu-line"></i>
      </button>
      <ul className="ml-auto flex items-center">
        <li>
          <button id="fullscreen-button">
            <i className="ri-fullscreen-line hover:bg-gray-100 rounded-full"></i>
          </button>
        </li>
        <li className="ml-3">
          <button type="button" className="dropdown-toggle flex items-center">
            <div className="flex-shrink-0 w-10 h-10 relative">
              <div className="p-1 bg-white rounded-full">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://laravelui.spruko.com/tailwind/ynex/build/assets/images/faces/9.jpg"
                  alt="profile"
                />
                <div className="top-0 left-7 absolute w-3 h-3 bg-lime-400 border-2 border-white rounded-full animate-ping"></div>
                <div className="top-0 left-7 absolute w-3 h-3 bg-lime-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
            <div className="p-2 md:block text-left">
              <h2 className="text-sm font-semibold text-gray-800">John Doe</h2>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TopNavbar;