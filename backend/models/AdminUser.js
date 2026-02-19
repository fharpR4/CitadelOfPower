const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin', 'editor'],
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
AdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
AdminUserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('AdminUser', AdminUserSchema);