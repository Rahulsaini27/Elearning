
import React, { useContext, useEffect, useState } from 'react';
import {
  TrendingUp,
  BookOpen,
  Users,
  Video,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';
import ProjectContext from '../../Context/ProjectContext';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, loading } = useContext(ProjectContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const courses = user?.enrolledCourses || [];

  const learningProgressData = [
    { name: 'Jan', progress: 45, courses: 2 },
    { name: 'Feb', progress: 60, courses: 3 },
    { name: 'Mar', progress: 75, courses: 3 },
    { name: 'Apr', progress: 90, courses: 4 },
    { name: 'May', progress: 85, courses: 5 },
    { name: 'Jun', progress: 95, courses: 5 }
  ];

  const renderStatCard = (title, value, icon, percentage, iconBgColor, iconColor) => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-600 font-semibold text-sm tracking-wide">{title}</h2>
          <div className={`${iconBgColor} ${iconColor} p-2 rounded-full`}>{icon}</div>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          <p className="text-green-600 text-sm flex items-center font-medium">
            <ArrowUpRight size={16} className="mr-1" />
            {percentage}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {user?.name || "Student"}!
        </h1>
        <p className="text-gray-600 text-lg">Your Learning Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {renderStatCard("Courses Enrolled", courses.length, <BookOpen size={22} />, "2 new", "bg-blue-100", "text-blue-500")}
        {renderStatCard("Learning Streak", `${user?.streak || 0} days`, <TrendingUp size={22} />, "+3 days", "bg-green-100", "text-green-600")}
        {renderStatCard("Assignments Due", "3", <Video size={22} />, "this week", "bg-orange-100", "text-orange-500")}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <button onClick={() => navigate("/client/course")} className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {courses.length > 0 ? (
              courses.map((courseItem) => (
                <div key={courseItem._id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition duration-300 cursor-pointer" onClick={() => navigate(`/client/course/${courseItem._id}`)}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                      <BookOpen size={18} className="text-blue-500" />
                    </div>
                    <span className="font-semibold text-gray-700">{courseItem.title}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <BookOpen size={40} className="mx-auto text-gray-400" />
                <p className="text-gray-500 mt-4">No courses enrolled yet.</p>
                <button className="mt-3 text-blue-500 text-sm font-medium hover:underline">Explore courses</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Progression</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={learningProgressData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
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
              <Area type="monotone" dataKey="progress" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: '#3B82F6', fill: 'white' }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#3B82F6', fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;