import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCalendar,
  FaFileInvoiceDollar,
  FaUserMd,
  FaFlask,
  FaPills,
  FaCog,
  FaChartBar,
  FaQuoteLeft,
  FaFileAlt,
  FaUserShield,
} from "react-icons/fa";

const Sidebar = ({ isOpen, role, isDarkMode, onClose }) => {
  // ✅ Role-based Menu Configuration
  const getMenuItems = () => {
    const menus = {
      admin: [
        { path: "/app/admin", icon: FaHome, label: "Dashboard" },
        { path: "/app/receptionist/patients", icon: FaUsers, label: "Patients" },
        // {  icon: FaUserMd, label: "Doctors" },
        { path: "/app/receptionist/appointments", icon: FaCalendar, label: "Appointments" },
        { path: "/app/admin/staffs", icon: FaUserShield, label: "Staffs" },
        // {  icon: FaCog, label: "Roles" },
      ],
      doctor: [
        { path: "/app/doctor", icon: FaHome, label: "Dashboard" },
        { path: "/app/doctor/appointments", icon: FaCalendar, label: "Appointments" },
        { path: "/app/doctor/consultations", icon: FaFileAlt, label: "Consultation History" },
      ],
      receptionist: [
        { path: "/app/receptionist", icon: FaHome, label: "Dashboard" },
        { path: "/app/receptionist/patients", icon: FaUsers, label: "Patients" },
        { path: "/app/receptionist/appointments", icon: FaCalendar, label: "Appointments" },
        { path: "/app/receptionist/billing", icon: FaFileInvoiceDollar, label: "Billing" },
      ],
      labtechnician: [
        { path: "/app/lab-technician", icon: FaHome, label: "Dashboard" },
        { path: "/app/lab-technician/tests", icon: FaFlask, label: "Lab Tests" },
        { path: "/app/lab-technician/reports", icon: FaChartBar, label: "Reports" },
      ],
      pharmacist: [
        { path: "/app/pharmacist", icon: FaHome, label: "Dashboard" },
        { path: "/app/pharmacist/medicines", icon: FaPills, label: "Medicines" },
        { path: "/app/pharmacist/orders", icon: FaFileInvoiceDollar, label: "Orders" },
        { path: "/app/pharmacist/inventory", icon: FaChartBar, label: "Inventory" },
      ],
    };

    return menus[role] || [];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && window.innerWidth < 992 && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 1040,
            top: "80px",
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-${isDarkMode ? "dark" : "light"}`}
        style={{
          position: "fixed",
          top: "80px",
          left: isOpen ? "0" : "-250px",
          width: "250px",
          height: "calc(100vh - 80px)",
          background: isDarkMode
            ? "linear-gradient(180deg, #0f5132 0%, #14532d 100%)"
            : "linear-gradient(180deg, #e6f4ea 0%, #cdebd8 100%)",
          transition: "all 0.3s ease",
          zIndex: 1050,
          overflowY: "auto",
          boxShadow: isOpen ? "2px 0 8px rgba(0, 0, 0, 0.1)" : "none",
          borderRight: `1px solid ${isDarkMode ? "#0a3823" : "#b2dfc2"}`,
          display: "flex",
          flexDirection: "column",
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
                    `d-flex align-items-center gap-3 text-decoration-none px-3 py-3 rounded ${
                      isActive
                        ? isDarkMode
                          ? "active-dark"
                          : "active-light"
                        : ""
                    }`
                  }
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    color: isDarkMode ? "#d1fae5" : "#14532d",
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quote Section */}
        <div
          className="mt-auto p-3"
          style={{
            background: "linear-gradient(135deg, #16a34a 0%, #4ade80 100%)",
            borderRadius: "15px",
            margin: "0.75rem",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "150px",
              height: "150px",
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              fontSize: "1.8rem",
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: "0.5rem",
            }}
          >
            <FaQuoteLeft />
          </div>
          <p
            style={{
              color: "white",
              fontSize: "0.85rem",
              lineHeight: "1.5",
              marginBottom: "0.8rem",
              fontStyle: "italic",
              position: "relative",
              zIndex: 1,
            }}
          >
            "Your Health, Our Priority. Healing with Compassion, Caring with
            Excellence."
          </p>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.7rem",
              fontWeight: "600",
              borderTop: "1px solid rgba(255, 255, 255, 0.3)",
              paddingTop: "0.75rem",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            ANGEL CARE MULTI-SPECIALITY HOSPITAL
          </div>
        </div>
      </aside>

      {/* Extra Styles */}
      <style>
        {`
        .active-light {
          background: linear-gradient(90deg, #a7f3d0 0%, #6ee7b7 100%) !important;
          color: #064e3b !important;
          box-shadow: inset 3px 0 0 #16a34a;
        }
        .active-dark {
          background: linear-gradient(90deg, #064e3b 0%, #065f46 100%) !important;
          color: #bbf7d0 !important;
          box-shadow: inset 3px 0 0 #22c55e;
        }
        .sidebar-link-light:hover {
          background: rgba(34, 197, 94, 0.15);
          color: #166534 !important;
          transform: translateX(3px);
        }
        .sidebar-link-dark:hover {
          background: rgba(34, 197, 94, 0.15);
          color: #bbf7d0 !important;
          transform: translateX(3px);
        }
        `}
      </style>
    </>
  );
};

export default Sidebar;
