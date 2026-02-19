const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const workerRoutes = require('./routes/workerRoutes');
const sermonRoutes = require('./routes/sermonRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Initialize Express app
const app = express();

// ============================================
// CORS CONFIGURATION - Allow all localhost ports
// ============================================
const corsOptions = {
  origin: function (origin, callback) {
    // Allowed patterns
    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
    ];

    // Add FRONTEND_URL from env if it exists
    if (process.env.FRONTEND_URL) {
      try {
        const escapedUrl = process.env.FRONTEND_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        allowedPatterns.push(new RegExp(`^${escapedUrl}$`));
      } catch (e) {
        console.warn('Invalid FRONTEND_URL in .env:', process.env.FRONTEND_URL);
      }
    }

    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin matches any allowed pattern
    const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('CORS policy: This origin is not allowed'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// STATIC FILES - Serve uploaded images
// ============================================
// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

app.use('/uploads', express.static(uploadDir));

// ============================================
// DATABASE CONNECTION
// ============================================
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/workers', workerRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Citadel of Power API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// TEST UPLOAD ENDPOINT (for debugging)
// ============================================
app.get('/api/test-upload', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Upload endpoint is ready',
    uploadsDir: uploadDir,
    files: fs.readdirSync(uploadDir)
  });
});

// ============================================
// 404 HANDLER - API routes not found
// ============================================
app.use('/api/*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error Stack:', err.stack);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 'error',
      message: 'File too large. Maximum size is 5MB'
    });
  }
  
  if (err.message === 'Only image files are allowed (JPEG, PNG, GIF, WebP)') {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n=================================');
  console.log(`🚀 SERVER STARTED SUCCESSFULLY`);
  console.log(`=================================`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Uploads directory: ${uploadDir}`);
  console.log(`\n📌 Mounted Routes:`);
  console.log(`   ✅ /api/workers`);
  console.log(`   ✅ /api/sermons`);
  console.log(`   ✅ /api/events`);
  console.log(`   ✅ /api/auth`);
  console.log(`   ✅ /api/contact`);
  console.log(`   ✅ /api/health`);
  console.log(`   ✅ /uploads (static files)`);
  console.log(`=================================\n`);
});