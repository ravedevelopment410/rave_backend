import mongoose from 'mongoose';
import Review from '../models/Review.js';

export const fallbackReviews = [];

// @desc    Get all active reviews
// @route   GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find().sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: reviews.length, data: reviews });
    }
    return res.json({ success: true, count: fallbackReviews.length, data: fallbackReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const review = await Review.create(req.body);
      return res.status(201).json({ success: true, data: review });
    }
    const newRev = { ...req.body, _id: `rev-${Date.now()}` };
    fallbackReviews.unshift(newRev);
    return res.status(201).json({ success: true, data: newRev });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const updated = await Review.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    }
    const idx = fallbackReviews.findIndex(r => r._id === id);
    if (idx !== -1) {
      fallbackReviews[idx] = { ...fallbackReviews[idx], ...req.body };
      return res.json({ success: true, data: fallbackReviews[idx] });
    }
    return res.status(404).json({ success: false, message: 'Review not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Review.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Review deleted successfully' });
    }
    const idx = fallbackReviews.findIndex(r => r._id === id);
    if (idx !== -1) {
      fallbackReviews.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
