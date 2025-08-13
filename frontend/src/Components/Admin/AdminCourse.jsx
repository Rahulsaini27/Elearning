
// import React, { useContext, useEffect, useState } from "react";
// import { AlertContext } from "../../Context/AlertContext";
// import Swal from "sweetalert2";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Edit, Trash2, Video, ChevronDown, ChevronUp, Eye, Users, BookOpen, FileText, Plus, BookX } from 'lucide-react';
// import ProjectContext from "../../Context/ProjectContext";

// const AdminCourse = () => {
//   const [ShowPopup, setShowPopup] = useState(false);
//   const { Toast } = useContext(AlertContext);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [lessons, setLessons] = useState([]); // Array of lesson titles
//   const [category, setCategory] = useState("");
//   const [status, setStatus] = useState("draft"); // Default to draft
//   const [price, setPrice] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [language, setLanguage] = useState("");
//   const [ratings, setRatings] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [courseEdit, setCourseEdit] = useState(false);
//   const { API_BASE_URL, API_URL, COURSE_BASE_URL, course, fetchCourse, setCourse, } = useContext(ProjectContext)
//   const admintoken = localStorage.getItem("admintoken");
//   const [expandedRows, setExpandedRows] = useState({});
//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const courseData = {
//       title,
//       description,
//       lessons, // Array of lesson titles
//       category,
//       status: status.toLowerCase(), // Ensure correct enum value
//       price: Number(price) || 0,
//       discount: Number(discount) || 0,
//       language,
//       ratings: Number(ratings) || 0,
//       reviews,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/create`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${admintoken}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(courseData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         setShowPopup(false);
//         setTitle("");
//         setDescription("");
//         setLessons([]);
//         setCategory("");
//         setStatus("draft");
//         setPrice("");
//         setDiscount("");
//         setLanguage("");
//         setRatings("");
//         setReviews([]);
//         fetchCourse();
//         Toast.fire({ icon: "success", title: "Course added successfully!" });


