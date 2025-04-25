import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  FaBell,
  FaUserCircle,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaSearch,
  FaFilter,
  FaChevronDown,
} from "react-icons/fa";

const AnnouncementSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, read, unread
  const [displayCount, setDisplayCount] = useState(3); // Initially show 4 items

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
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "read" && announcement.isRead) ||
      (filterStatus === "unread" && !announcement.isRead);
    return matchesSearch && matchesFilter;
  });

  const visibleAnnouncements = filteredAnnouncements.slice(0, displayCount);
  const hasMore = filteredAnnouncements.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount(displayCount + 3); // Show 4 more items
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-4 mb-3">
              <FaBell className="text-indigo-600 h-8 w-8" />
              <span>Announcements</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Stay updated with the latest announcements and notifications
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
                  placeholder="Search announcements..."
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
                  <option value="all">All Announcements</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>
            </div>
          </div>

          {/* Announcements List */}
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
            ) : visibleAnnouncements.length > 0 ? (
              <>
                {visibleAnnouncements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl 
                      ${!announcement.isRead ? 'border-l-4 border-indigo-500' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{announcement.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-500">
                            <FaUserCircle className="mr-2 text-indigo-500" />
                            <span>{announcement.author}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-500">
                            <FaCalendarAlt className="mr-2 text-indigo-500" />
                            <span>{formatDate(announcement.createdAt)}</span>
                          </div>

                          {announcement.expirationDate && (
                            <div className="flex items-center text-gray-500">
                              <FaClock className="mr-2 text-indigo-500" />
                              <span>Expires: {formatDate(announcement.expirationDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        {announcement.isRead ? (
                          <span className="flex items-center text-green-600 text-sm font-medium">
                            <FaCheckCircle className="mr-1" />
                            Read
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-600 text-sm font-medium">
                            <FaExclamationCircle className="mr-1" />
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show More Button */}
                {hasMore && (
                  <button
                    onClick={handleShowMore}
                    className="w-full py-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-indigo-600 font-medium flex items-center justify-center gap-2 group"
                  >
                    <span>Show More</span>
                    <FaChevronDown className="group-hover:translate-y-1 transition-transform duration-300" />
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <FaBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSection;
