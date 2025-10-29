import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Dropdown } from 'react-bootstrap';
import { FaBars, FaUser, FaBell, FaSignOutAlt, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { useRole } from '../context/RoleContext';
import logo from '../assets/images/logo.png'; // ✅ Import your logo
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar, isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { role } = useRole();
  const [notifications] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleName = () => {
    const roleNames = {
      admin: 'Administrator',
      doctor: 'Doctor',
      receptionist: 'Receptionist',
      labtechnician: 'Lab Technician',
      pharmacist: 'Pharmacist',
    };
    return roleNames[user.role] || 'User';
  };

  return (
    <BSNavbar 
      expand="lg" 
      className={`border-bottom shadow-sm ${isDarkMode ? 'navbar-dark' : ''}`}
      style={{ 
        background: isDarkMode 
          ? '#1e293b' 
          : 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        height: '80px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
    >
      <Container fluid className="px-4 position-relative h-100">
        <div className="d-flex justify-content-between align-items-center w-100 h-100">
          {/* Left Side - Menu Toggle & Logo */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link p-0"
              onClick={toggleSidebar}
              style={{ 
                fontSize: '1.5rem',
                color: isDarkMode ? 'white' : '#2e7d32'
              }}
            >
              <FaBars />
            </button>
            
            {/* ✅ LOGO IMAGE - Replaces the icon */}
            <img 
              src={logo}
              alt="Angel Care Hospital Logo"
              style={{
                height: '55px',
                width: 'auto',
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          {/* CENTER - Hospital Name (BIG & BOLD) */}
          <div 
            className="position-absolute start-50 translate-middle-x d-none d-lg-flex align-items-center"
            style={{
              height: '100%',
              top: 0,
              pointerEvents: 'none'
            }}
          >
            <span 
              className="fw-bold" 
              style={{ 
                fontSize: '2rem',
                color: isDarkMode ? 'white' : '#1b5e20',
                whiteSpace: 'nowrap',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontFamily: 'Arial, sans-serif',
                textShadow: isDarkMode 
                  ? '0 2px 4px rgba(0,0,0,0.3)' 
                  : '0 2px 4px rgba(46, 125, 50, 0.2)'
              }}
            >
              ANGEL CARE MULTI-SPECIALITY HOSPITAL
            </span>
          </div>

          {/* Right Side - Theme, Notifications, User */}
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <button
              className="btn btn-link p-2"
              onClick={toggleTheme}
              style={{ 
                color: isDarkMode ? 'white' : '#2e7d32',
                fontSize: '1.25rem',
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(46, 125, 50, 0.1)',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Notifications */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 position-relative"
                style={{ 
                  background: 'transparent',
                  boxShadow: 'none',
                  fontSize: '1.25rem',
                  color: isDarkMode ? 'white' : '#2e7d32'
                }}
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span 
                    className="position-absolute translate-middle badge rounded-pill bg-danger"
                    style={{
                      top: '0',
                      left: '100%',
                      fontSize: '0.65rem'
                    }}
                  >
                    {notifications.length}
                  </span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ width: '300px' }}>
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Divider />
                {notifications.length === 0 ? (
                  <div className="text-center py-3 text-muted">
                    <small>No new notifications</small>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <Dropdown.Item key={index}>
                      {notification.message}
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="text-decoration-none p-0 border-0"
                style={{ background: 'transparent', boxShadow: 'none' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="d-none d-xl-block text-start">
                    <div 
                      className="fw-semibold" 
                      style={{ 
                        fontSize: '0.875rem',
                        color: isDarkMode ? 'white' : '#1b5e20'
                      }}
                    >
                      {user?.username || 'User'}
                    </div>
                    <div 
                      className="text-muted" 
                      style={{ 
                        fontSize: '0.75rem',
                        color: isDarkMode ? '#94a3b8' : '#2e7d32'
                      }}
                    >
                      {getRoleName()}
                    </div>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ minWidth: '200px' }}>
                <Dropdown.Item className="d-flex align-items-center gap-2">
                  <FaUser size={14} />
                  <span>Profile</span>
                </Dropdown.Item>
                <Dropdown.Item className="d-flex align-items-center gap-2">
                  <FaCog size={14} />
                  <span>Settings</span>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  className="d-flex align-items-center gap-2 text-danger"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={14} />
                  <span>Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
