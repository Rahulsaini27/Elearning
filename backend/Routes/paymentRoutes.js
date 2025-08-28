const express = require("express");
const router = express.Router();
// Renamed functions for clarity
const { verifyAndUpdatePayment, logFailedPaymentUpdate } = require("../Controller/paymentController");

// POST /api/payment/verify - Verifies a successful payment and UPDATES the enrollment request
router.post("/verify", verifyAndUpdatePayment);

// POST /api/payment/log-failure - Logs a failed payment attempt by UPDATING the request
router.post("/log-failure", logFailedPaymentUpdate);

module.exports = router;