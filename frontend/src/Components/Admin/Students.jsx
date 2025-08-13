// import React, { useContext, useState } from "react"; // Removed useEffect as it was unused locally
// import { AlertContext } from "../../Context/AlertContext";
// import axios from "axios";
// import Swal from "sweetalert2";
// import ProjectContext from "../../Context/ProjectContext";
// import { ChevronDown, ChevronUp, Edit, Trash2, Check, X, Plus, FileX, CircleDashed } from 'lucide-react';

// function Students() {
//   const { Toast } = useContext(AlertContext);
//   const { API_BASE_URL, API_URL, USER_BASE_URL, course, totalusers, fetchUsers, setTotalUsers } = useContext(ProjectContext);

//   const admintoken = localStorage.getItem("admintoken");

//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Renamed for clarity
//   const [showAddUserModal, setShowAddUserModal] = useState(false); // Renamed for clarity
//   const [userName, setUserName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("");

//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "", // Standardized to 'phone'
//     gender: "",
//     address: "",
//     education: "", // Standardized to 'education'
//     occupation: "",
//     enrolledCourses: [], // This will be handled by the assign course logic
//   });

//   const [editUserDetails, setEditUserDetails] = useState({
//     _id: null,
//     name: "",
//     email: "",
//     password: "", // Leave blank for security
//     phone: "",
//     gender: "",
//     address: "",
//     education: "",
//     occupation: "",
//   });
//   const [showEditModal, setShowEditModal] = useState(false);

//   // For expanding table rows in desktop view
//   const [expandedRows, setExpandedRows] = useState({});

//   // Handle Input Change for New User form
//   const handleNewUserChange = (e) => {
//     setNewUser({ ...newUser, [e.target.name]: e.target.value });
//   };

//   // Add New User
//   const handleAddUser = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(API_BASE_URL + API_URL + USER_BASE_URL + "/register", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${admintoken}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           name: newUser.name,
//           email: newUser.email,
//           password: newUser.password,
//           phone: newUser.phone,
//           address: newUser.address,
//           education: newUser.education,
//           occupation: newUser.occupation,
//           gender: newUser.gender,
//           // enrolledCourses handled separately if assigned immediately after registration
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setShowAddUserModal(false);
//         setNewUser({ // Reset form
//           name: "", email: "", password: "", phone: "", gender: "",
//           address: "", education: "", occupation: "", enrolledCourses: []
//         });
//         fetchUsers();
//         Toast.fire({ icon: "success", title: "User registered successfully!" });
//       } else {
//         Toast.fire({ icon: "error", title: "Failed to register user", text: data.msg });
//       }
//     } catch (error) {
//       Toast.fire({ icon: "error", title: "Failed to register user", text: error.message || "An unexpected error occurred." });
//     }
//   };

//   // Change User Status (Active/Inactive)
//   const changeStatus = async (userId, status) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/updateStatus/${userId}`, {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${admintoken}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ isActive: status }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Toast.fire({ icon: "success", title: "User status updated successfully!" });
//         setTotalUsers((prevUsers) =>
//           prevUsers.map((user) => (user._id === userId ? { ...user, isActive: status } : user))
//         );
//       } else {
//         Toast.fire({ icon: "error", title: "Failed to update status", text: data.msg });
//       }
//     } catch (error) {
//       Toast.fire({ icon: "error", title: "Failed to update status", text: error.message });
//     }
//   };

