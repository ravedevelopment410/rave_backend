import mongoose from 'mongoose';
import Contact from '../models/Contact.js';

// In-memory fallback log
const contactsStore = [];

// @desc    Submit a contact inquiry form
// @route   POST /api/contact
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (Name, Email, and Message)',
      });
    }

    const contactData = {
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const savedContact = await Contact.create(contactData);
      return res.status(201).json({
        success: true,
        message: `Thank you, ${name}! Your message has been received. Our Aravez care team will get back to you within 24 hours.`,
        data: savedContact,
      });
    }

    contactsStore.push({ ...contactData, _id: `contact-${Date.now()}` });
    return res.status(201).json({
      success: true,
      message: `Thank you, ${name}! Your message has been received. Our Aravez care team will get back to you within 24 hours.`,
      data: contactData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit contact message', error: error.message });
  }
};

// @desc    Get all inquiries (for admin/monitoring)
// @route   GET /api/contact
export const getContacts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Contact.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: messages.length, data: messages });
    }
    return res.json({ success: true, count: contactsStore.length, data: contactsStore });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete contact inquiry
// @route   DELETE /api/contact/:id
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      await Contact.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Message deleted' });
    }

    const index = contactsStore.findIndex(c => c._id === id);
    if (index !== -1) {
      contactsStore.splice(index, 1);
    }
    return res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

