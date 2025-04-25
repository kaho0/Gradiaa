// // StudentSection.js
// import React, { useState, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import axios from 'axios';
// import { StudentsContainer, Content, StudentsContent, StudentsHeader, StudentList, StudentItem, AddStudentForm, AddStudentInput,
//   AddStudentButton } from '../../styles/StudentsStyles';

// const StudentSection = () => {
//   const [newStudent, setNewStudent] = useState({ name: '', registrationNumber: '', grade: '' });
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/api/v1/students/getall');
//       setStudents(response.data.students);
//     } catch (error) {
//       console.error('Error fetching students:', error);
//     }
//   };

//   return (
//     <StudentsContainer>
//       <Sidebar />
//       <Content>
//         <StudentsContent>
//           <StudentsHeader>Students</StudentsHeader>
//           <StudentList>
//             {students.map((student) => (
//               <StudentItem key={student.id}>{student.name} - {student.registrationNumber} - {student.grade}</StudentItem>
//             ))}
//           </StudentList>
//         </StudentsContent>
//       </Content>
//     </StudentsContainer>
//   );
// };

// export default StudentSection;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaFilter, FaUser, FaTags, FaGraduationCap, FaChevronDown } from "react-icons/fa";
import Sidebar from "./Sidebar";

const StudentSection = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/students/getall`
      );
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      (filterGrade === "" || student.grade === filterGrade) &&
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStudentDetails = (studentId) => {
    setSelectedStudent(selectedStudent === studentId ? null : studentId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-600 mt-2">View and manage your students</p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Students List
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <FaFilter />
                Filters
                <FaChevronDown
                  className={`transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div
              className={`grid gap-4 ${
                showFilters ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              } transition-all duration-300 ease-in-out`}
            >
              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Grade Filter - Only shown when filters are expanded */}
              {showFilters && (
                <div className="relative">
                  <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Grades</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Students List */}
          <div className="bg-white rounded-lg shadow-md">
            {filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No students found matching your criteria
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <div key={student._id} className="transition-all duration-200">
                    <button
                      onClick={() => toggleStudentDetails(student._id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800">
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {student.registrationNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Grade {student.grade}
                        </span>
                        <FaChevronDown
                          className={`transform transition-transform ${
                            selectedStudent === student._id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expanded Student Details */}
                    {selectedStudent === student._id && (
                      <div className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Personal Information
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Full Name:</span>{" "}
                                {student.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Registration Number:</span>{" "}
                                {student.registrationNumber}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Grade:</span>{" "}
                                {student.grade}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                              Academic Progress
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Current Grade:</span>{" "}
                                {student.grade}
                              </p>
                              {/* Add more academic details here */}
                            </div>
                          </div>
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

export default StudentSection;
