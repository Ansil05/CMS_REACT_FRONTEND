// src/components/TestBillTable.jsx
import React from "react";

const TestBillTable = ({ bills, onStatusChange }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3">Bill ID</th>
            <th className="p-3">Patient</th>
            <th className="p-3">Test</th>
            <th className="p-3">Date</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Payment Status</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.bill_id} className="border-b hover:bg-gray-50">
              <td className="p-3">{bill.bill_id}</td>
              <td className="p-3">{bill.patient_name || bill.patient}</td>
              <td className="p-3">{bill.test_name || bill.test}</td>
              <td className="p-3">{bill.date}</td>
              <td className="p-3">₹{bill.total_amount}</td>
              <td className="p-3">{bill.payment_status}</td>
              <td className="p-3 text-center">
                {bill.payment_status !== "Paid" && (
                  <button
                    onClick={() => onStatusChange(bill.bill_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestBillTable;
