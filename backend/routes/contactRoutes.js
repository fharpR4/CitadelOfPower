const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.json({
      status: 'success',
      results: messages.length,
      data: { messages }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// @desc    Get single message (admin only)
// @route   GET /api/contact/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'Message not found' });
    }
    res.json({ status: 'success', data: { message } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// @desc    Create contact message (public)
// @route   POST /api/contact
router.post('/', async (req, res) => {
  try {
    const message = await Contact.create(req.body);
    res.status(201).json({ 
      status: 'success', 
      data: { message } 
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// @desc    Update message (admin only)
// @route   PUT /api/contact/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'Message not found' });
    }
    res.json({ status: 'success', data: { message } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// @desc    Delete message (admin only)
// @route   DELETE /api/contact/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ status: 'fail', message: 'Message not found' });
    }
    res.json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;