import React, { useContext, useEffect, useState } from "react";
import ProjectContext from "../../Context/ProjectContext";
import { AlertContext } from "../../Context/AlertContext";
import axios from "axios";
import { FileText, Download, CheckCircle, XCircle, UserCircle, BookOpen, Video, Calendar, ChevronDown, ChevronUp, Loader2, Award } from 'lucide-react';
import { format } from "date-fns";

const AdminAssignments = () => {
    const { API_BASE_URL, API_URL } = useContext(ProjectContext);
    const { Toast } = useContext(AlertContext);
    const admintoken = localStorage.getItem("admintoken");

    const [assignmentsOverview, setAssignmentsOverview] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedAssignments, setExpandedAssignments] = useState({});
    const [showStudentListModal, setShowStudentListModal] = useState(false);
    const [modalStudentList, setModalStudentList] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const [downloadingOriginal, setDownloadingOriginal] = useState({});
    const [showGradingModal, setShowGradingModal] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState(null);
    const [gradeInput, setGradeInput] = useState("");
    const [feedbackInput, setFeedbackInput] = useState("");
    const [gradingLoading, setGradingLoading] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}${API_URL}/assignments/admin/overview`, { headers: { Authorization: `Bearer ${admintoken}` } });
                setAssignmentsOverview(response.data.assignmentsOverview);
            } catch (err) {
                setError("Failed to load assignments.");
                Toast.fire({ icon: "error", title: "Failed to load assignments" });
            } finally {
                setLoading(false);
            }
        };
        if (admintoken) fetchAssignments();
    }, [admintoken, API_BASE_URL, API_URL, Toast]);

    const handleDownload = async (submissionUrl) => {
        try {
            const res = await axios.get(`${API_BASE_URL}${API_URL}/assignments/submission-file-url?submissionUrl=${encodeURIComponent(submissionUrl)}`, { headers: { Authorization: `Bearer ${admintoken}` } });
            if (res.data.success) window.open(res.data.downloadUrl, '_blank');
            else Toast.fire({ icon: "error", title: "Failed to get download link." });
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to download file" });
        }
    };

    const handleDownloadOriginal = async (assignmentUrl, id) => {
        setDownloadingOriginal(prev => ({ ...prev, [id]: true }));
        try {
            const res = await axios.get(`${API_BASE_URL}${API_URL}/assignments/generate-assignment-download-url`, { params: { assignmentUrl }, headers: { Authorization: `Bearer ${admintoken}` } });
            if (res.data.success) window.open(res.data.downloadUrl, '_blank');
            else Toast.fire({ icon: "error", title: "Failed to get download link." });
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to download original assignment" });
        } finally {
            setDownloadingOriginal(prev => ({ ...prev, [id]: false }));
        }
    };

    const toggleAssignmentExpand = (id) => setExpandedAssignments(prev => ({ ...prev, [id]: !prev[id] }));

    const openStudentListModal = (assignment, type) => {
        const students = assignment.studentStatuses.filter(s => type === 'submitted' ? s.submitted : !s.submitted);
        setModalStudentList(students);
        setModalTitle(`${type === 'submitted' ? 'Submitted' : 'Pending'} Students for "${assignment.title}"`);
        setShowStudentListModal(true);
    };

    const openGradingModal = (submission) => {
        setCurrentSubmission(submission);
        setGradeInput(submission.submissionDetails?.grade || "");
        setFeedbackInput(submission.submissionDetails?.feedback || "");
        setShowGradingModal(true);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        const grade = parseInt(gradeInput, 10);
        if (isNaN(grade) || grade < 0 || grade > 100) return Toast.fire({ icon: "error", title: "Grade must be 0-100." });

        setGradingLoading(true);
        try {
            await axios.put(`${API_BASE_URL}${API_URL}/assignments/grade-submission/${currentSubmission.submissionDetails._id}`,
                { grade, feedback: feedbackInput }, { headers: { Authorization: `Bearer ${admintoken}` } });
            Toast.fire({ icon: "success", title: "Submission graded!" });
            setShowGradingModal(false);
            // In a real app, you'd refetch or update state here
        } catch (error) {
            Toast.fire({ icon: "error", title: "Failed to grade submission" });
        } finally {
            setGradingLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20"><Loader2 className="animate-spin text-blue-500 w-12 h-12" /></div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Assignment Submissions Overview</h1>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course / Video</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Overview</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assignmentsOverview.map((assignment) => {
                            const submitted = assignment.studentStatuses.filter(s => s.submitted).length;
                            const total = assignment.studentStatuses.length;
                            return (
                                <tr key={assignment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-semibold text-gray-900">{assignment.title}</div>
                                        <button onClick={() => handleDownloadOriginal(assignment.assignmentUrl, assignment._id)}
                                            className="mt-2 text-sm text-blue-500 hover:underline flex items-center gap-1" disabled={downloadingOriginal[assignment._id]}>
                                            {downloadingOriginal[assignment._id] ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Original
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 align-top text-sm text-gray-600">
                                        <p>{assignment.course?.title}</p>
                                        <p className="text-xs">{assignment.videoTitle}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <p className="text-sm font-medium">{submitted} / {total} Submitted</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${total > 0 ? (submitted / total) * 100 : 0}%` }}></div>
                                        </div>
                                        <button onClick={() => openStudentListModal(assignment, 'submitted')} className="text-xs text-blue-500 hover:underline mt-1">View Submissions</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showStudentListModal && (
                <div className="fixed z-50 inset-0 bg-black/60 flex justify-center items-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{modalTitle}</h2>
                        <div className="space-y-4">
                            {modalStudentList.map((student) => (
                                <div key={student.studentId} className="p-4 border rounded-lg bg-gray-50">
                                    <p className="font-semibold">{student.studentName}</p>
                                    <p className="text-sm text-gray-500">{student.studentEmail}</p>
                                    {student.submitted &&
                                        <div className="mt-2 flex items-center gap-4">
                                            <button onClick={() => handleDownload(student.submissionDetails.submissionUrl)} className="text-sm text-blue-500 hover:underline">Download Submission</button>
                                            <button onClick={() => openGradingModal(student)} className="text-sm text-green-600 hover:underline">Grade</button>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowStudentListModal(false)} className="mt-6 px-6 py-2 bg-gray-200 rounded-lg">Close</button>
                    </div>
                </div>
            )}

            {showGradingModal && (
                <div className="fixed z-50 inset-0 bg-black/60 flex justify-center items-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Grade for {currentSubmission.studentName}</h2>
                        <form onSubmit={handleGradeSubmit} className="space-y-4">
                            <input type="number" min="0" max="100" value={gradeInput} onChange={e => setGradeInput(e.target.value)} placeholder="Grade (0-100)" className="w-full p-2.5 border rounded-lg" required />
                            <textarea value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder="Feedback (Optional)" className="w-full p-2.5 border rounded-lg" />
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowGradingModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg" disabled={gradingLoading}>{gradingLoading ? "Saving..." : "Save Grade"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAssignments;