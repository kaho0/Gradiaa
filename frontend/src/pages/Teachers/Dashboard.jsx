// TeacherDashboard.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import {
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSpinner,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all assignments and count them
      const assignmentsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/assignments/getall`
      );

      // Fetch all students and count them
      const studentsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/students/getall`
      );

      // Fetch events
      const eventsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/events/getall`
      );

      setStats({
        totalStudents: studentsResponse.data.students?.length || 0,
        totalAssignments: assignmentsResponse.data.assignments?.length || 0,
      });

      setEvents(eventsResponse.data.events || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire('Error!', 'Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (type) => {
    const eventType = type?.toLowerCase() || 'default';
    switch (eventType) {
      case 'class': return 'bg-blue-100 text-blue-600';
      case 'exam': return 'bg-red-100 text-red-600';
      case 'lab': return 'bg-green-100 text-green-600';
      case 'meeting': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatEventType = (type) => {
    if (!type) return 'Event';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, Teacher!</h1>
              <p className="text-gray-600 mt-2">Here's what's happening in your classes today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <FaUserGraduate className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalAssignments}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <FaBook className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                  View All Events
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
                </div>
              ) : (
                <div className="space-y-6">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <FaClock className="mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FaCalendarAlt className="mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <FaMapMarkerAlt className="mr-2" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventColor(event.type)}`}>
                          {formatEventType(event.type)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
