const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker
} = require('../controllers/workerController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getWorkers);
router.get('/:id', getWorker);

// Protected routes with image upload
router.post(
  '/', 
  protect, 
  authorize('admin', 'super_admin'), 
  upload.single('image'), 
  createWorker
);

router.put(
  '/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  upload.single('image'), 
  updateWorker
);

router.delete(
  '/:id', 
  protect, 
  authorize('admin', 'super_admin'), 
  deleteWorker
);

module.exports = router;