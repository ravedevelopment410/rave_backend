import mongoose from 'mongoose';
import Subscriber from '../models/Subscriber.js';

const subscribersStore = new Set();

// @desc    Subscribe to Aravez Newsletter
// @route   POST /api/newsletter/subscribe
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const existing = await Subscriber.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'You are already subscribed to the Aravez newsletter!' });
      }
      await Subscriber.create({ email: cleanEmail });
      return res.status(201).json({
        success: true,
        message: 'Welcome to the Aravez Inner Circle! Check your inbox for your 15% welcome code.',
      });
    }

    if (subscribersStore.has(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'You are already subscribed to the Aravez newsletter!' });
    }

    subscribersStore.add(cleanEmail);
    return res.status(201).json({
      success: true,
      message: 'Welcome to the Aravez Inner Circle! Check your inbox for your 15% welcome code.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Subscription failed', error: error.message });
  }
};

// @desc    Get all subscribers (Admin)
// @route   GET /api/newsletter
export const getSubscribers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const subs = await Subscriber.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: subs.length, data: subs });
    }
    const list = Array.from(subscribersStore).map((email, idx) => ({
      _id: `sub-${idx + 1}`,
      email,
      createdAt: new Date().toISOString(),
    }));
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

