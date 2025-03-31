import React, { useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { BookOpen, Users, TrendingUp, ArrowUpRight, ChevronRight, CheckCircle, Calendar } from 'lucide-react';
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
  const { course, totalusers,videos  } = useContext(ProjectContext);

  const renderStatCard = (title, value, icon, percentage, color, bgColor) => {
    return (
      <div className={`bg-gradient-to-br from-[#F0F6F6] to-[${bgColor}] border border-[#4ecdc4]/40 hover:border-[#4ecdc4] rounded-2xl p-6 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-600 font-semibold text-sm tracking-wide">{title}</h2>
          <div className={`text-${color} bg-${color}/10 p-2 rounded-full`}>{icon}</div>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className={`text-${color} text-sm flex items-center font-medium`}>
            <ArrowUpRight size={16} className="mr-1" />
            {percentage}
          </p>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6F6] to-[#E8F4F4] p-8">
      <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
          Admin Dashboard
          <span className="ml-3 text-sm text-white bg-[#4ecdc4] px-3 py-1 rounded-full">Pro</span>
        </h1>
        <p className="text-gray-600 text-lg">Platform Management Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {renderStatCard("Total Courses", course.length, <BookOpen size={22} />, "12% from last month", "[#4ecdc4]", "#E0F4F4")}
        {renderStatCard("Active Students", totalusers.length, <Users size={22} />, "5% from last month", "[#4c88ff]", "#E6F0FF")}
        {renderStatCard("Total videos ", videos.length, <TrendingUp size={22} />, "8% increase", "[#9966ff]", "#F0E6FF")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Distribution Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Course Distribution</h2>
            <button className="text-[#4ecdc4] hover:text-[#3dbdb5] text-sm font-medium flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
            {course.length > 0 ? (
              course.map((courseItem, index) => (
                <div key={index} className="bg-[#F0F6F6] rounded-xl p-5 hover:bg-[#E8F4F4] transition duration-300 border border-transparent hover:border-[#4ecdc4]/30">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-[#4ECDC4]/20 flex items-center justify-center mr-3">
                        <BookOpen size={18} className="text-[#4ECDC4]" />
                      </div>
                      <span className="font-semibold text-gray-700">{courseItem.title}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-500">{courseItem.assignedStudents?.length || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                      <div 
                        className="bg-gradient-to-r from-[#4ECDC4] to-[#3dbdb5] h-3 rounded-full" 
                        style={{ width: `${Math.min((courseItem.assignedStudents?.length || 0) * 2, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#4ECDC4]">
                      {Math.min((courseItem.assignedStudents?.length || 0) * 2, 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <CheckCircle size={14} className="mr-1 text-[#4ECDC4]" />
                      <span>Active</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>Updated today</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <BookOpen size={40} className="mx-auto text-gray-400" />
                <p className="text-gray-500 mt-4">No courses available.</p>
                <button className="mt-3 text-[#4ecdc4] text-sm font-medium">Add new course</button>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Course & Student Trends</h2>
            <select className="bg-[#F0F6F6] text-gray-700 rounded-lg px-3 py-2 text-sm font-medium border-none focus:outline-none focus:ring-2 focus:ring-[#4ecdc4]">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Area type="monotone" dataKey="courses" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorCourses)" />
              <Line
                type="monotone"
                dataKey="courses"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: '#8884d8', fill: 'white' }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#8884d8', fill: 'white' }}
              />
              <Area type="monotone" dataKey="students" stroke="#4ECDC4" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#4ECDC4"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: '#4ECDC4', fill: 'white' }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#4ECDC4', fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center space-x-8 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
              <span className="text-sm text-gray-600">Courses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#4ECDC4] mr-2"></div>
              <span className="text-sm text-gray-600">Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;