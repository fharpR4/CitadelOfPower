const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please provide the event date']
  },
  time: {
    type: String,
    trim: true
  },
  venue: {
    type: String,
    required: [true, 'Please provide the event venue'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Sunday Service', 'Bible Study', 'Prayer Meeting', 'Conference', 'Outreach', 'Fellowship', 'Other'],
    default: 'Other'
  },
  image: {
    type: String,
    default: '/uploads/default-event.jpg'
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  maxAttendees: {
    type: Number,
    min: 1
  },
  currentAttendees: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);