const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort('-date');
    
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: { events }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ date: { $gte: currentDate } })
      .sort('date')
      .limit(5);
    
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: { events }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    console.log('📥 Creating event...');
    console.log('📦 Body:', req.body);
    console.log('📸 File:', req.file);

    // Prepare event data
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time || '',
      venue: req.body.venue,
      category: req.body.category || 'Other',
      registrationRequired: req.body.registrationRequired === 'true',
      maxAttendees: req.body.maxAttendees ? parseInt(req.body.maxAttendees) : null
    };

    // Add image if uploaded
    if (req.file) {
      eventData.image = `/uploads/${req.file.filename}`;
    }

    console.log('📊 Event data to save:', eventData);

    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'venue'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        console.log(`❌ Missing required field: ${field}`);
        return res.status(400).json({
          status: 'error',
          message: `${field} is required`
        });
      }
    }

    const event = await Event.create(eventData);
    
    console.log('✅ Event created:', event._id);

    res.status(201).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create event'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Export ALL functions
module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
};