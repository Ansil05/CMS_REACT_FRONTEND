import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendar, FaFileInvoiceDollar, FaUserMd, FaFlask, FaPills, FaCog, FaChartBar, FaQuoteLeft, FaFileAlt } from 'react-icons/fa';


const Sidebar = ({ isOpen, role, isDarkMode }) => {
  const getMenuItems = () => {
    const menus = {
      admin: [
        { path: '/admin', icon: FaHome, label: 'Dashboard' },
        { path: '/admin/users', icon: FaUsers, label: 'Users' },
        { path: '/admin/doctors', icon: FaUserMd, label: 'Doctors' },
        { path: '/admin/reports', icon: FaChartBar, label: 'Reports' },
        { path: '/admin/settings', icon: FaCog, label: 'Settings' },
      ],
      doctor: [
  { path: '/app/doctor', icon: FaHome, label: 'Dashboard' },
  { path: '/app/doctor/appointments', icon: FaCalendar, label: 'Appointments' },
  { path: '/app/doctor/consultations', icon: FaFileAlt, label: 'Consultation History' },
],


      receptionist: [
        { path: '/receptionist', icon: FaHome, label: 'Dashboard' },
        { path: '/receptionist/patients', icon: FaUsers, label: 'Patients' },
        { path: '/receptionist/appointments', icon: FaCalendar, label: 'Appointments' },
        { path: '/receptionist/billing', icon: FaFileInvoiceDollar, label: 'Billing' },
      ],
      labTechnician: [
        { path: '/lab-technician', icon: FaHome, label: 'Dashboard' },
        { path: '/lab-technician/tests', icon: FaFlask, label: 'Lab Tests' },
        { path: '/lab-technician/reports', icon: FaChartBar, label: 'Reports' },
      ],
      pharmacist: [
        { path: '/pharmacist', icon: FaHome, label: 'Dashboard' },
        { path: '/pharmacist/medicines', icon: FaPills, label: 'Medicines' },
        { path: '/pharmacist/orders', icon: FaFileInvoiceDollar, label: 'Orders' },
        { path: '/pharmacist/inventory', icon: FaChartBar, label: 'Inventory' },
      ],
    };

    return menus[role] || [];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && window.innerWidth < 992 && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ 
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040,
            top: '80px' // ✅ CHANGED: Start below navbar
          }}
          onClick={() => {}}
        />
      )}

      {/* Sidebar - Reduced Width & Starts Below Navbar */}
      <aside
        className={`sidebar-${isDarkMode ? 'dark' : 'light'}`}
        style={{
          position: 'fixed',
          top: '80px', // ✅ CHANGED: Start below navbar (80px navbar height)
          left: isOpen ? '0' : '-250px', // ✅ CHANGED: Reduced from 280px to 250px
          width: '250px', // ✅ CHANGED: Reduced from 280px to 250px
          height: 'calc(100vh - 80px)', // ✅ CHANGED: Adjust height to account for navbar
          background: isDarkMode ? '#1e293b' : 'white',
          transition: 'all 0.3s ease',
          zIndex: 1050,
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: isOpen ? '2px 0 8px rgba(0, 0, 0, 0.1)' : 'none',
          borderRight: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Navigation Menu */}
        <nav className="p-3">
          <ul className="list-unstyled mb-0">
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 text-decoration-none px-3 py-3 rounded sidebar-link-${isDarkMode ? 'dark' : 'light'} ${
                      isActive ? 'active' : ''
                    }`
                  }
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    color: isDarkMode ? '#e2e8f0' : '#64748b'
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hospital Quote Section - Pushed to bottom */}
        <div 
          className="mt-auto p-3" // ✅ CHANGED: Reduced padding from p-4 to p-3
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '15px',
            margin: '0.75rem', // ✅ CHANGED: Reduced margin
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background pattern */}
          <div 
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
          
          {/* Quote Icon */}
          <div 
            style={{
              fontSize: '1.8rem', // ✅ CHANGED: Slightly smaller
              color: 'rgba(255, 255, 255, 0.3)',
              marginBottom: '0.5rem'
            }}
          >
            <FaQuoteLeft />
          </div>

          {/* Quote Text */}
          <p 
            style={{
              color: 'white',
              fontSize: '0.85rem', // ✅ CHANGED: Slightly smaller
              lineHeight: '1.5', // ✅ CHANGED: Tighter line height
              marginBottom: '0.8rem',
              fontStyle: 'italic',
              position: 'relative',
              zIndex: 1
            }}
          >
            "Your Health, Our Priority. Healing with Compassion, Caring with Excellence."
          </p>

          {/* Hospital Name */}
          <div 
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.7rem', // ✅ CHANGED: Slightly smaller
              fontWeight: '600',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)',
              paddingTop: '0.75rem',
              letterSpacing: '0.5px' // ✅ ADDED: Better readability
            }}
          >
            ANGEL CARE MULTI-SPECIALITY HOSPITAL
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
