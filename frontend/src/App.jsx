import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Home />} />
            <Route path="users" element={<User />} />
            <Route path="courses" element={<CourseIndex />}>
              <Route path="courses" element={<Course />} />
              <Route path="courses/:courseId" element={<CourseManager />} />
              <Route path="authors" element={<Author />} />
              <Route path="categories" element={<Category />} />
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<Auth />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
