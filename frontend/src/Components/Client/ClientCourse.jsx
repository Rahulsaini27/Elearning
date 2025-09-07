import React, { useContext, useState } from "react";
import ProjectContext from "../../Context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, Video } from 'lucide-react';

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
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 h-screen flex items-center justify-center">
                <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md text-center border-l-8 border-red-500">
                    <div className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-800">My Courses</h1>
                </div>

                {secureUserCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {secureUserCourses.map((course) => (
                            <div
                                key={course._id}
                                className="group relative transform transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl opacity-25 group-hover:opacity-50 transition duration-300 blur-md"></div>
                                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                                    <div
                                        className="absolute top-0 left-0 right-0 h-24 transform -skew-y-6 origin-top-left"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)'
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-medium z-10">
                                        {course.category}
                                    </div>
                                    <div className="p-6 pt-24 relative z-20">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                                            {course.title}
                                        </h2>
                                        <p className={`text-sm text-gray-600 ${expandedDescriptions[course._id] ? '' : 'line-clamp-2'}`}>
                                            {course.description}
                                        </p>
                                        <button
                                            className="text-blue-600 text-xs font-medium mt-2"
                                            onClick={() => toggleDescription(course._id)}
                                        >
                                            {expandedDescriptions[course._id] ? 'Show Less' : 'Read More'}
                                        </button>
                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 bg-blue-500/10 rounded-full">
                                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">{course.lessons || 0} Lessons</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="p-1.5 bg-blue-500/10 rounded-full">
                                                    <Video className="h-4 w-4 text-blue-500" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">{course.videos?.length || 0} Videos</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-6">
                                            <div
                                                className="bg-blue-500 h-1.5 rounded-full"
                                                style={{ width: '35%' }}
                                            ></div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/client/course/${course._id}`)}
                                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center justify-center mt-4 transition-all group"
                                        >
                                            Continue Learning
                                            <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No courses yet</h3>
                        <p className="text-sm text-gray-600 mb-6">You haven't enrolled in any courses.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientCourse;