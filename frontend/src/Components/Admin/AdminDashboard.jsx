

// import React, { useContext } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
// import { BookOpen, Users, TrendingUp, ArrowUpRight, ChevronRight, CheckCircle, Calendar } from 'lucide-react';
// import ProjectContext from "../../Context/ProjectContext";

// const AdminDashboard = () => {
//   // Mock data for chart (since full context isn't available)
//   const courseData = [
//     { name: 'Jan', courses: 10, students: 400 },
//     { name: 'Feb', courses: 15, students: 350 },
//     { name: 'Mar', courses: 12, students: 450 },
//     { name: 'Apr', courses: 20, students: 500 },
//     { name: 'May', courses: 18, students: 420 },
//     { name: 'Jun', courses: 22, students: 550 }
//   ];

//   // Simulating context data
//   const { course, totalusers,videos  } = useContext(ProjectContext);

//   const renderStatCard = (title, value, icon, percentage, iconBgColor, iconColor, textColor) => {
//     return (
//       <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm transform transition duration-300 hover:scale-[1.02] hover:shadow-md`}> {/* Refined card styles */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-slate-600 font-semibold text-sm tracking-wide">{title}</h2> {/* Adjusted text color */}
//           <div className={`${iconBgColor} ${iconColor} p-2 rounded-full`}>{icon}</div> {/* Dynamic colors for icon background and color */}
//         </div>
//         <div className="flex justify-between items-end">
//           <p className="text-4xl font-extrabold text-slate-800">{value}</p> {/* Larger, bolder value */}
//           <p className={`${textColor} text-sm flex items-center font-medium`}> {/* Dynamic text color */}
//             <ArrowUpRight size={16} className="mr-1" />
//             {percentage}
//           </p>
//         </div>
//       </div>
//     );
//   };


