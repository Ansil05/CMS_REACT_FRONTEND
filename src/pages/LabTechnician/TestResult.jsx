import React, { useState } from "react";
import "../../styles/forms.css"; // ✅ Make sure the path is correct

const TestResult = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    name: "",
    age: "",
    testName: "",
    date: "",
    testResult: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("✅ Test Result Saved Successfully!");
    console.log("Saved Data:", formData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="form-container max-w-4xl mx-auto mt-10">
      <h2
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: "var(--primary-700)" }}
      >
        🧪 Lab Test Result Entry
      </h2>

      <form onSubmit={handleSave}>
        {/* Row 1 - Patient ID & Name */}
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label form-label-required">Patient ID</label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="Enter Patient ID"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Patient Name"
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Row 2 - Age & Test Name */}
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label form-label-required">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter Age"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Test Name</label>
            <input
              type="text"
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              placeholder="Enter Test Name"
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Row 3 - Date & Test Result */}
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label form-label-required">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Test Result</label>
            <input
              type="text"
              name="testResult"
              value={formData.testResult}
              onChange={handleChange}
              placeholder="Enter Test Result"
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="form-group">
          <label className="form-label">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Enter any remarks or notes..."
            className="form-control form-textarea"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            💾 Save Result
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-generate"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🖨️ Generate & Print
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestResult;
