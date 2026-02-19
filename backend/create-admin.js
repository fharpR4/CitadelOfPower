const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const AdminUser = require('./models/AdminUser');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Delete existing admin
    await AdminUser.deleteOne({ username: 'admin' });
    console.log('✅ Deleted old admin');
    
    // Create new admin with role
    const admin = await AdminUser.create({
      username: 'admin',
      password: 'Citadel@2026',
      role: 'super_admin'  // ← ADD ROLE
    });
    
    console.log('\n✅ NEW ADMIN CREATED!');
    console.log('=================================');
    console.log('Username: admin');
    console.log('Password: Citadel@2026');
    console.log('Role: super_admin');
    console.log('ID:', admin._id);
    console.log('=================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

createAdmin();