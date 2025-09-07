import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AlertContext } from '../../Context/AlertContext';
import ProjectContext from '../../Context/ProjectContext';
import { FileX, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const AdminEnrollmentRequests = () => {
    const { Toast } = useContext(AlertContext);
    const { API_BASE_URL, API_URL } = useContext(ProjectContext);
    const admintoken = localStorage.getItem("admintoken");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}${API_URL}/enrollment/admin/requests`, { headers: { Authorization: `Bearer ${admintoken}` } });
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
            await axios.post(`${API_BASE_URL}${API_URL}/enrollment/admin/approve/${requestId}`, {}, { headers: { Authorization: `Bearer ${admintoken}` } });
            Toast.fire({ icon: 'success', title: 'User Approved!', text: 'The user has been registered and enrolled.' });
            fetchRequests();
        } catch (error) {
            Toast.fire({ icon: 'error', title: 'Error', text: error.response?.data?.msg || "Approval failed." });
        }
    };

    const handleReject = (requestId) => {
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
                    await axios.post(`${API_BASE_URL}${API_URL}/enrollment/admin/reject/${requestId}`, {}, { headers: { Authorization: `Bearer ${admintoken}` } });
                    Toast.fire({ icon: 'success', title: 'Request Rejected' });
                    fetchRequests();
                } catch (error) {
                    Toast.fire({ icon: 'error', title: 'Error', text: error.response?.data?.msg || "Rejection failed." });
                }
            }
        });
    };

    const getStatusChip = (status, type) => {
        const styles = {
            payment: {
                Success: "bg-green-100 text-green-800",
                Pending: "bg-yellow-100 text-yellow-800",
                Failed: "bg-red-100 text-red-800",
            },
            approval: {
                Approved: "bg-blue-100 text-blue-800",
                Pending: "bg-gray-100 text-gray-800",
                Rejected: "bg-red-100 text-red-800",
            }
        };
        return <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[type][status]}`}>{status}</span>;
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Enrollment Requests</h1>
            {requests.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map(req => (
                                <tr key={req._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{req.name}</div>
                                        <div className="text-sm text-gray-500">{req.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{req.course?.title}</td>
                                    <td className="px-6 py-4">{getStatusChip(req.paymentStatus, 'payment')}</td>
                                    <td className="px-6 py-4">{getStatusChip(req.approvalStatus, 'approval')}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(req.createdAt), "MMM d, yyyy")}</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        {req.approvalStatus === 'Pending' && req.paymentStatus === 'Success' && (
                                            <button onClick={() => handleApprove(req._id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600">
                                                Approve
                                            </button>
                                        )}
                                        {req.approvalStatus === 'Pending' && (
                                            <button onClick={() => handleReject(req._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
                                                Reject
                                            </button>
                                        )}
                                        {req.approvalStatus === 'Approved' && (
                                            <span className="text-green-600 font-semibold flex items-center justify-center"><CheckCircle size={16} className="mr-1" /> Approved</span>
                                        )}
                                        {req.approvalStatus === 'Rejected' && (
                                            <span className="text-red-600 font-semibold flex items-center justify-center"><XCircle size={16} className="mr-1" /> Rejected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <FileX size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No pending enrollment requests.</p>
                </div>
            )}
        </div>
    );
};

export default AdminEnrollmentRequests;