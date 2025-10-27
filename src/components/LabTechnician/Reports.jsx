import React, { useEffect, useState } from "react";

const Reports = () => {
  const [reportStats, setReportStats] = useState({
    pending: 8,
    completed: 24,
    ongoing: 5,
  });

  useEffect(() => {
    // Simulate fetching data from backend (dummy data)
    const loadReports = async () => {
      setTimeout(() => {
        setReportStats({
          pending: 8,
          completed: 24,
          ongoing: 5,
        });
      }, 500);
    };
    loadReports();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        📊 Lab Reports Overview
      </h2>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Pending */}
        <div className="bg-orange-50 border-l-4 border-orange-500 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-orange-700">Pending Tests</h3>
          <p className="text-5xl font-bold mt-3 text-orange-800">{reportStats.pending}</p>
          <p className="text-sm text-gray-500 mt-2">Awaiting processing</p>
        </div>

        {/* Completed */}
        <div className="bg-green-50 border-l-4 border-green-500 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-green-700">Completed Tests</h3>
          <p className="text-5xl font-bold mt-3 text-green-800">{reportStats.completed}</p>
          <p className="text-sm text-gray-500 mt-2">Results delivered</p>
        </div>

        {/* Ongoing */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-yellow-700">Ongoing Tests</h3>
          <p className="text-5xl font-bold mt-3 text-yellow-800">{reportStats.ongoing}</p>
          <p className="text-sm text-gray-500 mt-2">Under analysis</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-12 bg-white shadow-lg rounded-xl p-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Summary Report</h3>
        <p className="text-gray-600 leading-relaxed">
          The lab currently has{" "}
          <span className="font-semibold text-orange-600">{reportStats.pending}</span> tests pending,{" "}
          <span className="font-semibold text-yellow-600">{reportStats.ongoing}</span> in progress, and{" "}
          <span className="font-semibold text-green-600">{reportStats.completed}</span> completed.{" "}
          This overview helps lab technicians monitor performance and ensure timely delivery of results.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700">Average Turnaround Time</h4>
            <p className="text-lg text-gray-800">18 Hours</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700">Tests Conducted Today</h4>
            <p className="text-lg text-gray-800">12</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-700">Active Lab Technicians</h4>
            <p className="text-lg text-gray-800">4</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
