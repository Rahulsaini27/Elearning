import React, { useContext, useState } from 'react';
import {
    User,
    Book,
    Video,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ArrowRight,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import ProjectContext from '../../Context/ProjectContext';
import { useNavigate } from 'react-router-dom';

const ClientProfile = () => {
    const [expandedCourses, setExpandedCourses] = useState({});
    const navigate = useNavigate();
    const { user, loading } = useContext(ProjectContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    const toggleCourseDescription = (courseId) => {
        setExpandedCourses(prev => ({
            ...prev,
            [courseId]: !prev[courseId]
        }));
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div
                                className="h-32 transform -skew-y-6 origin-top-left"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)'
                                }}
                            />
                            <div className="px-6 -mt-16 relative z-20">
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white shadow-lg overflow-hidden">
                                    <div className="w-full h-full bg-blue-500/10 flex items-center justify-center">
                                        <User className="w-16 h-16 text-blue-500" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                                    <p className="text-gray-600 mb-4">{user?.occupation}</p>
                                    <div className="flex justify-center space-x-4 mb-6">
                                        <div className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs">
                                            {user?.education} & Tech Enthusiast
                                        </div>
                                        <div className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs">
                                            {user?.totalAchievements || "0"} Achievements
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl shadow-2xl mt-8 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Mail className="mr-3 text-blue-500" />
                                Contact Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Mail className="mr-3 text-gray-600" />
                                    <span className="text-gray-800">{user?.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-3 text-gray-600" />
                                    <span className="text-gray-800">{user?.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-3 text-gray-600" />
                                    <span className="text-gray-800">{user?.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                                    <Book className="mr-4 text-blue-500" />
                                    My Courses
                                </h2>
                                <div className="bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full">
                                    Total Courses: {user?.enrolledCourses.length}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {user?.enrolledCourses.map((course) => (
                                    <div onClick={() => navigate(`/client/course/${course._id}`)}
                                        key={course._id}
                                        className="group cursor-pointer relative transform transition-all duration-300 hover:-translate-y-2"
                                    >
                                        <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl opacity-25 group-hover:opacity-50 transition duration-300 blur-md"></div>
                                        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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
                                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                                                    {course.title}
                                                </h3>
                                                <p className={`text-sm text-gray-600 ${expandedCourses[course._id] ? '' : 'line-clamp-2'}`}>
                                                    {course.description}
                                                </p>
                                                <button
                                                    className="text-blue-600 text-xs font-medium mt-2 flex items-center"
                                                    onClick={(e) => { e.stopPropagation(); toggleCourseDescription(course._id); }}
                                                >
                                                    {expandedCourses[course._id] ? 'Show Less' : 'Read More'}
                                                    {expandedCourses[course._id] ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                                                </button>
                                                <div className="flex justify-between items-center mt-6">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="p-1.5 bg-blue-500/10 rounded-full">
                                                            <Book className="h-4 w-4 text-blue-500" />
                                                        </div>
                                                        <span className="text-xs text-gray-600">{course.lessons} Lessons</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="p-1.5 bg-blue-500/10 rounded-full">
                                                            <Video className="h-4 w-4 text-blue-500" />
                                                        </div>
                                                        <span className="text-xs text-gray-600">{course.videos.length} Videos</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center justify-center mt-4 transition-all group"
                                                >
                                                    Continue Learning
                                                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
                                <Calendar className="mr-4 text-blue-500" />
                                Account Overview
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-600 text-sm mb-2">Joined Date</p>
                                    <p className="text-gray-800 font-medium">
                                        {new Date(user?.created).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm mb-2">Total Learning Time</p>
                                    <p className="text-gray-800 font-medium">
                                        126 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;