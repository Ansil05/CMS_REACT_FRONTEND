import React, { useState } from "react";

const TestResult = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    age: "",
    testName: "",
    date: "",
    testRate: "",
    totalAmount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayment = (type) => {
    alert(`${type} selected!`);
  };

  const handleGeneratePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Lab Test Result</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Patient ID
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter Patient ID"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter Age"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Test Name
            </label>
            <input
              type="text"
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter Test Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Test Rate</label>
            <input
              type="number"
              name="testRate"
              value={formData.testRate}
              onChange={(e) => {
                handleChange(e);
                setFormData({
                  ...formData,
                  totalAmount: e.target.value,
                });
              }}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter Test Rate"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Total Amount
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="w-full border border-gray-300 p-2 rounded bg-gray-100"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={() => handlePayment("Insurance")}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Insurance
          </button>
          <button
            type="button"
            onClick={() => handlePayment("Pay Now")}
            className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
          >
            Pay Now
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleGeneratePrint}
            className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 transition"
          >
            Generate & Print
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestResult;