//       } else {
//         Toast.fire({ icon: "error", title: "Failed to add course" });
//       }
//     } catch (error) {
//       console.error("Error submitting course:", error);
//       Toast.fire({ icon: "error", title: "An error occurred while adding the course" });
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleDelete = async (course_id) => {
//     try {
//       console.log(course_id, "course_id");

//       // 🔹 Show confirmation alert before deleting
//       Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!"
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           try {
//             // 🔹 Perform delete request
//             const response = await axios.delete(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/delete/${course_id}`,
//               {
//                 headers: {
//                   Authorization: `Bearer ${admintoken}`,
//                   "Content-Type": "application/json"
//                 }
//               }
//             );

//             if (response.status === 200) {
//               Toast.fire({ icon: "success", title: "Course deleted successfully!" });
//               fetchCourse(); // ✅ Refresh Course list after deletion
//             } else {
//               Toast.fire({ icon: "error", title: "Failed to delete Course" });
//             }

//           } catch (error) {
//             Toast.fire({
//               icon: "error",
//               title: "Failed to delete Course",
//               text: error.response?.data?.message || error.message
//             });
//           }
//         }
//       });

//     } catch (error) {
//       Toast.fire({
//         icon: "error",
//         title: "Failed to delete Course",
//         text: error.message
//       });
//     }
//   };

//   // Toggle expanded state for a course
//   const toggleRowExpand = (courseId) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [courseId]: !prev[courseId]
//     }));
//   };

//   // Function to truncate description text
//   const truncateText = (text, maxLength = 100) => {
//     if (!text) return "No description available";
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + "...";
//   };
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   // Function to open edit modal and set selected course data
//   const editCourse = (course) => {
//     setSelectedCourse(course);
//     setCourseEdit(true);
//   };

//   // Function to handle form submission
//   const handleEdit = async (e) => {
//     e.preventDefault();

//     if (!selectedCourse || !selectedCourse._id) {
//       Toast.fire("error", "Invalid course selection!", "error ");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_URL}${COURSE_BASE_URL}/update/${selectedCourse._id}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${admintoken}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(selectedCourse),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to update course");
//       }

//       // Optimistically update UI (if applicable)
//       setCourse((prevCourses) =>
//         prevCourses.map((course) =>
//           course._id === selectedCourse._id ? data.course : course
//         )
//       );
//       Toast.fire("Success", "Course updated successfully!", "success");

//       setCourseEdit(false); // Close modal
//     } catch (error) {
//       console.error("❌ Error updating course:", error);
//       Toast.fire("error", "Failed to update course");

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-slate-50 p-4"> {/* Changed background and padding */}
//         <div className="flex justify-between items-center mb-6"> {/* Increased bottom margin */}
//           <h2 className="text-2xl font-bold text-slate-800 relative"> {/* Adjusted text color and size */}
//             All Courses ({course.length})
//           </h2>

//           {/* Add Course Button */}
//           <div
//             onClick={() => setShowPopup(true)}
//             className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full flex items-center gap-2 transform hover:scale-105 shadow-md cursor-pointer" // Refined button styles
//           >
//             <Plus size={18} />
//             Add Course
//           </div>
//         </div>

//         {/* Course Cards Grid */}
//         <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"> {/* Changed background, added border, refined shadow */}
//           {/* Mobile View (< 768px) - Card-based layout */}
//           <div className="md:hidden">
//             {course.length > 0 ? (
//               course.map((item, index) => (
//                 <div key={item._id} className="border-b border-slate-200 p-4 hover:bg-slate-50 transition-all duration-300"> {/* Changed borders and hover */}
//                   <div className="flex items-start gap-3">
//                     <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg"> {/* Changed color */}
//                       {item.title.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-start">
//                         <h3 className="font-medium text-slate-800 break-words pr-2">{item.title}</h3> {/* Adjusted text color */}
//                         <button
//                           onClick={() => toggleRowExpand(item._id)}
//                           className="p-1 rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0 mt-1" // Adjusted icon color and hover
//                         >
//                           {expandedRows[item._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                         </button>
//                       </div>
//                       <div className="flex items-center space-x-4 mt-1 text-slate-600"> {/* Adjusted text color */}
//                         <p className="text-xs flex items-center gap-1">
//                           <Users size={14} className="text-slate-400" /> {/* Adjusted icon color */}
//                           {item.assignedStudents?.length || 0} Students
//                         </p>
//                         <p className="text-xs flex items-center gap-1">
//                           <BookOpen size={14} className="text-slate-400" /> {/* Adjusted icon color */}
//                           {item.lessons} Lessons
//                         </p>
//                       </div>
//                       <div className="mt-2">
//                         <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
//                           }`}>
//                           {item.status}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {expandedRows[item._id] && (
//                     <div className="mt-3 pl-2 animate-fadeIn overflow-hidden">
//                       <div className="bg-slate-50 bg-opacity-70 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm"> {/* Changed background and border color */}
//                         <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"> {/* Adjusted text color */}
//                           <FileText size={14} className="text-slate-500" /> {/* Adjusted icon color */}
//                           Description:
//                         </h4>
//                         <p className="text-sm text-slate-600 break-words whitespace-pre-line mb-4"> {/* Adjusted text color */}
//                           {item.description || "No description available."}
//                         </p>
//                       </div>

//                       <div className="flex gap-3 pt-2 mt-3 flex-wrap"> {/* Added flex-wrap */}
//                         <button
//                           onClick={() => editCourse(item)}
//                           className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-200 transition-all hover:shadow-md" // Changed colors
//                         >
//                           <Edit size={16} />
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => handleDelete(item._id)}
//                           className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-all hover:shadow-md"
//                         >
//                           <Trash2 size={16} />
//                           Delete
//                         </button>

//                         <button
//                           onClick={() => navigate(`/admin/Admin-course/videos/${item._id}`)}
//                           className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm hover:bg-slate-200 transition-all hover:shadow-md" // Changed colors to neutral
//                         >
//                           <Video size={16} />
//                           Videos
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12">
//                 <BookX size={48} className="mx-auto mb-4 text-slate-300" /> {/* Adjusted icon color */}
//                 <p className="text-slate-500">No courses available yet.</p> {/* Adjusted text color */}
//               </div>
//             )}
//           </div>

//           {/* Tablet and Desktop View (≥ 768px) - Table layout */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-full divide-y divide-slate-200"> {/* Changed divider color */}
//               <thead className="bg-slate-100"> {/* Changed background */}
//                 <tr>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-12 border-b-2 border-indigo-600">#</th> {/* Changed border color and text */}
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider border-b-2 border-indigo-600">Course Details</th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-indigo-600">Description</th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32 border-b-2 border-indigo-600">Stats</th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Status</th>
//                   <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-slate-200"> {/* Changed background and divider */}
//                 {course.length > 0 ? (
//                   course.map((item, index) => (
//                     <tr key={item._id} className="hover:bg-slate-50 transition-colors duration-300"> {/* Changed hover */}
//                       {/* Number */}
//                       <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-center"> {/* Adjusted text color */}
//                         {index + 1}
//                       </td>

//                       {/* Title and Videos */}
//                       <td className="px-3 py-4">
//                         <div className="flex flex-col">
//                           <h3 className="text-sm font-medium text-slate-900 break-words"> {/* Adjusted text color */}
//                             {item.title}
//                           </h3>
//                           <p className="text-sm text-slate-600 mt-1 flex items-center gap-1"> {/* Adjusted text color */}
//                             <Video size={14} className="text-slate-400" /> {/* Adjusted icon color */}
//                             {item.videos.length} Videos
//                           </p>
//                         </div>
//                       </td>

//                       {/* Description (hidden on medium screens) */}
//                       <td className="px-3 py-4 whitespace-normal hidden lg:table-cell">
//                         <div className="max-w-md relative">
//                           <div className={`transition-all duration-500 ${expandedRows[item._id] ? 'opacity-0 h-0' : 'opacity-100'}`}>
//                             <p className="text-sm text-slate-600 break-words line-clamp-3 bg-slate-50 p-2 rounded-lg"> {/* Changed background */}
//                               {truncateText(item.description, 200)}
//                             </p>
//                             {item.description && item.description.length > 200 && (
//                               <button
//                                 onClick={() => toggleRowExpand(item._id)}
//                                 className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 flex items-center transition-all hover:pl-1" // Changed colors
//                               >
//                                 <ChevronDown size={16} className="mr-1 transition-transform duration-300 transform hover:translate-y-1" />
//                                 Show more
//                               </button>
//                             )}
//                           </div>

//                           {expandedRows[item._id] && (
//                             <div className="animate-slideDown bg-slate-50 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm"> {/* Changed background and border color */}
//                               <p className="text-sm text-slate-600 break-words"> {/* Adjusted text color */}
//                                 {item.description}
//                               </p>
//                               <button
//                                 onClick={() => toggleRowExpand(item._id)}
//                                 className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 flex items-center transition-all hover:pl-1" // Changed colors
//                               >
//                                 <ChevronUp size={16} className="mr-1 transition-transform duration-300 transform hover:-translate-y-1" />
//                                 Show less
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </td>

//                       {/* Stats */}
//                       <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600"> {/* Adjusted text color */}
//                         <div className="flex flex-col space-y-2">
//                           <div className="flex items-center gap-1">
//                             <Users size={14} className="text-slate-400" /> {/* Adjusted icon color */}
//                             {item.assignedStudents?.length || 0} Students
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <BookOpen size={14} className="text-slate-400" /> {/* Adjusted icon color */}
//                             {item.lessons} Lessons
//                           </div>
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
//                           }`}>
//                           {item.status}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <div className="flex items-center justify-center space-x-3">
//                           <button
//                             onClick={() => editCourse(item)}
//                             className="text-indigo-600 hover:text-indigo-700 transition-all duration-300 transform hover:scale-110 hover:rotate-6" // Changed colors and rotation
//                             title="Edit course"
//                           >
//                             <Edit size={20} /> {/* Slightly smaller icon */}
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item._id)}
//                             className="text-red-600 hover:text-red-700 transition-all duration-300 transform hover:scale-110 hover:-rotate-6" // Changed colors and rotation
//                             title="Delete course"
//                           >
//                             <Trash2 size={20} /> {/* Slightly smaller icon */}
//                           </button>
//                           <button
//                             onClick={() => navigate(`/admin/Admin-course/videos/${item._id}`)}
//                             className="text-slate-600 hover:text-slate-800 transition-all duration-300 transform hover:scale-110 hover:rotate-6" // Changed colors to neutral
//                             title="View course videos"
//                           >
//                             <Video size={20} /> {/* Slightly smaller icon */}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-3 py-12 text-center text-slate-500">
//                       <BookX size={48} className="mx-auto mb-4 text-slate-300" />
//                       <p>No courses available yet.</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>


