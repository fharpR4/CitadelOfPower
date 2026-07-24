import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  PlayIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { format, isValid } from 'date-fns';

// ============================================================
// EVENT RECORDINGS (hardcoded, no backend needed)
//
// Same folder idea as the events below: give each video a
// category and it lands in that folder automatically. Reuse
// an existing category name to add a video to an existing
// folder, or type a new one to start a fresh one.
//
// To add a new recording: copy the Drive share link, grab the
// ID between /d/ and /view, add a new object with a real
// title and category. Make sure the file's sharing is "Anyone
// with the link can view" or it won't play for visitors.
//
// NOTE: the titles and categories below are placeholders,
// swap them for the real service names/dates and the correct
// program type once you know which recording is which.
// ============================================================
const EVENT_VIDEOS = [
  { id: '1U6b3hmRJLD8Fpy53ooFvQkXDHDwKpUJz', title: 'Sunday Service Recording 1', category: 'Sunday Service' },
  { id: '1vKwzqcPgvMsrAJsrj-Jn8RqWi0gmMWQ2', title: 'Sunday Service Recording 2', category: 'Sunday Service' },
  { id: '1xfFTjCXrQkxfd9P8pdf8uyGa9RwRBmlW', title: 'Sunday Service Recording 3', category: 'Sunday Service' },
  { id: '17IbqSuuOhmu5Rx8QRYhxIYUpk-NlB5UG', title: 'Sunday Service Recording 4', category: 'Sunday Service' },
  { id: '1PU3BOGdRZwOsZhD6NwajC2aGLp4VCsTA', title: 'Sunday Service Recording 5', category: 'Sunday Service' },
  { id: '1detp_fLJhgGW4NFOkjRTO1a-wK-3AItT', title: 'Sunday Service Recording 6', category: 'Sunday Service' },
  { id: '1JCLPX4ksDtfT3s2teAVrSu-ZbFJqxktI', title: 'Sunday Service Recording 7', category: 'Sunday Service' },
  { id: '1faKgYesOMcUtJZ2ORVeHnnv4u1JwXL6X', title: 'Sunday Service Recording 8', category: 'Sunday Service' },
];

// ============================================================
// EVENTS (hardcoded, no backend needed)
//
// category groups events into their own accordion section on
// the page ("Sunday Service", "Youth Camp", etc). Pick any
// name you like, if it's new it just becomes a new group
// automatically, nothing else to configure.
//
// date still controls the "Upcoming" badge on each card, so
// within a category you can always tell what's next.
//
// image: put your event photo in src/assets/events/ and
// import it at the top of this file (see the two examples
// below), then reference the imported variable here. If you
// don't have a photo yet, leave image as null and a plain
// colored card will show instead, nothing breaks.
//
// date format: 'YYYY-MM-DDTHH:MM:SS' (24 hour time)
// ============================================================

// import youthConferenceImg from '../assets/events/youth-conference.jpg';
// import watchNightImg from '../assets/events/watch-night.jpg';

const EVENTS = [
  {
    id: 'evt-1',
    title: 'Sunday Worship Service',
    category: 'Sunday Service',
    image: null, // e.g. youthConferenceImg
    date: '2026-08-02T09:00:00',
    venue: 'Main Sanctuary',
    description: 'Join us for a powerful time of worship, the word, and fellowship.',
  },
  {
    id: 'evt-2',
    title: 'Midweek Bible Study',
    category: 'Bible Study',
    image: null,
    date: '2026-07-30T18:00:00',
    venue: 'Fellowship Hall',
    description: 'A deeper look into scripture, open to everyone regardless of background.',
  },
  {
    // SKELETON — fill this in once the pastor confirms details.
    // Everything marked TODO below is a placeholder, swap it
    // and leave the rest of the structure exactly as is.
    id: 'evt-3',
    title: 'Birthday Celebration', // e.g. "Sister Grace's Birthday Celebration"
    category: 'Sunday Service',
    image: null, // TODO: import photo (see the two commented import lines above) and set it here
    date: '2026-07-19T09:00:00', // TODO: confirm exact date/time if different
    venue: 'Main Sanctuary',
    description: 'We celebrate all July Celebrants.',
  },
  // Add more events by copying a block above. Reuse an existing
  // category name to add it to that same group, or type a new
  // one to start a fresh group.

  // BLANK TEMPLATE — uncomment and fill in for a new event:
  // {
  //   id: 'evt-X',
  //   title: '',
  //   category: '',
  //   image: null,
  //   date: 'YYYY-MM-DDTHH:MM:SS',
  //   venue: '',
  //   description: '',
  // },
];

// Order categories appear in on the page. Anything not listed
// here just gets added to the end automatically. Used by both
// the video folders and the event/program folders.
const CATEGORY_ORDER = [
  'Sunday Service',
  'Bible Study',
  'Prayer Meeting',
  'Conference',
  'Outreach',
  'Fellowship',
  'Youth Camp',
  'Children Ministry',
  'Other',
];

