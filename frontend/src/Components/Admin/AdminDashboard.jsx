import React, { useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { BookOpen, Users, TrendingUp, ArrowUpRight, ChevronRight, CheckCircle, Calendar } from 'lucide-react';
import ProjectContext from "../../Context/ProjectContext";

const AdminDashboard = () => {
  // Mock data for chart
  const courseData = [
    { name: 'Jan', courses: 10, students: 400 },
    { name: 'Feb', courses: 15, students: 350 },
    { name: 'Mar', courses: 12, students: 450 },
    { name: 'Apr', courses: 20, students: 500 },
    { name: 'May', courses: 18, students: 420 },
    { name: 'Jun', courses: 22, students: 550 }
  ];

  const { course, totalusers, videos } = useContext(ProjectContext);

  const renderStatCard = (title, value, icon, percentage, iconBgColor, iconColor, textColor) => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-600 font-semibold text-sm tracking-wide">{title}</h2>
          <div className={`${iconBgColor} ${iconColor} p-2 rounded-full`}>{icon}</div>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          <p className={`${textColor} text-sm flex items-center font-medium`}>
            <ArrowUpRight size={16} className="mr-1" />
            {percentage}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Platform Management Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {renderStatCard("Total Courses", course.length, <BookOpen size={22} />, "12% from last month", "bg-blue-100", "text-blue-500", "text-green-600")}
        {renderStatCard("Active Students", totalusers.length, <Users size={22} />, "5% from last month", "bg-green-100", "text-green-600", "text-green-600")}
        {renderStatCard("Total Videos", videos.length, <TrendingUp size={22} />, "8% increase", "bg-orange-100", "text-orange-500", "text-green-600")}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Course Distribution Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Course Distribution</h2>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {course.length > 0 ? (
              course.map((courseItem, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                        <BookOpen size={18} className="text-blue-500" />
                      </div>
                      <span className="font-semibold text-gray-700">{courseItem.title}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">{courseItem.assignedStudents?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <BookOpen size={40} className="mx-auto text-gray-400" />
                <p className="text-gray-500 mt-4">No courses available.</p>
                <button className="mt-3 text-blue-500 text-sm font-medium hover:underline">Add new course</button>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Course & Student Trends</h2>
            <select className="bg-gray-50 text-gray-700 rounded-lg px-3 py-2 text-sm font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
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
              <Area type="monotone" dataKey="courses" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorCourses)" />
              <Line
                type="monotone"
                dataKey="courses"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: '#3B82F6', fill: 'white' }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#3B82F6', fill: 'white' }}
              />
              <Area type="monotone" dataKey="students" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: '#10B981', fill: 'white' }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#10B981', fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center items-center space-x-8 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">Courses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;