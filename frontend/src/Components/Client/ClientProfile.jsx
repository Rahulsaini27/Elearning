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


    const { user ,loading} = useContext(ProjectContext)
    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen bg-[#f0f6f6]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4ecdc4]"></div>
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
        <div className="bg-[#f0f6f6] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            {/* Angled Background Header */}
                            <div
                                className="h-32 transform -skew-y-6 origin-top-left"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(78,205,196,0.2) 0%, rgba(255,107,107,0.2) 100%)'
                                }}
                            />

                            <div className="px-6 -mt-16 relative z-20">
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white shadow-lg overflow-hidden">
                                    <div className="w-full h-full bg-[#4ecdc4]/10 flex items-center justify-center">
                                        <User className="w-16 h-16 text-[#4ecdc4]" />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h1 className="text-2xl font-bold text-[#2c3e50]">{user?.name}</h1>
                                    <p className="text-[#7f8c8d] mb-4">{user?.occupation}</p>

                                    <div className="flex justify-center space-x-4 mb-6">
                                        <div className="bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1 rounded-full text-xs">
                                            {user?.education} & Tech Enthusiast
                                        </div>
                                        <div className="bg-[#4ecdc4]/10 text-[#4ecdc4] px-3 py-1 rounded-full text-xs">
                                            {user?.totalAchievements || "0"} Achievements
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white rounded-3xl shadow-2xl mt-8 p-6">
                            <h2 className="text-xl font-bold text-[#2c3e50] mb-4 flex items-center">
                                <Mail className="mr-3 text-[#4ecdc4]" />
                                Contact Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Mail className="mr-3 text-[#7f8c8d]" />
                                    <span className="text-[#2c3e50]">{user?.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-3 text-[#7f8c8d]" />
                                    <span className="text-[#2c3e50]">{user?.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-3 text-[#7f8c8d]" />
                                    <span className="text-[#2c3e50]">{user?.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Courses Section */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-[#2c3e50] flex items-center">
                                    <Book className="mr-4 text-[#4ecdc4]" />
                                    My Courses
                                </h2>
                                <div className="bg-[#4ecdc4]/10 text-[#4ecdc4] px-4 py-2 rounded-full">
                                    Total Courses: {user?.enrolledCourses.length}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {user?.enrolledCourses.map((course) => (
                                    <div onClick={() => navigate(`/client/course/${course._id}`)}
                                        key={course._id}
                                        className="group cursor-pointer relative transform transition-all duration-300 hover:-translate-y-2"
                                    >
                                        {/* Subtle Shadow Effect */}
                                        <div className="absolute -inset-1 bg-[#4ecdc4]/20 rounded-2xl opacity-25 group-hover:opacity-50 transition duration-300 blur-md"></div>

                                        <div className="relative bg-white rounded-2xl shadow-xl border border-[#e0e0e0] overflow-hidden">
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

                                            <div className="p-6 pt-24 relative z-20">
                                                <h3 className="text-xl font-bold text-[#2c3e50] mb-2 group-hover:text-[#4ecdc4] transition">
                                                    {course.title}
                                                </h3>

                                                <p className={`text-sm text-[#7f8c8d] ${expandedCourses[course._id] ? '' : 'line-clamp-2'}`}>
                                                    {course.description}
                                                </p>

                                                <button
                                                    className="text-[#4ecdc4] text-xs font-medium mt-2 flex items-center"
                                                    onClick={() => toggleCourseDescription(course._id)}
                                                >
                                                    {expandedCourses[course._id] ? 'Show Less' : 'Read More'}
                                                    {expandedCourses[course._id] ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                                                </button>

                                                {/* Course Stats */}
                                                <div className="flex justify-between items-center mt-6">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="p-1.5 bg-[#4ecdc4]/10 rounded-full">
                                                            <Book className="h-4 w-4 text-[#4ecdc4]" />
                                                        </div>
                                                        <span className="text-xs text-[#7f8c8d]">{course.lessons} Lessons</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="p-1.5 bg-[#4ecdc4]/10 rounded-full">
                                                            <Video className="h-4 w-4 text-[#4ecdc4]" />
                                                        </div>
                                                        <span className="text-xs text-[#7f8c8d]">{course.videos.length} Videos</span>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}

                                                {/* Continue Learning Button */}
                                                <button
                                                    onClick={() => navigate(`/client/course/${course._id}`)}

                                                    className="w-full py-3 px-4 bg-[#4ecdc4] hover:bg-[#45b7aa] text-white text-sm font-medium rounded-lg flex items-center justify-center mt-4 transition-all group"
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

                        {/* Account Details */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            <h2 className="text-3xl font-bold text-[#2c3e50] flex items-center mb-6">
                                <Calendar className="mr-4 text-[#4ecdc4]" />
                                Account Overview
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[#7f8c8d] text-sm mb-2">Joined Date</p>
                                    <p className="text-[#2c3e50] font-medium">
                                        {new Date(user?.created).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#7f8c8d] text-sm mb-2">Total Learning Time</p>
                                    <p className="text-[#2c3e50] font-medium">
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