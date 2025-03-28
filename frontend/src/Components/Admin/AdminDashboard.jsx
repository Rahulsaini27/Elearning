import React, { useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, TrendingUp } from 'lucide-react';
import ProjectContext from "../../Context/ProjectContext";

const AdminDashboard = () => {
  // Mock data for chart (since full context isn't available)
  const courseData = [
    { name: 'Jan', courses: 10, students: 400 },
    { name: 'Feb', courses: 15, students: 350 },
    { name: 'Mar', courses: 12, students: 450 },
    { name: 'Apr', courses: 20, students: 500 },
    { name: 'May', courses: 18, students: 420 },
    { name: 'Jun', courses: 22, students: 550 }
  ];

  // Simulating context data


  const { course , totalusers  } = useContext(ProjectContext);

  const renderStatCard = (title, value, icon, percentage, color) => {
    return (
      <div className="bg-[#F0F6F6] rounded-2xl p-6 shadow-md border border-gray-100 transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-500 font-semibold text-sm">{title}</h2>
          <div className={`text-${color}-500`}>{icon}</div>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className={`text-${color}-500 text-sm flex items-center`}>{percentage}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Platform Management Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {renderStatCard("Total Courses", course.length, <BookOpen />, "12% from last month", "green")}
        {renderStatCard("Active Students", totalusers.length, <Users />, "5% from last month", "blue")}
        {renderStatCard("Course Engagement", Math.floor(course.length * 1.5), <TrendingUp />, "8% increase", "purple")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Distribution Section */}
        <div className="bg-[#F0F6F6] rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Distribution</h2>
          <div className="grid grid-cols-1 gap-4">
            {course.length > 0 ? (
              course.map((courseItem, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">{courseItem.title}</span>
                    <span className="text-sm text-gray-500">{courseItem.assignedStudents?.length || 0} students</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${(courseItem.assignedStudents?.length || 0) * 2}%`}}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No courses available.</p>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#F0F6F6] rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course & Student Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '10px',
                  border: 'none'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="courses" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ r: 6, fill: '#8884d8' }}
              />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#82ca9d" 
                strokeWidth={3}
                dot={{ r: 6, fill: '#82ca9d' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;