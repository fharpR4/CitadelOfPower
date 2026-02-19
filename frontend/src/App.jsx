import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const WorkersPage = lazy(() => import('./pages/WorkersPage'));
const SermonsPage = lazy(() => import('./pages/SermonsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Admin CRUD Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminWorkers = lazy(() => import('./pages/admin/AdminWorkers'));
const AdminSermons = lazy(() => import('./pages/admin/AdminSermons'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Private Route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Redirect if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return !isAuthenticated ? children : <Navigate to="/admin/dashboard" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLoginPage = location.pathname === '/admin/login';
  const isAdminDashboard = location.pathname === '/admin/dashboard';
  
  // Determine which navbar to show
  const showAdminNavbar = isAdminRoute && !isAdminLoginPage && isAuthenticated;
  const showPublicNavbar = !isAdminRoute;
  const showNoNavbar = isAdminLoginPage;

  // Log route changes for debugging
  useEffect(() => {
    console.log('📍 Route changed:', location.pathname);
    console.log('   isAdminRoute:', isAdminRoute);
    console.log('   isAuthenticated:', isAuthenticated);
    console.log('   showAdminNavbar:', showAdminNavbar);
    console.log('   showPublicNavbar:', showPublicNavbar);
  }, [location, isAuthenticated, isAdminRoute, showAdminNavbar, showPublicNavbar]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ScrollToTop />
      
      {/* Conditional Navbar */}
      {showAdminNavbar && <AdminNavbar />}
      {showPublicNavbar && <Navbar />}
      {/* No navbar for admin login page */}
      
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/workers" element={<WorkersPage />} />
            <Route path="/sermons" element={<SermonsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Login - Public but redirects if authenticated */}
            <Route 
              path="/admin/login" 
              element={
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/workers" 
              element={
                <PrivateRoute>
                  <AdminWorkers />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/workers/new" 
              element={
                <PrivateRoute>
                  <AdminWorkers />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/workers/:id" 
              element={
                <PrivateRoute>
                  <AdminWorkers />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/sermons" 
              element={
                <PrivateRoute>
                  <AdminSermons />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/sermons/new" 
              element={
                <PrivateRoute>
                  <AdminSermons />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/sermons/:id" 
              element={
                <PrivateRoute>
                  <AdminSermons />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <PrivateRoute>
                  <AdminEvents />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/events/new" 
              element={
                <PrivateRoute>
                  <AdminEvents />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/events/:id" 
              element={
                <PrivateRoute>
                  <AdminEvents />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/contacts" 
              element={
                <PrivateRoute>
                  <AdminContacts />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/contacts/:id" 
              element={
                <PrivateRoute>
                  <AdminContacts />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <PrivateRoute>
                  <AdminSettings />
                </PrivateRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      {/* Footer - Hide on all admin routes except dashboard maybe */}
      {!isAdminRoute && <Footer />}
      {isAdminDashboard && (
        <div className="text-center text-xs text-gray-500 py-2 border-t">
          Citadel of Power Admin Panel
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;