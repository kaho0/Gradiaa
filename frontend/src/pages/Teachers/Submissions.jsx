import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  FaGraduationCap,
  FaUser,
  FaFile,
  FaClock,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaStar,
  FaDownload,
} from "react-icons/fa";
import Swal from "sweetalert2";

const TeacherSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, graded, ungraded
  const [displayCount, setDisplayCount] = useState(5);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/submissions/getall`
      );
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      Swal.fire("Error!", "Failed to load submissions.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (submissionId, grade) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/submissions/grade/${submissionId}`,
        { grade }
      );
      
      // Update local state
      setSubmissions(submissions.map(sub => 
        sub._id === submissionId ? { ...sub, grade } : sub
      ));
      
      Swal.fire("Success!", "Grade updated successfully.", "success");
    } catch (error) {
      console.error("Error grading submission:", error);
      Swal.fire("Error!", "Failed to update grade.", "error");
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.assignmentId.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "graded" && submission.grade) ||
      (filterStatus === "ungraded" && !submission.grade);
    
    return matchesSearch && matchesFilter;
  });

  const visibleSubmissions = filteredSubmissions.slice(0, displayCount);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-4 mb-3">
              <FaGraduationCap className="text-indigo-600 h-8 w-8" />
              <span>Student Submissions</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Review and grade student assignment submissions
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name or assignment..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-300"
                >
                  <option value="all">All Submissions</option>
                  <option value="graded">Graded</option>
                  <option value="ungraded">Ungraded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-6">
            {loading ? (
              // Loading Skeletons
              [...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-2xl shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : visibleSubmissions.length > 0 ? (
              <>
                {visibleSubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      {/* Submission Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {submission.assignmentId.title}
                          </h3>
                          <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                            submission.grade 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.grade ? 'Graded' : 'Pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-600">
                            <FaUser className="mr-2 text-indigo-500" />
                            <span>Student: {submission.student}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaClock className="mr-2 text-indigo-500" />
                            <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-gray-600">{submission.content}</p>

                        {submission.fileUrl && (
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                          >
                            <FaFile className="mr-2" />
                            View Attachment
                          </a>
                        )}
                      </div>

                      {/* Grading Section */}
                      <div className="flex flex-col justify-center items-center border-l border-gray-200 pl-6 min-w-[200px]">
                        <div className="text-center mb-4">
                          <span className="text-sm font-medium text-gray-500">Grade</span>
                          <div className="text-3xl font-bold text-indigo-600">
                            {submission.grade || '-'}
                          </div>
                        </div>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Enter grade"
                          className="w-full p-2 border border-gray-200 rounded-lg text-center mb-2"
                          defaultValue={submission.grade}
                          onChange={(e) => {
                            const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                            e.target.value = value;
                          }}
                        />

                        <button
                          onClick={(e) => {
                            const grade = e.target.previousSibling.value;
                            if (grade) {
                              handleGradeSubmission(submission._id, grade);
                            }
                          }}
                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <FaCheck className="w-4 h-4" />
                          Update Grade
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More Button */}
                {filteredSubmissions.length > displayCount && (
                  <button
                    onClick={() => setDisplayCount(prev => prev + 5)}
                    className="w-full py-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-indigo-600 font-medium"
                  >
                    Show More Submissions
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSubmissions;
