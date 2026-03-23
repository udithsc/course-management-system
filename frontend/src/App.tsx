import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './components/layout/Dashboard';
import Auth from './pages/auth/Auth';
import Home from './components/layout/Home';
import User from './pages/users/User';
import Author from './pages/authors/Author';
import Category from './pages/categories/Category';
import Course from './pages/courses/Course';
import NotFound from './components/layout/NotFound';
import ProtectedRoute from './protectedRoute';
import CourseManager from './pages/courses/CourseManager';
import CourseIndex from './pages/courses/CourseIndex';
import Account from './pages/account/Account';
import AuditLogs from './pages/admin/AuditLogs';
import LandingPage from './pages/landing/LandingPage';
import ExplorePage from './pages/explore/ExplorePage';
import CourseDetail from './pages/explore/CourseDetail';
import LearnPage from './pages/learn/LearnPage';
import MyLearning from './pages/mylearning/MyLearning';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import { selectAccessToken, selectUserRole } from './store/auth';

// Smart root redirect: logged-in users go to their role's home
function RootRedirect() {
  const token = useSelector(selectAccessToken);
  const role = useSelector(selectUserRole);
  if (!token) return <LandingPage />;
  if (role === 'ADMIN') return <Navigate to="/dashboard" replace />;
  if (role === 'INSTRUCTOR') return <Navigate to="/instructor" replace />;
  return <Navigate to="/explore" replace />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Landing / smart root */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Auth />} />

        {/* Student + All Users: Explore catalog */}
        <Route path="/explore" element={<ProtectedRoute />}>
          <Route index element={<ExplorePage />} />
          <Route path=":courseId" element={<CourseDetail />} />
        </Route>

        {/* Student + All Users: My Learning */}
        <Route path="/my-learning" element={<ProtectedRoute />}>
          <Route index element={<MyLearning />} />
        </Route>

        {/* Video player (full-screen, all roles) */}
        <Route path="/learn" element={<ProtectedRoute />}>
          <Route path=":courseId" element={<LearnPage />} />
        </Route>

        {/* Instructor portal (INSTRUCTOR + ADMIN) */}
        <Route
          path="/instructor"
          element={<ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']} redirectTo="/explore" />}
        >
          <Route index element={<InstructorDashboard />} />
        </Route>

        {/* Admin Dashboard (ADMIN only) */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute allowedRoles={['ADMIN']} redirectTo="/explore" />}
        >
          <Route element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="users" element={<User />} />
            <Route path="account" element={<Account />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="courses" element={<CourseIndex />}>
              <Route path="courses" element={<Course />} />
              <Route path="courses/:courseId" element={<CourseManager />} />
              <Route path="authors" element={<Author />} />
              <Route path="categories" element={<Category />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
