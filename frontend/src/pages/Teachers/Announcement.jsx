import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  FaBell,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaClock,
  FaUserCircle,
  FaPlusCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

const AnnouncementSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    expirationDate: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/announcements/getall`
      );
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      Swal.fire("Error!", "Failed to load announcements.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/announcements`, formData);
      Swal.fire("Success!", "Announcement created successfully.", "success");
      setFormData({
        title: "",
        description: "",
        author: "",
        expirationDate: "",
      });
      setShowForm(false);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      Swal.fire("Error!", "Failed to create announcement.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/announcements/${id}`);
        Swal.fire("Deleted!", "Announcement has been deleted.", "success");
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      Swal.fire("Error!", "Failed to delete announcement.", "error");
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const isExpired = new Date(announcement.expirationDate) < new Date();
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !isExpired) ||
      (filterStatus === "expired" && isExpired);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-4 mb-3">
              <FaBell className="text-indigo-600 h-8 w-8" />
              <span>Announcements</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Create and manage announcements for students
            </p>
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
                  placeholder="Search announcements..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  <option value="all">All Announcements</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors duration-300"
              >
                <FaPlusCircle />
                Create Announcement
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      value={formData.expirationDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expirationDate: e.target.value })
                      }
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Announcements List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-indigo-600 text-4xl" />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement._id}
                  className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {announcement.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData(announcement);
                          setShowForm(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{announcement.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaUserCircle className="mr-2" />
                      {announcement.author}
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      Created: {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                    {announcement.expirationDate && (
                      <div className="flex items-center">
                        <FaClock className="mr-2" />
                        Expires: {new Date(announcement.expirationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredAnnouncements.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                  <FaBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No announcements found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSection;
