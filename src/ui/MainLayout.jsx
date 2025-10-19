import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useRole } from '../context/RoleContext';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { role } = useRole();
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  }, [location]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: 'var(--bg-secondary)' }}>
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="d-flex flex-grow-1 position-relative">
        <Sidebar isOpen={sidebarOpen} role={role} />
        
        <main 
          className="flex-grow-1 p-4 fade-in"
          style={{ 
            marginLeft: sidebarOpen && window.innerWidth >= 992 ? '280px' : '0',
            transition: 'margin-left var(--transition-base)',
            minHeight: 'calc(100vh - 68px - 70px)', // minus navbar and footer height
          }}
        >
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
