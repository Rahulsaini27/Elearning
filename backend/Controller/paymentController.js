const Razorpay = require('razorpay');
const crypto = require('crypto');
const EnrollmentRequest = require("../Models/EnrollmentRequest");

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// 1. Verify Payment and UPDATE the Enrollment Request
exports.verifyAndUpdatePayment = async (req, res) => {
    try {
        const {
            requestId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Signature verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, msg: "Payment verification failed. Invalid signature." });
        }


        const updatedRequest = await EnrollmentRequest.findByIdAndUpdate(
            requestId,
            {
                paymentStatus: "Success",
                paymentId: razorpay_payment_id,
            },
            { new: true } 
        );

        if (!updatedRequest) {
            return res.status(404).json({ success: false, msg: "Enrollment request not found." });
        }

        res.status(200).json({
            success: true,
            msg: "Payment successful! Your enrollment is pending admin approval.",
        });

    } catch (err) {
        console.error("Error verifying payment and updating request:", err);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

// 2. Log a Failed Payment by UPDATING the Enrollment Request
exports.logFailedPaymentUpdate = async (req, res) => {
    try {
        const { requestId, error } = req.body;

        const updatedRequest = await EnrollmentRequest.findByIdAndUpdate(
            requestId,
            {
                paymentStatus: "Failed",
                paymentFailureReason: error?.reason || "Payment was cancelled or failed by the user.",
                paymentId: error?.metadata?.payment_id || 'N/A'
            },
            { new: true }
        );
        
        if (!updatedRequest) {
            return res.status(404).json({ success: false, msg: "Enrollment request not found." });
        }

        res.status(200).json({ success: true, msg: "Payment failure has been logged." });

    } catch (err) {
        console.error("Error logging failed payment update:", err);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};