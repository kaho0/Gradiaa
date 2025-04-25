import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { FaChevronDown, FaPlus, FaClock, FaGraduationCap } from "react-icons/fa";

const AssignmentSection = () => {
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    details: "",
    grade: "",
  });
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAssignments, setShowAssignments] = useState(false);
  const [expandedAssignment, setExpandedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/assignments/getall`
      );
      setAssignments(response.data.assignments);
    } catch (error) {
      setError("Error fetching assignments");
      console.error("Error fetching assignments:", error);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newAssignment.title || !newAssignment.details || !newAssignment.grade) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/assignments/create`,
        newAssignment
      );
      setAssignments([...assignments, response.data.assignment]);
      setSuccess("Assignment created successfully!");
      setNewAssignment({
        title: "",
        details: "",
        grade: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Error creating assignment");
    }
  };

  const toggleAssignment = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Assignment Management</h1>
            <p className="text-gray-600 mt-2">Create and manage your assignments</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}

          {/* Create Assignment Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, title: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter assignment name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newAssignment.details}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, details: e.target.value })
                  }
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter assignment details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newAssignment.grade}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, grade: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter maximum grade"
                  min="0"
                  max="100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Create Assignment
              </button>
            </form>
          </div>

          {/* Show Assignments Dropdown */}
          <div className="bg-white rounded-lg shadow-md">
            <button
              onClick={() => setShowAssignments(!showAssignments)}
              className="w-full px-6 py-4 flex items-center justify-between text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <FaGraduationCap className="text-blue-600" />
                Show Existing Assignments
              </span>
              <FaChevronDown
                className={`transform transition-transform ${
                  showAssignments ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Assignments List */}
            {showAssignments && (
              <div className="border-t border-gray-200">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => toggleAssignment(assignment._id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-800">
                          {assignment.title}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          Grade: {assignment.grade}
                        </span>
                      </div>
                      <FaChevronDown
                        className={`transform transition-transform ${
                          expandedAssignment === assignment._id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    {expandedAssignment === assignment._id && (
                      <div className="px-6 py-4 bg-gray-50">
                        <p className="text-gray-700 mb-2">{assignment.details}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaClock />
                          <span>Created: {formatDate(assignment.createdAt)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSection;
