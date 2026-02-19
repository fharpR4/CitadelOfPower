const Worker = require('../models/Worker');
const fs = require('fs');
const path = require('path');

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ isActive: true }).sort('order');
    
    res.status(200).json({
      status: 'success',
      results: workers.length,
      data: { workers }
    });
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch workers'
    });
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Public
const getWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        status: 'fail',
        message: 'No worker found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { worker }
    });
  } catch (error) {
    console.error('Error fetching worker:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch worker'
    });
  }
};

// @desc    Create worker
// @route   POST /api/workers
// @access  Private/Admin
const createWorker = async (req, res) => {
  try {
    console.log('📥 Creating worker...');
    console.log('📦 Body:', req.body);
    console.log('📸 File:', req.file);

    // Prepare worker data
    const workerData = {
      name: req.body.name,
      role: req.body.role,
      unit: req.body.unit,
      email: req.body.email || '',
      phone: req.body.phone || '',
      bio: req.body.bio || ''
    };

    // Add image if uploaded
    if (req.file) {
      workerData.image = `/uploads/${req.file.filename}`;
    }

    console.log('📊 Worker data to save:', workerData);

    // Validate required fields
    const requiredFields = ['name', 'role', 'unit'];
    for (const field of requiredFields) {
      if (!workerData[field]) {
        console.log(`❌ Missing required field: ${field}`);
        return res.status(400).json({
          status: 'error',
          message: `${field} is required`
        });
      }
    }

    const worker = await Worker.create(workerData);
    
    console.log('✅ Worker created:', worker._id);

    res.status(201).json({
      status: 'success',
      data: { worker }
    });
  } catch (error) {
    console.error('❌ Error creating worker:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create worker'
    });
  }
};

// @desc    Update worker
// @route   PUT /api/workers/:id
// @access  Private/Admin
const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        status: 'fail',
        message: 'No worker found with that ID'
      });
    }

    // Prepare update data
    const updateData = {
      name: req.body.name,
      role: req.body.role,
      unit: req.body.unit,
      email: req.body.email || '',
      phone: req.body.phone || '',
      bio: req.body.bio || ''
    };

    // If new image uploaded
    if (req.file) {
      // Delete old image if it exists and is not the default
      if (worker.image && worker.image !== '/uploads/default-worker.jpg') {
        const oldImagePath = path.join(__dirname, '..', worker.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑️ Deleted old image:', worker.image);
        }
      }
      
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('✅ Worker updated:', updatedWorker._id);

    res.status(200).json({
      status: 'success',
      data: { worker: updatedWorker }
    });
  } catch (error) {
    console.error('Error updating worker:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update worker'
    });
  }
};

// @desc    Delete worker
// @route   DELETE /api/workers/:id
// @access  Private/Admin
const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        status: 'fail',
        message: 'No worker found with that ID'
      });
    }

    // Delete image if it exists and is not the default
    if (worker.image && worker.image !== '/uploads/default-worker.jpg') {
      const imagePath = path.join(__dirname, '..', worker.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('🗑️ Deleted image:', worker.image);
      }
    }

    await worker.deleteOne();
    
    console.log('✅ Worker deleted:', req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting worker:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete worker'
    });
  }
};

module.exports = {
  getWorkers,
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker
};