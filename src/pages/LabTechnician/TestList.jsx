import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/table.css";
import "../../styles/forms.css";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    test_name: "",
    description: "",
    cost: "",
    sample_required: "",
  });

  // Fetch all tests on load
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/labtech/labtests/");
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching test data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Add Form
  const handleAddClick = () => {
    setFormData({
      test_name: "",
      description: "",
      cost: "",
      sample_required: "",
    });
    setIsEditing(false);
    setShowForm(true);
  };

  // Save new or edited test
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing test
        const response = await axios.put(
          `http://127.0.0.1:8000/api/labtech/labtests/${selectedId}/`,
          formData
        );

        // Update table instantly
        setTests((prev) =>
          prev.map((test) => (test.test_id === selectedId ? response.data : test))
        );

        alert("✅ Test updated successfully!");
      } else {
        // Add new test
        const response = await axios.post(
          "http://127.0.0.1:8000/api/labtech/labtests/",
          formData
        );

        setTests((prev) => [...prev, response.data]);
        alert("✅ Test added successfully!");
      }

      // Reset and close form
      setFormData({
        test_name: "",
        description: "",
        cost: "",
        sample_required: "",
      });
      setShowForm(false);
      setIsEditing(false);
      setSelectedId(null);
    } catch (error) {
      console.error("Error saving test:", error);
      alert("❌ Failed to save. Check your data or backend connection.");
    }
  };

  // Edit test
  const handleEdit = (test) => {
    setFormData({
      test_name: test.test_name,
      description: test.description,
      cost: test.cost,
      sample_required: test.sample_required,
    });
    setSelectedId(test.test_id);
    setIsEditing(true);
    setShowForm(true);
  };

  // Delete test
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/labtech/labtests/${id}/`);
      setTests((prev) => prev.filter((test) => test.test_id !== id));
      alert("🗑️ Test deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("❌ Failed to delete test.");
    }
  };

  return (
    <div className="table-container">
      {/* Header */}
      <div
        className="table-filters"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ fontWeight: "600", fontSize: "1.25rem" }}>Lab Test List</h2>
        <button
          onClick={handleAddClick}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Test
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Test Name</th>
              <th>Description</th>
              <th>Cost (₹)</th>
              <th>Sample Required</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-empty">
                  <div className="table-empty-text">Loading data...</div>
                </td>
              </tr>
            ) : tests.length > 0 ? (
              tests.map((test, index) => (
                <tr key={test.test_id || index}>
                  <td>{index + 1}</td>
                  <td>{test.test_name}</td>
                  <td>{test.description}</td>
                  <td>{test.cost}</td>
                  <td>{test.sample_required}</td>
                  <td>
                    {test.created_at
                      ? new Date(test.created_at).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(test)}
                      style={{
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        border: "1px solid #ffeeba",
                        padding: "4px 10px",
                        borderRadius: "5px",
                        marginRight: "6px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test.test_id)}
                      style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        border: "1px solid #f5c6cb",
                        padding: "4px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="table-empty">
                  <div className="table-empty-text">No lab tests found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form (Add/Edit) */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="form-container"
            style={{
              width: "90%",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            <h3 style={{ marginBottom: "1.5rem" }}>
              {isEditing ? "Edit Test" : "Add New Test"}
            </h3>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label form-label-required">
                  Test Name
                </label>
                <input
                  type="text"
                  name="test_name"
                  value={formData.test_name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter test name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control form-textarea"
                  placeholder="Enter description"
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Cost (₹)</label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter cost"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">
                  Sample Required
                </label>
                <input
                  type="text"
                  name="sample_required"
                  value={formData.sample_required}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter sample type"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: "#ccc",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: isEditing ? "#ffc107" : "#28a745",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {isEditing ? "Update Test" : "Save Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestList;
