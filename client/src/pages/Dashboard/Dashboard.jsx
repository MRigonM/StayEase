import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import MainContent from './MainContent';

const Dashboard = () => {
    useEffect(() => {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const main = document.querySelector('.main');
    
        const toggleSidebar = (e) => {
          e.preventDefault();
          main.classList.toggle('active');
          sidebarOverlay.classList.toggle('hidden');
          sidebarMenu.classList.toggle('-translate-x-full');
        };
    
        const closeSidebar = (e) => {
          e.preventDefault();
          main.classList.add('active');
          sidebarOverlay.classList.add('hidden');
          sidebarMenu.classList.add('-translate-x-full');
        };
    
        sidebarToggle?.addEventListener('click', toggleSidebar);
        sidebarOverlay?.addEventListener('click', closeSidebar);
    
        document.querySelectorAll('.sidebar-dropdown-toggle').forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = item.closest('.group');
            if (parent.classList.contains('selected')) {
              parent.classList.remove('selected');
            } else {
              document.querySelectorAll('.sidebar-dropdown-toggle').forEach((i) => {
                i.closest('.group').classList.remove('selected');
              });
              parent.classList.add('selected');
            }
          });
        });
    
        return () => {
          sidebarToggle?.removeEventListener('click', toggleSidebar);
          sidebarOverlay?.removeEventListener('click', closeSidebar);
        };
      }, []);


  return (
    <div>
      {/* <Navbar /> */}

      <div className="admin-dashboard">
      <Sidebar />
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden sidebar-overlay hidden"></div>
      <main className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-200 min-h-screen transition-all main">
        <TopNavbar />
        <MainContent />
      </main>
    </div>
    </div>
  )
}

export default Dashboard
