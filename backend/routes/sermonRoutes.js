const express = require('express');
const router = express.Router();
const {
  getSermons,
  getSermon,
  createSermon,
  updateSermon,
  deleteSermon
} = require('../controllers/sermonController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');  // ← ADD THIS LINE

// Public routes
router.get('/', getSermons);
router.get('/:id', getSermon);

// IMPORTANT: Add upload.single('thumbnail') middleware BEFORE createSermon
router.post(
  '/', 
  protect, 
  authorize('admin', 'super_admin'), 
  upload.single('thumbnail'),  // ← THIS IS CRITICAL
  createSermon
);

router.put(
  '/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  upload.single('thumbnail'),  // ← AND HERE
  updateSermon
);

router.delete(
  '/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  deleteSermon
);

module.exports = router;