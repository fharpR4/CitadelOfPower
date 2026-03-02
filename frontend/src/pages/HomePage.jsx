
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import banner from '../assets/banner.jpeg';
import { 
  UserGroupIcon, 
  VideoCameraIcon, 
  CalendarIcon,
  ArrowRightIcon,
  HeartIcon,
  BookOpenIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { eventAPI, sermonAPI } from '../services/api';
import { format, isValid } from 'date-fns';

const HomePage = () => {
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [latestSermon, setLatestSermon] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      try {
        const eventsRes = await eventAPI.getUpcoming();
        const events = eventsRes.data?.data?.events || [];
        if (events.length > 0) {
          setUpcomingEvent(events[0]);
          setUpcomingEvents(events.slice(0, 3));
        }
      } catch (eventErr) {
        console.warn('Events fetch failed:', eventErr.message);
      }

      // Fetch sermons
      try {
        const sermonsRes = await sermonAPI.getRecent();
        const sermons = sermonsRes.data?.data?.sermons || [];
        if (sermons.length > 0) {
          setLatestSermon(sermons[0]);
        }
      } catch (sermonErr) {
        console.warn('Sermons fetch failed:', sermonErr.message);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Unable to load some content. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Date TBD';
    const eventDate = new Date(date);
    if (!isValid(eventDate)) return 'Date TBD';
    return format(eventDate, 'MMM d, yyyy • h:mm a');
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="overflow-hidden">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-yellow-700">{error}</p>
          </div>
        </div>
      )}

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold">
                WELCOME TO
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block">CITADEL OF POWER</span>
              <span className="text-2xl md:text-3xl font-light mt-4 block text-blue-200">
                Where Faith Meets Power • Where Prayer Brings Change
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Experience the transforming power of God in a community of authentic worship, 
              powerful prayers, and life-changing fellowship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/workers"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Know More About Us
              </Link>
              <Link
                to="/sermons"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 backdrop-blur-sm"
              >
                Watch Latest Sermon
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* ===== ZIGZAG SECTION 1: WHO WE ARE ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <motion.div
              variants={fadeInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={banner} //https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80
                  alt="Church Worship"
                  className="w-full object-cover" //h-full 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                <UsersIcon className="h-12 w-12 mb-2" />
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Active Members</div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              variants={fadeInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
            >
              <span className="text-blue-600 font-semibold text-lg mb-4 block">WHO WE ARE</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                A Church With a <span className="text-blue-600">Difference</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Citade Of Power is not just a church; it's a spiritual home where lives are transformed, 
                destinies are changed, and miracles happen. We are a family of believers passionate about 
                God's presence and power.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <HeartIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Love & Care</span>
                </div>
                <div className="flex items-center gap-3">
                  <SparklesIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Power & Miracles</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpenIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Sound Doctrine</span>
                </div>
                <div className="flex items-center gap-3">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700">Global Impact</span>
                </div>
              </div>
              <Link to="/contact" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                Learn More About Us <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ZIGZAG SECTION 2: OUR SERVICES ===== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              variants={fadeInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="text-blue-600 font-semibold text-lg mb-4 block">WORSHIP WITH US</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Our <span className="text-blue-600">Service</span> Schedule
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join us for powerful worship services designed to strengthen your faith 
                and draw you closer to God. There's a place for you here.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Sunday Worship Service</h4>
                    <p className="text-gray-600">10:00 AM - 12:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Online Prayer Meeting</h4>
                    <p className="text-gray-600">Wednesdays • 9:00 PM</p>
                  </div>
                </div>
                
                {/* <div className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Prayer Meeting</h4>
                    <p className="text-gray-600">Fridays • 5:00 AM (Morning Prayer)</p>
                  </div> 
                </div> */}
              </div>
              
              <Link to="/services" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                View Full Schedule <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              variants={fadeInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1485218126466-34e6392ec754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Church Service"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 bg-purple-600 text-white p-6 rounded-2xl shadow-xl">
                <MusicalNoteIcon className="h-12 w-12 mb-2" />
                <div className="text-2xl font-bold">Powerful</div>
                <div className="text-sm">Worship</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ZIGZAG SECTION 3: UPCOMING EVENTS + LATEST SERMON ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-600 font-semibold text-lg mb-4 block">STAY CONNECTED</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What's Happening at <span className="text-blue-600">C. O. P.</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't miss out on these upcoming events and recent messages
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Upcoming Events Column */}
            <motion.div
              variants={fadeInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Upcoming Events</h3>
                  <Link to="/events" className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View All <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <motion.div
                        key={event._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <CalendarIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                              <ClockIcon className="h-4 w-4" />
                              <span>{formatDate(event.startDate || event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{event.venue || 'Main Sanctuary'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-xl text-center">
                    <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming events scheduled</p>
                    <p className="text-gray-400 text-sm mt-2">Check back soon for updates</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Latest Sermon Column */}
            <motion.div
              variants={fadeInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Latest Sermon</h3>
                  <Link to="/sermons" className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    Watch All <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>

                {latestSermon ? (
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <VideoCameraIcon className="h-16 w-16 text-gray-400" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-xl mb-2">{latestSermon.title}</h4>
                    <p className="text-gray-600 mb-4">by {latestSermon.preacher || 'Pastor'}</p>
                    <Link to={`/sermons/${latestSermon._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full text-center block">
                      Watch Now
                    </Link>
                  </motion.div>
                ) : (
                  <div className="bg-white p-8 rounded-xl text-center">
                    <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No sermons available</p>
                    <p className="text-gray-400 text-sm mt-2">Check back soon for new messages</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="bg-blue-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience God's Power?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Join us this Sunday and become part of our growing family at Citade Of Power
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Plan Your Visit
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                Request Prayer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
