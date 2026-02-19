const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');  // Add this line

// Public routes
router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/:id', getEvent);

// Protected routes with image upload
router.post(
  '/', 
  protect, 
  authorize('admin', 'super_admin'), 
  upload.single('image'),  // Make sure field name matches 'image'
  createEvent
);

router.put(
  '/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  upload.single('image'), 
  updateEvent
);

router.delete(
  '/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  deleteEvent
);

module.exports = router;