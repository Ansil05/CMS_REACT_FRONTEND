import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch data using Axios
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get("api/labtech/labtests/");
        console.log(response.data)
        
        setTests(response.data);
      } catch (err) {
        console.error("Error fetching lab tests:", err);
        if (err.response) {
          // Server returned an error (4xx / 5xx)
          setError(`Server Error (${err.response.status}): ${err.response.statusText}`);
        } else if (err.request) {
          // No response from server
          setError("No response from server. Please check if the backend is running.");
        } else {
          // Other errors
          setError("Error: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-700 text-lg font-semibold">
        Loading Lab Tests...
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg font-semibold">
        ⚠️ {error}
      </div>
    );
  }

  // ✅ Table UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        🧪 Lab Test List
      </h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Test Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Sample Required</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Cost (₹)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Created Date</th>
            </tr>
          </thead>

          <tbody>
            {tests.length > 0 ? (
              
              tests.map((test, index) => (
                
                <tr key={test.test_id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-3 border-b text-gray-700">{index + 1}</td>
                  <td className="px-6 py-3 border-b font-medium text-gray-800">{test.test_name}</td>
                  <td className="px-6 py-3 border-b text-gray-600">{test.description}</td>
                  <td className="px-6 py-3 border-b text-gray-700">{test.sample_required}</td>
                  <td className="px-6 py-3 border-b text-green-700 font-medium">
                    ₹{Number(test.cost).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 border-b text-gray-500">
                    {new Date(test.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No lab tests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestList;