const sortCategories = (categories) =>
  [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

const EventsPage = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    EVENTS.forEach((e) => {
      initial[e.category || 'Other'] = true;
    });
    return initial;
  });

  const [openVideoGroups, setOpenVideoGroups] = useState(() => {
    const initial = {};
    EVENT_VIDEOS.forEach((v) => {
      initial[v.category || 'Other'] = true;
    });
    return initial;
  });

  const toggleGroup = (category) => {
    setOpenGroups((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleVideoGroup = (category) => {
    setOpenVideoGroups((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const isUpcoming = (date) => {
    if (!date) return false;
    const eventDate = new Date(date);
    const today = new Date();
    return isValid(eventDate) && eventDate >= today;
  };

  const formatEventDate = (date, includeTime = true) => {
    if (!date) return 'Date TBD';
    const eventDate = new Date(date);
    if (!isValid(eventDate)) return 'Date TBD';
    try {
      return includeTime
        ? format(eventDate, 'MMMM d, yyyy - h:mm a')
        : format(eventDate, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date TBD';
    }
  };

  // Group events by category, sort each group by date ascending
  const groupedEvents = EVENTS.reduce((acc, event) => {
    const cat = event.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(event);
    return acc;
  }, {});
  Object.keys(groupedEvents).forEach((cat) => {
    groupedEvents[cat].sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  const eventCategoriesPresent = sortCategories(Object.keys(groupedEvents));

  // Group videos by category
  const groupedVideos = EVENT_VIDEOS.reduce((acc, video) => {
    const cat = video.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(video);
    return acc;
  }, {});
  const videoCategoriesPresent = sortCategories(Object.keys(groupedVideos));

  return (
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Church Events
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Join us for these upcoming activities and fellowship opportunities.
        </p>
      </motion.div>

      {/* Event Recordings, grouped by program type */}
      {videoCategoriesPresent.length > 0 && (
        <div className="mb-12 space-y-4">
          <h2 className="text-2xl font-bold mb-2">Watch Our Services</h2>
          {videoCategoriesPresent.map((category) => {
            const groupVideos = groupedVideos[category];
            const isOpen = !!openVideoGroups[category];

            return (
              <div key={category} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleVideoGroup(category)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                      {groupVideos.length} {groupVideos.length === 1 ? 'video' : 'videos'}
                    </span>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {groupVideos.map((video) => (
                          <button
                            key={video.id}
                            onClick={() => setActiveVideo(video)}
                            className="group relative aspect-video rounded-xl overflow-hidden bg-gray-900 text-left focus:outline-none focus:ring-2 focus:ring-primary-600"
                          >
                            <img
                              src={`https://drive.google.com/thumbnail?id=${video.id}&sz=w500`}
                              alt={video.title}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <PlayIcon className="h-7 w-7 text-primary-600 ml-0.5" />
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                              <span className="text-white text-sm font-medium">{video.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
                aria-label="Close video"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={`https://drive.google.com/file/d/${activeVideo.id}/preview`}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                />
              </div>
              <p className="text-white text-center mt-3 font-medium">{activeVideo.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events grouped by program type, accordion style */}
      {eventCategoriesPresent.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">Programs</h2>
          {eventCategoriesPresent.map((category) => {
            const groupEvents = groupedEvents[category];
            const isOpen = !!openGroups[category];
            const upcomingCount = groupEvents.filter((e) => isUpcoming(e.date)).length;

            return (
              <div key={category} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleGroup(category)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                      {groupEvents.length} {groupEvents.length === 1 ? 'event' : 'events'}
                    </span>
                    {upcomingCount > 0 && (
                      <span className="text-xs font-semibold text-primary-700 bg-primary-100 rounded-full px-2.5 py-1">
                        {upcomingCount} upcoming
                      </span>
                    )}
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupEvents.map((event, index) => {
                          const upcoming = isUpcoming(event.date);
                          return (
                            <motion.div
                              key={event.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`card overflow-hidden ${
                                upcoming ? 'border-l-4 border-primary-600' : 'opacity-75'
                              }`}
                            >
                              <div className="relative">
                                {event.image ? (
                                  <img
                                    src={event.image}
                                    alt={event.title}
                                    className={`w-full h-44 object-cover ${!upcoming ? 'grayscale-[30%]' : ''}`}
                                  />
                                ) : (
                                  <div
                                    className={`w-full h-44 flex items-center justify-center ${
                                      upcoming
                                        ? 'bg-gradient-to-br from-primary-100 to-primary-50'
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    <CalendarDaysIcon
                                      className={`h-16 w-16 ${upcoming ? 'text-primary-300' : 'text-gray-300'}`}
                                    />
                                  </div>
                                )}
                                {upcoming && (
                                  <span className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                    Upcoming
                                  </span>
                                )}
                              </div>
                              <div className="p-6">
                                <h4 className="text-xl font-bold text-gray-900 mb-3">
                                  {event.title || 'Untitled Event'}
                                </h4>
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <CalendarIcon className="h-5 w-5 text-primary-600" />
                                    <span>{formatEventDate(event.date, upcoming)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <MapPinIcon className="h-5 w-5 text-primary-600" />
                                    <span>{event.venue || 'Venue TBD'}</span>
                                  </div>
                                </div>
                                <p className="text-gray-700">
                                  {event.description || 'No description available.'}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-gradient-to-b from-gray-50 to-white rounded-3xl"
        >
          <CalendarDaysIcon className="h-32 w-32 mx-auto text-primary-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">No Events Scheduled</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We're currently planning our next church events.
            Please check back soon for updates!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EventsPage;