import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Video, ChevronDown, ChevronUp, BookOpen, FileText, Plus, BookX, Users } from 'lucide-react';
import ProjectContext from "../../Context/ProjectContext";

const AdminCourse = () => {
  const [ShowPopup, setShowPopup] = useState(false);
  const { Toast } = useContext(AlertContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
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
      lessons,
      category,
      status: status.toLowerCase(),
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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
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
            fetchCourse();
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
  };

  const toggleRowExpand = (courseId) => {
    setExpandedRows(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "No description available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const [selectedCourse, setSelectedCourse] = useState(null);

  const editCourse = (course) => {
    setSelectedCourse(course);
    setCourseEdit(true);
  };

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
      setCourse((prevCourses) =>
        prevCourses.map((course) =>
          course._id === selectedCourse._id ? data.course : course
        )
      );
      Toast.fire("Success", "Course updated successfully!", "success");
      setCourseEdit(false);
    } catch (error) {
      console.error("Error updating course:", error);
      Toast.fire("error", "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            All Courses ({course.length})
          </h2>
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded-lg flex items-center gap-2 font-semibold shadow-md cursor-pointer"
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {course.length > 0 ? (
                  course.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-900 break-words">{item.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                            <Video size={14} /> {item.videos.length} Videos
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-normal hidden lg:table-cell">
                        <p className="text-sm text-gray-600 break-words line-clamp-2">{truncateText(item.description, 150)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Users size={14} /> {item.assignedStudents?.length || 0} Students
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={14} /> {item.lessons} Lessons
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-4">
                          <button onClick={() => editCourse(item)} className="text-gray-500 hover:text-blue-500 transition-colors" title="Edit course">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(item._id)} className="text-gray-500 hover:text-red-500 transition-colors" title="Delete course">
                            <Trash2 size={18} />
                          </button>
                          <button onClick={() => navigate(`/admin/Admin-course/videos/${item._id}`)} className="text-gray-500 hover:text-green-500 transition-colors" title="View course videos">
                            <Video size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <BookX size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No courses available yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {ShowPopup && (
        <div className="fixed z-[500] inset-0 bg-black/60 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 relative">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
              <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required>
                    <option value="">Select a category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="personal-development">Personal Development</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lessons" className="block text-sm font-medium text-gray-700">Lessons</label>
                  <input id="lessons" type="number" value={lessons} onChange={(e) => setLessons(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required />
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                  <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required>
                    <option value="">Select a language</option>
                    <option value="english">English</option>
                    <option value="spanish">Hindi</option>
                    <option value="french">French</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required />
                </div>
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount</label>
                  <input id="discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800" required />
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-500 cursor-pointer text-white py-2.5 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                  {loading ? "Uploading..." : "Upload Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {courseEdit && selectedCourse && (
        <div className="fixed z-[500] inset-0 bg-black/60 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 relative">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              <button onClick={() => setCourseEdit(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" value={selectedCourse?.title || ""} onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select value={selectedCourse?.category || ""} onChange={(e) => setSelectedCourse({ ...selectedCourse, category: e.target.value })} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800">
                    <option value="">Select a category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lessons</label>
                  <input type="number" value={selectedCourse?.lessons || ""} onChange={(e) => setSelectedCourse({ ...selectedCourse, lessons: e.target.value })} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input type="number" value={selectedCourse?.price || ""} onChange={(e) => setSelectedCourse({ ...selectedCourse, price: e.target.value })} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={selectedCourse?.description || ""} onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800" />
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-500 cursor-pointer text-white py-2.5 px-6 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
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