

// import React, { useContext, useEffect, useState } from "react";
// import ProjectContext from "../../Context/ProjectContext";
// import { AlertContext } from "../../Context/AlertContext";
// import axios from "axios";
// import {
//     FileText,
//     Download,
//     CheckCircle,
//     XCircle,
//     UserCircle,
//     BookOpen,
//     Video,
//     Calendar,
//     ChevronDown,
//     ChevronUp,
//     Loader2,
//     Award // NEW: Icon for grading
// } from 'lucide-react';
// import { format } from "date-fns";

// const AdminAssignments = () => {
//     const { API_BASE_URL, API_URL } = useContext(ProjectContext);
//     const { Toast } = useContext(AlertContext);
//     const admintoken = localStorage.getItem("admintoken");

//     const [assignmentsOverview, setAssignmentsOverview] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [expandedAssignments, setExpandedAssignments] = useState({});

//     // --- NEW STATES FOR STUDENT LIST MODAL ---
//     const [showStudentListModal, setShowStudentListModal] = useState(false);
//     const [modalStudentList, setModalStudentList] = useState([]);
//     const [modalTitle, setModalTitle] = useState("");
//     // --- END NEW STATES ---

//     // NEW STATE: To manage loading state for original assignment downloads
//     const [downloadingOriginalAssignment, setDownloadingOriginalAssignment] = useState({});

//     // NEW STATES FOR GRADING MODAL
//     const [showGradingModal, setShowGradingModal] = useState(false);
//     const [currentSubmissionToGrade, setCurrentSubmissionToGrade] = useState(null);
//     const [gradeInput, setGradeInput] = useState("");
//     const [feedbackInput, setFeedbackInput] = useState("");
//     const [gradingLoading, setGradingLoading] = useState(false);


