import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  useTheme,
  Button,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { loadCourses, selectCourses } from '../../store/courses';
import { loadCategories, selectCategories } from '../../store/categories';
import {
  selectMyCourses,
  selectIsEnrolled,
  selectCourseProgress,
  loadMyCourses,
} from '../../store/subscriptions';
import CourseCard from '../../components/ui/CourseCard';
import { useSelector as useSelect } from 'react-redux';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function CardSkeleton() {
  return (
    <Box
      sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}
    >
      <Skeleton variant="rectangular" height={160} />
      <Box sx={{ p: 2 }}>
        <Skeleton height={18} width="80%" sx={{ mb: 0.75 }} />
        <Skeleton height={14} width="50%" sx={{ mb: 0.75 }} />
        <Skeleton height={14} width="30%" />
      </Box>
    </Box>
  );
}

function EnrolledCourseCard({ course }) {
  const progress = useSelect(selectCourseProgress(course.id));
  return <CourseCard course={course} enrolled progress={progress} />;
}

export default function ExplorePage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const allCourses = useSelector(selectCourses);
  const categories = useSelector(selectCategories);
  const myCourses = useSelector(selectMyCourses);

  const [search, setSearch] = useState('');
  const [activeCategory, setActive] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dispatch(loadCourses(0, 100, '')),
      dispatch(loadCategories(0, 100, '')),
      dispatch(loadMyCourses()),
    ]).finally(() => setLoading(false));
  }, []);

  const enrolledIds = useMemo(() => new Set(myCourses.map((c) => c.id)), [myCourses]);

  const filtered = useMemo(() => {
    return allCourses.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'all' || c.category?.id === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [allCourses, search, activeCategory]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          py: { xs: 5, md: 7 },
          px: { xs: 3, md: 8 },
          background: isDark
            ? 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 60%, #064E3B 100%)'
            : 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #10B981 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative circles */}
        {[
          { top: -60, right: -60, size: 240 },
          { bottom: -80, left: -80, size: 300 },
        ].map((b, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: b.top,
              right: b.right,
              bottom: b.bottom,
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
            }}
          />
        ))}

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <SchoolOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
            <Typography variant="h4" fontWeight={900} sx={{ color: 'white' }}>
              Explore Courses
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, maxWidth: 540 }}>
            Expand your skills with expert-led courses. Learn at your own pace, anywhere.
          </Typography>

          {/* Search bar */}
          <TextField
            variant="outlined"
            placeholder="Search for any course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 520,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255,255,255,0.12)',
                borderRadius: '10px',
                backdropFilter: 'blur(8px)',
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
              },
              '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.5)' },
            }}
          />

          <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5, flexWrap: 'wrap' }}>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)', alignSelf: 'center' }}
            >
              {allCourses.length} courses available
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.6)', alignSelf: 'center' }}
            >
              {myCourses.length} enrolled
            </Typography>
          </Box>
        </MotionBox>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4, maxWidth: 1400, mx: 'auto' }}>
        {/* My Learning section (if enrolled) */}
        {myCourses.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
              📚 My Learning
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Pick up where you left off
            </Typography>
            <Grid container spacing={2.5}>
              {myCourses.slice(0, 4).map((course, i) => (
                <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                  <EnrolledCourseCard course={course} />
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ mt: 4 }} />
          </Box>
        )}

        {/* Category filter pills */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <TuneIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          {[{ id: 'all', name: 'All Courses' }, ...categories].map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => setActive(cat.id)}
              sx={{
                cursor: 'pointer',
                fontWeight: 700,
                borderRadius: '8px',
                height: 32,
                bgcolor: activeCategory === cat.id ? 'primary.main' : 'transparent',
                color: activeCategory === cat.id ? 'white' : 'text.secondary',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'primary.main' : 'divider',
                transition: 'all 0.18s',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            />
          ))}
        </Box>

        {/* Results count */}
        {!loading && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {search ? ` for "${search}"` : ''}
          </Typography>
        )}

        {/* Grid */}
        <Grid container spacing={2.5}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <CardSkeleton />
              </Grid>
            ))
          ) : filtered.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SchoolOutlinedIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No courses found
                </Typography>
                <Button
                  onClick={() => {
                    setSearch('');
                    setActive('all');
                  }}
                  sx={{ mt: 2 }}
                >
                  Clear filters
                </Button>
              </Box>
            </Grid>
          ) : (
            filtered.map((course, i) => (
              <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                <CourseCard course={course} enrolled={enrolledIds.has(course.id)} index={i} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
}
