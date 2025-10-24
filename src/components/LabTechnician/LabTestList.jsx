import React, { useEffect, useState } from 'react';
import api, { handleApiError } from '../services/api';
import { FaFlask } from 'react-icons/fa';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        
        const response = await api.get('/labtests/');
        setTests(response.data);
      } catch (err) {
        console.error('Error fetching lab tests:', err);
        try {
          handleApiError(err);
        } catch (handledError) {
          setErrorMsg(handledError.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-blue-600">
        <FaFlask className="mr-2 animate-spin" /> Loading Lab Tests...
      </div>
    );

  if (errorMsg)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        ⚠️ {errorMsg}
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-700">
          <FaFlask className="mr-2" /> Lab Test List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Test ID</th>
                <th className="p-3 text-left">Test Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Sample Required</th>
                <th className="p-3 text-left">Cost (₹)</th>
                <th className="p-3 text-left">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {tests.length > 0 ? (
                tests.map((test) => (
                  <tr
                    key={test.test_id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-3">{test.test_id}</td>
                    <td className="p-3 font-semibold text-gray-800">
                      {test.test_name}
                    </td>
                    <td className="p-3 text-gray-600">{test.description}</td>
                    <td className="p-3">{test.sample_required}</td>
                    <td className="p-3 font-medium text-green-700">
                      ₹{test.cost}
                    </td>
                    <td className="p-3 text-gray-500">
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
    </div>
  );
};

export default TestList;
