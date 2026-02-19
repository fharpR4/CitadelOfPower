const Contact = require('../models/Contact');
let emailService;

// Try to load email service, but don't fail if it's not available
try {
  emailService = require('../services/emailService');
  console.log('Email service loaded successfully');
} catch (error) {
  console.log('Email service not available - emails will not be sent');
  emailService = {
    sendContactNotification: async () => console.log('Email service unavailable'),
    sendAutoReply: async () => console.log('Email service unavailable')
  };
}

// @desc    Submit contact form
// @route   POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create contact entry
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    // Try to send emails (don't await - let them run in background)
    emailService.sendContactNotification(contact).catch(err => 
      console.log('Background email error:', err.message)
    );
    emailService.sendAutoReply(contact).catch(err => 
      console.log('Background auto-reply error:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: contact._id,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact
exports.getContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('repliedBy', 'username email');

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single contact (admin only)
// @route   GET /api/contact/:id
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'username email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update contact status (admin only)
// @route   PATCH /api/contact/:id
exports.updateContactStatus = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;
    
    const updateData = {
      status,
      updatedAt: Date.now()
    };

    if (status === 'replied' && replyMessage) {
      updateData.repliedAt = Date.now();
      updateData.repliedBy = req.user.id;
      updateData.replyMessage = replyMessage;
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete contact (admin only)
// @route   DELETE /api/contact/:id
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get contact stats (admin only)
// @route   GET /api/contact/stats
exports.getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ status: 'unread' });
    const read = await Contact.countDocuments({ status: 'read' });
    const replied = await Contact.countDocuments({ status: 'replied' });

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        read,
        replied
      }
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