//   // Delete User
//   const deleteUser = async (userId) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#4F46E5", // indigo-600
//       cancelButtonColor: "#DC2626", // red-600
//       confirmButtonText: "Yes, delete it!"
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const response = await axios.delete(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/delete/${userId}`,
//             { headers: { "Authorization": `Bearer ${admintoken}` } }
//           );

//           if (response.status === 200) {
//             Toast.fire({ icon: "success", title: "User deleted successfully!" });
//             fetchUsers();
//           } else {
//             Toast.fire({ icon: "error", title: "Failed to delete user" });
//           }
//         } catch (error) {
//           Toast.fire({
//             icon: "error", title: "Failed to delete user",
//             text: error.response?.data?.message || error.message
//           });
//         }
//       }
//     });
//   };

//   // Populate Edit User Modal
//   const editUser = (user) => {
//     setEditUserDetails({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone || "", // Ensure it's never undefined
//       gender: user.gender || "",
//       address: user.address || "",
//       education: user.education || "",
//       occupation: user.occupation || "",
//       password: "", // Always keep password empty for editing
//     });
//     setShowEditModal(true);
//   };

//   // Handle input change for Edit User form
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditUserDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   // Submit updated user details
//   const handleEditUser = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { ...editUserDetails };
//       if (payload.password === "") { // Don't send empty password field if user didn't change it
//         delete payload.password;
//       }

//       const response = await fetch(
//         `${API_BASE_URL}${API_URL}${USER_BASE_URL}/edit/${editUserDetails._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Authorization": `Bearer ${admintoken}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         Toast.fire({ icon: "success", title: "User updated successfully!" });
//         fetchUsers();
//         setShowEditModal(false);
//       } else {
//         Toast.fire({ icon: "error", title: "Failed to update user", text: data.msg || response.statusText });
//       }
//     } catch (error) {
//       Toast.fire({ icon: "error", title: "Error updating user", text: error.message || "Something went wrong" });
//     }
//   };

//   // Assign Course to User
//   const handleAssignCourse = async () => {
//     if (!userId || !selectedCourse) {
//       Toast.fire({ icon: "error", title: "Please select a user and a course!" });
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/assign-course`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${admintoken}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           userId: userId,
//           courseId: selectedCourse
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Toast.fire({ icon: "success", title: "Course assigned successfully!" });
//         fetchUsers();
//         setIsAssignModalOpen(false);
//         setSelectedCourse(""); // Clear selected course
//       } else {
//         Toast.fire({ icon: "error", title: data.msg || "Failed to assign course" });
//       }
//     } catch (error) {
//       Toast.fire({ icon: "error", title: "Something went wrong while assigning course!" });
//     }
//   };

//   // Remove Course from User
//   const removeHandler = async (userId, courseId) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This will unassign the course from the student.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#4F46E5",
//       cancelButtonColor: "#DC2626",
//       confirmButtonText: "Yes, remove it!"
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const response = await axios.post(
//             `${API_BASE_URL}${API_URL}${USER_BASE_URL}/remove-student/${courseId}/${userId}`,
//             {},
//             { headers: { Authorization: `Bearer ${admintoken}` } }
//           );

//           if (response.status === 200) {
//             Toast.fire({ icon: "success", title: "Course unassigned successfully!" });
//             fetchUsers();
//           } else {
//             Toast.fire({ icon: "error", title: "Failed to unassign course" });
//           }
//         } catch (error) {
//           Toast.fire({
//             icon: "error", title: "Failed to unassign course",
//             text: error.response?.data?.message || error.message,
//           });
//         }
//       }
//     });
//   };

//   // Toggle expanded state for a user in the table
//   const toggleRowExpand = (userId) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [userId]: !prev[userId]
//     }));
//   };

//   return (
//     <>
//       {/* Main Component */}
//       <div className="min-h-screen bg-slate-50 p-4">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-slate-800">
//             All Students ({totalusers.length})
//           </h2>

//           <div
//             onClick={() => setShowAddUserModal(true)}
//             className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full flex items-center gap-2 transform hover:scale-105 shadow-md cursor-pointer"
//           >
//             <Plus size={18} />
//             Add Student
//           </div>
//         </div>

//         {/* Student List/Table */}
//         <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
//           {/* Mobile View (< 768px) - Card-based layout */}
//           <div className="md:hidden">
//             {totalusers.length > 0 ? (
//               totalusers.map((user, index) => (
//                 <div key={user._id} className="border-b border-slate-200 p-4 hover:bg-slate-50 transition-all duration-300">
//                   <div className="flex items-start gap-3">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-start">
//                         <h3 className="font-medium text-slate-900 break-words pr-2">{user.name}</h3>
//                         <button
//                           onClick={() => toggleRowExpand(user._id)}
//                           className="p-1 rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0 mt-1"
//                         >
//                           {expandedRows[user._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                         </button>
//                       </div>
//                       <p className="text-sm text-slate-600 mt-1">{user.email}</p>
//                       <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
//                         <span className={`w-2.5 h-2.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
//                         {user.isActive ? 'Active' : 'Inactive'}
//                       </p>
//                     </div>
//                   </div>

//                   {expandedRows[user._id] && (
//                     <div className="mt-3 pl-2 animate-fadeIn overflow-hidden">
//                       <div className="bg-slate-50 bg-opacity-70 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm">
//                         <div className="grid grid-cols-2 gap-2 mb-2">
//                           {[
//                             { label: 'Phone', value: user.phone },
//                             { label: 'Gender', value: user.gender },
//                             { label: 'Occupation', value: user.occupation },
//                             { label: 'Education', value: user.education }
//                           ].map(({ label, value }) => (
//                             <div key={label}>
//                               <p className="text-xs text-slate-500">{label}:</p>
//                               <p className="text-sm text-slate-700">{value || 'N/A'}</p>
//                             </div>
//                           ))}
//                         </div>

//                         <div className="mb-2">
//                           <p className="text-xs text-slate-500">Address:</p>
//                           <p className="text-sm text-slate-700 break-words">{user.address || 'N/A'}</p>
//                         </div>

//                         <div>
//                           <p className="text-xs text-slate-500 mb-1">Enrolled Courses:</p>
//                           {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
//                             <div className="space-y-1">
//                               {user.enrolledCourses.map((course) => (
//                                 <div
//                                   key={course._id}
//                                   className="flex items-center gap-2 border rounded-lg px-2 py-1 text-sm shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
//                                 >
//                                   <span className="flex-grow truncate text-slate-700">{course.title}</span>
//                                   <button
//                                     onClick={() => removeHandler(user._id, course._id)}
//                                     className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
//                                   >
//                                     <Trash2 size={14} />
//                                   </button>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <p className="text-sm text-slate-500 flex items-center gap-1">
//                               <CircleDashed size={16} className="text-slate-400" /> No courses enrolled
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex gap-3 pt-2 mt-3 flex-wrap">
//                         <button
//                           onClick={() => {
//                             setIsAssignModalOpen(true);
//                             setUserId(user._id);
//                             setUserName(user.name);
//                           }}
//                           className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-200 transition-all hover:shadow-md"
//                         >
//                           <Plus size={16} />
//                           Assign Course
//                         </button>

//                         <button
//                           onClick={() => changeStatus(user._id, !user.isActive)}
//                           className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all hover:shadow-md ${user.isActive
//                             ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
//                             : 'bg-red-100 text-red-700 hover:bg-red-200'
//                             }`}
//                         >
//                           {user.isActive ? <Check size={16} /> : <X size={16} />}
//                           {user.isActive ? 'Active' : 'Inactive'}
//                         </button>

//                         <button
//                           onClick={() => {
//                             editUser(user);
//                           }}
//                           className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm hover:bg-slate-200 transition-all hover:shadow-md"
//                         >
//                           <Edit size={16} />
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => deleteUser(user._id)}
//                           className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-all hover:shadow-md"
//                         >
//                           <Trash2 size={16} />
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12">
//                 <FileX size={48} className="mx-auto mb-4 text-slate-300" />
//                 <p className="text-slate-500">No students registered yet.</p>
//               </div>
//             )}
//           </div>

//           {/* Tablet and Desktop View (≥ 768px) - Table layout */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="min-w-full divide-y divide-slate-200">
//               <thead className="bg-slate-100">
//                 <tr>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-12 border-b-2 border-indigo-600">#</th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider border-b-2 border-indigo-600">Student Details</th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider border-b-2 border-indigo-600">Enrolled Courses</th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-indigo-600">Additional Info</th>
//                   <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Status</th>
//                   <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-slate-200">
//                 {totalusers.length > 0 ? (
//                   totalusers.map((user, index) => (
//                     <tr key={user._id} className="hover:bg-slate-50 transition-colors duration-300">
//                       {/* Number */}
//                       <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-center">
//                         {index + 1}
//                       </td>

//                       {/* Student Details */}
//                       <td className="px-3 py-4">
//                         <div className="flex flex-col">
//                           <h3 className="text-sm font-medium text-slate-900 break-words">
//                             {user.name}
//                           </h3>
//                           <p className="text-sm text-slate-600 mt-1">{user.email}</p>
//                           <p className="text-sm text-slate-600 mt-1">{user.phone || 'No phone'}</p>
//                         </div>
//                       </td>

//                       {/* Enrolled Courses */}
//                       <td className="px-3 py-4">
//                         <div className="max-w-xs">
//                           {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
//                             <>
//                               {user.enrolledCourses.length <= 2 && !expandedRows[user._id] ? (
//                                 <div className="space-y-2">
//                                   {user.enrolledCourses.map((course) => (
//                                     <div
//                                       key={course._id}
//                                       className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
//                                     >
//                                       <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
//                                       <span className="text-sm text-slate-800 flex-grow truncate">
//                                         {course.title}
//                                       </span>
//                                       <button
//                                         onClick={() => removeHandler(user._id, course._id)}
//                                         className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
//                                       >
//                                         <Trash2 size={16} />
//                                       </button>
//                                     </div>
//                                   ))}

//                                   <button
//                                     onClick={() => {
//                                       setIsAssignModalOpen(true);
//                                       setUserId(user._id);
//                                       setUserName(user.name);
//                                     }}
//                                     className="mt-2 inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md text-xs hover:bg-indigo-500/10 transition-all"
//                                   >
//                                     <Plus size={14} className="mr-1" /> Assign Course
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <>
//                                   {user.enrolledCourses.length > 2 && !expandedRows[user._id] ? (
//                                     <div>
//                                       <div className="space-y-2">
//                                         {user.enrolledCourses.slice(0, 2).map((course) => (
//                                           <div
//                                             key={course._id}
//                                             className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
//                                           >
//                                             <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
//                                             <span className="text-sm text-slate-800 flex-grow truncate">
//                                               {course.title}
//                                             </span>
//                                             <button
//                                               onClick={() => removeHandler(user._id, course._id)}
//                                               className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
//                                             >
//                                               <Trash2 size={16} />
//                                             </button>
//                                           </div>
//                                         ))}
//                                       </div>

//                                       <button
//                                         onClick={() => toggleRowExpand(user._id)}
//                                         className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 flex items-center transition-all hover:pl-1"
//                                       >
//                                         <ChevronDown size={16} className="mr-1 transition-transform duration-300 transform hover:translate-y-1" />
//                                         See all {user.enrolledCourses.length} courses
//                                       </button>
//                                     </div>
//                                   ) : (
//                                     expandedRows[user._id] && (
//                                       <div className="animate-slideDown">
//                                         <div className="max-h-40 overflow-y-auto pr-1">
//                                           <div className="space-y-2">
//                                             {user.enrolledCourses.map((course) => (
//                                               <div
//                                                 key={course._id}
//                                                 className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
//                                               >
//                                                 <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
//                                                 <span className="text-sm text-slate-800 flex-grow truncate">
//                                                   {course.title}
//                                                 </span>
//                                                 <button
//                                                   onClick={() => removeHandler(user._id, course._id)}
//                                                   className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
//                                                 >
//                                                   <Trash2 size={16} />
//                                                 </button>
//                                               </div>
//                                             ))}
//                                           </div>
//                                         </div>

//                                         <button
//                                           onClick={() => {
//                                             setIsAssignModalOpen(true);
//                                             setUserId(user._id);
//                                             setUserName(user.name);
//                                           }}
//                                           className="mt-2 inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md text-xs hover:bg-indigo-500/10 transition-all"
//                                         >
//                                           <Plus size={14} className="mr-1" /> Assign Course
//                                         </button>

//                                         <button
//                                           onClick={() => toggleRowExpand(user._id)}
//                                           className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 ml-2 flex items-center transition-all hover:pl-1"
//                                         >
//                                           <ChevronUp size={16} className="mr-1 transition-transform duration-300 transform hover:-translate-y-1" />
//                                           Show less
//                                         </button>
//                                       </div>
//                                     )
//                                   )}
//                                 </>
//                               )}
//                             </>
//                           ) : (
//                             <div className="flex items-center text-sm text-slate-500 py-2">
//                               <span className="w-6 h-6 mr-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
//                                 <CircleDashed size={14} />
//                               </span>
//                               No courses enrolled

//                               <button
//                                 onClick={() => {
//                                   setIsAssignModalOpen(true);
//                                   setUserId(user._id);
//                                   setUserName(user.name);
//                                 }}
//                                 className="ml-3 inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md text-xs hover:bg-indigo-500/10 transition-all"
//                               >
//                                 <Plus size={14} className="mr-1" /> Assign Course
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </td>

//                       {/* Additional Info */}
//                       <td className="px-3 py-4 whitespace-normal hidden lg:table-cell">
//                         <div className="max-w-md">
//                           <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
//                             {[
//                               { label: 'Gender', value: user.gender },
//                               { label: 'Occupation', value: user.occupation },
//                               { label: 'Education', value: user.education }
//                             ].map(({ label, value }) => (
//                               <React.Fragment key={label}>
//                                 <span className="text-slate-500">{label}:</span>
//                                 <span className="text-slate-800">{value || 'N/A'}</span>
//                               </React.Fragment>
//                             ))}
//                           </div>
//                           <div className="mt-2">
//                             <span className="text-slate-500">Address:</span>
//                             <p className="text-sm text-slate-800 break-words line-clamp-2">
//                               {user.address || 'N/A'}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Status */}
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <button
//                           onClick={() => changeStatus(user._id, !user.isActive)}
//                           className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${user.isActive
//                             ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
//                             : 'bg-red-100 text-red-800 hover:bg-red-200'
//                             }`}
//                         >
//                           {user.isActive ? <Check size={14} className="mr-1" /> : <X size={14} className="mr-1" />}
//                           {user.isActive ? 'Active' : 'Inactive'}
//                         </button>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-3 py-4 whitespace-nowrap">
//                         <div className="flex items-center justify-center space-x-3">
//                           <button
//                             onClick={() => {
//                               editUser(user);
//                             }}
//                             className="text-indigo-600 hover:text-indigo-700 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
//                             title="Edit student"
//                           >
//                             <Edit size={20} />
//                           </button>
//                           <button
//                             onClick={() => deleteUser(user._id)}
//                             className="text-red-600 hover:text-red-700 transition-all duration-300 transform hover:scale-110 hover:-rotate-6"
//                             title="Delete student"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="px-3 py-12 text-center text-slate-500">
//                       <FileX size={48} className="mx-auto mb-4 text-slate-300" />
//                       <p>No students registered yet.</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add User Modal */}
//       {showAddUserModal && (
//         <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
//           <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
//               <h2 className="text-2xl font-bold text-slate-800">New User Registration</h2>
//               <button
//                 className="text-slate-500 cursor-pointer hover:text-slate-700 transition"
//                 onClick={() => setShowAddUserModal(false)}
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
//             <form onSubmit={handleAddUser} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
//                   <input
//                     id="name"
//                     name="name"
//                     value={newUser.name}
//                     onChange={handleNewUserChange}
//                     required
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={newUser.email}
//                     onChange={handleNewUserChange}
//                     required
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     value={newUser.password}
//                     onChange={handleNewUserChange}
//                     required
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="education" className="block text-sm font-medium text-slate-700">Education</label>
//                   <input
//                     id="education"
//                     name="education"
//                     value={newUser.education}
//                     onChange={handleNewUserChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Gender</label>
//                   <select
//                     id="gender"
//                     name="gender"
//                     value={newUser.gender}
//                     onChange={handleNewUserChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
//                   <input
//                     id="address"
//                     name="address"
//                     value={newUser.address}
//                     onChange={handleNewUserChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Contact Number</label>
//                   <input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={newUser.phone}
//                     onChange={handleNewUserChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="occupation" className="block text-sm font-medium text-slate-700">Occupation</label>
//                   <input
//                     id="occupation"
//                     name="occupation"
//                     value={newUser.occupation}
//                     onChange={handleNewUserChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               {/* No direct course assignment on user creation in this form for simplicity */}
//               {/* If you want to assign a course right away, copy the select field from Assign Course modal */}

//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="mt-4 cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
//                 >
//                   Register User
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal */}
//       {showEditModal && editUserDetails._id && (
//         <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
//           <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
//               <h2 className="text-2xl font-bold text-slate-800">Edit User Information</h2>
//               <button
//                 className="text-slate-500 hover:text-slate-700 cursor-pointer transition"
//                 onClick={() => setShowEditModal(false)}
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
//             <form onSubmit={handleEditUser} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="edit_name" className="block text-sm font-medium text-slate-700">Name</label>
//                   <input
//                     id="edit_name"
//                     name="name"
//                     value={editUserDetails.name}
//                     onChange={handleEditChange}
//                     required
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="edit_email" className="block text-sm font-medium text-slate-700">Email</label>
//                   <input
//                     id="edit_email"
//                     name="email"
//                     type="email"
//                     value={editUserDetails.email}
//                     onChange={handleEditChange}
//                     required
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="edit_password" className="block text-sm font-medium text-slate-700">Password (leave blank to keep current)</label>
//                   <input
//                     id="edit_password"
//                     name="password"
//                     type="password"
//                     value={editUserDetails.password}
//                     onChange={handleEditChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="edit_gender" className="block text-sm font-medium text-slate-700">Gender</label>
//                   <select
//                     id="edit_gender"
//                     name="gender"
//                     value={editUserDetails.gender}
//                     onChange={handleEditChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="edit_address" className="block text-sm font-medium text-slate-700">Address</label>
//                   <input
//                     id="edit_address"
//                     name="address"
//                     value={editUserDetails.address}
//                     onChange={handleEditChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="edit_phone" className="block text-sm font-medium text-slate-700">Contact Number</label>
//                   <input
//                     id="edit_phone"
//                     name="phone"
//                     type="tel"
//                     value={editUserDetails.phone}
//                     onChange={handleEditChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="edit_education" className="block text-sm font-medium text-slate-700">Education</label>
//                   <input
//                     id="edit_education"
//                     name="education"
//                     value={editUserDetails.education}
//                     onChange={handleEditChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="edit_occupation" className="block text-sm font-medium text-slate-700">Occupation</label>
//                   <input
//                     id="edit_occupation"
//                     name="occupation"
//                     value={editUserDetails.occupation}
//                     onChange={handleEditChange}
//                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className="mt-4 cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Assign Course to User Modal */}
//       {isAssignModalOpen && (
//         <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
//           <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
//               <h2 className="text-2xl font-bold text-slate-800">Assign Course to User</h2>
//               <button
//                 className="text-slate-500 hover:text-slate-700 transition cursor-pointer"
//                 onClick={() => setIsAssignModalOpen(false)}
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

