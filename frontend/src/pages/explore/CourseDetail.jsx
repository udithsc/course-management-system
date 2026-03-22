import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Grid, Button, Chip, Avatar, Divider,
  LinearProgress, Accordion, AccordionSummary, AccordionDetails,
  Skeleton, Alert, useTheme, Rating, Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { loadMyCourses, enrollCourse, selectIsEnrolled, selectEnrollLoading, selectCourseProgress } from '../../store/subscriptions';
import { selectCourses, loadCourses } from '../../store/courses';

const MotionBox = motion(Box);
const ACCENT = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6'];

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const theme        = useTheme();
  const isDark       = theme.palette.mode === 'dark';

  const allCourses    = useSelector(selectCourses);
  const enrollLoading = useSelector(selectEnrollLoading);
  const isEnrolled    = useSelector(selectIsEnrolled(courseId));
  const progress      = useSelector(selectCourseProgress(courseId));

  const [course,  setCourse]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      if (allCourses.length === 0) await dispatch(loadCourses(0, 100, ''));
      await dispatch(loadMyCourses());
      setLoading(false);
    };
    fetchAll();
  }, [courseId]);

  useEffect(() => {
    const found = allCourses.find((c) => c.id === courseId);
    if (found) setCourse(found);
  }, [allCourses, courseId]);

  const handleEnroll = async () => {
    await dispatch(enrollCourse(courseId));
    await dispatch(loadMyCourses());
    navigate(`/learn/${courseId}`);
  };

  const accent = ACCENT[0];

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '12px', mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}><Skeleton height={40} sx={{ mb: 1 }} /><Skeleton height={20} width="60%" /></Grid>
        </Grid>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Course not found.</Alert>
        <Button onClick={() => navigate('/explore')} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>Back to Explore</Button>
      </Box>
    );
  }

  const avgRating = course.reviews?.length
    ? (course.reviews.reduce((s, r) => s + r.rating, 0) / course.reviews.length)
    : 0;
  const imageSrc = course.image
    ? (course.image.startsWith('http') ? course.image : `${import.meta.env.VITE_API_URL}/files/${course.image}`)
    : null;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Box sx={{
        background: isDark
          ? 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)'
          : 'linear-gradient(135deg, #312E81 0%, #1E1B4B 100%)',
        py: { xs: 5, md: 7 }, px: { xs: 3, md: 8 },
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(99,102,241,0.08)' }} />

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/explore')}
          sx={{ mb: 3, color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
        >Back to Explore</Button>

        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={7}>
            {course.category?.name && (
              <Chip label={course.category.name} size="small"
                sx={{ bgcolor: accent, color: 'white', fontWeight: 700, mb: 2, borderRadius: '6px', fontSize: '0.7rem' }} />
            )}
            <Typography variant="h3" fontWeight={900} sx={{ color: 'white', mb: 1.5, lineHeight: 1.2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              {course.name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 2.5, lineHeight: 1.7 }}>
              {course.description}
            </Typography>

            {/* Meta row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 3 }}>
              {avgRating > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#F59E0B' }}>{avgRating.toFixed(1)}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>({course.reviews?.length} reviews)</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.6)' }}>
                <OndemandVideoIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption">{course.lessons?.length ?? 0} lessons</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.6)' }}>
                <PersonOutlinedIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption">{course.subscriptions ?? 0} students</Typography>
              </Box>
            </Box>

            {/* Instructor */}
            {course.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: `${accent}44`, color: accent, width: 40, height: 40, fontWeight: 800 }}>
                  {course.author.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Instructor</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>{course.author.name}</Typography>
                </Box>
              </Box>
            )}
          </Grid>

          {/* CTA Card */}
          <Grid item xs={12} md={5}>
            <Box sx={{
              bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(16px)', borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.12)',
              p: { xs: 3, md: 3.5 },
            }}>
              {/* Thumbnail */}
              <Box sx={{ borderRadius: '10px', overflow: 'hidden', mb: 2.5, height: 160,
                bgcolor: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imageSrc
                  ? <Box component="img" src={imageSrc} alt={course.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <PlayCircleFilledWhiteIcon sx={{ fontSize: 56, color: 'rgba(255,255,255,0.3)' }} />
                }
              </Box>

              {/* Price */}
              <Typography variant="h4" fontWeight={900} sx={{ color: 'white', mb: 0.5 }}>
                {course.fee === 0 ? 'Free' : `$${course.fee}`}
              </Typography>

              {/* Progress bar if enrolled */}
              {isEnrolled && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Your progress</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#10B981' }}>{progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={progress}
                    sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': { bgcolor: '#10B981', borderRadius: 3 } }} />
                </Box>
              )}

              {isEnrolled
                ? (
                  <Button fullWidth variant="contained" size="large"
                    startIcon={<PlayCircleFilledWhiteIcon />}
                    onClick={() => navigate(`/learn/${courseId}`)}
                    sx={{ borderRadius: '10px', fontWeight: 800, py: 1.3,
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      boxShadow: '0 4px 18px rgba(16,185,129,0.4)', mb: 1 }}>
                    Continue Learning
                  </Button>
                )
                : (
                  <Button fullWidth variant="contained" size="large"
                    loading={enrollLoading}
                    onClick={handleEnroll}
                    sx={{ borderRadius: '10px', fontWeight: 800, py: 1.3,
                      background: `linear-gradient(135deg, ${accent}, #4F46E5)`,
                      boxShadow: '0 4px 18px rgba(99,102,241,0.4)', mb: 1 }}>
                    {course.fee === 0 ? 'Enroll for Free' : 'Enroll Now'}
                  </Button>
                )
              }
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>
                30-day money-back guarantee
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <Box sx={{ px: { xs: 2, md: 8 }, py: 5, maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={8}>
            {/* Curriculum */}
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Course Curriculum</Typography>
            {course.lessons?.length === 0 && (
              <Box sx={{ p: 3, borderRadius: '10px', border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                <OndemandVideoIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">No lessons uploaded yet</Typography>
              </Box>
            )}
            {course.lessons?.map((lesson, i) => (
              <Accordion key={lesson.id} elevation={0}
                sx={{ mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: '10px !important', '&:before': { display: 'none' }, bgcolor: 'background.paper' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: `${accent}18`, color: accent, fontSize: '0.75rem', fontWeight: 800 }}>
                      {i + 1}
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>{lesson.title || `Lesson ${i + 1}`}</Typography>
                    {isEnrolled
                      ? <PlayCircleFilledWhiteIcon sx={{ color: accent, fontSize: 18 }} />
                      : <LockOutlinedIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                    }
                  </Box>
                </AccordionSummary>
                {lesson.description && (
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">{lesson.description}</Typography>
                  </AccordionDetails>
                )}
              </Accordion>
            ))}

            {/* Reviews */}
            {course.reviews?.length > 0 && (
              <>
                <Typography variant="h5" fontWeight={800} sx={{ mt: 4, mb: 2 }}>Student Reviews</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3,
                  p: 3, borderRadius: '10px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight={900} color="primary.main">{avgRating.toFixed(1)}</Typography>
                    <Rating value={avgRating} readOnly precision={0.5} sx={{ fontSize: '1.1rem' }} />
                    <Typography variant="caption" color="text.secondary">{course.reviews.length} reviews</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ flex: 1 }}>
                    {[5,4,3,2,1].map((star) => {
                      const count = course.reviews.filter((r) => r.rating === star).length;
                      const pct   = course.reviews.length ? (count / course.reviews.length) * 100 : 0;
                      return (
                        <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ width: 8 }}>{star}</Typography>
                          <StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />
                          <LinearProgress variant="determinate" value={pct} sx={{ flex: 1, height: 6, borderRadius: 3,
                            bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
                            '& .MuiLinearProgress-bar': { bgcolor: '#F59E0B', borderRadius: 3 } }} />
                          <Typography variant="caption" color="text.secondary" sx={{ width: 28 }}>{count}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <Stack spacing={2}>
                  {course.reviews.slice(0, 5).map((r) => (
                    <Box key={r.id} sx={{ p: 2.5, borderRadius: '10px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: `${accent}22`, color: accent, fontSize: '0.8rem', fontWeight: 800 }}>
                          {r.user?.username?.charAt(0)?.toUpperCase() ?? 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{r.user?.username ?? 'Student'}</Typography>
                          <Rating value={r.rating} readOnly size="small" sx={{ fontSize: '0.8rem' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>{r.time}</Typography>
                      </Box>
                      {r.comment && <Typography variant="body2" color="text.secondary">{r.comment}</Typography>}
                    </Box>
                  ))}
                </Stack>
              </>
            )}
          </Grid>

          {/* Sidebar: Instructor card */}
          <Grid item xs={12} md={4}>
            {course.author && (
              <Box sx={{ p: 3, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', top: 90 }}>
                <Typography variant="subtitle2" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem', mb: 2 }}>
                  Your Instructor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar src={course.author.image ? `${import.meta.env.VITE_API_URL}/files/${course.author.image}` : undefined}
                    sx={{ width: 52, height: 52, bgcolor: `${accent}22`, color: accent, fontWeight: 800, fontSize: '1.2rem' }}>
                    {course.author.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={800}>{course.author.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{course.author.profession}</Typography>
                  </Box>
                </Box>
                {course.author.email && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>✉ {course.author.email}</Typography>
                )}
                {course.author.mobile && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>📱 {course.author.mobile}</Typography>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
