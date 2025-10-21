import React, { useState, useEffect } from "react";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch("http://localhost:8000/api/tests/")  
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }
        return response.json();
      })
      .then((data) => {
        setTests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-700">Loading tests...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">
        Lab Test List
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Test Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Specimen Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Turnaround Time (TAT)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold border-b">Reference Range</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((test, index) => (
              <tr
                key={test.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3 border-b text-gray-700">{index + 1}</td>
                <td className="px-6 py-3 border-b font-medium text-gray-800">{test.name}</td>
                <td className="px-6 py-3 border-b text-gray-600">{test.description}</td>
                <td className="px-6 py-3 border-b text-gray-700">{test.specimen}</td>
                <td className="px-6 py-3 border-b text-gray-700">{test.tat}</td>
                <td className="px-6 py-3 border-b text-gray-700">{test.referenceRange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestList;
