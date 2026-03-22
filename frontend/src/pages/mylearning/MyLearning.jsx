import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  LinearProgress,
  Button,
  Chip,
  Avatar,
  Skeleton,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  loadMyCourses,
  selectMyCourses,
  selectSubsLoading,
  selectCourseProgress,
} from '../../store/subscriptions';
import { useSelector as useSelect } from 'react-redux';

const ACCENT = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#8B5CF6'];
const MotionBox = motion(Box);

function ProgressCard({ course, index }) {
  const navigate = useNavigate();
  const progress = useSelect(selectCourseProgress(course.id));
  const accent = ACCENT[index % ACCENT.length];
  const isDark = false; // derived below
  const imageSrc = course.image
    ? course.image.startsWith('http')
      ? course.image
      : `${import.meta.env.VITE_API_URL}/files/${course.image}`
    : null;

  const remaining = (course.lessons?.length ?? 0) - (course.watchedVideoId?.length ?? 0);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.25s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${accent}33`,
        },
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ position: 'relative', height: 140, bgcolor: `${accent}15` }}>
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt={course.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
            }}
          >
            <SchoolOutlinedIcon sx={{ fontSize: 44, color: accent, opacity: 0.4 }} />
          </Box>
        )}
        {progress === 100 && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(16,185,129,0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 36, color: 'white', mb: 0.5 }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 800 }}>
              Completed!
            </Typography>
          </Box>
        )}
        {course.category?.name && (
          <Chip
            label={course.category.name}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: accent,
              color: 'white',
              fontWeight: 700,
              borderRadius: '6px',
              fontSize: '0.65rem',
              height: 20,
            }}
          />
        )}
      </Box>

      {/* Body */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{
            mb: 0.75,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
          }}
        >
          {course.name}
        </Typography>

        {course.author && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
            <Avatar
              sx={{
                width: 18,
                height: 18,
                bgcolor: `${accent}22`,
                color: accent,
                fontSize: '0.6rem',
                fontWeight: 800,
              }}
            >
              {course.author.name?.charAt(0)}
            </Avatar>
            <Typography variant="caption" color="text.secondary" noWrap>
              {course.author.name}
            </Typography>
          </Box>
        )}

        {/* Progress */}
        <Box sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {course.watchedVideoId?.length ?? 0} / {course.lessons?.length ?? 0} lessons
            </Typography>
            <Typography variant="caption" fontWeight={800} sx={{ color: accent }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: `${accent}18`,
              '& .MuiLinearProgress-bar': { bgcolor: accent, borderRadius: 3 },
            }}
          />
        </Box>

        {/* CTA */}
        <Button
          fullWidth
          variant={progress === 100 ? 'outlined' : 'contained'}
          startIcon={<PlayCircleFilledWhiteIcon />}
          onClick={() => navigate(`/learn/${course.id}`)}
          size="small"
          sx={{
            borderRadius: '8px',
            fontWeight: 800,
            py: 0.9,
            ...(progress < 100 && {
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              boxShadow: `0 4px 14px ${accent}44`,
            }),
            ...(progress === 100 && {
              borderColor: accent,
              color: accent,
            }),
          }}
        >
          {progress === 0
            ? 'Start Learning'
            : progress === 100
              ? 'Review Course'
              : `Continue · ${remaining} left`}
        </Button>
      </Box>
    </MotionBox>
  );
}

export default function MyLearning() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myCourses = useSelector(selectMyCourses);
  const loading = useSelector(selectSubsLoading);

  useEffect(() => {
    dispatch(loadMyCourses());
  }, []);

  const completed = myCourses.filter(
    (c) => c.watchedVideoId?.length === c.lessons?.length && c.lessons?.length > 0,
  );
  const inProgress = myCourses.filter(
    (c) => (c.watchedVideoId?.length ?? 0) > 0 && c.watchedVideoId?.length < c.lessons?.length,
  );
  const notStarted = myCourses.filter((c) => (c.watchedVideoId?.length ?? 0) === 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={900} gutterBottom>
          My Learning
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track your progress and continue where you left off
        </Typography>
      </Box>

      {/* Stats Row */}
      {!loading && myCourses.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Enrolled', value: myCourses.length, color: '#6366F1' },
            { label: 'In Progress', value: inProgress.length, color: '#F59E0B' },
            { label: 'Completed', value: completed.length, color: '#10B981' },
          ].map((s) => (
            <Grid item key={s.label} xs={4}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={900} sx={{ color: s.color }}>
                  {s.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {s.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Loading */}
      {loading && (
        <Grid container spacing={2.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item key={i} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: '12px' }} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty state */}
      {!loading && myCourses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <SchoolOutlinedIcon sx={{ fontSize: 72, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" fontWeight={800} gutterBottom>
            No courses yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Browse our catalog and enroll in a course to get started
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/explore')}
            sx={{
              borderRadius: '10px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
            }}
          >
            Explore Courses
          </Button>
        </Box>
      )}

      {/* In Progress */}
      {!loading && inProgress.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            ⏱ In Progress
          </Typography>
          <Grid container spacing={2.5}>
            {inProgress.map((c, i) => (
              <Grid item key={c.id} xs={12} sm={6} md={4}>
                <ProgressCard course={c} index={i} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Not Started */}
      {!loading && notStarted.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            🚀 Not Started
          </Typography>
          <Grid container spacing={2.5}>
            {notStarted.map((c, i) => (
              <Grid item key={c.id} xs={12} sm={6} md={4}>
                <ProgressCard course={c} index={i} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Completed */}
      {!loading && completed.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            🏆 Completed
          </Typography>
          <Grid container spacing={2.5}>
            {completed.map((c, i) => (
              <Grid item key={c.id} xs={12} sm={6} md={4}>
                <ProgressCard course={c} index={i} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
