import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AlertContext } from '../../Context/AlertContext';
import ProjectContext from '../../Context/ProjectContext';
import { UserCheck, Clock, CheckCircle, FileX, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const AdminEnrollmentRequests = () => {
    const { Toast } = useContext(AlertContext);
    const { API_BASE_URL, API_URL } = useContext(ProjectContext);
    const admintoken = localStorage.getItem("admintoken");

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    
console.log("requests" ,requests)

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}${API_URL}/enrollment/admin/requests`,
                { headers: { Authorization: `Bearer ${admintoken}` } }
            );
            setRequests(response.data);
        } catch (error) {
            Toast.fire({ icon: 'error', title: 'Failed to fetch requests.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (requestId) => {
        try {
            await axios.post(
                `${API_BASE_URL}${API_URL}/enrollment/admin/approve/${requestId}`,
                {},
                { headers: { Authorization: `Bearer ${admintoken}` } }
            );
            Toast.fire({ icon: 'success', title: 'User Approved!', text: 'The user has been registered and enrolled.' });
            fetchRequests();
        } catch (error) {
            const errorMsg = error.response?.data?.msg || "Approval failed.";
            Toast.fire({ icon: 'error', title: 'Error', text: errorMsg });
        }
    };

    const handleReject = async (requestId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will reject the user's enrollment request.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, reject it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(
                        `${API_BASE_URL}${API_URL}/enrollment/admin/reject/${requestId}`,
                        {},
                        { headers: { Authorization: `Bearer ${admintoken}` } }
                    );
                    Toast.fire({ icon: 'success', title: 'Request Rejected' });
                    fetchRequests();
                } catch (error) {
                    const errorMsg = error.response?.data?.msg || "Rejection failed.";
                    Toast.fire({ icon: 'error', title: 'Error', text: errorMsg });
                }
            }
        });
    };
    
    const getStatusChip = (status, type) => {
        const styles = {
            payment: {
                Success: "bg-emerald-100 text-emerald-800",
                Pending: "bg-amber-100 text-amber-800",
                Failed: "bg-red-100 text-red-800",
            },
            approval: {
                Approved: "bg-blue-100 text-blue-800",
                Pending: "bg-slate-100 text-slate-800",
                Rejected: "bg-red-100 text-red-800",
            }
        };
        return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[type][status]}`}>{status}</span>;
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Enrollment Requests</h1>
            {requests.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">User</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Course</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Payment Details</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Approval</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Date</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {requests.map(req => (
                                <tr key={req._id}>
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-slate-900">{req.name}</div>
                                        <div className="text-sm text-slate-500">{req.email}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-700">{req.course?.title}</td>
                                    <td className="px-4 py-4">
                                        {getStatusChip(req.paymentStatus, 'payment')}
                                        {req.paymentId && <div className="text-xs text-slate-500 mt-1">ID: {req.paymentId}</div>}
                                        {req.paymentStatus === 'Failed' && req.paymentFailureReason && (
                                            <div className="text-xs text-red-600 mt-1" title={req.paymentFailureReason}>
                                                Reason: {req.paymentFailureReason.substring(0, 30)}...
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">{getStatusChip(req.approvalStatus, 'approval')}</td>
                                    <td className="px-4 py-4 text-sm text-slate-500">{format(new Date(req.createdAt), "MMM d, yyyy")}</td>
                                    <td className="px-4 py-4 text-center space-x-2">
                                        {req.approvalStatus === 'Pending' && req.paymentStatus === 'Success' && (
                                            <button onClick={() => handleApprove(req._id)} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700">
                                                Approve
                                            </button>
                                        )}
                                        {req.approvalStatus === 'Pending' && (
                                            <button onClick={() => handleReject(req._id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700">
                                                Reject
                                            </button>
                                        )}
                                        {req.approvalStatus === 'Approved' && (
                                            <span className="text-emerald-600 font-semibold flex items-center justify-center"><CheckCircle size={16} className="mr-1"/> Approved</span>
                                        )}
                                        {req.approvalStatus === 'Rejected' && (
                                            <span className="text-red-600 font-semibold flex items-center justify-center"><XCircle size={16} className="mr-1"/> Rejected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-md border border-slate-200">
                    <FileX size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500">No pending enrollment requests.</p>
                </div>
            )}
        </div>
    );
};

export default AdminEnrollmentRequests;