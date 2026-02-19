const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Sermon title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  preacher: {
    type: String,
    required: [true, 'Preacher name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Sermon date is required'],
    default: Date.now
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    validate: {
      validator: function(v) {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid URL starting with http:// or https://'
    }
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail image is required']
  },
  thumbnailPublicId: {
    type: String,
    select: false
  },
  series: {
    type: String,
    trim: true
  },
  bibleText: {
    type: String,
    trim: true
  },
  duration: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sermon', sermonSchema);