//       {ShowPopup && (
//         <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
//           <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative"> {/* Changed background to white */}

//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200"> {/* Changed border color */}
//               <h2 className="text-2xl font-bold text-slate-800">Add Course</h2> {/* Adjusted text color */}
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="text-slate-500 hover:text-slate-700 transition" // Adjusted colors
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">

//               {/* Title & Description */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label> {/* Adjusted text color */}
//                   <input
//                     id="title"
//                     type="text"
//                     value={title} onChange={(e) => setTitle(e.target.value)} required
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" // Refined input styles
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label> {/* Adjusted text color */}
//                   <select
//                     id="category"
//                     value={category} onChange={(e) => setCategory(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" // Refined input styles
//                     required
//                   >
//                     <option value="">Select a category</option>
//                     <option value="development">Development</option>
//                     <option value="design">Design</option>
//                     <option value="business">Business</option>
//                     <option value="marketing">Marketing</option>
//                     <option value="personal-development">Personal Development</option>
//                   </select>
//                 </div>

//               </div>

//               {/* Lessons & Image URLs */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="lessons" className="block text-sm font-medium text-slate-700">Lessons</label>
//                   <input
//                     id="lessons"
//                     type="number"
//                     value={lessons}
//                     onChange={(e) => setLessons(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="reviews" className="block text-sm font-medium text-slate-700">Reviews</label>
//                   <input
//                     id="reviews"
//                     value={reviews}
//                     onChange={(e) => setReviews(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               {/* Language & Ratings */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="language" className="block text-sm font-medium text-slate-700">Language</label>
//                   <select
//                     id="language"
//                     value={language} onChange={(e) => setLanguage(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                     required
//                   >
//                     <option value="">Select a language</option>
//                     <option value="english">English</option>
//                     <option value="spanish">Hindi</option>
//                     <option value="french">French</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label htmlFor="ratings" className="block text-sm font-medium text-slate-700">Ratings</label>
//                   <input
//                     id="ratings"
//                     type="number"
//                     value={ratings}
//                     onChange={(e) => setRatings(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               {/* Category & Status Price & Discount */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                 <div>
//                   <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
//                   <select
//                     id="status"
//                     value={status} onChange={(e) => setStatus(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                     required
//                   >
//                     <option value="">Select a status</option>
//                     <option value="draft">Draft</option>
//                     <option value="published">Published</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price</label>
//                   <input
//                     id="price"
//                     type="number"
//                     value={price} onChange={(e) => setPrice(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="discount" className="block text-sm font-medium text-slate-700">Discount</label>
//                   <input
//                     id="discount"
//                     type="number"
//                     value={discount} onChange={(e) => setDiscount(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>



