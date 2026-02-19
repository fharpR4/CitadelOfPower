const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const AdminUser = require('./models/AdminUser');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Delete existing admin
    await AdminUser.deleteOne({ username: 'admin' });
    console.log('✅ Deleted old admin');
    
    // CRITICAL FIX: DO NOT hash manually! Let the pre-save hook do it!
    // Just pass plain password and let the model's pre('save') hook hash it
    const admin = await AdminUser.create({
      username: 'admin',
      password: 'Citadel@2026',  // Plain password - NOT hashed!
      email: 'admin@citadelofpower.org',
      fullName: 'System Administrator',
      role: 'superadmin'
    });
    
    console.log('\n✅ NEW ADMIN CREATED!');
    console.log('=================================');
    console.log('Username: admin');
    console.log('Password: Citadel@2026');
    console.log('ID:', admin._id);
    console.log('=================================\n');
    
    // Fetch the user with password to test
    const savedUser = await AdminUser.findOne({ username: 'admin' }).select('+password');
    
    // Test the password
    const testMatch = await savedUser.comparePassword('Citadel@2026');
    console.log('🔐 Password test:', testMatch ? '✅ Works!' : '❌ Still broken!');
    
    if (!testMatch) {
      console.log('\n⚠️ If still broken, check that your pre-save hook is working.');
      console.log('Hash in DB:', savedUser.password);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

resetAdmin();