//     const fetchAssignmentsOverview = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get(
//                 `${API_BASE_URL}${API_URL}/assignments/admin/overview`,
//                 {
//                     headers: { Authorization: `Bearer ${admintoken}` },
//                 }
//             );
//             setAssignmentsOverview(response.data.assignmentsOverview);
//         } catch (err) {
//             console.error("Error fetching assignments overview:", err);
//             setError("Failed to load assignments. Please try again.");
//             Toast.fire({ icon: "error", title: "Failed to load assignments" });
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (admintoken) {
//             fetchAssignmentsOverview();
//         }
//     }, [admintoken, API_BASE_URL, API_URL, Toast]);

//     // This function is for downloading *student submissions* (now fetches a presigned URL)
//    const handleDownload = async (submissionUrl) => {
//     try {
//         // First, get the presigned URL for the submission file
//         const response = await axios.get(
//             `${API_BASE_URL}${API_URL}/assignments/submission-file-url?submissionUrl=${encodeURIComponent(submissionUrl)}`,
//             {
//                 headers: { Authorization: `Bearer ${admintoken}` },
//             }
//         );

//         if (response.data.success && response.data.downloadUrl) {
//             // Open the presigned URL in a new tab/window, which will trigger download
//             window.open(response.data.downloadUrl, '_blank');
//             Toast.fire({ icon: "success", title: "Download started!" });
//         } else {
//             Toast.fire({ icon: "error", title: "Failed to get download link." });
//         }

//     } catch (error) {
//         console.error("Error downloading submission file:", error);
//         Toast.fire({ icon: "error", title: "Failed to download file" });
//     }
// };


//     // NEW FUNCTION: To handle downloading the *original assignment file*
//     const handleDownloadOriginalAssignment = async (assignmentUrl, assignmentId) => {
//         if (!admintoken) { // Ensure admin token exists
//             Toast.fire({ icon: "error", title: "You must be logged in to download assignments." });
//             return;
//         }
//         setDownloadingOriginalAssignment(prev => ({ ...prev, [assignmentId]: true }));
//         try {
//             const response = await axios.get(
//                 `${API_BASE_URL}${API_URL}/assignments/generate-assignment-download-url`,
//                 {
//                     params: { assignmentUrl: assignmentUrl },
//                     headers: { Authorization: `Bearer ${admintoken}` }, // Admin uses admintoken
//                 }
//             );

//             if (response.data.success && response.data.downloadUrl) {
//                 // Open the presigned URL in a new tab/window, which will trigger download
//                 window.open(response.data.downloadUrl, '_blank');
//                 Toast.fire({ icon: "success", title: "Download initiated!" });
//             } else {
//                 Toast.fire({ icon: "error", title: "Failed to get download link." });
//             }
//         } catch (error) {
//             console.error("Error generating original assignment download URL:", error);
//             Toast.fire({
//                 icon: "error",
//                 title: "Failed to download original assignment",
//                 text: error.response?.data?.message || error.message,
//             });
//         } finally {
//             setDownloadingOriginalAssignment(prev => ({ ...prev, [assignmentId]: false }));
//         }
//     };

//     const toggleAssignmentExpand = (assignmentId) => {
//         setExpandedAssignments(prev => ({
//             ...prev,
//             [assignmentId]: !prev[assignmentId]
//         }));
//     };

//     // --- NEW FUNCTION TO OPEN STUDENT LIST MODAL ---
//     const openStudentListModal = (assignment, type) => {
//         let studentsToDisplay = [];
//         let title = "";

//         if (type === "submitted") {
//             studentsToDisplay = assignment.studentStatuses.filter(s => s.submitted);
//             title = `Submitted Students for "${assignment.title}"`;
//         } else if (type === "pending") {
//             studentsToDisplay = assignment.studentStatuses.filter(s => !s.submitted);
//             title = `Pending Students for "${assignment.title}"`;
//         }

//         setModalStudentList(studentsToDisplay);
//         setModalTitle(title);
//         setShowStudentListModal(true);
//     };

//     const closeStudentListModal = () => {
//         setShowStudentListModal(false);
//         setModalStudentList([]);
//         setModalTitle("");
//     };
//     // --- END NEW FUNCTION ---

//     // NEW FUNCTIONS FOR GRADING
//     const openGradingModal = (submission) => {
//         setCurrentSubmissionToGrade(submission);
//         setGradeInput(submission.submissionDetails?.grade || ""); // Pre-fill if already graded
//         setFeedbackInput(submission.submissionDetails?.feedback || ""); // Pre-fill if already graded
//         setShowGradingModal(true);
//     };

//     const closeGradingModal = () => {
//         setShowGradingModal(false);
//         setCurrentSubmissionToGrade(null);
//         setGradeInput("");
//         setFeedbackInput("");
//         setGradingLoading(false);
//     };

//     const handleGradeSubmit = async (e) => {
//         e.preventDefault();
//         if (!currentSubmissionToGrade) return;

//         const submissionId = currentSubmissionToGrade.submissionDetails._id;
//         const parsedGrade = parseInt(gradeInput, 10);

//         if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 100) {
//             Toast.fire({ icon: "error", title: "Grade must be a number between 0 and 100." });
//             return;
//         }

//         setGradingLoading(true);
//         try {
//             await axios.put(
//                 `${API_BASE_URL}${API_URL}/assignments/grade-submission/${submissionId}`,
//                 { grade: parsedGrade, feedback: feedbackInput },
//                 { headers: { Authorization: `Bearer ${admintoken}` } }
//             );
//             Toast.fire({ icon: "success", title: "Submission graded successfully!" });
//             closeGradingModal();
//             fetchAssignmentsOverview(); // Re-fetch data to update overview including grades
//         } catch (error) {
//             console.error("Error grading submission:", error);
//             Toast.fire({
//                 icon: "error",
//                 title: "Failed to grade submission",
//                 text: error.response?.data?.message || error.message,
//             });
//         } finally {
//             setGradingLoading(false);
//         }
//     };
//     // END NEW FUNCTIONS FOR GRADING


//     if (loading) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
//                 <Loader2 className="animate-spin text-indigo-600 w-16 h-16 mb-4" />
//                 <p className="text-slate-700 text-lg">Loading assignments...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
//                 <XCircle className="text-red-600 w-16 h-16 mb-4" />
//                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Assignments</h2>
//                 <p className="text-slate-600 text-center">{error}</p>
//             </div>
//         );
//     }

//     // CloudDashed is not imported, replacing with a generic alert icon or a simple message.
//     // If you have a specific Lucide icon for "No data", you can import it.
//     const CloudDashed = ({ size, className }) => (
//         <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//             <path d="M17.5 17.5A4 4 0 0 0 14 20H6a4 4 0 0 1 0-8h1.29a6 6 0 0 1-.29-3.26v0A6 6 0 0 1 12 2a6.3 6.3 0 0 1 3.52 1.48" />
//             <path d="M21.64 12a1 1 0 0 0-.9-.23c-.45.07-.86.29-1.21.6-.26.21-.49.46-.7.75l-.26.35" />
//             <path d="M22 17.5a4 4 0 0 0-3.5-3.5" />
//         </svg>
//     ); // Simple placeholder icon if you don't have one

//     if (assignmentsOverview.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
//                 <CloudDashed className="text-slate-400 w-16 h-16 mb-4" />
//                 <h2 className="text-2xl font-bold text-slate-800 mb-2">No Assignments Found</h2>
//                 <p className="text-slate-600 text-center">There are no assignments configured in the system yet.</p>
//                 <p className="text-slate-600 text-center">Please add assignments to videos first.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 p-4">
//             <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-3 border-slate-200">Assignment Submissions Overview</h1>

//             <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
//                 <table className="min-w-full divide-y divide-slate-200">
//                     <thead className="bg-slate-100">
//                         <tr>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-1/4">Assignment Title</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-1/4">Course / Video</th>
//                             <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-1/2">Student Overview</th> {/* MODIFIED HEADER */}
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-slate-200">
//                         {assignmentsOverview.map((assignment) => {
//                             const submittedCount = assignment.studentStatuses.filter(s => s.submitted).length;
//                             const pendingCount = assignment.studentStatuses.filter(s => !s.submitted).length;
//                             const totalStudents = assignment.studentStatuses.length;

//                             return (
//                                 <React.Fragment key={assignment._id}>
//                                     <tr className="hover:bg-slate-50 transition-colors duration-300">
//                                         <td className="px-4 py-4 align-top">
//                                             <div className="flex items-center">
//                                                 <FileText className="text-indigo-600 mr-2" size={18} />
//                                                 <span className="font-semibold text-slate-900">{assignment.title}</span>
//                                                 <button onClick={() => toggleAssignmentExpand(assignment._id)} className="ml-2 p-1 rounded-full hover:bg-slate-100 text-slate-500">
//                                                     {expandedAssignments[assignment._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                                                 </button>
//                                             </div>
//                                             {expandedAssignments[assignment._id] && (
//                                                 <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-md animate-fadeIn">
//                                                     {assignment.description || "No description provided."}
//                                                 </p>
//                                             )}
//                                             {assignment.dueDate && new Date(assignment.dueDate).toString() !== 'Invalid Date' ? (
//                                                 <p className="text-xs text-slate-500 mt-1 flex items-center">
//                                                     <Calendar size={14} className="mr-1" />
//                                                     Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}
//                                                 </p>
//                                             ) : (
//                                                 <p className="text-xs text-slate-500 mt-1 flex items-center">
//                                                     <Calendar size={14} className="mr-1" />
//                                                     Due: Not set
//                                                 </p>
//                                             )}
//                                             {/* MODIFIED: Changed 'a' tag to 'button' and use new download function */}
//                                             {assignment.assignmentUrl && (
//                                                 <button
//                                                     onClick={() => handleDownloadOriginalAssignment(assignment.assignmentUrl, assignment._id)}
//                                                     disabled={downloadingOriginalAssignment[assignment._id]} // Disable while loading
//                                                     className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                                                 >
//                                                     {downloadingOriginalAssignment[assignment._id] ? (
//                                                         <>
//                                                             <Loader2 size={16} className="mr-1 animate-spin" /> Preparing...
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <Download size={16} className="mr-1" /> Original Assignment
//                                                         </>
//                                                     )}
//                                                 </button>
//                                             )}
//                                         </td>
//                                         <td className="px-4 py-4 align-top">
//                                             <p className="text-sm text-slate-700 flex items-center mb-1">
//                                                 <BookOpen className="text-slate-500 mr-2" size={16} />
//                                                 {assignment.course?.title || "No Course"}
//                                             </p>
//                                             <p className="text-sm text-slate-700 flex items-center">
//                                                 <Video className="text-slate-500 mr-2" size={16} />
//                                                 {assignment.videoTitle || "No Video"}
//                                             </p>
//                                         </td>
//                                         <td className="px-4 py-4 align-top">
//                                             {totalStudents > 0 ? (
//                                                 <div className="space-y-2">
//                                                     <p className="text-sm text-slate-700 mb-2">Total Students Assigned: <span className="font-bold">{totalStudents}</span></p>
//                                                     <button
//                                                         onClick={() => openStudentListModal(assignment, "submitted")}
//                                                         className="w-full flex items-center justify-between px-3 py-2 bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-colors shadow-sm"
//                                                     >
//                                                         <span className="flex items-center"><CheckCircle size={16} className="mr-2" /> Submitted Students</span>
//                                                         <span className="font-bold">{submittedCount}</span>
//                                                     </button>
//                                                     <button
//                                                         onClick={() => openStudentListModal(assignment, "pending")}
//                                                         className="w-full flex items-center justify-between px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors shadow-sm"
//                                                     >
//                                                         <span className="flex items-center"><XCircle size={16} className="mr-2" /> Pending Students</span>
//                                                         <span className="font-bold">{pendingCount}</span>
//                                                     </button>
//                                                 </div>
//                                             ) : (
//                                                 <p className="text-slate-500 text-sm">No students assigned to this course.</p>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 </React.Fragment>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>

//             {/* --- STUDENT LIST MODAL --- */}
//             {showStudentListModal && (
//                 <div className="fixed z-[700] inset-0 bg-black/60 flex justify-center items-center p-4">
//                     <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
//                         <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3 border-slate-200">
//                             {modalTitle} ({modalStudentList.length})
//                         </h2>
//                         <button
//                             className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition"
//                             onClick={closeStudentListModal}
//                         >
//                             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>

//                         {modalStudentList.length > 0 ? (
//                             <div className="space-y-4">
//                                 {modalStudentList.map((student) => (
//                                     <div key={student.studentId} className="border p-4 rounded-lg shadow-sm bg-slate-50 border-slate-200">
//                                         <div className="flex justify-between items-center mb-2">
//                                             <div className="flex items-center">
//                                                 <UserCircle className="text-slate-600 mr-3" size={20} />
//                                                 <div className="flex flex-col">
//                                                     <span className="font-medium text-slate-800">{student.studentName}</span>
//                                                     <span className="text-sm text-slate-500">{student.studentEmail}</span>
//                                                 </div>
//                                             </div>
//                                             {student.submitted ? (
//                                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
//                                                     <CheckCircle size={14} className="mr-1" /> Submitted
//                                                 </span>
//                                             ) : (
//                                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                     <XCircle size={14} className="mr-1" /> Pending
//                                                 </span>
//                                             )}
//                                         </div>
//                                         {student.submitted && (
//                                             <>
//                                                 <p className="text-xs text-slate-500 mt-2 mb-1">
//                                                     Submitted on: {student.submissionDetails.submittedAt && new Date(student.submissionDetails.submittedAt).toString() !== 'Invalid Date' ? format(new Date(student.submissionDetails.submittedAt), "MMM d, yyyy HH:mm") : 'N/A'}
//                                                 </p>
//                                                 <p className="text-sm text-slate-600 mb-3">
//                                                     Comments: {student.submissionDetails.submissionText || "No comments."}
//                                                 </p>
//                                                 <div className="flex flex-wrap gap-2 items-center mt-3">
//                                                     <button
//                                                         onClick={() => handleDownload(student.submissionDetails.submissionUrl)}
//                                                         className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
//                                                     >
//                                                         <Download size={16} className="mr-1" /> Download Submission
//                                                     </button>
//                                                     {/* NEW: Grade button for submitted assignments */}
//                                                     <button
//                                                         onClick={() => openGradingModal(student)}
//                                                         className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
//                                                     >
//                                                         <Award size={16} className="mr-1" /> {student.submissionDetails.grade !== undefined && student.submissionDetails.grade !== null ? `Edit Grade (${student.submissionDetails.grade}/100)` : 'Grade Assignment'}
//                                                     </button>
//                                                 </div>
//                                                 {student.submissionDetails.grade !== undefined && student.submissionDetails.grade !== null && (
//                                                     <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200">
//                                                         <p className="text-sm text-blue-800 font-semibold flex items-center"><Award size={14} className="mr-1" /> Graded: {student.submissionDetails.grade}/100</p>
//                                                         {student.submissionDetails.feedback && (
//                                                             <p className="text-xs text-blue-700 mt-1">Feedback: {student.submissionDetails.feedback}</p>
//                                                         )}
//                                                         {student.submissionDetails.gradedBy && (
//                                                             <p className="text-xs text-blue-600 mt-1">Graded by: {student.submissionDetails.gradedBy.email}</p>
//                                                         )}
//                                                         {student.submissionDetails.gradedAt && (
//                                                             <p className="text-xs text-blue-600">on: {format(new Date(student.submissionDetails.gradedAt), "MMM d, yyyy HH:mm")}</p>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-8">
//                                 <p className="text-slate-600 text-lg">No students found for this category.</p>
//                             </div>
//                         )}
//                         <div className="flex justify-end mt-6">
//                             <button
//                                 onClick={closeStudentListModal}
//                                 className="px-5 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* NEW: GRADING MODAL */}
//             {showGradingModal && currentSubmissionToGrade && (
//                 <div className="fixed z-[800] inset-0 bg-black/75 flex justify-center items-center p-4">
//                     <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative">
//                         <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3 border-slate-200">
//                             Grade Submission
//                         </h2>
//                         <button
//                             className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition"
//                             onClick={closeGradingModal}
//                             disabled={gradingLoading}
//                         >
//                             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>

//                         <p className="text-lg font-medium text-slate-700 mb-2">
//                             Student: <span className="text-indigo-600">{currentSubmissionToGrade.studentName}</span>
//                         </p>
//                         {/* <p className="text-md text-slate-600 mb-4">
//                             Assignment: <span className="font-semibold">{currentSubmissionToGrade.submissionDetails.assignment.title}</span>
//                         </p> */}

//                         <form onSubmit={handleGradeSubmit} className="space-y-4">
//                             <div>
//                                 <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1">Grade (0-100)</label>
//                                 <input
//                                     id="grade"
//                                     type="number"
//                                     min="0"
//                                     max="100"
//                                     value={gradeInput}
//                                     onChange={(e) => setGradeInput(e.target.value)}
//                                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-1">Feedback (Optional)</label>
//                                 <textarea
//                                     id="feedback"
//                                     value={feedbackInput}
//                                     onChange={(e) => setFeedbackInput(e.target.value)}
//                                     rows="4"
//                                     className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800"
//                                     placeholder="Provide constructive feedback here..."
//                                 />
//                             </div>
//                             <div className="flex justify-end gap-3 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={closeGradingModal}
//                                     className="px-5 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors"
//                                     disabled={gradingLoading}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                                     disabled={gradingLoading}
//                                 >
//                                     {gradingLoading ? (
//                                         <>
//                                             <Loader2 size={18} className="animate-spin" /> Saving...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Award size={18} /> Save Grade
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdminAssignments;

import React, { useContext, useEffect, useState } from "react";
import ProjectContext from "../../Context/ProjectContext";
import { AlertContext } from "../../Context/AlertContext";
import axios from "axios";
import {
    FileText,
    Download,
    CheckCircle,
    XCircle,
    UserCircle,
    BookOpen,
    Video,
    Calendar,
    ChevronDown,
    ChevronUp,
    Loader2,
    Award // NEW: Icon for grading
} from 'lucide-react';
import { format } from "date-fns";

const AdminAssignments = () => {
    const { API_BASE_URL, API_URL } = useContext(ProjectContext);
    const { Toast } = useContext(AlertContext);
    const admintoken = localStorage.getItem("admintoken");

    const [assignmentsOverview, setAssignmentsOverview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAssignments, setExpandedAssignments] = useState({});

    // --- NEW STATES FOR STUDENT LIST MODAL ---
    const [showStudentListModal, setShowStudentListModal] = useState(false);
    const [modalStudentList, setModalStudentList] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    // --- END NEW STATES ---

    // NEW STATE: To manage loading state for original assignment downloads
    const [downloadingOriginalAssignment, setDownloadingOriginalAssignment] = useState({});

    // NEW STATES FOR GRADING MODAL
    const [showGradingModal, setShowGradingModal] = useState(false);
    const [currentSubmissionToGrade, setCurrentSubmissionToGrade] = useState(null);
    const [gradeInput, setGradeInput] = useState("");
    const [feedbackInput, setFeedbackInput] = useState("");
    const [gradingLoading, setGradingLoading] = useState(false);


    const fetchAssignmentsOverview = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_URL}/assignments/admin/overview`,
                {
                    headers: { Authorization: `Bearer ${admintoken}` },
                }
            );
            setAssignmentsOverview(response.data.assignmentsOverview);
        } catch (err) {
            console.error("Error fetching assignments overview:", err);
            setError("Failed to load assignments. Please try again.");
            Toast.fire({ icon: "error", title: "Failed to load assignments" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admintoken) {
            fetchAssignmentsOverview();
        }
    }, [admintoken, API_BASE_URL, API_URL, Toast]);

    // This function is for downloading *student submissions* (now fetches a presigned URL)
   const handleDownload = async (submissionUrl) => {
    try {
        // First, get the presigned URL for the submission file
        const response = await axios.get(
            `${API_BASE_URL}${API_URL}/assignments/submission-file-url?submissionUrl=${encodeURIComponent(submissionUrl)}`,
            {
                headers: { Authorization: `Bearer ${admintoken}` },
            }
        );

        if (response.data.success && response.data.downloadUrl) {
            // Open the presigned URL in a new tab/window, which will trigger download
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


    // NEW FUNCTION: To handle downloading the *original assignment file*
    const handleDownloadOriginalAssignment = async (assignmentUrl, assignmentId) => {
        if (!admintoken) { // Ensure admin token exists
            Toast.fire({ icon: "error", title: "You must be logged in to download assignments." });
            return;
        }
        setDownloadingOriginalAssignment(prev => ({ ...prev, [assignmentId]: true }));
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_URL}/assignments/generate-assignment-download-url`,
                {
                    params: { assignmentUrl: assignmentUrl },
                    headers: { Authorization: `Bearer ${admintoken}` }, // Admin uses admintoken
                }
            );

            if (response.data.success && response.data.downloadUrl) {
                // Open the presigned URL in a new tab/window, which will trigger download
                window.open(response.data.downloadUrl, '_blank');
                Toast.fire({ icon: "success", title: "Download initiated!" });
            } else {
                Toast.fire({ icon: "error", title: "Failed to get download link." });
            }
        } catch (error) {
            console.error("Error generating original assignment download URL:", error);
            Toast.fire({
                icon: "error",
                title: "Failed to download original assignment",
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setDownloadingOriginalAssignment(prev => ({ ...prev, [assignmentId]: false }));
        }
    };

    const toggleAssignmentExpand = (assignmentId) => {
        setExpandedAssignments(prev => ({
            ...prev,
            [assignmentId]: !prev[assignmentId]
        }));
    };

    // --- NEW FUNCTION TO OPEN STUDENT LIST MODAL ---
    const openStudentListModal = (assignment, type) => {
        let studentsToDisplay = [];
        let title = "";

        if (type === "submitted") {
            studentsToDisplay = assignment.studentStatuses.filter(s => s.submitted);
            title = `Submitted Students for "${assignment.title}"`;
        } else if (type === "pending") {
            studentsToDisplay = assignment.studentStatuses.filter(s => !s.submitted);
            title = `Pending Students for "${assignment.title}"`;
        }

        setModalStudentList(studentsToDisplay);
        setModalTitle(title);
        setShowStudentListModal(true);
    };

    const closeStudentListModal = () => {
        setShowStudentListModal(false);
        setModalStudentList([]);
        setModalTitle("");
    };
    // --- END NEW FUNCTION ---

    // NEW FUNCTIONS FOR GRADING
    const openGradingModal = (submission) => {
        setCurrentSubmissionToGrade(submission);
        setGradeInput(submission.submissionDetails?.grade || ""); // Pre-fill if already graded
        setFeedbackInput(submission.submissionDetails?.feedback || ""); // Pre-fill if already graded
        setShowGradingModal(true);
    };

    const closeGradingModal = () => {
        setShowGradingModal(false);
        setCurrentSubmissionToGrade(null);
        setGradeInput("");
        setFeedbackInput("");
        setGradingLoading(false);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        if (!currentSubmissionToGrade) return;

        const submissionId = currentSubmissionToGrade.submissionDetails._id;
        const parsedGrade = parseInt(gradeInput, 10);

        if (isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 100) {
            Toast.fire({ icon: "error", title: "Grade must be a number between 0 and 100." });
            return;
        }

        setGradingLoading(true);
        try {
            await axios.put(
                `${API_BASE_URL}${API_URL}/assignments/grade-submission/${submissionId}`,
                { grade: parsedGrade, feedback: feedbackInput },
                { headers: { Authorization: `Bearer ${admintoken}` } }
            );
            Toast.fire({ icon: "success", title: "Submission graded successfully!" });
            closeGradingModal();
            fetchAssignmentsOverview(); // Re-fetch data to update overview including grades
        } catch (error) {
            console.error("Error grading submission:", error);
            Toast.fire({
                icon: "error",
                title: "Failed to grade submission",
                text: error.response?.data?.message || error.message,
            });
        } finally {
            setGradingLoading(false);
        }
    };
    // END NEW FUNCTIONS FOR GRADING


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600 w-16 h-16 mb-4" />
                <p className="text-slate-700 text-lg">Loading assignments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <XCircle className="text-red-600 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Assignments</h2>
                <p className="text-slate-600 text-center">{error}</p>
            </div>
        );
    }

    // CloudDashed is not imported, replacing with a generic alert icon or a simple message.
    // If you have a specific Lucide icon for "No data", you can import it.
    const CloudDashed = ({ size, className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17.5 17.5A4 4 0 0 0 14 20H6a4 4 0 0 1 0-8h1.29a6 6 0 0 1-.29-3.26v0A6 6 0 0 1 12 2a6.3 6.3 0 0 1 3.52 1.48" />
            <path d="M21.64 12a1 1 0 0 0-.9-.23c-.45.07-.86.29-1.21.6-.26.21-.49.46-.7.75l-.26.35" />
            <path d="M22 17.5a4 4 0 0 0-3.5-3.5" />
        </svg>
    ); // Simple placeholder icon if you don't have one

    if (assignmentsOverview.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
                <CloudDashed className="text-slate-400 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No Assignments Found</h2>
                <p className="text-slate-600 text-center">There are no assignments configured in the system yet.</p>
                <p className="text-slate-600 text-center">Please add assignments to videos first.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-3 border-slate-200">Assignment Submissions Overview</h1>

            <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-1/4">Assignment Title</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-1/4">Course / Video</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider w-1/2">Student Overview</th> {/* MODIFIED HEADER */}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {assignmentsOverview.map((assignment) => {
                            const submittedCount = assignment.studentStatuses.filter(s => s.submitted).length;
                            const pendingCount = assignment.studentStatuses.filter(s => !s.submitted).length;
                            const totalStudents = assignment.studentStatuses.length;

                            return (
                                <React.Fragment key={assignment._id}>
                                    <tr className="hover:bg-slate-50 transition-colors duration-300">
                                        <td className="px-4 py-4 align-top">
                                            <div className="flex items-center">
                                                <FileText className="text-indigo-600 mr-2" size={18} />
                                                <span className="font-semibold text-slate-900">{assignment.title}</span>
                                                <button onClick={() => toggleAssignmentExpand(assignment._id)} className="ml-2 p-1 rounded-full hover:bg-slate-100 text-slate-500">
                                                    {expandedAssignments[assignment._id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
                                            </div>
                                            {expandedAssignments[assignment._id] && (
                                                <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-md animate-fadeIn">
                                                    {assignment.description || "No description provided."}
                                                </p>
                                            )}
                                            {assignment.dueDate && new Date(assignment.dueDate).toString() !== 'Invalid Date' ? (
                                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                                    <Calendar size={14} className="mr-1" />
                                                    Due: {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-slate-500 mt-1 flex items-center">
                                                    <Calendar size={14} className="mr-1" />
                                                    Due: Not set
                                                </p>
                                            )}
                                            {/* MODIFIED: Changed 'a' tag to 'button' and use new download function */}
                                            {assignment.assignmentUrl && (
                                                <button
                                                    onClick={() => handleDownloadOriginalAssignment(assignment.assignmentUrl, assignment._id)}
                                                    disabled={downloadingOriginalAssignment[assignment._id]} // Disable while loading
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {downloadingOriginalAssignment[assignment._id] ? (
                                                        <>
                                                            <Loader2 size={16} className="mr-1 animate-spin" /> Preparing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download size={16} className="mr-1" /> Original Assignment
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <p className="text-sm text-slate-700 flex items-center mb-1">
                                                <BookOpen className="text-slate-500 mr-2" size={16} />
                                                {assignment.course?.title || "No Course"}
                                            </p>
                                            <p className="text-sm text-slate-700 flex items-center">
                                                <Video className="text-slate-500 mr-2" size={16} />
                                                {assignment.videoTitle || "No Video"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            {totalStudents > 0 ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-slate-700 mb-2">Total Students Assigned: <span className="font-bold">{totalStudents}</span></p>
                                                    <button
                                                        onClick={() => openStudentListModal(assignment, "submitted")}
                                                        className="w-full flex items-center justify-between px-3 py-2 bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-colors shadow-sm"
                                                    >
                                                        <span className="flex items-center"><CheckCircle size={16} className="mr-2" /> Submitted Students</span>
                                                        <span className="font-bold">{submittedCount}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openStudentListModal(assignment, "pending")}
                                                        className="w-full flex items-center justify-between px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors shadow-sm"
                                                    >
                                                        <span className="flex items-center"><XCircle size={16} className="mr-2" /> Pending Students</span>
                                                        <span className="font-bold">{pendingCount}</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 text-sm">No students assigned to this course.</p>
                                            )}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* --- STUDENT LIST MODAL --- */}
            {showStudentListModal && (
                <div className="fixed z-[700] inset-0 bg-black/60 flex justify-center items-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3 border-slate-200">
                            {modalTitle} ({modalStudentList.length})
                        </h2>
                        <button
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition"
                            onClick={closeStudentListModal}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {modalStudentList.length > 0 ? (
                            <div className="space-y-4">
                                {modalStudentList.map((student) => (
                                    <div key={student.studentId} className="border p-4 rounded-lg shadow-sm bg-slate-50 border-slate-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <UserCircle className="text-slate-600 mr-3" size={20} />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-800">{student.studentName}</span>
                                                    <span className="text-sm text-slate-500">{student.studentEmail}</span>
                                                </div>
                                            </div>
                                            {student.submitted ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    <CheckCircle size={14} className="mr-1" /> Submitted
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle size={14} className="mr-1" /> Pending
                                                </span>
                                            )}
                                        </div>
                                        {student.submitted && (
                                            <>
                                                <p className="text-xs text-slate-500 mt-2 mb-1">
                                                    Submitted on: {student.submissionDetails.submittedAt && new Date(student.submissionDetails.submittedAt).toString() !== 'Invalid Date' ? format(new Date(student.submissionDetails.submittedAt), "MMM d, yyyy HH:mm") : 'N/A'}
                                                </p>
                                                <p className="text-sm text-slate-600 mb-3">
                                                    Comments: {student.submissionDetails.submissionText || "No comments."}
                                                </p>
                                                <div className="flex flex-wrap gap-2 items-center mt-3">
                                                    <button
                                                        onClick={() => handleDownload(student.submissionDetails.submissionUrl)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                                                    >
                                                        <Download size={16} className="mr-1" /> Download Submission
                                                    </button>
                                                    {/* NEW: Grade button for submitted assignments */}
                                                    <button
                                                        onClick={() => openGradingModal(student)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                                    >
                                                        <Award size={16} className="mr-1" /> {student.submissionDetails.grade !== undefined && student.submissionDetails.grade !== null ? `Edit Grade (${student.submissionDetails.grade}/100)` : 'Grade Assignment'}
                                                    </button>
                                                </div>
                                                {student.submissionDetails.grade !== undefined && student.submissionDetails.grade !== null && (
                                                    <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200">
                                                        <p className="text-sm text-blue-800 font-semibold flex items-center"><Award size={14} className="mr-1" /> Graded: {student.submissionDetails.grade}/100</p>
                                                        {student.submissionDetails.feedback && (
                                                            <p className="text-xs text-blue-700 mt-1">Feedback: {student.submissionDetails.feedback}</p>
                                                        )}
                                                        {student.submissionDetails.gradedBy && (
                                                            <p className="text-xs text-blue-600 mt-1">Graded by: {student.submissionDetails.gradedBy.email}</p>
                                                        )}
                                                        {student.submissionDetails.gradedAt && (
                                                            <p className="text-xs text-blue-600">on: {format(new Date(student.submissionDetails.gradedAt), "MMM d, yyyy HH:mm")}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-600 text-lg">No students found for this category.</p>
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={closeStudentListModal}
                                className="px-5 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW: GRADING MODAL */}
            {showGradingModal && currentSubmissionToGrade && (
                <div className="fixed z-[800] inset-0 bg-black/75 flex justify-center items-center p-4">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-3 border-slate-200">
                            Grade Submission
                        </h2>
                        <button
                            className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition"
                            onClick={closeGradingModal}
                            disabled={gradingLoading}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <p className="text-lg font-medium text-slate-700 mb-2">
                            Student: <span className="text-indigo-600">{currentSubmissionToGrade.studentName}</span>
                        </p>
                        {/* <p className="text-md text-slate-600 mb-4">
                            Assignment: <span className="font-semibold">{currentSubmissionToGrade.submissionDetails.assignment.title}</span>
                        </p> */}

                        <form onSubmit={handleGradeSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1">Grade (0-100)</label>
                                <input
                                    id="grade"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={gradeInput}
                                    onChange={(e) => setGradeInput(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 mb-1">Feedback (Optional)</label>
                                <textarea
                                    id="feedback"
                                    value={feedbackInput}
                                    onChange={(e) => setFeedbackInput(e.target.value)}
                                    rows="4"
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-800"
                                    placeholder="Provide constructive feedback here..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeGradingModal}
                                    className="px-5 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors"
                                    disabled={gradingLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    disabled={gradingLoading}
                                >
                                    {gradingLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Award size={18} /> Save Grade
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAssignments;