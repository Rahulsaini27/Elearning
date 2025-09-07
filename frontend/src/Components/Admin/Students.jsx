import React, { useContext, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import axios from "axios";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";
import { ChevronDown, ChevronUp, Edit, Trash2, Check, X, Plus, FileX, CircleDashed, X as CloseIcon } from 'lucide-react';

function Students() {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL, course, totalusers, fetchUsers, setTotalUsers } = useContext(ProjectContext);

  const admintoken = localStorage.getItem("admintoken");

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [editUserDetails, setEditUserDetails] = useState({
    _id: null, name: "", email: "", password: "", phone: "", gender: "", address: "", education: "", occupation: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const changeStatus = async (userId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/updateStatus/${userId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${admintoken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: status }),
      });
      const data = await response.json();
      if (response.ok) {
        Toast.fire({ icon: "success", title: "User status updated successfully!" });
        setTotalUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? { ...user, isActive: status } : user)));
      } else {
        Toast.fire({ icon: "error", title: "Failed to update status", text: data.msg });
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: "Failed to update status", text: error.message });
    }
  };

  const deleteUser = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6", // blue-500
      cancelButtonColor: "#EF4444",   // red-500
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/delete/${userId}`, { headers: { "Authorization": `Bearer ${admintoken}` } });
          if (response.status === 200) {
            Toast.fire({ icon: "success", title: "User deleted successfully!" });
            fetchUsers();
          } else {
            Toast.fire({ icon: "error", title: "Failed to delete user" });
          }
        } catch (error) {
          Toast.fire({ icon: "error", title: "Failed to delete user", text: error.response?.data?.message || error.message });
        }
      }
    });
  };

  const editUser = (user) => {
    setEditUserDetails({
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone || "", gender: user.gender || "", address: user.address || "",
      education: user.education || "", occupation: user.occupation || "", password: "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editUserDetails };
      if (payload.password === "") {
        delete payload.password;
      }
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/edit/${editUserDetails._id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${admintoken}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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

  const handleAssignCourse = async () => {
    if (!userId || !selectedCourse) {
      Toast.fire({ icon: "error", title: "Please select a user and a course!" });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/assign-course`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${admintoken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, courseId: selectedCourse })
      });
      const data = await response.json();
      if (response.ok) {
        Toast.fire({ icon: "success", title: "Course assigned successfully!" });
        fetchUsers();
        setIsAssignModalOpen(false);
        setSelectedCourse("");
      } else {
        Toast.fire({ icon: "error", title: data.msg || "Failed to assign course" });
      }
    } catch (error) {
      Toast.fire({ icon: "error", title: "Something went wrong while assigning course!" });
    }
  };

  const removeHandler = async (userId, courseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will unassign the course from the student.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, remove it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/remove-student/${courseId}/${userId}`, {}, { headers: { Authorization: `Bearer ${admintoken}` } });
          if (response.status === 200) {
            Toast.fire({ icon: "success", title: "Course unassigned successfully!" });
            fetchUsers();
          } else {
            Toast.fire({ icon: "error", title: "Failed to unassign course" });
          }
        } catch (error) {
          Toast.fire({ icon: "error", title: "Failed to unassign course", text: error.response?.data?.message || error.message });
        }
      }
    });
  };

  const toggleRowExpand = (userId) => {
    setExpandedRows(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            All Students <span className="text-lg font-normal text-gray-500">({totalusers.length})</span>
          </h2>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Mobile View */}
          <div className="md:hidden">
            {totalusers.length > 0 ? (
              totalusers.map((user) => (
                <div key={user._id} className="border-b border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 break-words pr-2">{user.name}</h3>
                        <button onClick={() => toggleRowExpand(user._id)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 flex-shrink-0">
                          {expandedRows[user._id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  {expandedRows[user._id] && (
                    <div className="mt-4 pl-1 animate-fadeIn">
                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                          {[
                            { label: 'Phone', value: user.phone }, { label: 'Gender', value: user.gender },
                            { label: 'Occupation', value: user.occupation }, { label: 'Education', value: user.education }
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <p className="text-xs text-gray-500 font-medium">{label}:</p>
                              <p className="text-sm text-gray-700">{value || 'N/A'}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 font-medium">Address:</p>
                          <p className="text-sm text-gray-700 break-words">{user.address || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1.5">Enrolled Courses:</p>
                          {user.enrolledCourses?.length > 0 ? (
                            <div className="space-y-1.5">
                              {user.enrolledCourses.map((course) => (
                                <div key={course._id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm border group">
                                  <span className="truncate text-sm text-gray-700">{course.title}</span>
                                  <button onClick={() => removeHandler(user._id, course._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 p-1 rounded-full">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 flex items-center gap-2"><CircleDashed size={16} /> No courses enrolled</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 mt-3 flex-wrap">
                        <button onClick={() => { setIsAssignModalOpen(true); setUserId(user._id); setUserName(user.name); }} className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-all shadow-sm">
                          <Plus size={16} /> Assign
                        </button>
                        <button onClick={() => changeStatus(user._id, !user.isActive)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all shadow-sm ${user.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                          {user.isActive ? <Check size={16} /> : <X size={16} />} {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button onClick={() => editUser(user)} className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300 transition-all shadow-sm">
                          <Edit size={16} /> Edit
                        </button>
                        <button onClick={() => deleteUser(user._id)} className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-all shadow-sm">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <FileX size={52} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">No students registered yet.</p>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-12 border-b-2 border-blue-500">#</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-blue-500">Student Details</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-blue-500">Enrolled Courses</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell border-b-2 border-blue-500">Additional Info</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-28 border-b-2 border-blue-500">Status</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-28 border-b-2 border-blue-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {totalusers.length > 0 ? (
                    totalusers.map((user, index) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4 text-sm text-gray-600 text-center">{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <h3 className="text-md font-bold text-gray-800 break-words">{user.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                            <p className="text-sm text-gray-500 mt-1">{user.phone || 'No phone'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-xs">
                            {user.enrolledCourses?.length > 0 ? (
                              <div className="space-y-2">
                                {user.enrolledCourses.slice(0, expandedRows[user._id] ? user.enrolledCourses.length : 2).map((course) => (
                                  <div key={course._id} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 group">
                                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-800 flex-grow truncate">{course.title}</span>
                                    <button onClick={() => removeHandler(user._id, course._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 p-1 rounded-full"><Trash2 size={16} /></button>
                                  </div>
                                ))}
                                {user.enrolledCourses.length > 2 && (
                                  <button onClick={() => toggleRowExpand(user._id)} className="text-xs text-blue-500 hover:text-blue-600 mt-2 flex items-center">
                                    {expandedRows[user._id] ? <><ChevronUp size={16} className="mr-1" />Show less</> : <><ChevronDown size={16} className="mr-1" />See all {user.enrolledCourses.length}</>}
                                  </button>
                                )}
                              </div>
                            ) : (<p className="text-sm text-gray-500">No courses</p>)}
                            <button onClick={() => { setIsAssignModalOpen(true); setUserId(user._id); setUserName(user.name); }} className="mt-2 inline-flex items-center px-3 py-1 border border-blue-500 text-blue-600 rounded-lg text-xs hover:bg-blue-50 transition-all"><Plus size={14} className="mr-1" /> Assign</button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-normal hidden lg:table-cell">
                          <div className="max-w-md text-sm">
                            <p><span className="font-semibold text-gray-600">Gender:</span> {user.gender || 'N/A'}</p>
                            <p><span className="font-semibold text-gray-600">Occupation:</span> {user.occupation || 'N/A'}</p>
                            <p><span className="font-semibold text-gray-600">Education:</span> {user.education || 'N/A'}</p>
                            <p className="line-clamp-2"><span className="font-semibold text-gray-600">Address:</span> {user.address || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button onClick={() => changeStatus(user._id, !user.isActive)} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${user.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>
                            {user.isActive ? <Check size={14} className="mr-1" /> : <X size={14} className="mr-1" />}
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-4">
                            <button onClick={() => editUser(user)} className="text-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-125" title="Edit student"><Edit size={20} /></button>
                            <button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-600 transition-all duration-300 transform hover:scale-125" title="Delete student"><Trash2 size={20} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-16 text-center text-gray-500">
                        <FileX size={52} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">No students registered yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && editUserDetails._id && (
        <div className="fixed z-[500] inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Edit User Information</h2>
              <button className="text-gray-500 hover:text-gray-800 cursor-pointer transition" onClick={() => setShowEditModal(false)}>
                <CloseIcon size={24} />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input id="edit_name" name="name" value={editUserDetails.name} onChange={handleEditChange} required className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="edit_email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input id="edit_email" name="email" type="email" value={editUserDetails.email} onChange={handleEditChange} required className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_password" className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                  <input id="edit_password" name="password" type="password" value={editUserDetails.password} onChange={handleEditChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="edit_gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select id="edit_gender" name="gender" value={editUserDetails.gender} onChange={handleEditChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800">
                    <option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input id="edit_address" name="address" value={editUserDetails.address} onChange={handleEditChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="edit_phone" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input id="edit_phone" name="phone" type="tel" value={editUserDetails.phone} onChange={handleEditChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit_education" className="block text-sm font-medium text-gray-700">Education</label>
                  <input id="edit_education" name="education" value={editUserDetails.education} onChange={handleEditChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800" />
                </div>
                <div>
                  <label htmlFor="edit_occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                  <input id="edit_occupation" name="occupation" value={editUserDetails.occupation} onChange={handleEditChange} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-500 text-white py-2.5 px-6 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg font-semibold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignModalOpen && (
        <div className="fixed z-[500] inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative">
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Assign Course</h2>
              <button className="text-gray-500 hover:text-gray-800 transition cursor-pointer" onClick={() => setIsAssignModalOpen(false)}>
                <CloseIcon size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="assign_userName" className="block text-sm font-medium text-gray-700">User</label>
              <input id="assign_userName" type="text" value={userName} disabled className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed" />
            </div>
            <div className="mb-6">
              <label htmlFor="assign_courseSelection" className="block text-sm font-medium text-gray-700">Select Course</label>
              <select id="assign_courseSelection" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-800">
                <option value="">Choose a course</option>
                {course.map((crs) => (<option key={crs._id} value={crs._id}>{crs.title}</option>))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsAssignModalOpen(false)} className="py-2.5 px-5 bg-gray-600 text-white cursor-pointer rounded-lg hover:bg-gray-700 transition-colors font-semibold">Cancel</button>
              <button onClick={handleAssignCourse} className="py-2.5 px-5 bg-blue-500 text-white cursor-pointer rounded-lg hover:bg-blue-600 transition-colors font-semibold">Assign Course</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Students;