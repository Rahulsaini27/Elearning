// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import ProjectContext from '../../Context/ProjectContext';
// import { AlertContext } from '../../Context/AlertContext';
// import {
//     FileText,
//     CheckCircle,
//     XCircle,
//     BookOpen,
//     Video,
//     Award,
//     Clock,
//     Download,
//     Loader2 // For loading states
// } from 'lucide-react';
// import { format } from 'date-fns';

// const ClientAssignmentResults = () => {
//     const { API_BASE_URL, API_URL } = useContext(ProjectContext);
//     const { Toast } = useContext(AlertContext);
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');

//     const [gradedSubmissions, setGradedSubmissions] = useState([]);
//     const [pendingSubmissions, setPendingSubmissions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchStudentResults = async () => {
//             if (!token || !userId) {
//                 setError("You are not logged in. Please log in to view your assignment results.");
//                 setLoading(false);
//                 return;
//             }

//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get(
//                     `${API_BASE_URL}${API_URL}/assignments/my-results`,
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                         // userId is automatically picked from token in backend, but sending in params too doesn't hurt.
//                         // params: { userId: userId } 
//                     }
//                 );
//                 setGradedSubmissions(response.data.gradedSubmissions);
//                 setPendingSubmissions(response.data.pendingSubmissions);
//             } catch (err) {
//                 console.error("Error fetching student assignment results:", err);
//                 setError("Failed to load your assignment results. Please try again.");
//                 Toast.fire({ icon: "error", title: "Failed to load results" });
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStudentResults();
//     }, [token, userId, API_BASE_URL, API_URL, Toast]);

//     const handleDownloadSubmissionFile = async (submissionUrl) => {
//         try {
//             const response = await axios.get(
//                 `${API_BASE_URL}${API_URL}/assignments/submission-file-url?submissionUrl=${encodeURIComponent(submissionUrl)}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             if (response.data.success && response.data.downloadUrl) {
//                 window.open(response.data.downloadUrl, '_blank');
//                 Toast.fire({ icon: "success", title: "Download started!" });
//             } else {
//                 Toast.fire({ icon: "error", title: "Failed to get download link." });
//             }
//         } catch (error) {
//             console.error("Error downloading submission file:", error);
//             Toast.fire({ icon: "error", title: "Failed to download file" });
//         }
//     };


//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
//                 <Loader2 className="animate-spin text-indigo-600 w-16 h-16 mb-4" />
//                 <p className="text-slate-700 text-lg">Loading assignment results...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
//                 <XCircle className="text-red-600 w-16 h-16 mb-4" />
//                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Results</h2>
//                 <p className="text-slate-600 text-center">{error}</p>
//             </div>
//         );
//     }

//     const NoAssignmentsFound = ({ message }) => (
//         <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg p-8 text-center">
//             <FileText className="w-16 h-16 text-slate-400 mb-4" />
//             <h2 className="text-2xl font-bold text-slate-800 mb-3">No Assignments Here!</h2>
//             <p className="text-slate-600 max-w-md">{message}</p>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-slate-50 p-4">
//             <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-3 border-slate-200">My Assignment Results</h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Graded Assignments */}
//                 <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
//                     <h2 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center">
//                         <Award className="mr-3" size={24} /> Graded Assignments ({gradedSubmissions.length})
//                     </h2>
//                     {gradedSubmissions.length > 0 ? (
//                         <div className="space-y-4">
//                             {gradedSubmissions.map((submission) => (
//                                 <div key={submission._id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
//                                     <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
//                                         <FileText className="mr-2" size={20} />
//                                         {submission.assignment?.title || "Unknown Assignment"}
//                                     </h3>
//                                     <div className="text-sm text-slate-600 space-y-1 mb-3">
//                                         <p className="flex items-center"><BookOpen size={16} className="mr-2 text-slate-500" />Course: {submission.assignment?.course?.title || "N/A"}</p>
//                                         <p className="flex items-center"><Video size={16} className="mr-2 text-slate-500" />Video: {submission.assignment?.video?.title || "N/A"}</p>
//                                         <p className="flex items-center"><Clock size={16} className="mr-2 text-slate-500" />Submitted: {format(new Date(submission.submittedAt), "MMM d, yyyy HH:mm")}</p>
//                                     </div>
//                                     <div className="border-t border-emerald-200 pt-3 mt-3">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <p className="text-lg font-bold text-emerald-700 flex items-center">
//                                                 <Award className="mr-2" size={20} /> Grade: {submission.grade !== undefined && submission.grade !== null ? `${submission.grade}/100` : 'N/A'}
//                                             </p>
//                                             <button
//                                                 onClick={() => handleDownloadSubmissionFile(submission.submissionUrl)}
//                                                 className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
//                                             >
//                                                 <Download size={16} className="mr-1" /> Download Submitted File
//                                             </button>
//                                         </div>
//                                         {submission.feedback && (
//                                             <p className="text-sm text-slate-700"><strong>Feedback:</strong> {submission.feedback}</p>
//                                         )}
//                                         {submission.gradedBy && (
//                                             <p className="text-xs text-slate-500 mt-1">Graded by: {submission.gradedBy?.email || 'Admin'} on {format(new Date(submission.gradedAt), "MMM d, yyyy HH:mm")}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <NoAssignmentsFound message="You currently have no graded assignments." />
//                     )}
//                 </div>

