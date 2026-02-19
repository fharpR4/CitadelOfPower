const Sermon = require('../models/Sermon');
const cloudinary = require('../config/cloudinary');

// @desc    Get all sermons
// @route   GET /api/sermons
// @access  Public
const getSermons = async (req, res) => {
  try {
    const { limit, sort, series } = req.query;
    
    // Build query
    let query = Sermon.find({ isActive: true });
    
    // Filter by series
    if (series) {
      query = query.where('series').equals(series);
    }
    
    // Add sorting
    if (sort) {
      const sortFields = sort.split(',').join(' ');
      query = query.sort(sortFields);
    } else {
      query = query.sort('-date');
    }
    
    // Add limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const sermons = await query;
    
    res.status(200).json({
      status: 'success',
      results: sermons.length,
      data: { sermons }
    });
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sermons'
    });
  }
};

// @desc    Get single sermon
// @route   GET /api/sermons/:id
// @access  Public
const getSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    
    if (!sermon) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sermon not found'
      });
    }
    
    // Increment views
    sermon.views += 1;
    await sermon.save();
    
    res.status(200).json({
      status: 'success',
      data: { sermon }
    });
  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sermon'
    });
  }
};

// @desc    Create sermon
// @route   POST /api/sermons
// @access  Private/Admin
const createSermon = async (req, res) => {
  try {
    console.log('📥 Creating sermon...');
    console.log('📦 Body:', req.body);
    console.log('📸 File:', req.file);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Thumbnail image is required'
      });
    }

    // Prepare sermon data
    const sermonData = {
      title: req.body.title,
      preacher: req.body.preacher,
      date: req.body.date || Date.now(),
      description: req.body.description || '',
      videoUrl: req.body.videoUrl,
      thumbnail: `/uploads/${req.file.filename}`, // Local URL
      series: req.body.series || '',
      bibleText: req.body.bibleText || ''
    };

    // Validate required fields
    if (!sermonData.title) {
      return res.status(400).json({ status: 'error', message: 'Title is required' });
    }
    if (!sermonData.preacher) {
      return res.status(400).json({ status: 'error', message: 'Preacher is required' });
    }
    if (!sermonData.videoUrl) {
      return res.status(400).json({ status: 'error', message: 'Video URL is required' });
    }

    const sermon = await Sermon.create(sermonData);
    
    console.log('✅ Sermon created:', sermon._id);

    res.status(201).json({
      status: 'success',
      data: { sermon }
    });
  } catch (error) {
    console.error('❌ Error creating sermon:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create sermon'
    });
  }
};



// @desc    Update sermon
// @route   PUT /api/sermons/:id
// @access  Private/Admin
const updateSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    
    if (!sermon) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sermon not found'
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (sermon.thumbnailPublicId) {
        await cloudinary.uploader.destroy(sermon.thumbnailPublicId);
      }
      
      updateData.thumbnail = req.file.path;
      updateData.thumbnailPublicId = req.file.filename;
    }

    const updatedSermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log('✅ Sermon updated:', updatedSermon._id);

    res.status(200).json({
      status: 'success',
      data: { sermon: updatedSermon }
    });
  } catch (error) {
    console.error('Error updating sermon:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to update sermon'
    });
  }
};

// @desc    Delete sermon
// @route   DELETE /api/sermons/:id
// @access  Private/Admin
const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    
    if (!sermon) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sermon not found'
      });
    }

    // Delete image from Cloudinary
    if (sermon.thumbnailPublicId) {
      await cloudinary.uploader.destroy(sermon.thumbnailPublicId);
    }

    await sermon.deleteOne();
    
    console.log('✅ Sermon deleted:', req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete sermon'
    });
  }
};

module.exports = {
  getSermons,
  getSermon,
  createSermon,
  updateSermon,
  deleteSermon
};