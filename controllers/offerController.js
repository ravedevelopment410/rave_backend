import mongoose from 'mongoose';
import Offer from '../models/Offer.js';
import { seedOffers } from '../data/seedData.js';

// @desc    Get all active promotional offers & coupons
// @route   GET /api/offers
export const getOffers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
      if (offers.length > 0) {
        return res.json({ success: true, count: offers.length, data: offers });
      }
    }

    const fallbackOffers = seedOffers.map((o, idx) => ({ ...o, _id: o._id || `aravez-offer-${idx + 1}` }));
    return res.json({ success: true, count: fallbackOffers.length, data: fallbackOffers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching offers', error: error.message });
  }
};

// @desc    Validate coupon code
// @route   POST /api/offers/validate-coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const normalizedCode = code.trim().toUpperCase();

    let offer = null;
    if (mongoose.connection.readyState === 1) {
      offer = await Offer.findOne({ couponCode: normalizedCode, isActive: true });
    }

    if (!offer) {
      offer = seedOffers.find(o => o.couponCode === normalizedCode && o.isActive);
    }

    if (!offer) {
      return res.status(404).json({ success: false, message: `Invalid coupon code "${code}".` });
    }

    if (cartTotal < offer.minSpend) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart spend of $${offer.minSpend.toFixed(2)}.`,
      });
    }

    const discountAmount = (cartTotal * offer.discountPercent) / 100;

    return res.json({
      success: true,
      message: `Coupon "${normalizedCode}" applied! You save $${discountAmount.toFixed(2)}.`,
      data: {
        couponCode: normalizedCode,
        discountPercent: offer.discountPercent,
        discountAmount,
        finalTotal: cartTotal - discountAmount,
        offer,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new promotional offer / coupon
// @route   POST /api/offers
export const createOffer = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const offer = await Offer.create(req.body);
      return res.status(201).json({ success: true, data: offer });
    }

    const newOffer = { ...req.body, _id: `aravez-offer-${Date.now()}` };
    seedOffers.unshift(newOffer);
    return res.status(201).json({ success: true, data: newOffer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete promotional offer / coupon
// @route   DELETE /api/offers/:id
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Offer.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Offer deleted successfully' });
    }

    const index = seedOffers.findIndex(o => o._id === id);
    if (index !== -1) {
      seedOffers.splice(index, 1);
      return res.json({ success: true, message: 'Offer deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Offer not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
