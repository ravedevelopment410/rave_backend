import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay API credentials (KEY_ID or KEY_SECRET) are missing in environment variables.');
  }

  return new Razorpay({ key_id, key_secret });
};

// @desc    Get Razorpay Public Key ID
// @route   GET /api/payment/get-key
// @access  Public
export const getRazorpayKey = async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || '';
    res.status(200).json({
      success: true,
      keyId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Razorpay public key',
      error: error.message,
    });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid order amount is required',
      });
    }

    const instance = getRazorpayInstance();
    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay Payment Signature and Save Order
// @route   POST /api/payment/verify-payment
// @access  Public
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment verification parameters',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.warn('Razorpay Signature Verification Failed!');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature',
      });
    }

    // Payment is authentic! Now create/persist the order in MongoDB
    const generatedOrderId = orderData?.orderId || `ARZ-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const savedOrder = await Order.create({
      orderId: generatedOrderId,
      customer: {
        name: orderData?.customer?.name || 'Customer',
        email: orderData?.customer?.email || 'customer@example.com',
        phone: orderData?.customer?.phone || '',
        address: orderData?.customer?.address || '',
      },
      items: orderData?.items || [],
      totalAmount: orderData?.totalAmount || 0,
      currency: 'INR',
      paymentMethod: orderData?.paymentMethod || 'Razorpay Online',
      paymentStatus: 'PAID',
      status: 'Processing',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    console.log(`Order ${savedOrder.orderId} verified and recorded successfully.`);

    res.status(200).json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      data: savedOrder,
    });
  } catch (error) {
    console.error('Razorpay Payment Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};