//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"> {/* Changed background and padding */}
//       <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-slate-200"> {/* Added border */}
//         <h1 className="text-4xl font-extrabold text-slate-800 mb-2 flex items-center"> {/* Adjusted text color */}
//           Admin Dashboard
//           <span className="ml-3 text-sm text-white bg-indigo-600 px-3 py-1 rounded-full">Pro</span> {/* Changed accent color */}
//         </h1>
//         <p className="text-slate-600 text-lg">Platform Management Overview</p> {/* Adjusted text color */}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         {renderStatCard("Total Courses", course.length, <BookOpen size={22} />, "12% from last month", "bg-emerald-100", "text-emerald-600", "text-emerald-600")} {/* New colors */}
//         {renderStatCard("Active Students", totalusers.length, <Users size={22} />, "5% from last month", "bg-indigo-100", "text-indigo-600", "text-indigo-600")} {/* New colors */}
//         {renderStatCard("Total videos ", videos.length, <TrendingUp size={22} />, "8% increase", "bg-purple-100", "text-purple-600", "text-purple-600")} {/* New colors */}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Course Distribution Section */}
//         <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"> {/* Added border */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-slate-800">Course Distribution</h2> {/* Adjusted text color */}
//             <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-colors"> {/* Changed accent color */}
//               View All <ChevronRight size={16} className="ml-1" />
//             </button>
//           </div>
//           <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
//             {course.length > 0 ? (
//               course.map((courseItem, index) => (
//                 <div key={index} className="bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition duration-300 border border-transparent hover:border-slate-200"> {/* Changed background and hover */}
//                   <div className="flex justify-between items-center mb-3">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3"> {/* Changed accent color */}
//                         <BookOpen size={18} className="text-emerald-600" /> {/* Changed accent color */}
//                       </div>
//                       <span className="font-semibold text-slate-700">{courseItem.title}</span> {/* Adjusted text color */}
//                     </div>
//                     <div className="flex items-center">
//                       <Users size={16} className="text-slate-500 mr-2" /> {/* Adjusted text color */}
//                       <span className="text-sm font-medium text-slate-600">{courseItem.assignedStudents?.length || 0}</span> {/* Adjusted text color */}
//                     </div>
//                   </div>
//                   <div className="flex items-center mt-2">
//                     <div className="w-full bg-slate-200 rounded-full h-3 mr-3"> {/* Changed background */}
//                       <div
//                         className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
//                         style={{ width: `${Math.min((courseItem.assignedStudents?.length || 0) * 2, 100)}%` }}
//                       ></div>
//                     </div>
//                     <span className="text-sm font-medium text-emerald-600"> {/* Changed accent color */}
//                       {Math.min((courseItem.assignedStudents?.length || 0) * 2, 100)}%
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center mt-3 text-xs text-slate-500"> {/* Adjusted text color */}
//                     <div className="flex items-center">
//                       <CheckCircle size={14} className="mr-1 text-emerald-500" /> {/* Changed accent color */}
//                       <span>Active</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Calendar size={14} className="mr-1 text-slate-400" /> {/* Adjusted icon color */}
//                       <span>Updated today</span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl"> {/* Changed border color */}
//                 <BookOpen size={40} className="mx-auto text-slate-400" /> {/* Changed icon color */}
//                 <p className="text-slate-500 mt-4">No courses available.</p> {/* Adjusted text color */}
//                 <button className="mt-3 text-indigo-600 text-sm font-medium hover:underline">Add new course</button> {/* Changed accent color */}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Chart Section */}
//         <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"> {/* Added border */}
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-slate-800">Course & Student Trends</h2> {/* Adjusted text color */}
//             <select className="bg-slate-50 text-slate-700 rounded-lg px-3 py-2 text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"> {/* Changed colors and focus ring */}
//               <option>Last 6 months</option>
//               <option>Last year</option>
//               <option>All time</option>
//             </select>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={courseData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
//               <defs>
//                 <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/> {/* Keep for now or map to new purple/indigo */}
//                   <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
//                 </linearGradient>
//                 <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/> {/* Emerald-500 */}
//                   <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
//               <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
//               <YAxis stroke="#888888" tickLine={false} axisLine={false} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: '#ffffff',
//                   borderRadius: '10px',
//                   boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//                   border: '1px solid #f0f0f0'
//                 }}
//                 labelStyle={{ fontWeight: 'bold', color: '#333' }}
//               />
//               <Area type="monotone" dataKey="courses" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorCourses)" /> {/* Indigo-500 */}
//               <Line
//                 type="monotone"
//                 dataKey="courses"
//                 stroke="#6366F1" 
//                 strokeWidth={3}
//                 dot={{ r: 5, strokeWidth: 2, stroke: '#6366F1', fill: 'white' }}
//                 activeDot={{ r: 8, strokeWidth: 2, stroke: '#6366F1', fill: 'white' }}
//               />
//               <Area type="monotone" dataKey="students" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" /> {/* Emerald-500 */}
//               <Line
//                 type="monotone"
//                 dataKey="students"
//                 stroke="#10B981" 
//                 strokeWidth={3}
//                 dot={{ r: 5, strokeWidth: 2, stroke: '#10B981', fill: 'white' }}
//                 activeDot={{ r: 8, strokeWidth: 2, stroke: '#10B981', fill: 'white' }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//           <div className="flex justify-center items-center space-x-8 mt-4">
//             <div className="flex items-center">
//               <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div> {/* Indigo-500 */}
//               <span className="text-sm text-slate-600">Courses</span>
//             </div>
//             <div className="flex items-center">
//               <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div> {/* Emerald-500 */}
//               <span className="text-sm text-slate-600">Students</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


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

  const renderStatCard = (title, value, icon, percentage, iconBgColor, iconColor, textColor) => {
    return (
      <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm transform transition duration-300 hover:scale-[1.02] hover:shadow-md`}> {/* Refined card styles */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-slate-600 font-semibold text-sm tracking-wide">{title}</h2> {/* Adjusted text color */}
          <div className={`${iconBgColor} ${iconColor} p-2 rounded-full`}>{icon}</div> {/* Dynamic colors for icon background and color */}
        </div>
        <div className="flex justify-between items-end">
          <p className="text-4xl font-extrabold text-slate-800">{value}</p> {/* Larger, bolder value */}
          <p className={`${textColor} text-sm flex items-center font-medium`}> {/* Dynamic text color */}
            <ArrowUpRight size={16} className="mr-1" />
            {percentage}
          </p>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"> {/* Changed background and padding */}
      <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-slate-200"> {/* Added border */}
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 flex items-center"> {/* Adjusted text color */}
          Admin Dashboard
          <span className="ml-3 text-sm text-white bg-indigo-600 px-3 py-1 rounded-full">Pro</span> {/* Changed accent color */}
        </h1>
        <p className="text-slate-600 text-lg">Platform Management Overview</p> {/* Adjusted text color */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {renderStatCard("Total Courses", course.length, <BookOpen size={22} />, "12% from last month", "bg-emerald-100", "text-emerald-600", "text-emerald-600")} {/* New colors */}
        {renderStatCard("Active Students", totalusers.length, <Users size={22} />, "5% from last month", "bg-indigo-100", "text-indigo-600", "text-indigo-600")} {/* New colors */}
        {renderStatCard("Total videos ", videos.length, <TrendingUp size={22} />, "8% increase", "bg-purple-100", "text-purple-600", "text-purple-600")} {/* New colors */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Distribution Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"> {/* Added border */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Course Distribution</h2> {/* Adjusted text color */}
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-colors"> {/* Changed accent color */}
              View All <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
            {course.length > 0 ? (
              course.map((courseItem, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-5 hover:bg-slate-100 transition duration-300 border border-transparent hover:border-slate-200"> {/* Changed background and hover */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3"> {/* Changed accent color */}
                        <BookOpen size={18} className="text-emerald-600" /> {/* Changed accent color */}
                      </div>
                      <span className="font-semibold text-slate-700">{courseItem.title}</span> {/* Adjusted text color */}
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="text-slate-500 mr-2" /> {/* Adjusted text color */}
                      <span className="text-sm font-medium text-slate-600">{courseItem.assignedStudents?.length || 0}</span> {/* Adjusted text color */}
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-3 mr-3"> {/* Changed background */}
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full"
                        style={{ width: `${Math.min((courseItem.assignedStudents?.length || 0) * 2, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-emerald-600"> {/* Changed accent color */}
                      {Math.min((courseItem.assignedStudents?.length || 0) * 2, 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-xs text-slate-500"> {/* Adjusted text color */}
                    <div className="flex items-center">
                      <CheckCircle size={14} className="mr-1 text-emerald-500" /> {/* Changed accent color */}
                      <span>Active</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-slate-400" /> {/* Adjusted icon color */}
                      <span>Updated today</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl"> {/* Changed border color */}
                <BookOpen size={40} className="mx-auto text-slate-400" /> {/* Changed icon color */}
                <p className="text-slate-500 mt-4">No courses available.</p> {/* Adjusted text color */}
                <button className="mt-3 text-indigo-600 text-sm font-medium hover:underline">Add new course</button> {/* Changed accent color */}
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"> {/* Added border */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Course & Student Trends</h2> {/* Adjusted text color */}
            <select className="bg-slate-50 text-slate-700 rounded-lg px-3 py-2 text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"> {/* Changed colors and focus ring */}
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/> {/* Keep for now or map to new purple/indigo */}
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/> {/* Emerald-500 */}
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
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
              <Area type="monotone" dataKey="courses" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorCourses)" /> {/* Indigo-500 */}
              <Line
                type="monotone"
                dataKey="courses"
                stroke="#6366F1" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: '#6366F1', fill: 'white' }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#6366F1', fill: 'white' }}
              />
              <Area type="monotone" dataKey="students" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" /> {/* Emerald-500 */}
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
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div> {/* Indigo-500 */}
              <span className="text-sm text-slate-600">Courses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div> {/* Emerald-500 */}
              <span className="text-sm text-slate-600">Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;