import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProjectContext from '../../Context/ProjectContext';
import { AlertContext } from '../../Context/AlertContext';
import {
    FileText,
    Award,
    Clock,
    Download,
    Loader2,
    BookOpen,
    Video,
    FileX,
    Star,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Users
} from 'lucide-react';
import { format } from 'date-fns';

const ClientAssignmentResults = () => {
    const { API_BASE_URL, API_URL } = useContext(ProjectContext);
    const { Toast } = useContext(AlertContext);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const [gradedSubmissions, setGradedSubmissions] = useState([]);
    const [pendingSubmissions, setPendingSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentResults = async () => {
            if (!token || !userId) {
                setError("You are not logged in. Please log in to view your assignment results.");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}${API_URL}/assignments/my-results`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setGradedSubmissions(response.data.gradedSubmissions);
                setPendingSubmissions(response.data.pendingSubmissions);
            } catch (err) {
                setError("Failed to load your assignment results. Please try again.");
                Toast.fire({ icon: "error", title: "Failed to load results" });
            } finally {
                setLoading(false);
            }
        };

        fetchStudentResults();
    }, [token, userId, API_BASE_URL, API_URL, Toast]);

    const handleDownloadSubmissionFile = async (submissionUrl) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_URL}/assignments/submission-file-url?submissionUrl=${encodeURIComponent(submissionUrl)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success && response.data.downloadUrl) {
                window.open(response.data.downloadUrl, '_blank');
                Toast.fire({ icon: "success", title: "Download started!" });
            } else {
                Toast.fire({ icon: "error", title: "Failed to get download link." });
            }
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to download file" });
        }
    };

    // Calculate statistics
    const totalSubmissions = gradedSubmissions.length + pendingSubmissions.length;
    const averageGrade = gradedSubmissions.length > 0 
        ? Math.round(gradedSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / gradedSubmissions.length)
        : 0;
    const completionRate = totalSubmissions > 0 
        ? Math.round((gradedSubmissions.length / totalSubmissions) * 100)
        : 0;

    const getGradeColor = (grade) => {
        if (grade >= 90) return 'text-green-600 bg-green-100';
        if (grade >= 80) return 'text-blue-600 bg-blue-100';
        if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getGradeIcon = (grade) => {
        if (grade >= 90) return <Award className="h-5 w-5" />;
        if (grade >= 80) return <Star className="h-5 w-5" />;
        if (grade >= 70) return <CheckCircle className="h-5 w-5" />;
        return <AlertCircle className="h-5 w-5" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-gray-700 font-medium text-lg">Loading assignment results...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg p-8 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Results</h2>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const NoAssignmentsFound = ({ message, icon: Icon, iconColor }) => (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg p-8">
            <div className={`w-16 h-16 ${iconColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Assignments Here!</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">{message}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Award className="h-7 w-7 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Assignment Results</h1>
                            <p className="text-lg text-gray-600">Track your progress and achievements</p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalSubmissions}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                                    <p className="text-3xl font-bold text-gray-900">{averageGrade}%</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                    <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-orange-500" />
                                </div>
                            </div>
                            <div className="mt-4 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${completionRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Graded Assignments Section */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Award className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Graded Assignments</h2>
                                <p className="text-gray-600">{gradedSubmissions.length} completed</p>
                            </div>
                        </div>
                        
                        {gradedSubmissions.length > 0 ? (
                            <div className="space-y-6">
                                {gradedSubmissions.map((submission) => (
                                    <div key={submission._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                                                        {submission.assignment?.title || "Unknown Assignment"}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-gray-600">
                                                            <BookOpen className="h-4 w-4 mr-2" />
                                                            <span className="text-sm">{submission.assignment?.course?.title || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Video className="h-4 w-4 mr-2" />
                                                            <span className="text-sm">{submission.assignment?.video?.title || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Clock className="h-4 w-4 mr-2" />
                                                            <span className="text-sm">Submitted {format(new Date(submission.submittedAt), "MMM d, yyyy")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Grade Badge */}
                                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold ${getGradeColor(submission.grade || 0)}`}>
                                                    {getGradeIcon(submission.grade || 0)}
                                                    <span>{submission.grade !== undefined ? `${submission.grade}/100` : 'N/A'}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Feedback Section */}
                                            {submission.feedback && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                                                    <h4 className="font-semibold text-gray-900 mb-2">Instructor Feedback</h4>
                                                    <p className="text-gray-700 text-sm leading-relaxed">{submission.feedback}</p>
                                                </div>
                                            )}
                                            
                                            {/* Action Button */}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleDownloadSubmissionFile(submission.submissionUrl)}
                                                    className="group bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                                                >
                                                    <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <NoAssignmentsFound 
                                message="You currently have no graded assignments. Complete some assignments to see your results here!"
                                icon={Award}
                                iconColor="bg-green-500"
                            />
                        )}
                    </div>

                    {/* Pending Assignments Section */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Clock className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Pending Review</h2>
                                <p className="text-gray-600">{pendingSubmissions.length} awaiting grades</p>
                            </div>
                        </div>
                        
                        {pendingSubmissions.length > 0 ? (
                            <div className="space-y-6">
                                {pendingSubmissions.map((submission) => (
                                    <div key={submission._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                                                        {submission.assignment?.title || "Unknown Assignment"}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-gray-600">
                                                            <BookOpen className="h-4 w-4 mr-2" />
                                                            <span className="text-sm">{submission.assignment?.course?.title || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Video className="h-4 w-4 mr-2" />
                                                            <span className="text-sm">{submission.assignment?.video?.title || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Clock className="h-4 w-4 mr-2" />
                                                            <span className="text-sm">Submitted {format(new Date(submission.submittedAt), "MMM d, yyyy")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Pending Status */}
                                                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold bg-orange-100 text-orange-600">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                    <span>Under Review</span>
                                                </div>
                                            </div>
                                            
                                            {/* Status Message */}
                                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-5 w-5 text-orange-500" />
                                                    <p className="text-orange-800 font-medium">Your submission is being reviewed</p>
                                                </div>
                                                <p className="text-orange-700 text-sm mt-1">You'll receive your grade and feedback soon!</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <NoAssignmentsFound 
                                message="All your submitted assignments have been graded. Great job staying on top of your work!"
                                icon={CheckCircle}
                                iconColor="bg-orange-500"
                            />
                        )}
                    </div>
                </div>

                {/* Motivational Footer */}
                {(gradedSubmissions.length > 0 || pendingSubmissions.length > 0) && (
                    <div className="mt-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">Keep Up the Great Work!</h3>
                        <p className="text-blue-100 text-lg">
                            You've completed {gradedSubmissions.length} assignments with an average grade of {averageGrade}%. 
                            Continue learning and growing!
                        </p>
                        {pendingSubmissions.length > 0 && (
                            <p className="text-blue-100 text-sm mt-2">
                                {pendingSubmissions.length} assignments are currently being reviewed.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientAssignmentResults;