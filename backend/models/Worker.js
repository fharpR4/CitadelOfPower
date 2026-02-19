const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  role: {
    type: String,
    required: [true, 'Please provide a role'],
    trim: true
  },
  unit: {
    type: String,
    required: [true, 'Please provide a unit'],
    trim: true
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  image: {
    type: String,
    default: '/uploads/default-worker.jpg'
  },
  imagePublicId: {
    type: String,
    select: false
  },
  order: {
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

module.exports = mongoose.model('Worker', workerSchema);