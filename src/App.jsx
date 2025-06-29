import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import AdminPanel from './admin/AdminPanel'
import SubAdminPanel from './subadmin/SubAdminPanel'
import UserPanel from './user/UserPanel'
import AuthForm from './components/AuthForm'
import ScrollToTop from './components/ScrollToTop'

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-teal-100">
      <h1 className="text-4xl font-extrabold text-orange-700 mb-10 drop-shadow">Welcome to Swarg Store</h1>
      <div className="flex flex-col sm:flex-row gap-8">
        <button
          onClick={() => navigate('/login/admin')}
          className="bg-gradient-to-r from-orange-500 to-teal-500 text-white px-10 py-6 rounded-2xl text-2xl font-bold shadow-lg hover:scale-105 transition border-4 border-white hover:border-orange-200"
        >
          Go to Admin Panel
        </button>
        <button
          onClick={() => navigate('/login/subadmin')}
          className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-10 py-6 rounded-2xl text-2xl font-bold shadow-lg hover:scale-105 transition border-4 border-white hover:border-teal-200"
        >
          Go to Subadmin Panel
        </button>
        <button
          onClick={() => navigate('/user')}
          className="bg-gradient-to-r from-slate-500 to-orange-500 text-white px-10 py-6 rounded-2xl text-2xl font-bold shadow-lg hover:scale-105 transition border-4 border-white hover:border-slate-200"
        >
          Go to User Panel
        </button>
      </div>
    </div>
  );
}

// JWT expiry check utility
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

// Global error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // Optionally log error
    // console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-center py-20 font-bold text-2xl">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

// PrivateRoute for admin and subadmin
function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (e) {}
  }
  // Check expiry
  if (!token || userRole !== role || isTokenExpired(token)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
  return children;
}

// Force logout on route change if token expired
function TokenExpiryWatcher() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      localStorage.clear();
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <TokenExpiryWatcher />
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={
            <PrivateRoute role="admin">
              <AdminPanel />
            </PrivateRoute>
          } />
          <Route path="/subadmin" element={
            <PrivateRoute role="subadmin">
              <SubAdminPanel />
            </PrivateRoute>
          } />
          <Route path="/user" element={<UserPanel />} />
          <Route path="/login/admin" element={<AuthForm role="admin" />} />
          <Route path="/login/subadmin" element={<AuthForm role="subadmin" />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
