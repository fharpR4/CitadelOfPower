const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const AdminUser = require('./models/AdminUser');

const debugAuth = async () => {
  try {
    console.log('\n🔬 DEEP AUTHENTICATION DEBUGGING');
    console.log('=================================\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // 1. Check bcrypt version
    console.log('📦 Bcrypt version:', require('bcryptjs/package.json').version);
    
    // 2. Get the raw user from database
    console.log('\n🔍 Fetching user with password field...');
    const user = await AdminUser.findOne({ username: 'admin' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    console.log('✅ User found:');
    console.log('   Username:', user.username);
    console.log('   User ID:', user._id);
    console.log('   Password hash:', user.password);
    console.log('   Hash length:', user.password.length);
    
    // 3. Test password manually with bcrypt.compare
    console.log('\n🔐 Testing password manually with bcrypt.compare...');
    const testPassword = 'Citadel@2026';
    
    try {
      const manualCompare = await bcrypt.compare(testPassword, user.password);
      console.log(`   bcrypt.compare("${testPassword}", hash):`, manualCompare ? '✅ Valid' : '❌ Invalid');
    } catch (bcryptError) {
      console.error('   ❌ bcrypt.compare error:', bcryptError.message);
    }
    
    // 4. Test through model method
    console.log('\n🔐 Testing through model.comparePassword()...');
    try {
      const methodCompare = await user.comparePassword(testPassword);
      console.log('   model.comparePassword():', methodCompare ? '✅ Valid' : '❌ Invalid');
    } catch (methodError) {
      console.error('   ❌ model.comparePassword error:', methodError.message);
    }
    
    // 5. Create a brand new hash and compare
    console.log('\n🆕 Creating fresh hash for comparison...');
    const salt = await bcrypt.genSalt(10);
    const freshHash = await bcrypt.hash(testPassword, salt);
    console.log('   Fresh hash:', freshHash);
    
    const freshCompare = await bcrypt.compare(testPassword, freshHash);
    console.log('   bcrypt.compare with fresh hash:', freshCompare ? '✅ Works' : '❌ Failed');
    
    // 6. Check if the stored hash is valid format
    console.log('\n📊 Hash analysis:');
    console.log('   Starts with $2a$?:', user.password.startsWith('$2a$') ? '✅ Yes' : '❌ No');
    console.log('   Contains valid salt?', user.password.length > 29 ? '✅ Yes' : '❌ No');
    
    // 7. Try to extract and verify salt
    console.log('\n🧂 Salt verification:');
    const saltFromHash = user.password.substring(0, 29);
    console.log('   Salt from hash:', saltFromHash);
    
    try {
      const hashWithSameSalt = await bcrypt.hash(testPassword, saltFromHash);
      console.log('   Hash with same salt:', hashWithSameSalt);
      console.log('   Matches stored hash?', hashWithSameSalt === user.password ? '✅ Yes' : '❌ No');
    } catch (saltError) {
      console.error('   ❌ Salt error:', saltError.message);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error);
  } finally {
    console.log('\n=================================\n');
    await mongoose.disconnect();
    process.exit();
  }
};

debugAuth();