// src/pages/TestBill.jsx
import React, { useEffect, useState } from "react";
import { fetchBills, updateBill } from "../services/api";
import TestBillTable from "../components/TestBillTable";
import TestBillForm from "../components/TestBillForm";

const TestBill = () => {
  const [bills, setBills] = useState([]);

  const loadBills = () => {
    fetchBills()
      .then((res) => setBills(res.data))
      .catch((err) => console.error("Error fetching bills:", err));
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleStatusChange = async (id) => {
    try {
      await updateBill(id, { payment_status: "Paid" });
      loadBills();
    } catch (err) {
      console.error("Error updating bill:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Lab Test Billing</h1>
      <TestBillForm onBillAdded={loadBills} />
      <TestBillTable bills={bills} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default TestBill;