//               {/* Reviews */}


//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
//                 <textarea
//                   id="description"
//                   value={description} onChange={(e) => setDescription(e.target.value)}
//                   className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   required
//                 />
//               </div>
//               {/* Submit Button */}
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="mt-4 bg-indigo-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Refined button styles
//                   disabled={loading}
//                 >
//                   {loading ? "Uploading..." : "Upload Course"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}


//       {/* Edit Course Popup */}
//       {courseEdit && selectedCourse && (
//         <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
//           <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative"> {/* Changed background to white */}
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200"> {/* Changed border color */}
//               <h2 className="text-2xl font-bold text-slate-800">Edit Course</h2> {/* Adjusted text color */}
//               <button
//                 onClick={() => setCourseEdit(false)}
//                 className="text-slate-500 hover:text-slate-700 cursor-pointer transition" // Adjusted colors
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Edit Course Form */}
//             <form onSubmit={handleEdit} className="space-y-4">
//               {/* Title & Category */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700">Title</label>
//                   <input
//                     type="text"
//                     value={selectedCourse?.title || ""}
//                     onChange={(e) =>
//                       setSelectedCourse({ ...selectedCourse, title: e.target.value })
//                     }
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700">Category</label>
//                   <select
//                     value={selectedCourse?.category || ""}
//                     onChange={(e) =>
//                       setSelectedCourse({ ...selectedCourse, category: e.target.value })
//                     }
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
//                   >
//                     <option value="">Select a category</option>
//                     <option value="development">Development</option>
//                     <option value="design">Design</option>
//                     <option value="business">Business</option>
//                     <option value="marketing">Marketing</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Lessons & Reviews */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700">Lessons</label>
//                   <input
//                     type="number"
//                     value={selectedCourse?.lessons || ""}
//                     onChange={(e) =>
//                       setSelectedCourse({ ...selectedCourse, lessons: e.target.value })
//                     }
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700">Reviews</label>
//                   <input
//                     type="text"
//                     value={selectedCourse?.reviews || ""}
//                     onChange={(e) =>
//                       setSelectedCourse({ ...selectedCourse, reviews: e.target.value })
//                     }
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
//                   />
//                 </div>
//               </div>

