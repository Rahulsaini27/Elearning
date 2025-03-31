import React, { useContext, useEffect, useState } from "react";
import ProjectContext from "../../Context/ProjectContext";
import { useNavigate } from "react-router-dom";

const ClientCourse = () => {
  const { secureUserCourses, loading, error } = useContext(ProjectContext);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const navigate = useNavigate();
  const toggleDescription = (courseId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0f6f6]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4ecdc4]"></div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 h-screen flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center border-l-8 border-[#ff6b6b]">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#ff6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Oops! Something went wrong</h2>
          <p className="text-[#7f8c8d] mb-6">{error}</p>
          <button
            onClick={() => fetchCoursesForUser()}
            className="px-6 py-3 bg-[#4ecdc4] text-white rounded-full hover:bg-[#45b7aa] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f6f6] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-[#2c3e50]">My Courses</h1>
          <div className="bg-white shadow-md rounded-full px-4 py-2 text-sm text-[#2c3e50]">
            Total Courses: {secureUserCourses.length}
          </div>
        </div>

        {secureUserCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {secureUserCourses.map((course) => (
              <div
                key={course._id}
                className="group relative transform transition-all duration-300 hover:-translate-y-2"
              >
                {/* Subtle Shadow Effect */}
                <div className="absolute -inset-1 bg-[#4ecdc4]/20 rounded-2xl opacity-25 group-hover:opacity-50 transition duration-300 blur-md"></div>

                {/* Main Card */}
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-[#e0e0e0]">
                  {/* Angled Header */}
                  <div
                    className="absolute top-0 left-0 right-0 h-24 transform -skew-y-6 origin-top-left"
                    style={{
                      background: 'linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(255,107,107,0.1) 100%)'
                    }}
                  />

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1 rounded-full text-xs font-medium z-10">
                    {course.category}
                  </div>

                  {/* Course Content */}
                  <div className="p-6 pt-24 relative z-20">
                    <h2 className="text-xl font-bold text-[#2c3e50] mb-2 group-hover:text-[#4ecdc4] transition">
                      {course.title}
                    </h2>

                    <p className={`text-sm text-[#7f8c8d] ${expandedDescriptions[course._id] ? '' : 'line-clamp-2'}`}>
                      {course.description}
                    </p>

                    <button
                      className="text-[#4ecdc4] text-xs font-medium mt-2"
                      onClick={() => toggleDescription(course._id)}
                    >
                      {expandedDescriptions[course._id] ? 'Show Less' : 'Read More'}
                    </button>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-[#4ecdc4]/10 rounded-full">
                          <svg className="h-4 w-4 text-[#4ecdc4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-[#7f8c8d]">{course.lessons || 0} Lessons</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-[#4ecdc4]/10 rounded-full">
                          <svg className="h-4 w-4 text-[#4ecdc4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-[#7f8c8d]">{course.videos?.length || 0} Videos</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#e0e0e0] rounded-full h-1.5 mt-6">
                      <div
                        className="bg-[#4ecdc4] h-1.5 rounded-full"
                        style={{ width: '35%' }}
                      ></div>
                    </div>

                    {/* Continue Learning Button */}
                    <button
                      onClick={() => navigate(`/client/course/${course._id}`)}
                      className="w-full py-3 px-4 bg-[#4ecdc4] hover:bg-[#45b7aa] text-white text-sm font-medium rounded-lg flex items-center justify-center mt-4 transition-all group"
                    >
                      Continue Learning
                      <svg
                        className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md mx-auto">
            <h3 className="text-xl font-medium text-[#2c3e50] mb-2">No courses yet</h3>
            <p className="text-sm text-[#7f8c8d] mb-6">You haven't enrolled in any courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCourse;