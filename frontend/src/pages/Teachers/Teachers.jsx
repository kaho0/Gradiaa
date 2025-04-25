// TeacherSection.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  FaChalkboardTeacher,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";

const TeacherSection = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/teachers/getall`
      );
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterSubject === "all" || 
      teacher.subject.toLowerCase() === filterSubject.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const subjects = ["all", ...new Set(teachers.map(teacher => teacher.subject))];
  const visibleTeachers = filteredTeachers.slice(0, displayCount);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-4 mb-3">
              <FaChalkboardTeacher className="text-indigo-600 h-8 w-8" />
              <span>Our Teachers</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Meet our experienced and dedicated teaching staff
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
                  placeholder="Search teachers by name or subject..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-300 capitalize"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject} className="capitalize">
                      {subject === "all" ? "All Subjects" : subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Teachers Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="flex flex-col items-center mb-4">
                      <div className="relative">
                        <img
                          src={teacher.profileImage || "https://avatar.iran.liara.run/public/boy"}
                          alt={teacher.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 mb-4"
                        />
                        <div className="absolute bottom-4 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {teacher.name}
                      </h3>
                      <span className="px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium capitalize">
                        {teacher.subject}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <FaGraduationCap className="w-5 h-5 text-indigo-500 mr-3" />
                        <span>{teacher.qualification || "PhD in Education"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="w-5 h-5 text-indigo-500 mr-3" />
                        <a href={`mailto:${teacher.email}`} className="hover:text-indigo-600">
                          {teacher.email}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="w-5 h-5 text-indigo-500 mr-3" />
                        <span>{teacher.phone || "Not Available"}</span>
                      </div>
                      {teacher.address && (
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="w-5 h-5 text-indigo-500 mr-3" />
                          <span>{teacher.address}</span>
                        </div>
                      )}
                    </div>

                 
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {filteredTeachers.length > displayCount && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setDisplayCount(displayCount + 6)}
                    className="px-8 py-3 bg-white text-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Show More Teachers
                  </button>
                </div>
              )}

              {/* No Results Message */}
              {filteredTeachers.length === 0 && (
                <div className="text-center py-12">
                  <FaChalkboardTeacher className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSection;
