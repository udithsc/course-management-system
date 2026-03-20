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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ translateY: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
        elevation={0}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.05)',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={800} color="text.primary" sx={{ mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
              color: 'white',
              display: 'flex',
              boxShadow: `0 8px 16px -4px ${color}44`
            }}
          >
            {icon}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', gap: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: 'success.light', 
              color: 'success.dark',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
            +12%
          </Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            Since yesterday
          </Typography>
        </Box>
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
    <Box sx={{ pb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 6, position: 'relative' }}>
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" fontWeight={800} sx={{ mb: 1, letterSpacing: '-1px' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ opacity: 0.8 }}>
            Welcome back, <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{currentUser?.name || 'Academic Leader'}</Box>. Here is your UDT summary.
          </Typography>
        </motion.div>
      </Box>

      {/* Primary Statistics Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <StatCard 
          title="Academy Users" 
          value={users.length} 
          icon={<GroupIcon />} 
          color="#4F46E5" 
          delay={0.1}
        />
        <StatCard 
          title="Active Courses" 
          value={courses.length} 
          icon={<SchoolIcon />} 
          color="#10B981" 
          delay={0.2}
        />
        <StatCard 
          title="Curriculum Topics" 
          value={categories.length} 
          icon={<CategoryIcon />} 
          color="#F59E0B" 
          delay={0.3}
        />
        <StatCard 
          title="Expert Staff" 
          value={authors.length} 
          icon={<PersonIcon />} 
          color="#EC4899" 
          delay={0.4}
        />
      </Grid>

      {/* Main Content Areas */}
      <Grid container spacing={4}>
        {/* Progress / Activity Card */}
        <Grid item xs={12} lg={8}>
          <MotionPaper
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 5,
              background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 20px 40px -10px rgba(79, 70, 229, 0.4)'
            }}
          >
            <Box sx={{ zIndex: 1, position: 'relative' }}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Learning Management Growth
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500, mb: 4, lineHeight: 1.6 }}>
                Your academy is growing faster than average. You have reached 85% of your quarterly target for student enrollment and course completion rate.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/dashboard/courses')}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,1)', 
                  color: 'primary.main',
                  fontWeight: 800,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s'
                }}
              >
                View Detailed Reports
              </Button>
            </Box>

            <Box
              component={motion.div}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              sx={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '-30%',
                left: '10%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              }}
            />
          </MotionPaper>
        </Grid>

        {/* Action Center */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              Action Center
            </Typography>
            
            <MotionPaper
              whileHover={{ scale: 1.02 }}
              sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 2 }}
              onClick={() => navigate('/dashboard/users')}
            >
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.main', display: 'flex' }}>
                <PersonIcon />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>User Directory</Typography>
                <Typography variant="caption" color="text.secondary">Review active student accounts</Typography>
              </Box>
              <ArrowForwardIcon sx={{ ml: 'auto', opacity: 0.3 }} />
            </MotionPaper>

            <MotionPaper
              whileHover={{ scale: 1.02 }}
              sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 2 }}
              onClick={() => navigate('/dashboard/courses')}
            >
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'secondary.light', color: 'secondary.main', display: 'flex' }}>
                <SchoolIcon />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Course Builder</Typography>
                <Typography variant="caption" color="text.secondary">Create and publish curriculum</Typography>
              </Box>
              <ArrowForwardIcon sx={{ ml: 'auto', opacity: 0.3 }} />
            </MotionPaper>

            <MotionPaper
              whileHover={{ scale: 1.02 }}
              sx={{ p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 2 }}
              onClick={() => navigate('/dashboard/account')}
            >
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'info.light', color: 'info.main', display: 'flex' }}>
                <TrendingUpIcon />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>System Settings</Typography>
                <Typography variant="caption" color="text.secondary">Manage platform configurations</Typography>
              </Box>
              <ArrowForwardIcon sx={{ ml: 'auto', opacity: 0.3 }} />
            </MotionPaper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
