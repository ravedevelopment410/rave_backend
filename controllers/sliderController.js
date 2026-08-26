import mongoose from 'mongoose';
import Slider from '../models/Slider.js';

export const fallbackSliders = [
  {
    _id: 'slider-av-1',
    badge: '📺 RAVE SERVICES - Commercial AV Solutions',
    title: 'Interactive Flat Panels & 4K Laser Projectors.',
    subtitle: 'Authorized distributor of commercial Touchbooks, Active LEDs, and Video Conferencing equipment.',
    btnText: 'Explore Products',
    btnLink: '/products',
    secondaryBtnText: 'Contact AV Team',
    secondaryBtnLink: '/contact',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    floatingText: 'Authorized AV Partner',
    isActive: true,
    order: 1,
  }
];

// @desc    Get all active sliders
// @route   GET /api/sliders
export const getSliders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const sliders = await Slider.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: sliders.length, data: sliders });
    }
    return res.json({ success: true, count: fallbackSliders.length, data: fallbackSliders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new hero slider
// @route   POST /api/sliders
export const createSlider = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const slider = await Slider.create(req.body);
      return res.status(201).json({ success: true, data: slider });
    }
    const newSlide = { ...req.body, _id: `slider-${Date.now()}` };
    fallbackSliders.push(newSlide);
    return res.status(201).json({ success: true, data: newSlide });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update hero slider
// @route   PUT /api/sliders/:id
export const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      const updated = await Slider.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    }
    const idx = fallbackSliders.findIndex(s => s._id === id);
    if (idx !== -1) {
      fallbackSliders[idx] = { ...fallbackSliders[idx], ...req.body };
      return res.json({ success: true, data: fallbackSliders[idx] });
    }
    return res.status(404).json({ success: false, message: 'Slider not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete hero slider
// @route   DELETE /api/sliders/:id
export const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Slider.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Slider deleted' });
    }
    const idx = fallbackSliders.findIndex(s => s._id === id);
    if (idx !== -1) {
      fallbackSliders.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Slider deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
