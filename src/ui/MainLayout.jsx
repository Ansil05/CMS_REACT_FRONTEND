import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useRole } from '../context/RoleContext';

const MainLayout = () => {
  const { role } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  // ✅ Handle screen resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 992) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [windowWidth]);

  return (
    <div className={`d-flex flex-column ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`} style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Wrapper */}
      <div className="d-flex flex-grow-1 position-relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          role={role}
          isDarkMode={isDarkMode}
          toggleSidebar={toggleSidebar}
        />

        {/* Overlay for small screens */}
        {sidebarOpen && windowWidth < 992 && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 998,
            }}
            onClick={toggleSidebar}
          />
        )}

        {/* Main Page Content */}
        <main
          className="flex-grow-1 d-flex flex-column"
          style={{
            marginLeft: sidebarOpen && windowWidth >= 992 ? '250px' : '0',
            transition: 'margin-left 0.3s ease',
            minHeight: 'calc(100vh - 80px)',
            background: isDarkMode ? '#0f172a' : '#f8fafc',
          }}
        >
          <Container fluid className="py-4">
            <div className="flex-grow-1">
              <Outlet />
            </div>
          </Container>

          <Footer isDarkMode={isDarkMode} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
