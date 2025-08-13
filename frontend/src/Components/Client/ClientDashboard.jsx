// import React, { useContext, useEffect, useState } from 'react';
// import {
//   TrendingUp,
//   BookOpen,
//   Video,
//   ChevronRight,
//   Clock
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Area
// } from 'recharts';
// import ProjectContext from '../../Context/ProjectContext';

// const ClientDashboard = () => {
//   const { user, loading } = useContext(ProjectContext);
//   const [client, setClient] = useState(null);

//   useEffect(() => {
//     if (user) {
//       setClient(user);
//     }
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-[#f0f6f6]">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4ecdc4]"></div>
//       </div>
//     );
//   }

//   // Ensure enrolledCourses is always an array
//   const courses = user?.enrolledCourses || [];

//   // Learning Progression Data
//   const learningProgressData = [
//     { name: 'Week 1', progress: 45 },
//     { name: 'Week 2', progress: 60 },
//     { name: 'Week 3', progress: 75 },
//     { name: 'Week 4', progress: 90 },
//     { name: 'Week 5', progress: 85 },
//     { name: 'Week 6', progress: 95 }
//   ];

//   const learningStats = [
//     {
//       icon: <TrendingUp className="text-[#4ecdc4]" size={32} />,
//       title: "Learning Streak",
//       value: `${user?.streak || 0} days`,
//       trend: "+3 from last week",
//       bgGradient: "from-[#4ecdc4]/10 to-[#4ecdc4]/30"
//     },
//     {
//       icon: <BookOpen className="text-[#2c3e50]" size={32} />,
//       title: "Courses Completed",
//       value: `${courses.length} Courses`,
//       trend: "+1 this month",
//       bgGradient: "from-[#2c3e50]/10 to-[#2c3e50]/30"
//     },
//     {
//       icon: <Video className="text-[#ff6b6b]" size={32} />,
//       title: "Watch Time",
//       value: "42h 15m",
//       trend: "+5h from last week",
//       bgGradient: "from-[#ff6b6b]/10 to-[#ff6b6b]/30"
//     }
//   ];

//   const CustomProgressBar = ({ progress }) => (
//     <div className="w-full bg-[#f0f6f6] rounded-full h-3">
//       <div
//         className="bg-gradient-to-r from-[#4ecdc4] to-[#4ecdc4]/70 h-3 rounded-full transition-all duration-500 ease-in-out"
//         style={{ width: `${progress || 0}%` }}
//       />
//     </div>
//   );

//   return (
//     <div className="bg-gradient-to-br from-[#f0f6f6] to-[#e6f2f2] min-h-screen p-4 lg:p-8 space-y-8">
//       {/* Dashboard Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white rounded-2xl p-6 shadow-sm">
//         <div className="mb-4 md:mb-0">
//           <h1 className="text-4xl font-bold text-[#2c3e50] mb-1">Dashboard</h1>
//           <p className="text-[#7f8c8d] text-lg">Welcome back, <span className="font-semibold text-[#4ecdc4]">{client?.name || "Student"}</span>!</p>
//         </div>
//         <div className="flex space-x-3">
//           <button className="bg-gradient-to-r from-[#4ecdc4]/10 to-[#4ecdc4]/30 text-[#4ecdc4] px-5 py-3 rounded-xl text-sm font-medium hover:shadow-md transition-all duration-300 flex items-center">
//             Explore Courses
//             <ChevronRight size={16} className="ml-1" />
//           </button>
//           <button className="bg-gradient-to-r from-[#ff6b6b]/10 to-[#ff6b6b]/30 text-[#ff6b6b] px-5 py-3 rounded-xl text-sm font-medium hover:shadow-md transition-all duration-300 flex items-center">
//             Learning Path
//             <ChevronRight size={16} className="ml-1" />
//           </button>
//         </div>
//       </div>

//       {/* Learning Statistics */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {learningStats.map((stat, index) => (
//           <div
//             key={index}
//             className={`bg-gradient-to-br ${stat.bgGradient} border border-white/50 shadow-lg rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
//           >
//             <div className="flex justify-between items-center">
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3">
//                   {stat.icon}
//                   <h3 className="text-lg font-semibold text-[#2c3e50]">{stat.title}</h3>
//                 </div>
//                 <p className="text-3xl font-bold text-[#2c3e50]">{stat.value}</p>
//                 <p className="text-sm font-medium text-[#4ecdc4] flex items-center">
//                   <TrendingUp size={14} className="mr-1" /> {stat.trend}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Courses and Learning Progression */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Courses in Progress */}
//         <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-[#2c3e50]">Courses in Progress</h2>
//             <button className="text-[#4ecdc4] hover:text-[#4ecdc4]/70 transition-colors duration-300 text-sm flex items-center">
//               View All <ChevronRight size={16} className="ml-1" />
//             </button>
//           </div>
//           <div className="space-y-5">
//             {courses.length > 0 ? (
//               courses.map((course, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between border-b border-[#f0f6f6] pb-5 last:border-b-0 hover:bg-[#f0f6f6]/50 p-3 rounded-xl transition-all duration-300"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className={`w-12 h-12 bg-gradient-to-br from-[#4ecdc4] to-[#4ecdc4]/70 rounded-xl flex items-center justify-center text-white shadow-sm`}>
//                       <BookOpen size={24} />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-[#2c3e50] text-lg">{course.title}</h3>
//                       <div className="flex items-center text-[#7f8c8d] text-xs mt-1">
//                         <Clock size={12} className="mr-1" />
//                         <span>Last accessed 2 days ago</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <CustomProgressBar progress={65} />
//                     <span className="ml-3 text-[#4ecdc4] font-medium">65%</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-10 border-2 border-dashed border-[#4ecdc4]/30 rounded-xl">
//                 <BookOpen size={40} className="mx-auto text-[#7f8c8d]" />
//                 <p className="text-[#7f8c8d] mt-4 font-medium">No courses in progress</p>
//                 <button className="mt-3 text-[#4ecdc4] text-sm font-medium">Discover new courses</button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Learning Progression Chart */}
//         <div className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
//           <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">Learning Progression</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <LineChart data={learningProgressData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
//               <defs>
//                 <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.2} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f6f6" />
//               <XAxis dataKey="name" tick={{ fill: '#7f8c8d' }} />
//               <YAxis tick={{ fill: '#7f8c8d' }} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#ffffff',
//                   border: '1px solid #4ecdc4',
//                   borderRadius: '8px',
//                   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
//                 }}
//               />
//               <Area type="monotone" dataKey="progress" stroke="#4ecdc4" strokeWidth={2} fillOpacity={1} fill="url(#progressGradient)" />
//               <Line type="monotone" dataKey="progress" stroke="#4ecdc4" strokeWidth={3} dot={{ r: 6, strokeWidth: 2, stroke: '#4ecdc4', fill: 'white' }} activeDot={{ r: 8, stroke: '#4ecdc4', strokeWidth: 2, fill: 'white' }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClientDashboard;



import React, { useContext, useEffect, useState } from 'react';
import {
  TrendingUp,
  BookOpen,
  Video,
  ChevronRight,
  Clock,
  Award // For assignment results or general achievements
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

const ClientDashboard = () => {
  const { user, loading } = useContext(ProjectContext);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (user) {
      setClient(user);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

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
      icon: <TrendingUp className="text-emerald-600" size={32} />,
      title: "Learning Streak",
      value: `${user?.streak || 0} days`,
      trend: "+3 from last week",
      bgGradient: "bg-emerald-100",
      textColor: "text-emerald-700"
    },
    {
      icon: <BookOpen className="text-indigo-600" size={32} />,
      title: "Courses Completed",
      value: `${courses.length} Courses`,
      trend: "+1 this month",
      bgGradient: "bg-indigo-100",
      textColor: "text-indigo-700"
    },
    {
      icon: <Video className="text-purple-600" size={32} />,
      title: "Watch Time",
      value: "42h 15m",
      trend: "+5h from last week",
      bgGradient: "bg-purple-100",
      textColor: "text-purple-700"
    }
  ];

  const CustomProgressBar = ({ progress }) => (
    <div className="w-full bg-slate-200 rounded-full h-3">
      <div
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress || 0}%` }}
      />
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen p-4 lg:p-8 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-bold text-slate-800 mb-1">Dashboard</h1>
          <p className="text-slate-600 text-lg">Welcome back, <span className="font-semibold text-indigo-600">{client?.name || "Student"}</span>!</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-indigo-100 text-indigo-600 px-5 py-3 rounded-xl text-sm font-medium hover:shadow-md transition-all duration-300 flex items-center hover:bg-indigo-200">
            Explore Courses
            <ChevronRight size={16} className="ml-1" />
          </button>
          <button className="bg-emerald-100 text-emerald-600 px-5 py-3 rounded-xl text-sm font-medium hover:shadow-md transition-all duration-300 flex items-center hover:bg-emerald-200">
            My Learning Path
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Learning Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learningStats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white border border-slate-200 shadow-md rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`${stat.bgGradient} p-2 rounded-full`}>{stat.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-800">{stat.title}</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className={`${stat.textColor} text-sm font-medium flex items-center`}>
                  <TrendingUp size={14} className="mr-1" /> {stat.trend}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses and Learning Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses in Progress */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Courses in Progress</h2>
            <button className="text-indigo-600 hover:text-indigo-700 transition-colors duration-300 text-sm flex items-center">
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="space-y-5">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-slate-200 pb-5 last:border-b-0 hover:bg-slate-50 p-3 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm`}>
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{course.title}</h3>
                      <div className="flex items-center text-slate-600 text-xs mt-1">
                        <Clock size={12} className="mr-1 text-slate-500" />
                        <span>Last accessed 2 days ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CustomProgressBar progress={65} />
                    <span className="ml-3 text-indigo-600 font-medium">65%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-slate-300 rounded-xl">
                <BookOpen size={40} className="mx-auto text-slate-400" />
                <p className="text-slate-600 mt-4 font-medium">No courses in progress</p>
                <button className="mt-3 text-indigo-600 text-sm font-medium hover:underline">Discover new courses</button>
              </div>
            )}
          </div>
        </div>

        {/* Learning Progression Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Learning Progression</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={learningProgressData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" tick={{ fill: '#7f8c8d' }} />
              <YAxis tick={{ fill: '#7f8c8d' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #6366F1',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area type="monotone" dataKey="progress" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#progressGradient)" />
              <Line type="monotone" dataKey="progress" stroke="#6366F1" strokeWidth={3} dot={{ r: 6, strokeWidth: 2, stroke: '#6366F1', fill: 'white' }} activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 2, fill: 'white' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