//             {/* User Input */}
//             <div className="mb-4">
//               <label htmlFor="assign_userName" className="block text-sm font-medium text-slate-700">User</label>
//               <input
//                 id="assign_userName"
//                 type="text"
//                 value={userName}
//                 disabled
//                 className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm bg-slate-100 text-slate-700 cursor-not-allowed"
//               />
//             </div>

//             {/* Select Course */}
//             <div className="mb-4">
//               <label htmlFor="assign_courseSelection" className="block text-sm font-medium text-slate-700">Select Course</label>
//               <select
//                 id="assign_courseSelection"
//                 value={selectedCourse}
//                 onChange={(e) => setSelectedCourse(e.target.value)}
//                 className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
//               >
//                 <option value="">Choose a course</option>
//                 {course.map((crs) => (
//                   <option key={crs._id} value={crs._id}>{crs.title}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={() => setIsAssignModalOpen(false)}
//                 className="py-2 px-4 bg-slate-700 text-white cursor-pointer rounded-md hover:bg-slate-800 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAssignCourse}
//                 className="py-2 px-4 bg-indigo-600 text-white cursor-pointer rounded-md hover:bg-indigo-700 transition-colors"
//               >
//                 Assign Course
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Students;


import React, { useContext, useState } from "react"; // Removed useEffect as it was unused locally
import { AlertContext } from "../../Context/AlertContext";
import axios from "axios";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";
import { ChevronDown, ChevronUp, Edit, Trash2, Check, X, Plus, FileX, CircleDashed } from 'lucide-react';

