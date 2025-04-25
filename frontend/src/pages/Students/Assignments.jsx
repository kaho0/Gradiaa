import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaPaperPlane,
  FaFile,
  FaHistory,
  FaChevronDown,
  FaUpload,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaGraduationCap
} from "react-icons/fa";
import Sidebar from "./Sidebar";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSubmission, setNewSubmission] = useState({
    assignmentId: "",
    student: "",
    content: "",
    studentId: localStorage.getItem("studentProfile")?._id || "",
  });
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showPreviousSubmissions, setShowPreviousSubmissions] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/assignments/getall`
      );
      console.log("Fetched assignments:", response.data);
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      Swal.fire("Error!", "Failed to load assignments.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/submissions/getall`
      );
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      Swal.fire("Error!", "Failed to load submissions.", "error");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    const studentProfile = JSON.parse(localStorage.getItem("studentProfile"));
    if (!studentProfile || !studentProfile._id) {
      Swal.fire("Error!", "Student profile not found. Please login again.", "error");
      return;
    }

    if (!newSubmission.assignmentId || !newSubmission.student || !newSubmission.content) {
      Swal.fire("Error!", "Please fill in all required fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("student", newSubmission.student);
    formData.append("content", newSubmission.content);
    formData.append("studentId", studentProfile._id);
    if (file) formData.append("submissionFile", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/submissions/assignments/${newSubmission.assignmentId}/submit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Assignment submitted successfully:", response.data);
      Swal.fire("Success!", "Assignment submitted successfully.", "success");
      setNewSubmission({
        assignmentId: "",
        student: "",
        content: "",
        studentId: studentProfile._id
      });
      setFile(null);
      if (newSubmission.assignmentId) {
        fetchSubmissions(newSubmission.assignmentId);
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      Swal.fire("Error!", "Submission failed. Please try again.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaGraduationCap className="text-blue-600" />
              Assignment Submission
            </h1>
            <p className="text-gray-600 mt-2">Submit your assignments and view previous submissions</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              {/* Assignment Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Assignment
                </label>
                <select
                  value={newSubmission.assignmentId}
                  onChange={(e) => {
                    const assignmentId = e.target.value;
                    setNewSubmission({ ...newSubmission, assignmentId });
                    if (assignmentId) {
                      fetchSubmissions(assignmentId);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select an assignment...</option>
                  {assignments.map((assignment) => (
                    <option key={assignment._id} value={assignment._id}>
                      {assignment.title} - Due: {new Date(assignment.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>

                {/* Show selected assignment details */}
                {newSubmission.assignmentId && assignments.length > 0 && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const selected = assignments.find(a => a._id === newSubmission.assignmentId);
                      return selected ? (
                        <>
                          <h3 className="font-medium text-gray-900">{selected.title}</h3>
                          <p className="text-gray-600 mt-1">{selected.details}</p>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaClock />
                              Due: {new Date(selected.createdAt).toLocaleDateString()}
                            </span>
                            {selected.grade && (
                              <span className="flex items-center gap-1 text-green-600">
                                <FaCheckCircle />
                                Grade: {selected.grade}
                              </span>
                            )}
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Rest of the form */}
              <form onSubmit={handleAssignmentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-gray-400">
                        <FaUser className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        value={newSubmission.student}
                        onChange={(e) =>
                          setNewSubmission({
                            ...newSubmission,
                            student: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <FaUpload className="mr-2 text-gray-400" />
                        {file ? file.name : "Choose File"}
                      </label>
                    </div>
                  </div>

                  {/* Submission Content */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      value={newSubmission.content}
                      onChange={(e) =>
                        setNewSubmission({
                          ...newSubmission,
                          content: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Type your answer here..."
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                >
                  <FaPaperPlane className="mr-2" />
                  Submit Assignment
                </button>
              </form>
            </div>

            {/* Previous Submissions Section */}
            <div className="border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowPreviousSubmissions(!showPreviousSubmissions)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-2 text-gray-700">
                  <FaHistory className="text-blue-600" />
                  Show Previous Submissions
                </span>
                <FaChevronDown
                  className={`transform transition-transform ${showPreviousSubmissions ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Previous Submissions Content */}
              {showPreviousSubmissions && (
                <div className="p-4 space-y-4">
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <div
                        key={submission._id}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400" />
                            <span className="font-medium">{submission.student}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaClock />
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
                        {submission.fileUrl && (
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
                          >
                            <FaFile className="mr-1" />
                            View Attachment
                          </a>
                        )}
                        {submission.grade && (
                          <div className="mt-2 flex items-center gap-2 text-green-600">
                            <FaCheckCircle />
                            <span>Grade: {submission.grade}/100</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaHistory className="mx-auto mb-2 text-gray-400 text-xl" />
                      <p>No previous submissions found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;