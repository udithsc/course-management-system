import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Paper, Box, IconButton, Button, Card, CardContent } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';

import { loadCategories, selectCategories } from '../../store/categories';
import { loadAuthors, selectAuthors } from '../../store/authors';
import { loadUsers, selectUsers } from '../../store/users';
import { loadCourses, selectCourses } from '../../store/courses';
import { selectUser } from '../../store/auth';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

function StatCard({ title, value, icon, color, delay }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        elevation={0}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color="text.primary">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}1A`, // 10% opacity
              color: color,
              display: 'flex'
            }}
          >
            {icon}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
          <Typography variant="body2" color="success.main" fontWeight={500}>
            +12% <Typography variant="caption" color="text.secondary">from last month</Typography>
          </Typography>
        </Box>
        
        {/* Decorative corner blur */}
        <Box
          sx={{
            position: 'absolute',
            right: -20,
            bottom: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}22 0%, ${color}00 70%)`,
          }}
        />
      </MotionPaper>
    </Grid>
  );
}

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const categories = useSelector(selectCategories);
  const authors = useSelector(selectAuthors);
  const users = useSelector(selectUsers);
  const courses = useSelector(selectCourses);
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    dispatch(loadAuthors());
    dispatch(loadCategories());
    dispatch(loadUsers());
    dispatch(loadCourses());
  }, [dispatch]);

  return (
    <Box>
      {/* Welcome Banner */}
      <MotionPaper
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
          color: 'primary.contrastText',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ zIndex: 1 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Admin'}! 👋
          </Typography>
          <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9, maxWidth: 600, mb: { xs: 3, md: 0 } }}>
            Here is what's happening in your Skilgloo academy today. You have pending course approvals and new user registrations to review.
          </Typography>
        </Box>
        <Box sx={{ zIndex: 1 }}>
          <Button 
            variant="contained" 
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/courses')}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              fontWeight: 'bold',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Manage Courses
          </Button>
        </Box>

        {/* Decorative elements for the banner */}
        <Box
          component={motion.div}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          sx={{
            position: 'absolute',
            right: '-10%',
            top: '-50%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
      </MotionPaper>

      {/* Statistics Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'text.primary' }}>
          Overview
        </Typography>
        <Grid container spacing={3}>
          <StatCard 
            title="TOTAL USERS" 
            value={users.length} 
            icon={<GroupIcon fontSize="large" />} 
            color="#4F46E5" // primary default
            delay={0.1}
          />
          <StatCard 
            title="ACTIVE COURSES" 
            value={courses.length} 
            icon={<SchoolIcon fontSize="large" />} 
            color="#10B981" // emerald
            delay={0.2}
          />
          <StatCard 
            title="CATEGORIES" 
            value={categories.length} 
            icon={<CategoryIcon fontSize="large" />} 
            color="#F59E0B" // amber
            delay={0.3}
          />
          <StatCard 
            title="INSTRUCTORS" 
            value={authors.length} 
            icon={<PersonIcon fontSize="large" />} 
            color="#EC4899" // pink
            delay={0.4}
          />
        </Grid>
      </Box>

      {/* Bottom Layout Row */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'text.primary' }}>
            System Activity
          </Typography>
          <MotionCard 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            elevation={0}
            sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 4 }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Interactive Activity Graph will be mounted here.
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Awaiting connection to analytics engine.
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'text.primary' }}>
            Quick Actions
          </Typography>
          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            elevation={0}
            sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 2 }}
          >
             <Button variant="outlined" color="primary" fullWidth size="large" onClick={() => navigate('/users')} sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}>
               <PersonIcon sx={{ mr: 2 }} /> Create New User
             </Button>
             <Button variant="outlined" color="secondary" fullWidth size="large" onClick={() => navigate('/courses')} sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}>
               <SchoolIcon sx={{ mr: 2 }} /> Draft New Course
             </Button>
             <Button variant="outlined" color="info" fullWidth size="large" onClick={() => navigate('/courses/categories')} sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}>
               <CategoryIcon sx={{ mr: 2 }} /> Define Category
             </Button>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
