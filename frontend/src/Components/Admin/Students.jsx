
import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import axios from "axios";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";
import { ChevronDown, ChevronUp, Edit, Trash2, Check, X, Plus } from 'lucide-react';

function Students() {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL, course, totalusers, fetchUsers, setTotalUsers } = useContext(ProjectContext)
  const admintoken = localStorage.getItem("admintoken");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    gender: "",
    address: "",
    highestDegree: "",
    occupation: "",
    status: "Active",
    course: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
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
          phone: newUser.contactNumber,
          address: newUser.address,
          education: newUser.highestDegree,
          occupation: newUser.occupation,
          enrolledCourses: enrolledCourses,  // Add dateOfBirth field if required
          gender: newUser.gender,

        }),
      });

      const data = await response.json();
      setNewUser({
        name: "",
        email: "",
        password: "",
        contactNumber: "",
        address: "",
        highestDegree: "",
        occupation: "",
        course: "",
        gender: "",
      });
      if (response.ok) {
        setShowModal(false);
        fetchUsers(); // This should be enough
        Toast.fire({ icon: "success", title: "User registered successfully!" });
        setUsers([...users, newUser]); // Add user to local stat
      } else {
        Toast.fire({ icon: "error", title: "Failed to register user", text: data.msg });

      }
    } catch (error) {
      Toast.fire({ icon: "error", title: "Failed to register user", text: error });
    }
  };

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

  const deleteUser = async (userId) => {
    try {
      console.log(userId, "userId");

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
            const response = await axios.delete(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/delete/${userId}`,
              {
                headers: {
                  "Authorization": `Bearer ${admintoken}`,
                  "Content-Type": "application/json"
                }
              }
            );

            if (response.status === 200) {
              Toast.fire({ icon: "success", title: "User deleted successfully!" });
              fetchUsers(); // ✅ Refresh user list after deletion
            } else {
              Toast.fire({ icon: "error", title: "Failed to delete user" });
            }

          } catch (error) {
            Toast.fire({
              icon: "error",
              title: "Failed to delete user",
              text: error.response?.data?.message || error.message
            });
          }
        }
      });

    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to delete user",
        text: error.message
      });
    }
  };


  const [editUserDetails, setEditUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    contactNumber: "",
    occupation: "",
    highestDegree: "",

  });
  const [showEditModal, setShowEditModal] = useState(false);

  const editUser = (user) => {
    setEditUserDetails(user);
    setShowEditModal(true);
  };

  // Handle input change dynamically
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated user details
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_URL}${USER_BASE_URL}/edit/${editUserDetails._id}`, // Corrected URL
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${admintoken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(editUserDetails),
        }
      );

      if (response.ok) {
        Swal.fire("Success", "User updated successfully!", "success");
        fetchUsers(); // Refresh users
        setShowEditModal(false); // Close modal
      } else {
        // Handle response errors properly
        console.error("Failed to update user:", response.statusText);
        Swal.fire("Error", "Failed to update user", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };


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
        fetchUsers(); // ✅ Refresh user list after deletion

        setIsModalOpen(false);
      } else {
        Toast.fire({ icon: "error", title: data.msg || "Failed to assign course" });
      }
    } catch (error) {
      console.error("Error assigning course:", error);
      Toast.fire({ icon: "error", title: "Something went wrong!" });
    }
  };


  const [expandedRows, setExpandedRows] = useState({});

  // Toggle expanded state for a user
  const toggleRowExpand = (userId) => {
    setExpandedRows(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const removeHandler = async (userId, courseId) => {
    
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // 🔹 Perform delete request
            const response = await axios.post(
              `${API_BASE_URL}${API_URL}${USER_BASE_URL}/remove-student/${courseId}/${userId}`,
              {}, // POST requests typically require a body, but here it's empty
              {
                headers: {
                  Authorization: `Bearer ${admintoken}`,
                  "Content-Type": "application/json",
                },
              }
            );
          
            if (response.status === 200) {
              Toast.fire({ icon: "success", title: "User deleted successfully!" });
              fetchUsers(); // ✅ Refresh user list after deletion
            } else {
              Toast.fire({ icon: "error", title: "Failed to delete user" });
            }
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: "Failed to delete user",
              text: error.response?.data?.message || error.message,
            });
          }
          
        }
      });
    } catch (error) {
      console.log(error)
    }



  };
  return (
    <>
      {/* main Components */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-7xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#2c3e50]">All Users</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-white bg-[#4ecdc4] hover:bg-[#45b7aa] transition duration-300 rounded-3xl shadow-md hover:shadow-lg"
            >
              Add User
            </button>
          </div>

          <div className="w-full rounded-lg shadow-md border border-[#e0e0e0] overflow-hidden">
            {/* Mobile View (< 768px) - Card-based layout */}
            <div className="md:hidden">
              {totalusers?.map((user, index) => (
                <div
                  key={index}
                  className="border-b border-[#e0e0e0] p-4 hover:bg-[#f0f6f6] transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-[#2c3e50]">{user.name}</h3>
                      <p className="text-sm text-[#7f8c8d]">{user.email}</p>
                    </div>
                    <button
                      onClick={() => toggleRowExpand(user._id)}
                      className="p-1 cursor-pointer rounded-full hover:bg-[#4ecdc4]/10"
                    >
                      {expandedRows[user._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {expandedRows[user._id] && (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Contact', value: user.phone },
                          { label: 'Gender', value: user.gender },
                          { label: 'Occupation', value: user.occupation },
                          { label: 'Education', value: user.education }
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[#7f8c8d]">{label}:</p>
                            <p>{value || 'N/A'}</p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <p className="text-[#7f8c8d]">Address:</p>
                        <p className="break-words">{user.address || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-[#7f8c8d]">Enrolled Courses:</p>
                        {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                          <ul className="list-disc pl-5 mt-1">
                            {user.enrolledCourses.map((course) => (
                              <div key={course._id} className="flex gap-5 items-center">
                                <li className="break-words">{course.title}</li>
                                <Trash2
                                  onClick={() => removeHandler(user._id, course._id)}
                                  size={18}
                                  className="text-[#ff6b6b] cursor-pointer hover:text-red-700"
                                />
                              </div>
                            ))}
                          </ul>
                        ) : (
                          <p>No courses enrolled</p>
                        )}
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                            setUserId(user._id);
                            setUserName(user.name);
                          }}
                          className="flex cursor-pointer items-center gap-1 bg-[#4ecdc4] text-white  rounded-lg 
          hover:bg-[#45b7aa] px-3 py-1.5 text-sm h transition-colors"
                        >
                          <Plus size={16} />
                          Assign Course
                        </button>

                        <button
                          onClick={() => changeStatus(user._id, !user.isActive)}
                          className={`flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${user.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                        >
                          {user.isActive ? <Check size={16} /> : <X size={16} />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>

                        <button
                          onClick={() => {
                            setShowEditModal(true);
                            editUser(user);
                          }}
                          className="flex cursor-pointer items-center gap-1 bg-[#f0f6f6] text-[#2c3e50] px-3 py-1.5 rounded-md text-sm hover:bg-[#e0f4f4] transition-colors"
                        >
                          <Edit size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteUser(user._id)}
                          className="flex cursor-pointer items-center gap-1 bg-[#ff6b6b]/10 text-[#ff6b6b] px-3 py-1.5 rounded-md text-sm hover:bg-[#ff6b6b]/20 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View (≥ 768px) - Traditional table layout */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e0e0e0]">
                  <thead className="bg-[#f0f6f6]">
                    <tr>
                      {[
                        '#', 'User', 'Courses', 'Details', 'Status', 'Actions'
                      ].map((header) => (
                        <th
                          key={header}
                          className={`px-6 py-3 text-left text-xs font-medium text-[#7f8c8d] uppercase tracking-wider 
                          ${header === 'Details' ? 'hidden lg:table-cell' : ''} 
                          ${header === 'Actions' ? 'text-right' : ''}`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-[#F0F6F6] divide-y divide-[#e0e0e0]">
                    {totalusers?.map((user, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#e0f4f4] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-[#7f8c8d]">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-[#2c3e50]">{user.name}</div>
                            <div className="text-sm text-[#7f8c8d]">{user.email}</div>
                            <div className="text-sm text-[#7f8c8d] md:hidden">{user.phone}</div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                              <div className="max-h-24 overflow-y-auto">
                                <ul className="list-disc pl-5 text-sm text-[#2c3e50]">
                                  {user.enrolledCourses.map((course) => (
                                    <div key={course._id} className="flex gap-5 items-center">
                                      <li className="break-words">{course.title}</li>
                                      <Trash2
                                        onClick={() => removeHandler(user._id, course._id)}
                                        size={18}
                                        className="text-[#ff6b6b] cursor-pointer hover:text-red-700"
                                      />
                                    </div>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <span className="text-sm text-[#7f8c8d]">No courses enrolled</span>
                            )}

                            <button
                              onClick={() => {
                                setIsModalOpen(true);
                                setUserId(user._id);
                                setUserName(user.name);
                              }}
                              className="mt-2 inline-flex border border-[#4ecdc4] text-[#4ecdc4] rounded-md px-2 py-1 cursor-pointer items-center text-xs hover:bg-[#4ecdc4]/10"
                            >
                              <Plus size={14} className="mr-1" /> Assign Course
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-sm text-[#2c3e50] grid grid-cols-2 gap-x-4 gap-y-1">
                            {[
                              { label: 'Phone', value: user.phone },
                              { label: 'Gender', value: user.gender },
                              { label: 'Occupation', value: user.occupation },
                              { label: 'Education', value: user.education }
                            ].map(({ label, value }) => (
                              <React.Fragment key={label}>
                                <span className="text-[#7f8c8d]">{label}:</span>
                                <span>{value || 'N/A'}</span>
                              </React.Fragment>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => changeStatus(user._id, !user.isActive)}
                            className={`cursor-pointer inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {user.isActive ? <Check size={14} className="mr-1" /> : <X size={14} className="mr-1" />}
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setShowEditModal(true);
                                editUser(user);
                              }}
                              className="text-[#4ecdc4] cursor-pointer hover:text-[#45b7aa]"
                              title="Edit user"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-[#ff6b6b] cursor-pointer hover:text-red-700"
                              title="Delete user"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty state */}
            {(!totalusers || totalusers.length === 0) && (
              <div className="text-center py-12">
                <p className="text-[#7f8c8d]">No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* add user model */}
      {showModal && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-3xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">User Information Form</h2>
              <button
                className="text-[#4ecdc4] hover:text-[#45b7aa] transition"
                onClick={() => setShowModal(false)}
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
                  <label htmlFor="name" className="block text-sm font-medium text-[#2c3e50]">Name</label>
                  <input
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2c3e50]">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#2c3e50]">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="highestDegree" className="block text-sm font-medium text-[#2c3e50]">Degree</label>
                  <input
                    id="highestDegree"
                    name="highestDegree"
                    value={newUser.highestDegree}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-[#2c3e50]">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={newUser.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-[#2c3e50]">Address</label>
                  <input
                    id="address"
                    name="address"
                    value={newUser.address}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-[#2c3e50]">Contact Number</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={newUser.contactNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-[#2c3e50]">Occupation</label>
                  <input
                    id="occupation"
                    name="occupation"
                    value={newUser.occupation}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-[#2c3e50]">Select Course</label>
                <select
                  id="course"
                  name="course"
                  value={enrolledCourses}
                  onChange={(e) => setEnrolledCourses(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                >
                  <option value="">Choose a course</option>
                  {course.map((crs) => (
                    <option key={crs._id} value={crs._id}>{crs.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-[#4ecdc4] text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* edit model */}
      {showEditModal && editUserDetails && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-3xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Edit User Information</h2>
              <button
                className="text-[#4ecdc4] hover:text-[#45b7aa] transition"
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
                  <label htmlFor="name" className="block text-sm font-medium text-[#2c3e50]">Name</label>
                  <input
                    id="name"
                    name="name"
                    value={editUserDetails.name}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2c3e50]">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={editUserDetails.email}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#2c3e50]">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={editUserDetails.password}
                    onChange={handleEditChange}
                    required
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-[#2c3e50]">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={editUserDetails.gender}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
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
                  <label htmlFor="address" className="block text-sm font-medium text-[#2c3e50]">Address</label>
                  <input
                    id="address"
                    name="address"
                    value={editUserDetails.address}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-[#2c3e50]">Contact Number</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={editUserDetails.phone}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-[#2c3e50]">Education</label>
                  <input
                    id="education"
                    name="education"
                    value={editUserDetails.education}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-[#2c3e50]">Occupation</label>
                  <input
                    id="occupation"
                    name="occupation"
                    value={editUserDetails.occupation}
                    onChange={handleEditChange}
                    className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-[#4ecdc4] text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Assign Course to User */}
      {isModalOpen && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-3xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Assign Course to User</h2>
              <button
                className="text-[#4ecdc4] hover:text-[#45b7aa] transition"
                onClick={() => setIsModalOpen(false)}
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
              <label htmlFor="userName" className="block text-sm font-medium text-[#2c3e50]">User</label>
              <input
                id="userName"
                type="text"
                value={userName}
                disabled
                className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Select Course */}
            <div className="mb-4">
              <label htmlFor="courseSeletion" className="block text-sm font-medium text-[#2c3e50]">Select Course</label>
              <select
                id="courseSeletion"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4] sm:text-sm"
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
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-[#2c3e50] text-white rounded-md hover:bg-[#45b7aa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCourse}
                className="py-2 px-4 bg-[#4ecdc4] text-white rounded-md hover:bg-[#45b7aa] transition-colors"
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
