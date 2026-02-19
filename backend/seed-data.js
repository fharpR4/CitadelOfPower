const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const Sermon = require('./models/Sermon');

dotenv.config();

const sampleEvents = [
  {
    title: 'Sunday Worship Service',
    description: 'Join us for our weekly Sunday worship service. Experience the presence of God through powerful worship and life-changing word.',
    startDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    endDate: new Date(Date.now() + 86400000 * 2 + 7200000),
    venue: 'Main Sanctuary',
    type: 'Service',
    isFeatured: true
  },
  {
    title: 'Power Night Prayer',
    description: 'A night of intense prayer and spiritual warfare. Come with your prayer requests.',
    startDate: new Date(Date.now() + 86400000 * 4), // 4 days from now
    endDate: new Date(Date.now() + 86400000 * 4 + 10800000),
    venue: 'Prayer Cathedral',
    type: 'Prayer',
    isFeatured: true
  },
  {
    title: 'Youth Conference 2025',
    description: 'Annual youth conference with guest ministers and powerful sessions.',
    startDate: new Date(Date.now() + 86400000 * 14), // 14 days from now
    endDate: new Date(Date.now() + 86400000 * 16),
    venue: 'Main Auditorium',
    type: 'Conference',
    isFeatured: true
  }
];

const sampleSermons = [
  {
    title: 'The Power of Persistent Prayer',
    preacher: 'Pastor David Williams',
    bibleText: { book: 'Luke', chapter: 18, verse: '1-8' },
    datePreached: new Date(Date.now() - 86400000 * 3),
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    description: 'Understanding why we must pray without ceasing.',
    duration: 45
  },
  {
    title: 'Walking in Divine Purpose',
    preacher: 'Pastor Sarah Johnson',
    bibleText: { book: 'Jeremiah', chapter: 29, verse: '11' },
    datePreached: new Date(Date.now() - 86400000 * 7),
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    description: 'Discovering and walking in God\'s purpose for your life.',
    duration: 52
  },
  {
    title: 'The Season of Breakthrough',
    preacher: 'Pastor Michael Chen',
    bibleText: { book: 'Isaiah', chapter: 43, verse: '19' },
    datePreached: new Date(Date.now() - 86400000 * 10),
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    description: 'Behold, I am doing a new thing. Recognizing your season of breakthrough.',
    duration: 48
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Event.deleteMany({});
    await Sermon.deleteMany({});
    console.log('Cleared existing events and sermons');

    // Insert sample events
    const events = await Event.insertMany(sampleEvents);
    console.log(`Created ${events.length} sample events`);

    // Insert sample sermons
    const sermons = await Sermon.insertMany(sampleSermons);
    console.log(`Created ${sermons.length} sample sermons`);

    console.log('Data seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
