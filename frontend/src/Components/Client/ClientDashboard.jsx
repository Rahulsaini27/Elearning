import React, { useContext, useEffect, useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Video, 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import ProjectContext from '../../Context/ProjectContext';

const ClientDashboard = () => {
  const { user } = useContext(ProjectContext);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (user) {
      setClient(user);
    }
  }, [user]);

  // Ensure enrolledCourses is always an array
  const courses = user?.enrolledCourses || [];

  // Learning Progression Data
  const learningProgressData = [
    { name: 'Week 1', progress: 45 },
    { name: 'Week 2', progress: 60 },
    { name: 'Week 3', progress: 75 },
    { name: 'Week 4', progress: 90 },
    { name: 'Week 5', progress: 85 },
    { name: 'Week 6', progress: 95 }
  ];

  const learningStats = [
    {
      icon: <TrendingUp className="text-[#4ecdc4]" size={32} />,
      title: "Learning Streak",
      value: `${user?.streak || 0} days`,
      trend: "+3 from last week"
    },
    {
      icon: <BookOpen className="text-[#2c3e50]" size={32} />,
      title: "Courses Completed",
      value: `${courses.length} Courses`,
      trend: "+1 this month"
    },
    {
      icon: <Video className="text-[#ff6b6b]" size={32} />,
      title: "Watch Time",
      value: "42h 15m",
      trend: "+5h from last week"
    }
  ];

  const CustomProgressBar = ({ progress }) => (
    <div className="w-full bg-[#f0f6f6] rounded-full h-2">
      <div 
        className="bg-[#4ecdc4] h-2 rounded-full" 
        style={{ width: `${progress || 0}%` }}
      />
    </div>
  );

  return (
    <div className="bg-[#f0f6f6] min-h-screen p-4 lg:p-8 space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Dashboard</h1>
          <p className="text-[#7f8c8d]">Welcome back, {client?.name || "Student"}!</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-[#4ecdc4]/10 text-[#4ecdc4] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4ecdc4]/20 transition">
            Explore Courses
          </button>
          <button className="bg-[#ff6b6b]/10 text-[#ff6b6b] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ff6b6b]/20 transition">
            Learning Path
          </button>
        </div>
      </div>

      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learningStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white shadow-md rounded-xl p-6 transform transition hover:scale-105 hover:shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {stat.icon}
                  <h3 className="text-lg font-semibold text-[#2c3e50]">{stat.title}</h3>
                </div>
                <p className="text-2xl font-bold text-[#2c3e50]">{stat.value}</p>
                <p className="text-sm text-[#4ecdc4]">{stat.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses and Learning Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses in Progress */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#2c3e50]">Courses in Progress</h2>
            <button className="text-[#4ecdc4] hover:underline text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-[#f0f6f6] pb-4 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 bg-[#4ecdc4] rounded-lg flex items-center justify-center text-white`}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2c3e50]">{course.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32">
                      <CustomProgressBar progress={course.progress} />
                    </div>
                    <span className="text-sm font-medium text-[#7f8c8d]">
                      {course.progress || 0}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#7f8c8d] text-center">No courses in progress</p>
            )}
          </div>
        </div>

        {/* Learning Progression Chart */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#2c3e50] mb-4">Learning Progression</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={learningProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f6f6" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #f0f6f6',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#4ecdc4" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;