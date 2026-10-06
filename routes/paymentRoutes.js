import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/get-key', getRazorpayKey);
router.post('/create-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);

export default router;
