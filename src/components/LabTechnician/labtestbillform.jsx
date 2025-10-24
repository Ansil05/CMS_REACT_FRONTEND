// src/components/TestBillForm.jsx
import React, { useState, useEffect } from "react";
import { fetchTests, fetchPatients, createBill } from "../services/api";

const TestBillForm = ({ onBillAdded }) => {
  const [formData, setFormData] = useState({
    patient: "",
    test: "",
    address: "",
    sex: "",
    test_rate: "",
    total_amount: "",
    payment_status: "Unpaid",
  });

  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetchPatients().then((res) => setPatients(res.data));
    fetchTests().then((res) => setTests(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBill(formData);
      alert("Bill created successfully!");
      onBillAdded();
      setFormData({
        patient: "",
        test: "",
        address: "",
        sex: "",
        test_rate: "",
        total_amount: "",
        payment_status: "Unpaid",
      });
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Bill</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select name="patient" value={formData.patient} onChange={handleChange} className="border rounded p-2">
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select name="test" value={formData.test} onChange={handleChange} className="border rounded p-2">
          <option value="">Select Test</option>
          {tests.map((t) => (
            <option key={t.test_id} value={t.test_id}>
              {t.test_name}
            </option>
          ))}
        </select>

        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border rounded p-2" />

        <select name="sex" value={formData.sex} onChange={handleChange} className="border rounded p-2">
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input type="number" name="test_rate" placeholder="Test Rate" value={formData.test_rate} onChange={handleChange} className="border rounded p-2" />

        <input type="number" name="total_amount" placeholder="Total Amount" value={formData.total_amount} onChange={handleChange} className="border rounded p-2" />

        <select name="payment_status" value={formData.payment_status} onChange={handleChange} className="border rounded p-2">
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Insurance">Insurance</option>
        </select>

        <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TestBillForm;