//                 {/* Pending Assignments */}
//                 <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
//                     <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
//                         <Clock className="mr-3" size={24} /> Pending Assignments ({pendingSubmissions.length})
//                     </h2>
//                     {pendingSubmissions.length > 0 ? (
//                         <div className="space-y-4">
//                             {pendingSubmissions.map((submission) => (
//                                 <div key={submission._id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
//                                     <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
//                                         <FileText className="mr-2" size={20} />
//                                         {submission.assignment?.title || "Unknown Assignment"}
//                                     </h3>
//                                     <div className="text-sm text-slate-600 space-y-1 mb-3">
//                                         <p className="flex items-center"><BookOpen size={16} className="mr-2 text-slate-500" />Course: {submission.assignment?.course?.title || "N/A"}</p>
//                                         <p className="flex items-center"><Video size={16} className="mr-2 text-slate-500" />Video: {submission.assignment?.video?.title || "N/A"}</p>
//                                         <p className="flex items-center"><Clock size={16} className="mr-2 text-slate-500" />Submitted: {format(new Date(submission.submittedAt), "MMM d, yyyy HH:mm")}</p>
//                                     </div>
//                                     <div className="border-t border-orange-200 pt-3 mt-3">
//                                         <p className="text-lg font-bold text-orange-700 flex items-center">
//                                             <XCircle className="mr-2" size={20} /> Status: Pending Review
//                                         </p>
//                                         <button
//                                             onClick={() => handleDownloadSubmissionFile(submission.submissionUrl)}
//                                             className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium mt-2"
//                                         >
//                                             <Download size={16} className="mr-1" /> Download My Submission
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <NoAssignmentsFound message="All your submitted assignments have been graded. Great job!" />
//                     )}
//                 </div>
//             </div>

//             {/* If no assignments have been submitted at all */}
//             {gradedSubmissions.length === 0 && pendingSubmissions.length === 0 && (
//                 <div className="mt-8">
//                     <NoAssignmentsFound message="You haven't submitted any assignments yet. Keep up the good work and check your courses for assignments!" />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ClientAssignmentResults;


