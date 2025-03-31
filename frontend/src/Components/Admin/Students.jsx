
import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import axios from "axios";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";
import { ChevronDown, ChevronUp, Edit, Trash2, Check, X, Plus, FileX } from 'lucide-react';

function Students() {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL, course, totalusers, fetchUsers, setTotalUsers  } = useContext(ProjectContext)


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
      <div className="min-h-screen bg-[#F0F6F6]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black relative">
            All Students ({totalusers.length})
          </h2>

          {/* Add Student Button */}
          <div
            onClick={() => setShowModal(true)}
            className="px-4 cursor-pointer py-2 text-white bg-[#4ecdc4] hover:bg-[#45b7aa] transition duration-300 rounded-3xl flex items-center gap-2 transform hover:scale-105"
          >
            <Plus size={18} />
            Add Student
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="w-full bg-[#F0F6F6] rounded-lg shadow-md">
          {/* Mobile View (< 768px) - Card-based layout */}
          <div className="md:hidden">
            {totalusers.length > 0 ? (
              totalusers.map((user, index) => (
                <div key={user._id} className="border-b border-gray-200 p-4 hover:bg-[#e0f4f4] transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 break-words pr-2">{user.name}</h3>
                        <button
                          onClick={() => toggleRowExpand(user._id)}
                          className="p-1 rounded-full hover:bg-[#e0f4f4] flex-shrink-0 mt-1"
                        >
                          {expandedRows[user._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  {expandedRows[user._id] && (
                    <div className="mt-3 pl-2 animate-fadeIn overflow-hidden">
                      <div className="bg-white bg-opacity-50 p-3 rounded-lg border-l-4 border-[#4ecdc4] shadow-sm">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {[
                            { label: 'Phone', value: user.phone },
                            { label: 'Gender', value: user.gender },
                            { label: 'Occupation', value: user.occupation },
                            { label: 'Education', value: user.education }
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <p className="text-xs text-gray-500">{label}:</p>
                              <p className="text-sm">{value || 'N/A'}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mb-2">
                          <p className="text-xs text-gray-500">Address:</p>
                          <p className="text-sm break-words">{user.address || 'N/A'}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Enrolled Courses:</p>
                          {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                            <div className="space-y-1">
                              {user.enrolledCourses.map((course) => (
                                <div
                                  key={course._id}
                                  className="flex items-center gap-2 border rounded-lg px-2 py-1 text-sm shadow-sm border-l-4 border-[#4ecdc4] group hover:bg-[#e0f4f4] transition-all"
                                >
                                  <span className="flex-grow truncate">{course.title}</span>
                                  <button
                                    onClick={() => removeHandler(user._id, course._id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No courses enrolled</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2 mt-3 flex-wrap">
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                            setUserId(user._id);
                            setUserName(user.name);
                          }}
                          className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md text-sm hover:bg-purple-200 transition-all hover:shadow-md"
                        >
                          <Plus size={16} />
                          Assign Course
                        </button>

                        <button
                          onClick={() => changeStatus(user._id, !user.isActive)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all hover:shadow-md ${user.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
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
                          className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm hover:bg-blue-200 transition-all hover:shadow-md"
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
                <FileX size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No students registered yet.</p>
              </div>
            )}
          </div>

          {/* Tablet and Desktop View (≥ 768px) - Table layout */}
          <div className="hidden md:block overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#e0f4f4]">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-12 border-b-2 border-[#4ecdc4]">#</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b-2 border-[#4ecdc4]">Student Details</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b-2 border-[#4ecdc4]">Enrolled Courses</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-[#4ecdc4]">Additional Info</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-24 border-b-2 border-[#4ecdc4]">Status</th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider w-24 border-b-2 border-[#4ecdc4]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[#F0F6F6] divide-y divide-gray-200">
                  {totalusers.length > 0 ? (
                    totalusers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-[#e0f4f4] transition-colors duration-300">
                        {/* Number */}
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {index + 1}
                        </td>

                        {/* Student Details */}
                        <td className="px-3 py-4">
                          <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-gray-900 break-words">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                            <p className="text-sm text-gray-500 mt-1">{user.phone || 'No phone'}</p>
                          </div>
                        </td>

                        {/* Enrolled Courses */}
                        <td className="px-3 py-4">
                          <div className="max-w-xs">
                            {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                              <>
                                {/* Display directly if 2 or fewer courses */}
                                {user.enrolledCourses.length <= 2 && !expandedRows[user._id] ? (
                                  <div className="space-y-2">
                                    {user.enrolledCourses.map((course) => (
                                      <div
                                        key={course._id}
                                        className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-[#4ecdc4] group hover:bg-[#e0f4f4] transition-all"
                                      >
                                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#4ecdc4]"></div>
                                        <span className="text-sm text-gray-800 flex-grow truncate">
                                          {course.title}
                                        </span>
                                        <button
                                          onClick={() => removeHandler(user._id, course._id)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    ))}

                                    <button
                                      onClick={() => {
                                        setIsModalOpen(true);
                                        setUserId(user._id);
                                        setUserName(user.name);
                                      }}
                                      className="mt-2 inline-flex items-center px-3 py-1 border border-[#4ecdc4] text-[#4ecdc4] rounded-md text-xs hover:bg-[#4ecdc4]/10 transition-all"
                                    >
                                      <Plus size={14} className="mr-1" /> Assign Course
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    {/* Show summary with See more option if more than 2 courses and not expanded */}
                                    {user.enrolledCourses.length > 2 && !expandedRows[user._id] ? (
                                      <div>
                                        <div className="space-y-2">
                                          {/* Show first 2 courses */}
                                          {user.enrolledCourses.slice(0, 2).map((course) => (
                                            <div
                                              key={course._id}
                                              className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-[#4ecdc4] group hover:bg-[#e0f4f4] transition-all"
                                            >
                                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#4ecdc4]"></div>
                                              <span className="text-sm text-gray-800 flex-grow truncate">
                                                {course.title}
                                              </span>
                                              <button
                                                onClick={() => removeHandler(user._id, course._id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                              >
                                                <Trash2 size={16} />
                                              </button>
                                            </div>
                                          ))}
                                        </div>

                                        <button
                                          onClick={() => toggleRowExpand(user._id)}
                                          className="text-xs text-[#4ecdc4] hover:text-[#45b7aa] mt-2 flex items-center transition-all hover:pl-1"
                                        >
                                          <ChevronDown size={16} className="mr-1 transition-transform duration-300 transform hover:translate-y-1" />
                                          See all {user.enrolledCourses.length} courses
                                        </button>
                                      </div>
                                    ) : (
                                      /* Expanded view showing all courses */
                                      expandedRows[user._id] && (
                                        <div className="animate-slideDown">
                                          <div className="max-h-40 overflow-y-auto pr-1">
                                            <div className="space-y-2">
                                              {user.enrolledCourses.map((course) => (
                                                <div
                                                  key={course._id}
                                                  className="flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm border-l-4 border-[#4ecdc4] group hover:bg-[#e0f4f4] transition-all"
                                                >
                                                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#4ecdc4]"></div>
                                                  <span className="text-sm text-gray-800 flex-grow truncate">
                                                    {course.title}
                                                  </span>
                                                  <button
                                                    onClick={() => removeHandler(user._id, course._id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                                  >
                                                    <Trash2 size={16} />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          <button
                                            onClick={() => {
                                              setIsModalOpen(true);
                                              setUserId(user._id);
                                              setUserName(user.name);
                                            }}
                                            className="mt-2 inline-flex items-center px-3 py-1 border border-[#4ecdc4] text-[#4ecdc4] rounded-md text-xs hover:bg-[#4ecdc4]/10 transition-all"
                                          >
                                            <Plus size={14} className="mr-1" /> Assign Course
                                          </button>

                                          <button
                                            onClick={() => toggleRowExpand(user._id)}
                                            className="text-xs text-[#4ecdc4] hover:text-[#45b7aa] mt-2 ml-2 flex items-center transition-all hover:pl-1"
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
                              <div className="flex items-center text-sm text-gray-500 py-2">
                                <span className="w-6 h-6 mr-2 rounded-full bg-gray-100 flex items-center justify-center">
                                  <X size={14} />
                                </span>
                                No courses enrolled

                                <button
                                  onClick={() => {
                                    setIsModalOpen(true);
                                    setUserId(user._id);
                                    setUserName(user.name);
                                  }}
                                  className="ml-3 inline-flex items-center px-3 py-1 border border-[#4ecdc4] text-[#4ecdc4] rounded-md text-xs hover:bg-[#4ecdc4]/10 transition-all"
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
                                  <span className="text-gray-500">{label}:</span>
                                  <span className="text-gray-800">{value || 'N/A'}</span>
                                </React.Fragment>
                              ))}
                            </div>
                            <div className="mt-2">
                              <span className="text-gray-500">Address:</span>
                              <p className="text-sm text-gray-800 break-words line-clamp-2">
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
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
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
                                setShowEditModal(true);
                                editUser(user);
                              }}
                              className="text-[#4ecdc4] hover:text-[#45b7aa] transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                              title="Edit student"
                            >
                              <Edit size={22} />
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-red-600 hover:text-red-800 transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
                              title="Delete student"
                            >
                              <Trash2 size={22} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-12 text-center text-gray-500">
                        <FileX size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No students registered yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* add user model */}
      {showModal && (
        <div className="fixed z-[500] inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="w-full max-w-xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">User Information Form</h2>
              <button
                className="text-[#4ecdc4] cursor-pointer hover:text-[#45b7aa] transition"
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
                  className="mt-4 cursor-pointer bg-[#4ecdc4] text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors"
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
          <div className="w-full max-w-xl bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Edit User Information</h2>
              <button
                className="text-[#4ecdc4] hover:text-[#45b7aa] cursor-pointer transition"
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
                  className="mt-4 cursor-pointer bg-[#4ecdc4] text-white py-2 px-4 rounded-md hover:bg-[#45b7aa] transition-colors"
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
          <div className="w-full max-w-md bg-[#f0f6f6] rounded-lg shadow-lg p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-[#e0e0e0]">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Assign Course to User</h2>
              <button
                className="text-[#4ecdc4] hover:text-[#45b7aa] transition cursor-pointer"
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
                className="mt-1 block w-full p-2 border border-[#4ecdc4]/30 rounded-md shadow-sm text-gray-700 cursor-not-allowed"
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
                className="py-2 px-4 bg-[#2c3e50] text-white cursor-pointer  rounded-md hover:bg-[#45b7aa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCourse}
                className="py-2 px-4 bg-[#4ecdc4] text-white cursor-pointer rounded-md hover:bg-[#45b7aa] transition-colors"
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
