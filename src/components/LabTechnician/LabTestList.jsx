import React, { useEffect, useState } from "react";
import api from "../../services/api";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get("labtests/");
        setTests(response.data);
      } catch (err) {
        setError("Failed to load lab tests. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-blue-800">Lab Test List</h2>
        <p className="text-gray-600 mt-2">
          View all available lab tests with details
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-700 text-lg">Loading tests...</div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-600 bg-red-50 border border-red-200 rounded-md py-3 px-4 mb-4">
          {error}
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded-xl bg-white">
          <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
            <thead className="bg-blue-100 text-blue-900 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 border-b">#</th>
                <th className="px-6 py-3 border-b">Test Name</th>
                <th className="px-6 py-3 border-b">Description</th>
                <th className="px-6 py-3 border-b">Sample Required</th>
                <th className="px-6 py-3 border-b">Cost (₹)</th>
                <th className="px-6 py-3 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {tests.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No tests available.
                  </td>
                </tr>
              ) : (
                tests.map((test, index) => (
                  <tr
                    key={test.test_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {test.test_name}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {test.description || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {test.sample_required || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      ₹{test.cost || 0}
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {new Date(test.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestList;