import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProjectContext from '../../Context/ProjectContext';
import { AlertContext } from '../../Context/AlertContext';
import {
    FileText,
    CheckCircle,
    XCircle,
    BookOpen,
    Video,
    Award,
    Clock,
    Download,
    Loader2 // For loading states
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
            setError(null);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}${API_URL}/assignments/my-results`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        // userId is automatically picked from token in backend, but sending in params too doesn't hurt.
                        // params: { userId: userId } 
                    }
                );
                setGradedSubmissions(response.data.gradedSubmissions);
                setPendingSubmissions(response.data.pendingSubmissions);
            } catch (err) {
                console.error("Error fetching student assignment results:", err);
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
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success && response.data.downloadUrl) {
                window.open(response.data.downloadUrl, '_blank');
                Toast.fire({ icon: "success", title: "Download started!" });
            } else {
                Toast.fire({ icon: "error", title: "Failed to get download link." });
            }
        } catch (error) {
            console.error("Error downloading submission file:", error);
            Toast.fire({ icon: "error", title: "Failed to download file" });
        }
    };


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600 w-16 h-16 mb-4" />
                <p className="text-slate-700 text-lg">Loading assignment results...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <XCircle className="text-red-600 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Results</h2>
                <p className="text-slate-600 text-center">{error}</p>
            </div>
        );
    }

    const NoAssignmentsFound = ({ message }) => (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg p-8 text-center">
            <FileText className="w-16 h-16 text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-3">No Assignments Here!</h2>
            <p className="text-slate-600 max-w-md">{message}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-3 border-slate-200">My Assignment Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Graded Assignments */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <h2 className="text-2xl font-bold text-emerald-600 mb-4 flex items-center">
                        <Award className="mr-3" size={24} /> Graded Assignments ({gradedSubmissions.length})
                    </h2>
                    {gradedSubmissions.length > 0 ? (
                        <div className="space-y-4">
                            {gradedSubmissions.map((submission) => (
                                <div key={submission._id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
                                        <FileText className="mr-2" size={20} />
                                        {submission.assignment?.title || "Unknown Assignment"}
                                    </h3>
                                    <div className="text-sm text-slate-600 space-y-1 mb-3">
                                        <p className="flex items-center"><BookOpen size={16} className="mr-2 text-slate-500" />Course: {submission.assignment?.course?.title || "N/A"}</p>
                                        <p className="flex items-center"><Video size={16} className="mr-2 text-slate-500" />Video: {submission.assignment?.video?.title || "N/A"}</p>
                                        <p className="flex items-center"><Clock size={16} className="mr-2 text-slate-500" />Submitted: {format(new Date(submission.submittedAt), "MMM d, yyyy HH:mm")}</p>
                                    </div>
                                    <div className="border-t border-emerald-200 pt-3 mt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-lg font-bold text-emerald-700 flex items-center">
                                                <Award className="mr-2" size={20} /> Grade: {submission.grade !== undefined && submission.grade !== null ? `${submission.grade}/100` : 'N/A'}
                                            </p>
                                            <button
                                                onClick={() => handleDownloadSubmissionFile(submission.submissionUrl)}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                                            >
                                                <Download size={16} className="mr-1" /> Download Submitted File
                                            </button>
                                        </div>
                                        {submission.feedback && (
                                            <p className="text-sm text-slate-700"><strong>Feedback:</strong> {submission.feedback}</p>
                                        )}
                                        {submission.gradedBy && (
                                            <p className="text-xs text-slate-500 mt-1">Graded by: {submission.gradedBy?.email || 'Admin'} on {format(new Date(submission.gradedAt), "MMM d, yyyy HH:mm")}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <NoAssignmentsFound message="You currently have no graded assignments." />
                    )}
                </div>

                {/* Pending Assignments */}
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <h2 className="text-2xl font-bold text-orange-600 mb-4 flex items-center">
                        <Clock className="mr-3" size={24} /> Pending Assignments ({pendingSubmissions.length})
                    </h2>
                    {pendingSubmissions.length > 0 ? (
                        <div className="space-y-4">
                            {pendingSubmissions.map((submission) => (
                                <div key={submission._id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                    <h3 className="text-lg font-semibold text-slate-800 flex items-center mb-2">
                                        <FileText className="mr-2" size={20} />
                                        {submission.assignment?.title || "Unknown Assignment"}
                                    </h3>
                                    <div className="text-sm text-slate-600 space-y-1 mb-3">
                                        <p className="flex items-center"><BookOpen size={16} className="mr-2 text-slate-500" />Course: {submission.assignment?.course?.title || "N/A"}</p>
                                        <p className="flex items-center"><Video size={16} className="mr-2 text-slate-500" />Video: {submission.assignment?.video?.title || "N/A"}</p>
                                        <p className="flex items-center"><Clock size={16} className="mr-2 text-slate-500" />Submitted: {format(new Date(submission.submittedAt), "MMM d, yyyy HH:mm")}</p>
                                    </div>
                                    <div className="border-t border-orange-200 pt-3 mt-3">
                                        <p className="text-lg font-bold text-orange-700 flex items-center">
                                            <XCircle className="mr-2" size={20} /> Status: Pending Review
                                        </p>
                                        <button
                                            onClick={() => handleDownloadSubmissionFile(submission.submissionUrl)}
                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium mt-2"
                                        >
                                            <Download size={16} className="mr-1" /> Download My Submission
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <NoAssignmentsFound message="All your submitted assignments have been graded. Great job!" />
                    )}
                </div>
            </div>

            {/* If no assignments have been submitted at all */}
            {gradedSubmissions.length === 0 && pendingSubmissions.length === 0 && (
                <div className="mt-8">
                    <NoAssignmentsFound message="You haven't submitted any assignments yet. Keep up the good work and check your courses for assignments!" />
                </div>
            )}
        </div>
    );
};

export default ClientAssignmentResults;