//               {/* Price & Discount */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700">Price</label>
//                   <input
//                     type="number"
//                     value={selectedCourse?.price || ""}
//                     onChange={(e) =>
//                       setSelectedCourse({ ...selectedCourse, price: e.target.value })
//                     }
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700">Discount</label>
//                   <input
//                     type="number"
//                     value={selectedCourse?.discount || ""}
//                     onChange={(e) =>
//                       setSelectedCourse({ ...selectedCourse, discount: e.target.value })
//                     }
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700">Description</label>
//                 <textarea
//                   value={selectedCourse?.description || ""}
//                   onChange={(e) =>
//                     setSelectedCourse({ ...selectedCourse, description: e.target.value })
//                   }
//                   className="mt-1  block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
//                 />
//               </div>

//               {/* Submit Button */}
//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="mt-4 bg-indigo-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={loading}
//                 >
//                   {loading ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AdminCourse;



import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Video, ChevronDown, ChevronUp, Eye, Users, BookOpen, FileText, Plus, BookX } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 p-4"> {/* Changed background and padding */}
        <div className="flex justify-between items-center mb-6"> {/* Increased bottom margin */}
          <h2 className="text-2xl font-bold text-slate-800 relative"> {/* Adjusted text color and size */}
            All Courses ({course.length})
          </h2>

          {/* Add Course Button */}
          <div
            onClick={() => setShowPopup(true)}
            className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full flex items-center gap-2 transform hover:scale-105 shadow-md cursor-pointer" // Refined button styles
          >
            <Plus size={18} />
            Add Course
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"> {/* Changed background, added border, refined shadow */}
          {/* Mobile View (< 768px) - Card-based layout */}
          <div className="md:hidden">
            {course.length > 0 ? (
              course.map((item, index) => (
                <div key={item._id} className="border-b border-slate-200 p-4 hover:bg-slate-50 transition-all duration-300"> {/* Changed borders and hover */}
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg"> {/* Changed color */}
                      {item.title.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-slate-800 break-words pr-2">{item.title}</h3> {/* Adjusted text color */}
                        <button
                          onClick={() => toggleRowExpand(item._id)}
                          className="p-1 rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0 mt-1" // Adjusted icon color and hover
                        >
                          {expandedRows[item._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-slate-600"> {/* Adjusted text color */}
                        <p className="text-xs flex items-center gap-1">
                          <Users size={14} className="text-slate-400" /> {/* Adjusted icon color */}
                          {item.assignedStudents?.length || 0} Students
                        </p>
                        <p className="text-xs flex items-center gap-1">
                          <BookOpen size={14} className="text-slate-400" /> {/* Adjusted icon color */}
                          {item.lessons} Lessons
                        </p>
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                          }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {expandedRows[item._id] && (
                    <div className="mt-3 pl-2 animate-fadeIn overflow-hidden">
                      <div className="bg-slate-50 bg-opacity-70 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm"> {/* Changed background and border color */}
                        <h4 className="text-sm font-medium text-slate-700 mb-1 flex items-center gap-1"> {/* Adjusted text color */}
                          <FileText size={14} className="text-slate-500" /> {/* Adjusted icon color */}
                          Description:
                        </h4>
                        <p className="text-sm text-slate-600 break-words whitespace-pre-line mb-4"> {/* Adjusted text color */}
                          {item.description || "No description available."}
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2 mt-3 flex-wrap"> {/* Added flex-wrap */}
                        <button
                          onClick={() => editCourse(item)}
                          className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-200 transition-all hover:shadow-md" // Changed colors
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-all hover:shadow-md"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                        <button
                          onClick={() => navigate(`/admin/Admin-course/videos/${item._id}`)}
                          className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm hover:bg-slate-200 transition-all hover:shadow-md" // Changed colors to neutral
                        >
                          <Video size={16} />
                          Videos
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BookX size={48} className="mx-auto mb-4 text-slate-300" /> {/* Adjusted icon color */}
                <p className="text-slate-500">No courses available yet.</p> {/* Adjusted text color */}
              </div>
            )}
          </div>

          {/* Tablet and Desktop View (≥ 768px) - Table layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200"> {/* Changed divider color */}
              <thead className="bg-slate-100"> {/* Changed background */}
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-12 border-b-2 border-indigo-600">#</th> {/* Changed border color and text */}
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider border-b-2 border-indigo-600">Course Details</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-indigo-600">Description</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-32 border-b-2 border-indigo-600">Stats</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Status</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200"> {/* Changed background and divider */}
                {course.length > 0 ? (
                  course.map((item, index) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors duration-300"> {/* Changed hover */}
                      {/* Number */}
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-center"> {/* Adjusted text color */}
                        {index + 1}
                      </td>

                      {/* Title and Videos */}
                      <td className="px-3 py-4">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-medium text-slate-900 break-words"> {/* Adjusted text color */}
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1 flex items-center gap-1"> {/* Adjusted text color */}
                            <Video size={14} className="text-slate-400" /> {/* Adjusted icon color */}
                            {item.videos.length} Videos
                          </p>
                        </div>
                      </td>

                      {/* Description (hidden on medium screens) */}
                      <td className="px-3 py-4 whitespace-normal hidden lg:table-cell">
                        <div className="max-w-md relative">
                          <div className={`transition-all duration-500 ${expandedRows[item._id] ? 'opacity-0 h-0' : 'opacity-100'}`}>
                            <p className="text-sm text-slate-600 break-words line-clamp-3 bg-slate-50 p-2 rounded-lg"> {/* Changed background */}
                              {truncateText(item.description, 200)}
                            </p>
                            {item.description && item.description.length > 200 && (
                              <button
                                onClick={() => toggleRowExpand(item._id)}
                                className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 flex items-center transition-all hover:pl-1" // Changed colors
                              >
                                <ChevronDown size={16} className="mr-1 transition-transform duration-300 transform hover:translate-y-1" />
                                Show more
                              </button>
                            )}
                          </div>

                          {expandedRows[item._id] && (
                            <div className="animate-slideDown bg-slate-50 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm"> {/* Changed background and border color */}
                              <p className="text-sm text-slate-600 break-words"> {/* Adjusted text color */}
                                {item.description}
                              </p>
                              <button
                                onClick={() => toggleRowExpand(item._id)}
                                className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 flex items-center transition-all hover:pl-1" // Changed colors
                              >
                                <ChevronUp size={16} className="mr-1 transition-transform duration-300 transform hover:-translate-y-1" />
                                Show less
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600"> {/* Adjusted text color */}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-slate-400" /> {/* Adjusted icon color */}
                            {item.assignedStudents?.length || 0} Students
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen size={14} className="text-slate-400" /> {/* Adjusted icon color */}
                            {item.lessons} Lessons
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
                          }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => editCourse(item)}
                            className="text-indigo-600 hover:text-indigo-700 transition-all duration-300 transform hover:scale-110 hover:rotate-6" // Changed colors and rotation
                            title="Edit course"
                          >
                            <Edit size={20} /> {/* Slightly smaller icon */}
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-700 transition-all duration-300 transform hover:scale-110 hover:-rotate-6" // Changed colors and rotation
                            title="Delete course"
                          >
                            <Trash2 size={20} /> {/* Slightly smaller icon */}
                          </button>
                          <button
                            onClick={() => navigate(`/admin/Admin-course/videos/${item._id}`)}
                            className="text-slate-600 hover:text-slate-800 transition-all duration-300 transform hover:scale-110 hover:rotate-6" // Changed colors to neutral
                            title="View course videos"
                          >
                            <Video size={20} /> {/* Slightly smaller icon */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-3 py-12 text-center text-slate-500">
                      <BookX size={48} className="mx-auto mb-4 text-slate-300" />
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
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative"> {/* Changed background to white */}

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200"> {/* Changed border color */}
              <h2 className="text-2xl font-bold text-slate-800">Add Course</h2> {/* Adjusted text color */}
              <button
                onClick={() => setShowPopup(false)}
                className="text-slate-500 hover:text-slate-700 transition" // Adjusted colors
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
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label> {/* Adjusted text color */}
                  <input
                    id="title"
                    type="text"
                    value={title} onChange={(e) => setTitle(e.target.value)} required
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" // Refined input styles
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label> {/* Adjusted text color */}
                  <select
                    id="category"
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800" // Refined input styles
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
                  <label htmlFor="lessons" className="block text-sm font-medium text-slate-700">Lessons</label>
                  <input
                    id="lessons"
                    type="number"
                    value={lessons}
                    onChange={(e) => setLessons(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reviews" className="block text-sm font-medium text-slate-700">Reviews</label>
                  <input
                    id="reviews"
                    value={reviews}
                    onChange={(e) => setReviews(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Language & Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-slate-700">Language</label>
                  <select
                    id="language"
                    value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                    required
                  >
                    <option value="">Select a language</option>
                    <option value="english">English</option>
                    <option value="spanish">Hindi</option>
                    <option value="french">French</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ratings" className="block text-sm font-medium text-slate-700">Ratings</label>
                  <input
                    id="ratings"
                    type="number"
                    value={ratings}
                    onChange={(e) => setRatings(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Category & Status Price & Discount */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                  <select
                    id="status"
                    value={status} onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                    required
                  >
                    <option value="">Select a status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price</label>
                  <input
                    id="price"
                    type="number"
                    value={price} onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-slate-700">Discount</label>
                  <input
                    id="discount"
                    type="number"
                    value={discount} onChange={(e) => setDiscount(e.target.value)}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>



              {/* Reviews */}


              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  id="description"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  required
                />
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-indigo-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Refined button styles
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Edit Course Popup */}
      {courseEdit && selectedCourse && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative"> {/* Changed background to white */}
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200"> {/* Changed border color */}
              <h2 className="text-2xl font-bold text-slate-800">Edit Course</h2> {/* Adjusted text color */}
              <button
                onClick={() => setCourseEdit(false)}
                className="text-slate-500 hover:text-slate-700 cursor-pointer transition" // Adjusted colors
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

            {/* Edit Course Form */}
            <form onSubmit={handleEdit} className="space-y-4">
              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Title</label>
                  <input
                    type="text"
                    value={selectedCourse?.title || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, title: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={selectedCourse?.category || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, category: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
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
                  <label className="block text-sm font-medium text-slate-700">Lessons</label>
                  <input
                    type="number"
                    value={selectedCourse?.lessons || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, lessons: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Reviews</label>
                  <input
                    type="text"
                    value={selectedCourse?.reviews || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, reviews: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price</label>
                  <input
                    type="number"
                    value={selectedCourse?.price || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, price: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Discount</label>
                  <input
                    type="number"
                    value={selectedCourse?.discount || ""}
                    onChange={(e) =>
                      setSelectedCourse({ ...selectedCourse, discount: e.target.value })
                    }
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={selectedCourse?.description || ""}
                  onChange={(e) =>
                    setSelectedCourse({ ...selectedCourse, description: e.target.value })
                  }
                  className="mt-1  block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-indigo-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
