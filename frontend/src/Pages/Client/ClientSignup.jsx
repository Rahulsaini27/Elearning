import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { AlertContext } from "../../Context/AlertContext";
import ProjectContext from "../../Context/ProjectContext";
import gsap from "gsap";

const ClientSignup = ({ onClose, onSwitchForm }) => {
    const { Toast } = useContext(AlertContext);
    const { API_BASE_URL, API_URL } = useContext(ProjectContext);

    const [step, setStep] = useState(1);
    const [requestId, setRequestId] = useState(null);
    const [otp, setOtp] = useState("");
    
    const [formData, setFormData] = useState({
        name: "", email: "", password: "", confirmPassword: "", courseId: "", gender: "",
    });

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    }, [step]); // Re-run animation when step changes

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}${API_URL}/courses/getCourseList`);
                setCourses(response.data.data);
            } catch (error) {
                Toast.fire({ icon: 'error', title: 'Could not load courses.' });
            }
        };
        fetchCourses();
    }, [API_BASE_URL, API_URL, Toast]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            Toast.fire({ icon: "error", title: "Passwords do not match." });
            return;
        }
        if (!formData.courseId || !formData.gender) {
            Toast.fire({ icon: "error", title: "Please fill in all required fields." });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}${API_URL}/enrollment/register-send-otp`, formData);
            setRequestId(response.data.requestId);
            setStep(2);
            Toast.fire({ icon: 'success', title: response.data.msg });
        } catch (error) {
            const errorMsg = error.response?.data?.msg || "Registration failed.";
            Toast.fire({ icon: "error", title: "Error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmitAndPay = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            Toast.fire({ icon: 'error', title: 'Please enter a valid 6-digit OTP.' });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}${API_URL}/enrollment/verify-otp-payment`, { requestId, otp });

            const { order } = response.data;
            const selectedCourse = courses.find(c => c._id === formData.courseId);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "LearnHub",
                description: `Enrollment for ${selectedCourse?.title || 'a course'}`,
                order_id: order.id,
                handler: async (paymentResponse) => {
                    await axios.post(`${API_BASE_URL}${API_URL}/payment/verify`, {
                        requestId,
                        razorpay_payment_id: paymentResponse.razorpay_payment_id,
                        razorpay_order_id: paymentResponse.razorpay_order_id,
                        razorpay_signature: paymentResponse.razorpay_signature,
                    });
                    Toast.fire({ icon: "success", title: "Payment Successful!", text: "Your enrollment is pending admin approval." });
                    onClose();
                },
                prefill: { name: formData.name, email: formData.email },
                theme: { color: "#4f46e5" },
                modal: {
                    ondismiss: async () => {
                        await axios.post(`${API_BASE_URL}${API_URL}/payment/log-failure`, {
                            requestId, error: { reason: "payment_cancelled" },
                        });
                        Toast.fire({ icon: 'info', title: 'Payment Cancelled' });
                        onClose();
                    }
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', async (failureResponse) => {
                await axios.post(`${API_BASE_URL}${API_URL}/payment/log-failure`, {
                    requestId, error: failureResponse.error,
                });
                Toast.fire({ icon: 'error', title: 'Payment Failed', text: failureResponse.error.description });
            });
            rzp.open();

        } catch (error) {
            const errorMsg = error.response?.data?.msg || "OTP verification failed.";
            Toast.fire({ icon: "error", title: "Error", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={formRef}>
            {step === 1 && (
                <div className="relative">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-900">Join LearnHub</h3>
                        <p className="text-gray-600 text-sm">Create your account to get started</p>
                    </div>
                    <form onSubmit={handleDetailsSubmit} className="mt-6 space-y-3">
                        <select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500" required>
                            <option value="" disabled>-- Select a Course --</option>
                            {courses.map(course => (<option key={course._id} value={course._id}>{course.title} - ₹{course.price}</option>))}
                        </select>
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500" required>
                            <option value="" disabled>-- Select Gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500" />
                        <button type="submit" className="w-full mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md" disabled={loading}>
                            {loading ? "Processing..." : "Sign Up & Verify Email"}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-gray-600">
                        Already have an account?{" "}
                        <button type="button" onClick={() => onSwitchForm("login")} className="text-blue-500 hover:underline">Sign In</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="relative">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-gray-900">Verify Your Email</h3>
                        <p className="text-gray-600 text-sm">An OTP has been sent to {formData.email}</p>
                    </div>
                    <form onSubmit={handleOtpSubmitAndPay} className="mt-6 space-y-3">
                        <input type="text" name="otp" placeholder="Enter 6-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500" required maxLength="6" />
                        <button type="submit" className="w-full mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md" disabled={loading}>
                            {loading ? "Verifying..." : "Verify & Proceed to Payment"}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <button onClick={() => setStep(1)} className="text-sm text-gray-600 hover:underline">
                            Back to signup form
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ClientSignup;