function Students() {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL, course, totalusers, fetchUsers, setTotalUsers } = useContext(ProjectContext);

  const admintoken = localStorage.getItem("admintoken");

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Renamed for clarity
  const [showAddUserModal, setShowAddUserModal] = useState(false); // Renamed for clarity
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "", // Standardized to 'phone'
    gender: "",
    address: "",
    education: "", // Standardized to 'education'
    occupation: "",
    enrolledCourses: [], // This will be handled by the assign course logic
  });

  const [editUserDetails, setEditUserDetails] = useState({
    _id: null,
    name: "",
    email: "",
    password: "", // Leave blank for security
    phone: "",
    gender: "",
    address: "",
    education: "",
    occupation: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // For expanding table rows in desktop view
  const [expandedRows, setExpandedRows] = useState({});

  // Handle Input Change for New User form
  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Add New User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE_URL + API_URL + USER_BASE_URL + "/register", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${admintoken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.phone,
          address: newUser.address,
          education: newUser.education,
          occupation: newUser.occupation,
          gender: newUser.gender,
          // enrolledCourses handled separately if assigned immediately after registration
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowAddUserModal(false);
        setNewUser({ // Reset form
          name: "", email: "", password: "", phone: "", gender: "",
          address: "", education: "", occupation: "", enrolledCourses: []
        });
        fetchUsers();
        Toast.fire({ icon: "success", title: "User registered successfully!" });
      } else {
        Toast.fire({ icon: "error", title: "Failed to register user", text: data.msg });
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: "Failed to register user", text: error.message || "An unexpected error occurred." });
    }
  };

  // Change User Status (Active/Inactive)
  const changeStatus = async (userId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/updateStatus/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${admintoken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isActive: status }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.fire({ icon: "success", title: "User status updated successfully!" });
        setTotalUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, isActive: status } : user))
        );
      } else {
        Toast.fire({ icon: "error", title: "Failed to update status", text: data.msg });
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: "Failed to update status", text: error.message });
    }
  };

  // Delete User
  const deleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5", // indigo-600
      cancelButtonColor: "#DC2626", // red-600
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/delete/${userId}`,
            { headers: { "Authorization": `Bearer ${admintoken}` } }
          );

          if (response.status === 200) {
            Toast.fire({ icon: "success", title: "User deleted successfully!" });
            fetchUsers();
          } else {
            Toast.fire({ icon: "error", title: "Failed to delete user" });
          }
        } catch (error) {
          Toast.fire({
            icon: "error", title: "Failed to delete user",
            text: error.response?.data?.message || error.message
          });
        }
      }
    });
  };

  // Populate Edit User Modal
  const editUser = (user) => {
    setEditUserDetails({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "", // Ensure it's never undefined
      gender: user.gender || "",
      address: user.address || "",
      education: user.education || "",
      occupation: user.occupation || "",
      password: "", // Always keep password empty for editing
    });
    setShowEditModal(true);
  };

  // Handle input change for Edit User form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated user details
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editUserDetails };
      if (payload.password === "") { // Don't send empty password field if user didn't change it
        delete payload.password;
      }

      const response = await fetch(
        `${API_BASE_URL}${API_URL}${USER_BASE_URL}/edit/${editUserDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${admintoken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Toast.fire({ icon: "success", title: "User updated successfully!" });
        fetchUsers();
        setShowEditModal(false);
      } else {
        Toast.fire({ icon: "error", title: "Failed to update user", text: data.msg || response.statusText });
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: "Error updating user", text: error.message || "Something went wrong" });
    }
  };

  // Assign Course to User
  const handleAssignCourse = async () => {
    if (!userId || !selectedCourse) {
      Toast.fire({ icon: "error", title: "Please select a user and a course!" });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/assign-course`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${admintoken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userId,
          courseId: selectedCourse
        })
      });

      const data = await response.json();

      if (response.ok) {
        Toast.fire({ icon: "success", title: "Course assigned successfully!" });
        fetchUsers();
        setIsAssignModalOpen(false);
        setSelectedCourse(""); // Clear selected course
      } else {
        Toast.fire({ icon: "error", title: data.msg || "Failed to assign course" });
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: "Something went wrong while assigning course!" });
    }
  };

  // Remove Course from User
  const removeHandler = async (userId, courseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will unassign the course from the student.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#DC2626",
      confirmButtonText: "Yes, remove it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}${API_URL}${USER_BASE_URL}/remove-student/${courseId}/${userId}`,
            {},
            { headers: { Authorization: `Bearer ${admintoken}` } }
          );

          if (response.status === 200) {
            Toast.fire({ icon: "success", title: "Course unassigned successfully!" });
            fetchUsers();
          } else {
            Toast.fire({ icon: "error", title: "Failed to unassign course" });
          }
        } catch (error) {
          Toast.fire({
            icon: "error", title: "Failed to unassign course",
            text: error.response?.data?.message || error.message,
          });
        }
      }
    });
  };

  // Toggle expanded state for a user in the table
  const toggleRowExpand = (userId) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <>
      {/* Main Component */}
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            All Students ({totalusers.length})
          </h2>

          <div
            onClick={() => setShowAddUserModal(true)}
            className="px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full flex items-center gap-2 transform hover:scale-105 shadow-md cursor-pointer"
          >
            <Plus size={18} />
            Add Student
          </div>
        </div>

        {/* Student List/Table */}
        <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Mobile View (< 768px) - Card-based layout */}
          <div className="md:hidden">
            {totalusers.length > 0 ? (
              totalusers.map((user, index) => (
                <div key={user._id} className="border-b border-slate-200 p-4 hover:bg-slate-50 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-slate-900 break-words pr-2">{user.name}</h3>
                        <button
                          onClick={() => toggleRowExpand(user._id)}
                          className="p-1 rounded-full text-slate-500 hover:bg-slate-100 flex-shrink-0 mt-1"
                        >
                          {expandedRows[user._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{user.email}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  {expandedRows[user._id] && (
                    <div className="mt-3 pl-2 animate-fadeIn overflow-hidden">
                      <div className="bg-slate-50 bg-opacity-70 p-3 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {[
                            { label: 'Phone', value: user.phone },
                            { label: 'Gender', value: user.gender },
                            { label: 'Occupation', value: user.occupation },
                            { label: 'Education', value: user.education }
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <p className="text-xs text-slate-500">{label}:</p>
                              <p className="text-sm text-slate-700">{value || 'N/A'}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mb-2">
                          <p className="text-xs text-slate-500">Address:</p>
                          <p className="text-sm text-slate-700 break-words">{user.address || 'N/A'}</p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 mb-1">Enrolled Courses:</p>
                          {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <div className="space-y-1">
                              {user.enrolledCourses.map((course) => (
                                <div
                                  key={course._id}
                                  className="flex items-center gap-2 border rounded-lg px-2 py-1 text-sm shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
                                >
                                  <span className="flex-grow truncate text-slate-700">{course.title}</span>
                                  <button
                                    onClick={() => removeHandler(user._id, course._id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <CircleDashed size={16} className="text-slate-400" /> No courses enrolled
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2 mt-3 flex-wrap">
                        <button
                          onClick={() => {
                            setIsAssignModalOpen(true);
                            setUserId(user._id);
                            setUserName(user.name);
                          }}
                          className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-200 transition-all hover:shadow-md"
                        >
                          <Plus size={16} />
                          Assign Course
                        </button>

                        <button
                          onClick={() => changeStatus(user._id, !user.isActive)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all hover:shadow-md ${user.isActive
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                        >
                          {user.isActive ? <Check size={16} /> : <X size={16} />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>

                        <button
                          onClick={() => {
                            editUser(user);
                          }}
                          className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-sm hover:bg-slate-200 transition-all hover:shadow-md"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteUser(user._id)}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-all hover:shadow-md"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileX size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">No students registered yet.</p>
              </div>
            )}
          </div>

          {/* Tablet and Desktop View (≥ 768px) - Table layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-12 border-b-2 border-indigo-600">#</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider border-b-2 border-indigo-600">Student Details</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider border-b-2 border-indigo-600">Enrolled Courses</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-indigo-600">Additional Info</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Status</th>
                  <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider w-24 border-b-2 border-indigo-600">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {totalusers.length > 0 ? (
                  totalusers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors duration-300">
                      {/* Number */}
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 text-center">
                        {index + 1}
                      </td>

                      {/* Student Details */}
                      <td className="px-3 py-4">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-medium text-slate-900 break-words">
                            {user.name}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">{user.email}</p>
                          <p className="text-sm text-slate-600 mt-1">{user.phone || 'No phone'}</p>
                        </div>
                      </td>

                      {/* Enrolled Courses */}
                      <td className="px-3 py-4">
                        <div className="max-w-xs">
                          {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <>
                              {user.enrolledCourses.length <= 2 && !expandedRows[user._id] ? (
                                <div className="space-y-2">
                                  {user.enrolledCourses.map((course) => (
                                    <div
                                      key={course._id}
                                      className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
                                    >
                                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                                      <span className="text-sm text-slate-800 flex-grow truncate">
                                        {course.title}
                                      </span>
                                      <button
                                        onClick={() => removeHandler(user._id, course._id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  ))}

                                  <button
                                    onClick={() => {
                                      setIsAssignModalOpen(true);
                                      setUserId(user._id);
                                      setUserName(user.name);
                                    }}
                                    className="mt-2 inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md text-xs hover:bg-indigo-500/10 transition-all"
                                  >
                                    <Plus size={14} className="mr-1" /> Assign Course
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {user.enrolledCourses.length > 2 && !expandedRows[user._id] ? (
                                    <div>
                                      <div className="space-y-2">
                                        {user.enrolledCourses.slice(0, 2).map((course) => (
                                          <div
                                            key={course._id}
                                            className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
                                          >
                                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-sm text-slate-800 flex-grow truncate">
                                              {course.title}
                                            </span>
                                            <button
                                              onClick={() => removeHandler(user._id, course._id)}
                                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>

                                      <button
                                        onClick={() => toggleRowExpand(user._id)}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 flex items-center transition-all hover:pl-1"
                                      >
                                        <ChevronDown size={16} className="mr-1 transition-transform duration-300 transform hover:translate-y-1" />
                                        See all {user.enrolledCourses.length} courses
                                      </button>
                                    </div>
                                  ) : (
                                    expandedRows[user._id] && (
                                      <div className="animate-slideDown">
                                        <div className="max-h-40 overflow-y-auto pr-1">
                                          <div className="space-y-2">
                                            {user.enrolledCourses.map((course) => (
                                              <div
                                                key={course._id}
                                                className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-emerald-500 group hover:bg-slate-100 transition-all"
                                              >
                                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <span className="text-sm text-slate-800 flex-grow truncate">
                                                  {course.title}
                                                </span>
                                                <button
                                                  onClick={() => removeHandler(user._id, course._id)}
                                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 p-1 rounded-full"
                                                >
                                                  <Trash2 size={16} />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => {
                                            setIsAssignModalOpen(true);
                                            setUserId(user._id);
                                            setUserName(user.name);
                                          }}
                                          className="mt-2 inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md text-xs hover:bg-indigo-500/10 transition-all"
                                        >
                                          <Plus size={14} className="mr-1" /> Assign Course
                                        </button>

                                        <button
                                          onClick={() => toggleRowExpand(user._id)}
                                          className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 ml-2 flex items-center transition-all hover:pl-1"
                                        >
                                          <ChevronUp size={16} className="mr-1 transition-transform duration-300 transform hover:-translate-y-1" />
                                          Show less
                                        </button>
                                      </div>
                                    )
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center text-sm text-slate-500 py-2">
                              <span className="w-6 h-6 mr-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <CircleDashed size={14} />
                              </span>
                              No courses enrolled

                              <button
                                onClick={() => {
                                  setIsAssignModalOpen(true);
                                  setUserId(user._id);
                                  setUserName(user.name);
                                }}
                                className="ml-3 inline-flex items-center px-3 py-1 border border-indigo-500 text-indigo-600 rounded-md text-xs hover:bg-indigo-500/10 transition-all"
                              >
                                <Plus size={14} className="mr-1" /> Assign Course
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Additional Info */}
                      <td className="px-3 py-4 whitespace-normal hidden lg:table-cell">
                        <div className="max-w-md">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            {[
                              { label: 'Gender', value: user.gender },
                              { label: 'Occupation', value: user.occupation },
                              { label: 'Education', value: user.education }
                            ].map(({ label, value }) => (
                              <React.Fragment key={label}>
                                <span className="text-slate-500">{label}:</span>
                                <span className="text-slate-800">{value || 'N/A'}</span>
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="mt-2">
                            <span className="text-slate-500">Address:</span>
                            <p className="text-sm text-slate-800 break-words line-clamp-2">
                              {user.address || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <button
                          onClick={() => changeStatus(user._id, !user.isActive)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${user.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                        >
                          {user.isActive ? <Check size={14} className="mr-1" /> : <X size={14} className="mr-1" />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => {
                              editUser(user);
                            }}
                            className="text-indigo-600 hover:text-indigo-700 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                            title="Edit student"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:text-red-700 transition-all duration-300 transform hover:scale-110 hover:-rotate-6"
                            title="Delete student"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-3 py-12 text-center text-slate-500">
                      <FileX size={48} className="mx-auto mb-4 text-slate-300" />
                      <p>No students registered yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">New User Registration</h2>
              <button
                className="text-slate-500 cursor-pointer hover:text-slate-700 transition"
                onClick={() => setShowAddUserModal(false)}
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
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    required
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    required
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    required
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-slate-700">Education</label>
                  <input
                    id="education"
                    name="education"
                    value={newUser.education}
                    onChange={handleNewUserChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={newUser.gender}
                    onChange={handleNewUserChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                  <input
                    id="address"
                    name="address"
                    value={newUser.address}
                    onChange={handleNewUserChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Contact Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={newUser.phone}
                    onChange={handleNewUserChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-slate-700">Occupation</label>
                  <input
                    id="occupation"
                    name="occupation"
                    value={newUser.occupation}
                    onChange={handleNewUserChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* No direct course assignment on user creation in this form for simplicity */}
              {/* If you want to assign a course right away, copy the select field from Assign Course modal */}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editUserDetails._id && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Edit User Information</h2>
              <button
                className="text-slate-500 hover:text-slate-700 cursor-pointer transition"
                onClick={() => setShowEditModal(false)}
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
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_name" className="block text-sm font-medium text-slate-700">Name</label>
                  <input
                    id="edit_name"
                    name="name"
                    value={editUserDetails.name}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="edit_email" className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="edit_email"
                    name="email"
                    type="email"
                    value={editUserDetails.email}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_password" className="block text-sm font-medium text-slate-700">Password (leave blank to keep current)</label>
                  <input
                    id="edit_password"
                    name="password"
                    type="password"
                    value={editUserDetails.password}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="edit_gender" className="block text-sm font-medium text-slate-700">Gender</label>
                  <select
                    id="edit_gender"
                    name="gender"
                    value={editUserDetails.gender}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_address" className="block text-sm font-medium text-slate-700">Address</label>
                  <input
                    id="edit_address"
                    name="address"
                    value={editUserDetails.address}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="edit_phone" className="block text-sm font-medium text-slate-700">Contact Number</label>
                  <input
                    id="edit_phone"
                    name="phone"
                    type="tel"
                    value={editUserDetails.phone}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_education" className="block text-sm font-medium text-slate-700">Education</label>
                  <input
                    id="edit_education"
                    name="education"
                    value={editUserDetails.education}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label htmlFor="edit_occupation" className="block text-sm font-medium text-slate-700">Occupation</label>
                  <input
                    id="edit_occupation"
                    name="occupation"
                    value={editUserDetails.occupation}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Course to User Modal */}
      {isAssignModalOpen && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Assign Course to User</h2>
              <button
                className="text-slate-500 hover:text-slate-700 transition cursor-pointer"
                onClick={() => setIsAssignModalOpen(false)}
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

            {/* User Input */}
            <div className="mb-4">
              <label htmlFor="assign_userName" className="block text-sm font-medium text-slate-700">User</label>
              <input
                id="assign_userName"
                type="text"
                value={userName}
                disabled
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm bg-slate-100 text-slate-700 cursor-not-allowed"
              />
            </div>

            {/* Select Course */}
            <div className="mb-4">
              <label htmlFor="assign_courseSelection" className="block text-sm font-medium text-slate-700">Select Course</label>
              <select
                id="assign_courseSelection"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-800"
              >
                <option value="">Choose a course</option>
                {course.map((crs) => (
                  <option key={crs._id} value={crs._id}>{crs.title}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="py-2 px-4 bg-slate-700 text-white cursor-pointer rounded-md hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCourse}
                className="py-2 px-4 bg-indigo-600 text-white cursor-pointer rounded-md hover:bg-indigo-700 transition-colors"
              >
                Assign Course
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Students;
