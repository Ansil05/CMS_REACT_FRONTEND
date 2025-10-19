import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useRole } from '../context/RoleContext';

const MainLayout = () => {
  const { role } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar 
        toggleSidebar={toggleSidebar} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <div className="d-flex flex-grow-1 position-relative">
        <Sidebar 
          isOpen={sidebarOpen} 
          role={role}
          isDarkMode={isDarkMode}
        />
        
        <main 
          className="flex-grow-1 d-flex flex-column"
          style={{
            marginLeft: sidebarOpen && window.innerWidth >= 992 ? '280px' : '0',
            transition: 'margin-left 0.3s ease',
            minHeight: 'calc(100vh - 80px)' // Updated from 68px to 80px
          }}
        >
          <div 
            className="flex-grow-1"
            style={{
              padding: '2rem',
              background: isDarkMode ? '#0f172a' : '#f8fafc'
            }}
          >
            <Outlet />
          </div>
          
          <Footer isDarkMode={isDarkMode} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
