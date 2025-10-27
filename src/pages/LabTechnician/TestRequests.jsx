import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/forms.css";

const TestRequest = () => {
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    patient: "",
    test: "",
    remarks: "",
  });

  // ✅ Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, patientsRes, requestsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/labtech/labtests/"),
          axios.get("http://127.0.0.1:8000/api/patients/"),
          axios.get("http://127.0.0.1:8000/api/labtech/testrequests/"),
        ]);
        setTests(testsRes.data);
        setPatients(patientsRes.data);
        setRequests(requestsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/labtech/testrequests/", formData);
      alert("✅ Test Request Submitted Successfully!");
      setFormData({ patient: "", test: "", remarks: "" });
      const res = await axios.get("http://127.0.0.1:8000/api/labtech/testrequests/");
      setRequests(res.data);
    } catch (error) {
      console.error("Error submitting test request:", error);
      alert("❌ Failed to submit request.");
    }
  };

  // ✅ Helper functions to show names
  const getPatientName = (id) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? patient.name : "Unknown";
  };

  const getTestName = (id) => {
    const test = tests.find((t) => t.test_id === id);
    return test ? test.test_name : "Unknown";
  };

  return (
    <div className="form-container max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-700">
        🧾 Doctor Test Request
      </h2>

      {/* --- Form Section --- */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg">
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label form-label-required">Patient</label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="form-control form-select"
              required
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label form-label-required">Test</label>
            <select
              name="test"
              value={formData.test}
              onChange={handleChange}
              className="form-control form-select"
              required
            >
              <option value="">-- Select Test --</option>
              {tests.map((t) => (
                <option key={t.test_id} value={t.test_id}>
                  {t.test_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="form-control form-textarea"
            placeholder="Enter any specific instructions or notes"
          ></textarea>
        </div>

        <div className="form-actions text-center mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-medium shadow"
          >
            ➕ Submit Request
          </button>
        </div>
      </form>

      {/* --- Table Section --- */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          📋 Existing Test Requests
        </h3>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 border-b">Request ID</th>
                <th className="py-3 px-4 border-b">Patient ID</th>
                <th className="py-3 px-4 border-b">Patient Name</th>
                <th className="py-3 px-4 border-b">Test Name</th>
                <th className="py-3 px-4 border-b">Requested Date</th>
                <th className="py-3 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <tr
                    key={req.request_id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-3 px-4 border-b text-center">
                      {req.request_id}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {req.patient}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {getPatientName(req.patient)}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {getTestName(req.test)}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {req.requested_date}
                    </td>
                    <td
                      className={`py-3 px-4 border-b text-center font-semibold ${
                        req.status === "Completed"
                          ? "text-green-600"
                          : req.status === "Pending"
                          ? "text-orange-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {req.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No test requests available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestRequest;
