import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFlask, FaListAlt, FaClipboardCheck, FaVial } from "react-icons/fa";

const LabHome = () => {
  const navigate = useNavigate();

  const summary = [
    { title: "Pending Tests", value: 12 },
    { title: "Completed Tests", value: 45 },
    { title: "New Requests", value: 5 },
  ];

  const cards = [
    { title: "Dashboard", icon: <FaFlask />, color: "blue", path: "/lab/dashboard" },
    { title: "Lab Test List", icon: <FaListAlt />, color: "green", path: "/lab/tests" },
    { title: "Test Requests", icon: <FaClipboardCheck />, color: "yellow", path: "/lab/requests" },
    { title: "Lab Results", icon: <FaVial />, color: "purple", path: "/lab/results" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-2">Welcome to Lab Technician Portal</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summary.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition"
          >
            <h3 className="text-lg font-medium text-gray-600">{item.title}</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={() => navigate(c.path)}
            className={`cursor-pointer bg-white shadow-md rounded-xl p-6 border-t-4 border-${c.color}-500 hover:shadow-lg transition`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`text-${c.color}-600 text-4xl`}>{c.icon}</div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabHome;
