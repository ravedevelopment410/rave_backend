import mongoose from 'mongoose';
import Slider from '../models/Slider.js';

export const fallbackSliders = [
  {
    _id: 'slider-1',
    badge: '🌿 100% Certified Botanical Wellness',
    title: 'Pure Botanical Care for Radiant Skin & Soul.',
    subtitle: 'Discover Aravez — artisanal skincare, herbal adaptogens, and organic loose-leaf teas consciously crafted from wildcrafted earth botanicals.',
    btnText: 'Shop Best Sellers',
    btnLink: '/products',
    secondaryBtnText: 'Explore Offers (Up to 30% OFF)',
    secondaryBtnLink: '/offers',
    image: 'https://images.unsplash.com/photo-1608248597359-009a25b6a716?auto=format&fit=crop&w=1200&q=80',
    floatingText: 'Code: ARAVEZ20 (20% OFF)',
    isActive: true,
    order: 1,
  },
  {
    _id: 'slider-2',
    badge: '✨ Ancient Ayurvedic Intelligence',
    title: 'Restorative Herbal Elixirs & Adaptogen Tonics.',
    subtitle: 'Calm daily stress, awaken cellular longevity, and fortify immune resilience with sacred Himalayan botanicals and Shilajit drops.',
    btnText: 'Explore Herbal Wellness',
    btnLink: '/products?category=Herbal+Wellness',
    secondaryBtnText: 'Read Our Story',
    secondaryBtnLink: '/about',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    floatingText: '100% Wildcrafted Himalayan Herbs',
    isActive: true,
    order: 2,
  },
  {
    _id: 'slider-3',
    badge: '🍵 Mountain Cloud-Forest Harvest',
    title: 'Artisan Loose-Leaf Organic Teas & Infusions.',
    subtitle: 'Slow down with high-elevation organic green teas, soothing French lavender blossoms, and fragrant night-blooming jasmine.',
    btnText: 'Discover Tea Collection',
    btnLink: '/products?category=Organic+Teas',
    secondaryBtnText: 'View Tea Deals',
    secondaryBtnLink: '/offers',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    floatingText: 'Zero Artificial Aromas • Biodegradable',
    isActive: true,
    order: 3,
  },
];

// @desc    Get all active sliders
// @route   GET /api/sliders
export const getSliders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const sliders = await Slider.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
      if (sliders.length > 0) {
        return res.json({ success: true, count: sliders.length, data: sliders });
      }
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
