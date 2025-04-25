import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  FaUserCheck,
  FaUserTimes,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaDownload,
  FaChartBar,
} from "react-icons/fa";

const AttendanceSection = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    excused: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/attendance/getall`
      );
      const data = response.data.data;
      setAttendanceData(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = data.reduce(
      (acc, record) => {
        if (record.status === "Present") acc.present++;
        else if (record.status === "Absent") acc.absent++;
        else if (record.status === "Excused") acc.excused++;
        return acc;
      },
      { present: 0, absent: 0, excused: 0 }
    );
    setStats(stats);
  };

  const filteredAttendance = attendanceData.filter((record) => {
    const matchesSearch = record.student
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDate = !filterDate || record.date.includes(filterDate);
    return matchesSearch && matchesDate;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <FaCheckCircle className="text-green-500 w-5 h-5" />;
      case "Absent":
        return <FaTimesCircle className="text-red-500 w-5 h-5" />;
      case "Excused":
        return <FaExclamationCircle className="text-yellow-500 w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-4 mb-3">
              <FaUserCheck className="text-indigo-600 h-8 w-8" />
              <span>Attendance Management</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Track and manage student attendance records
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present</p>
                <p className="text-3xl font-bold text-green-600">{stats.present}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <FaUserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Absent</p>
                <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <FaUserTimes className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excused</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.excused}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-full">
                <FaExclamationCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Export Button */}
              <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors duration-300">
                <FaDownload />
                Export Attendance
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Time</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAttendance.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={record.studentImage || "https://avatar.iran.liara.run/public/boy"}
                              alt={record.student}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <span className="font-medium text-gray-900">{record.student}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{record.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getStatusIcon(record.status)}
                            <span className={`ml-2 ${
                              record.status === "Present" ? "text-green-600" :
                              record.status === "Absent" ? "text-red-600" :
                              "text-yellow-600"
                            }`}>
                              {record.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{record.time || "N/A"}</td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredAttendance.length === 0 && (
                  <div className="text-center py-12">
                    <FaUserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSection;
