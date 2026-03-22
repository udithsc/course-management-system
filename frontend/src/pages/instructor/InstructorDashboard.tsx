import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  useTheme,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import axios from 'axios';
import { selectUser, loggedOut } from '../../store/auth';
import { useColorMode } from '../../ColorModeProvider';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const ACCENT = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6'];

function StatCard({ label, value, icon, color, delay = 0 }) {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      elevation={0}
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        height: '100%',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${color}18`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={900} sx={{ color }}>
          {value ?? '—'}
        </Typography>
      </CardContent>
    </MotionCard>
  );
}

function CourseRow({ course, index, onClick }) {
  const accent = ACCENT[index % ACCENT.length];
  const progress = course.lessons?.length
    ? Math.round((course.studentCount / Math.max(course.studentCount, 1)) * 100)
    : 0;

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      onClick={() => onClick(course.id)}
      sx={{
        p: 2,
        borderRadius: '10px',
        cursor: 'pointer',
        mb: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: `0 4px 20px ${accent}22`,
          borderColor: `${accent}44`,
          transform: 'translateX(4px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
            border: `1px solid ${accent}22`,
          }}
        >
          <SchoolIcon sx={{ color: accent, fontSize: 20 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} noWrap>
            {course.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              👥 {course.studentCount} students
            </Typography>
            {course.avgRating > 0 && (
              <Typography variant="caption" color="text.secondary">
                ⭐ {course.avgRating}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              🎬 {course.lessons?.length ?? 0} lessons
            </Typography>
          </Box>
        </Box>
        <Chip
          label={course.fee === 0 ? 'Free' : `$${course.fee}`}
          size="small"
          sx={{
            fontWeight: 800,
            bgcolor: `${accent}18`,
            color: accent,
            borderRadius: '6px',
            height: 22,
            fontSize: '0.68rem',
          }}
        />
        <EditIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
      </Box>
    </MotionBox>
  );
}

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { mode, toggleColorMode } = useColorMode();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/courses/instructor/my-courses`,
        );
        setCourses(data.data ?? []);
      } catch (e) {
        console.error('Failed to load instructor courses', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalStudents = courses.reduce((s, c) => s + (c.studentCount ?? 0), 0);
  const avgRating = courses.length
    ? (courses.reduce((s, c) => s + (c.avgRating ?? 0), 0) / courses.length).toFixed(1)
    : '—';
  const totalLessons = courses.reduce((s, c) => s + (c.lessons?.length ?? 0), 0);

  const handleLogout = () => {
    sessionStorage.clear();
    delete axios.defaults.headers.common['x-auth-token'];
    dispatch(loggedOut());
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 1.5,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backdropFilter: 'blur(12px)',
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg,#6366F1,#10B981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 900,
          }}
        >
          I
        </Box>
        <Typography
          variant="subtitle1"
          fontWeight={800}
          sx={{
            background: 'linear-gradient(90deg,#6366F1,#10B981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Instructor Studio
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          startIcon={<ExploreOutlinedIcon fontSize="small" />}
          onClick={() => navigate('/explore')}
          sx={{ borderRadius: '8px', fontWeight: 700, color: 'text.secondary' }}
        >
          Browse
        </Button>
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton size="small" onClick={toggleColorMode} sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Logout">
          <IconButton size="small" onClick={handleLogout} sx={{ color: 'text.secondary' }}>
            <LogoutOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: 'primary.main',
            fontWeight: 800,
            fontSize: '0.85rem',
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() ?? 'I'}
        </Avatar>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, px: { xs: 2, md: 4 }, py: 4, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        {/* Welcome */}
        <MotionBox
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ mb: 4 }}
        >
          <Typography variant="h4" fontWeight={900} gutterBottom>
            Welcome back, {user?.name ?? 'Instructor'} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's an overview of your teaching activity and course performance.
          </Typography>
        </MotionBox>

        {/* Stat cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {[
            {
              label: 'My Courses',
              value: courses.length,
              icon: <SchoolIcon />,
              color: '#6366F1',
              delay: 0,
            },
            {
              label: 'Total Students',
              value: totalStudents,
              icon: <PeopleIcon />,
              color: '#10B981',
              delay: 0.07,
            },
            {
              label: 'Avg Rating',
              value: avgRating,
              icon: <StarIcon />,
              color: '#F59E0B',
              delay: 0.14,
            },
            {
              label: 'Total Lessons',
              value: totalLessons,
              icon: <PlayCircleIcon />,
              color: '#3B82F6',
              delay: 0.21,
            },
          ].map((s, i) => (
            <Grid item xs={12} md={3} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* My Courses */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="h6" fontWeight={800}>
                My Courses
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/courses/courses')}
                sx={{
                  borderRadius: '8px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg,#6366F1,#4F46E5)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                  fontSize: '0.78rem',
                }}
              >
                Create Course
              </Button>
            </Box>

            {loading ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : courses.length === 0 ? (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: '12px',
                  border: '1px dashed',
                  borderColor: 'divider',
                }}
              >
                <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No courses yet.
                </Typography>
                <Button onClick={() => navigate('/dashboard/courses/courses')} sx={{ mt: 1 }}>
                  Create your first course
                </Button>
              </Box>
            ) : (
              courses.map((c, i) => (
                <CourseRow
                  key={c.id}
                  course={c}
                  index={i}
                  onClick={(id) => navigate(`/instructor/analytics/${id}`)}
                />
              ))
            )}
          </Grid>

          {/* Quick Tips / Analytics */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              📊 Engagement Snapshot
            </Typography>
            {!loading && courses.length > 0 ? (
              <Stack spacing={2}>
                {courses.slice(0, 5).map((c, i) => {
                  const accent = ACCENT[i % ACCENT.length];
                  const totalSubs = courses.reduce((s, x) => s + x.studentCount, 0) || 1;
                  const share = Math.round((c.studentCount / totalSubs) * 100);
                  return (
                    <Box key={c.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" noWrap sx={{ maxWidth: '60%' }}>
                          {c.name}
                        </Typography>
                        <Typography variant="caption" fontWeight={700} color={accent}>
                          {c.studentCount} students
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={share}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: `${accent}18`,
                          '& .MuiLinearProgress-bar': { bgcolor: accent, borderRadius: 3 },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <Box
                sx={{
                  p: 3,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)',
                }}
              >
                <Typography variant="body2" fontWeight={700} gutterBottom>
                  🚀 Getting started
                </Typography>
                {[
                  'Create your first course',
                  'Add video lessons with descriptions',
                  'Students can find your course in Explore',
                  'Track engagement in the Analytics tab',
                ].map((tip, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {tip}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
              ⚡ Quick Actions
            </Typography>
            <Stack spacing={1.5}>
              {[
                {
                  label: 'Manage Courses',
                  icon: <SchoolIcon />,
                  action: () => navigate('/dashboard/courses/courses'),
                  color: '#6366F1',
                },
                {
                  label: 'Manage Authors',
                  icon: <PeopleIcon />,
                  action: () => navigate('/dashboard/courses/authors'),
                  color: '#10B981',
                },
                {
                  label: 'Browse Catalog',
                  icon: <ExploreOutlinedIcon />,
                  action: () => navigate('/explore'),
                  color: '#3B82F6',
                },
                {
                  label: 'My Learning',
                  icon: <PlayCircleIcon />,
                  action: () => navigate('/my-learning'),
                  color: '#F59E0B',
                },
              ].map((a) => (
                <Button
                  key={a.label}
                  fullWidth
                  variant="outlined"
                  startIcon={a.icon}
                  onClick={a.action}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 700,
                    justifyContent: 'flex-start',
                    borderColor: `${a.color}33`,
                    color: a.color,
                    '&:hover': { bgcolor: `${a.color}0D`, borderColor: a.color },
                  }}
                >
                  {a.label}
                </Button>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
