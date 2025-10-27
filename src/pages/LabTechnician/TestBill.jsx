import React, { useState } from "react";

const TestBill = () => {
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
    const updated = { ...formData, [name]: value };

    // Auto-update totalAmount when testRate changes
    if (name === "testRate") {
      updated.totalAmount = value;
    }

    setFormData(updated);
  };

  const handlePayment = (type) => {
    alert(`${type} selected! Payment processing will be integrated.`);
  };

  const handleGeneratePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700 tracking-wide">
        🧾 Lab Test Bill
      </h2>

      <form className="space-y-6">
        {/* Grid Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Patient ID
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-green-300 p-2 rounded-md outline-none"
              placeholder="Enter Patient ID"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-green-300 p-2 rounded-md outline-none"
              placeholder="Enter Patient Name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-green-300 p-2 rounded-md outline-none"
              placeholder="Enter Age"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Test Name
            </label>
            <input
              type="text"
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-green-300 p-2 rounded-md outline-none"
              placeholder="Enter Test Name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-green-300 p-2 rounded-md outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Test Rate (₹)
            </label>
            <input
              type="number"
              name="testRate"
              value={formData.testRate}
              onChange={handleChange}
              min="50"
              step="50"
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-green-300 p-2 rounded-md outline-none"
              placeholder="Enter Test Rate (e.g., 100, 150, 700)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">
              Total Amount (₹)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="w-full border border-gray-300 bg-gray-100 p-2 rounded-md cursor-not-allowed"
            />
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-6">
          <div className="flex gap-4 w-full md:w-2/3">
            <button
              type="button"
              onClick={() => handlePayment("Insurance")}
              className="flex-1 bg-blue-100 text-blue-700 border border-blue-300 font-semibold py-2 rounded-lg hover:bg-blue-200 transition"
            >
              💳 Insurance
            </button>

            <button
              type="button"
              onClick={() => handlePayment("Pay Now")}
              className="flex-1 bg-green-500 text-blue font-semibold py-2 rounded-lg hover:bg-green-600 transition"
            >
              💰 Pay Now
            </button>
          </div>

          <div className="text-center w-full md:w-1/3">
            <button
              type="button"
              onClick={handleGeneratePrint}
              className="w-full bg-gray-800 text-blue py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              🖨️ Generate & Print
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestBill;
