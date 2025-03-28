import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Video, ChevronDown, ChevronUp, Eye, Users, BookOpen } from 'lucide-react';
import ProjectContext from "../../Context/ProjectContext";

const AdminCourse = () => {
  const [ShowPopup, setShowPopup] = useState(false);
  const { Toast } = useContext(AlertContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState([]); // Array of lesson titles
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft"); // Default to draft
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [language, setLanguage] = useState("");
  const [ratings, setRatings] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseEdit, setCourseEdit] = useState(false);
  const { API_BASE_URL, API_URL, COURSE_BASE_URL, course, fetchCourse, setCourse, } = useContext(ProjectContext)
  const admintoken = localStorage.getItem("admintoken");
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const courseData = {
      title,
      description,
      lessons, // Array of lesson titles
      category,
      status: status.toLowerCase(), // Ensure correct enum value
      price: Number(price) || 0,
      discount: Number(discount) || 0,
      language,
      ratings: Number(ratings) || 0,
      reviews,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${admintoken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courseData),
      });
      const result = await response.json();
      if (response.ok) {
        setShowPopup(false);
        setTitle("");
        setDescription("");
        setLessons([]);
        setCategory("");
        setStatus("draft");
        setPrice("");
        setDiscount("");
        setLanguage("");
        setRatings("");
        setReviews([]);
        fetchCourse();
        Toast.fire({ icon: "success", title: "Course added successfully!" });


      } else {
        Toast.fire({ icon: "error", title: "Failed to add course" });
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      Toast.fire({ icon: "error", title: "An error occurred while adding the course" });
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (course_id) => {
    try {
      console.log(course_id, "course_id");

      // 🔹 Show confirmation alert before deleting
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // 🔹 Perform delete request
            const response = await axios.delete(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/delete/${course_id}`,
              {
                headers: {
                  Authorization: `Bearer ${admintoken}`,
                  "Content-Type": "application/json"
                }
              }
            );

            if (response.status === 200) {
              Toast.fire({ icon: "success", title: "Course deleted successfully!" });
              fetchCourse(); // ✅ Refresh Course list after deletion
            } else {
              Toast.fire({ icon: "error", title: "Failed to delete Course" });
            }

          } catch (error) {
            Toast.fire({
              icon: "error",
              title: "Failed to delete Course",
              text: error.response?.data?.message || error.message
            });
          }
        }
      });

    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to delete Course",
        text: error.message
      });
    }
  };

  // Toggle expanded state for a course
  const toggleRowExpand = (courseId) => {
    setExpandedRows(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  // Function to truncate description text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "No description available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Function to open edit modal and set selected course data
  const editCourse = (course) => {
    setSelectedCourse(course);
    setCourseEdit(true);
  };

  // Function to handle form submission
  const handleEdit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !selectedCourse._id) {
      Toast.fire("error", "Invalid course selection!", "error ");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/update/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${admintoken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedCourse),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update course");
      }

      // Optimistically update UI (if applicable)
      setCourse((prevCourses) =>
        prevCourses.map((course) =>
          course._id === selectedCourse._id ? data.course : course
        )
      );
      Toast.fire("Success", "Course updated successfully!", "success");

      setCourseEdit(false); // Close modal
    } catch (error) {
      console.error("❌ Error updating course:", error);
      Toast.fire("error", "Failed to update course");

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto bg-[#F0F6F6] min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#2c3e50]">Courses</h1>
            <p className="text-[#7f8c8d]">Create and manage courses for your students.</p>
          </div>
          <button
            className="flex items-center bg-[#4ecdc4] text-white px-5 py-2 rounded-lg 
          hover:bg-[#45b7aa] transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={() => setShowPopup(true)}
          >
            Add Course
          </button>
        </div>

        <div className="w-full bg-[#F0F6F6] rounded-lg shadow-md overflow-hidden">
          {/* Mobile View (< 768px) - Card-based list */}
          <div className="md:hidden">
            {course.length > 0 ? (
              course.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-[#e0e0e0] p-4 hover:bg-[#e0f4f4] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#2c3e50]">{item.title}</h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRowExpand(item._id)}
                      className="p-1 rounded-full hover:bg-[#f0f6f6]"
                    >
                      {expandedRows[item._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center text-sm text-[#7f8c8d] space-x-4">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span>{item.students} Students</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={16} className="mr-1" />
                      <span>{item.lessons} Lessons</span>
                    </div>
                  </div>

                  {expandedRows[item._id] && (
                    <div className="mt-3">
                      <p className="text-sm text-[#2c3e50] mb-4">
                        {item.description || "No description available."}
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          className="flex justify-center items-center bg-[#f0f6f6] text-[#2c3e50] px-3 py-2 rounded-md text-sm hover:bg-[#e0f4f4] transition-colors"
                        >
                          <Edit size={16} className="mr-1" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex justify-center items-center bg-[#ff6b6b]/10 text-[#ff6b6b] px-3 py-2 rounded-md text-sm hover:bg-[#ff6b6b]/20 transition-colors"
                        >
                          <Trash2 size={16} className="mr-1" />
                          <span>Delete</span>
                        </button>
                        <button
                          className="flex justify-center items-center bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-2 rounded-md text-sm hover:bg-[#4ecdc4]/20 transition-colors"
                        >
                          <Video size={16} className="mr-1" />
                          <span>Videos</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-[#7f8c8d]">No courses found.</p>
              </div>
            )}
          </div>

          {/* Tablet and Desktop View (≥ 768px) - Table layout */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-[#e0e0e0] divide-y divide-[#e0e0e0] ">
                <thead className="bg-[#F0F6F6] text-[#7f8c8d]">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-medium text-[#7f8c8d] uppercase tracking-wider">Sr no</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7f8c8d] uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7f8c8d] uppercase tracking-wider hidden lg:table-cell">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7f8c8d] uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#7f8c8d] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-[#7f8c8d] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#F0F6F6] divide-y divide-[#e0e0e0]">
                  {course.length > 0 ? (
                    course.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#e0f4f4] transition-colors duration-200"
                      >
                        <td className="whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#2c3e50]">{index + 1}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#2c3e50]">{item.title}</div>
                              <div className="text-xs py-2 text-[#7f8c8d]">{item.videos.length} Videos</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-normal hidden lg:table-cell">
                          <div className="text-sm text-[#2c3e50]">
                            {truncateText(item.description, 150)}
                            {item.description && item.description.length > 150 && (
                              <button
                                onClick={() => toggleRowExpand(item._id)}
                                className="ml-1 text-xs text-[#4ecdc4] hover:text-[#45b7aa]"
                              >
                                {expandedRows[item._id] ? "Show less" : "Show more"}
                              </button>
                            )}
                            {expandedRows[item._id] && (
                              <div className="mt-2 p-3  rounded-md">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-sm text-[#7f8c8d]">
                              <Users size={16} className="mr-1" />
                              <span>{item.assignedStudents.length}</span>
                            </div>
                            <div className="flex items-center text-sm text-[#7f8c8d]">
                              <BookOpen size={16} className="mr-1" />
                              <span>{item.lessons}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => editCourse(item)}
                              className="text-[#7f8c8d] cursor-pointer hover:text-[#2c3e50]"
                              title="Edit course"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-[#ff6b6b] cursor-pointer hover:text-red-700"
                              title="Delete course"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/Admin-course/videos/${item._id}`)}
                              className="text-[#4ecdc4] cursor-pointer hover:text-[#45b7aa]"
                              title="View course videos"
                            >
                              <Video size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-[#7f8c8d]">
                        No courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {ShowPopup && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Add Course</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-[#4ecdc4] hover:text-[#45b7aa] transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Title & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#2c3e50]">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title} onChange={(e) => setTitle(e.target.value)} required
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#2c3e50]">Category</label>
                  <select
                    id="category"
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="personal-development">Personal Development</option>
                  </select>
                </div>

              </div>

              {/* Lessons & Image URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lessons" className="block text-sm font-medium text-[#2c3e50]">Lessons</label>
                  <input
                    id="lessons"
                    type="number"
                    value={lessons}
                    onChange={(e) => setLessons(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reviews" className="block text-sm font-medium text-[#2c3e50]">Reviews</label>
                  <input
                    id="reviews"
                    value={reviews}
                    onChange={(e) => setReviews(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              {/* Language & Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-[#2c3e50]">Language</label>
                  <select
                    id="language"
                    value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                    required
                  >
                    <option value="">Select a language</option>
                    <option value="english">English</option>
                    <option value="spanish">Hindi</option>
                    <option value="french">French</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ratings" className="block text-sm font-medium text-[#2c3e50]">Ratings</label>
                  <input
                    id="ratings"
                    type="number"
                    value={ratings}
                    onChange={(e) => setRatings(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              {/* Category & Status Price & Discount */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-[#2c3e50]">Status</label>
                  <select
                    id="status"
                    value={status} onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                    required
                  >
                    <option value="">Select a status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-[#2c3e50]">Price</label>
                  <input
                    id="price"
                    type="number"
                    value={price} onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-[#2c3e50]">Discount</label>
                  <input
                    id="discount"
                    type="number"
                    value={discount} onChange={(e) => setDiscount(e.target.value)}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>



              {/* Reviews */}


              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#2c3e50]">Description</label>
                <textarea
                  id="description"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  required
                />
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-[#4ecdc4] text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors"
                >
                  Upload Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}





      {/* Edit Course Popup */}
      {courseEdit && selectedCourse && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Edit Course</h2>
              <button
                onClick={() => setCourseEdit(false)}
                className="text-[#4ecdc4] hover:text-[#45b7aa] transition"
              >
                ✖
              </button>
            </div>

            {/* Edit Course Form */}
            <form onSubmit={handleEdit} className="space-y-4">
              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2c3e50]">Title</label>
                  <input
                    type="text"
                    value={selectedCourse?.title || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, title: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2c3e50]">Category</label>
                  <select
                    value={selectedCourse?.category || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, category: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                  >
                    <option value="">Select a category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>

              {/* Lessons & Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2c3e50]">Lessons</label>
                  <input
                    type="number"
                    value={selectedCourse?.lessons || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, lessons: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2c3e50]">Reviews</label>
                  <input
                    type="text"
                    value={selectedCourse?.reviews || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, reviews: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                  />
                </div>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2c3e50]">Price</label>
                  <input
                    type="number"
                    value={selectedCourse?.price || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, price: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2c3e50]">Discount</label>
                  <input
                    type="number"
                    value={selectedCourse?.discount || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, discount: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#2c3e50]">Description</label>
                <textarea
                  value={selectedCourse?.description || ""}
                  onChange={(e) =>
                    setSelectedCourse({ ...selectedCourse, description: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-[#4ecdc4] text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition flex items-center"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default AdminCourse;
