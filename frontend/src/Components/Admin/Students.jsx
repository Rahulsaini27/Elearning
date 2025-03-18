import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../Context/AlertContext";
import axios from "axios";
import Swal from "sweetalert2";
import ProjectContext from "../../Context/ProjectContext";

function Students() {
  const { Toast } = useContext(AlertContext);
  const { API_BASE_URL, API_URL, USER_BASE_URL } = useContext(ProjectContext)

  const [totalusers, settotalUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.contactNumber,
          address: newUser.address,
          education: newUser.highestDegree,
          occupation: newUser.occupation,
          dateOfBirth: newUser.dateOfBirth || "",  // Add dateOfBirth field if required
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
        dateOfBirth: "",
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


  // Fetch Users from Backend API
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_BASE_URL + API_URL + USER_BASE_URL + "/getUser");
      console.log("Fetch Response:", response);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("Fetched Users:", data);
      settotalUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const changeStatus = async (userId, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/updateStatus/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: status }),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.fire({ icon: "success", title: "User status updated successfully!" });
        settotalUsers((prevUsers) =>
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
            const response = await axios.delete(`${API_BASE_URL}${API_URL}${USER_BASE_URL}/delete/${userId}`);

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



  return (
    <>
      <div className="relative overflow-x-auto  px-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Users</h2>
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="text-white bg-black py-2 px-3 rounded-2xl cursor-pointer"
            >
              Add User
            </button>
          </div>
        </div>

        {/* User Table */}
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Password</th>
              <th className="px-6 py-3">Contact Number</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Occupation</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {totalusers.map((user, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 max-w-[40px] ">********</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.gender}</td>

                <td className="px-6 py-4">{user.occupation}</td>
                <td className="px-6 py-4">{user.address}</td>
                <td className="px-6 py-4 flex  justify-center items-center gap-1">
                  <svg onClick={() => deleteUser(user._id)} xmlns="http://www.w3.org/2000/svg" className=" cursor-pointer hover:scale-105 duration-300" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z" fill="red"></path>
                  </svg>

                </td>
                <td className="py-2 px-4 ">
                  <div>
                    {user.isActive ? (<button
                      onClick={() => changeStatus(user._id, false)}
                      className="text-white cursor-pointer font-medium rounded-lg text-sm px-2 py-1 bg-lime-500 duration-200 hover:bg-lime-400">
                      Active
                    </button>
                    ) : (
                      <button onClick={() => changeStatus(user._id, true)}
                        className="text-white cursor-pointer font-medium rounded-lg text-sm px-2 py-1 bg-red-500 duration-200 hover:bg-red-400">
                        Inactive
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="inset-0 z-[9999999999] absolute bg-black/50 top-0 right-0 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Information Form</h2>
              <button
                onClick={() => setShowModal(false)} className="text-gray-500  cursor-pointer  hover:text-black focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={newUser.name} onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email} onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password} onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    id="highestDegree"
                    name="highestDegree"
                    value={newUser.highestDegree} onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                  />

                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={newUser.gender} onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={newUser.address} onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={newUser.contactNumber} onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                    Occupation
                  </label>
                  <input
                    id="occupation"
                    name="occupation"
                    value={newUser.occupation} onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded transition duration-300 w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>

  );
}

export default Students;
