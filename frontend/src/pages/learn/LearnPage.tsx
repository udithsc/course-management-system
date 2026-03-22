import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  LinearProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  loadMyCourses,
  markVideoWatched,
  selectMyCourses,
  selectCourseProgress,
} from '../../store/subscriptions';
import { loadCourses, selectCourses } from '../../store/courses';

const SIDEBAR_W = 320;

export default function LearnPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  const videoRef = useRef(null);

  const allCourses = useSelector(selectCourses);
  const myCourses = useSelector(selectMyCourses);
  const progress = useSelector(selectCourseProgress(courseId));

  const [myCourse, setMyCourse] = useState(null);
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (allCourses.length === 0) await dispatch(loadCourses(0, 100, ''));
      await dispatch(loadMyCourses());
    };
    init();
  }, [courseId]);

  useEffect(() => {
    const found = allCourses.find((c) => c.id === courseId);
    if (found) {
      setCourse(found);
      if (found.lessons?.length && !activeLesson) setActiveLesson(found.lessons[0]);
    }
  }, [allCourses, courseId]);

  useEffect(() => {
    const sub = myCourses.find((c) => c.id === courseId);
    if (sub) setMyCourse(sub);
  }, [myCourses, courseId]);

  const isWatched = (lessonId) => myCourse?.watchedVideoId?.includes(lessonId) ?? false;

  const handleLessonClick = (lesson) => {
    setActiveLesson(lesson);
    setDrawerOpen(false);
    if (videoRef.current) videoRef.current.load();
  };

  const handleVideoEnd = () => {
    if (!activeLesson) return;
    if (!isWatched(activeLesson.id)) {
      dispatch(markVideoWatched(courseId, activeLesson.id));
    }
    // Auto-advance to next lesson
    const lessons = course?.lessons ?? [];
    const idx = lessons.findIndex((l) => l.id === activeLesson.id);
    if (idx >= 0 && idx < lessons.length - 1) {
      setTimeout(() => setActiveLesson(lessons[idx + 1]), 400);
    }
  };

  const curriculum = (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={800} noWrap>
          {course?.name ?? 'Course Curriculum'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
              '& .MuiLinearProgress-bar': { bgcolor: '#10B981', borderRadius: 3 },
            }}
          />
          <Typography variant="caption" fontWeight={800} color="success.main">
            {progress}%
          </Typography>
        </Box>
      </Box>

      {/* Lesson list */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List disablePadding>
          {(course?.lessons ?? []).map((lesson, i) => {
            const watched = isWatched(lesson.id);
            const active = activeLesson?.id === lesson.id;
            return (
              <React.Fragment key={lesson.id}>
                <ListItemButton
                  onClick={() => handleLessonClick(lesson)}
                  selected={active}
                  sx={{
                    py: 1.5,
                    px: 2,
                    bgcolor: active
                      ? isDark
                        ? 'rgba(99,102,241,0.15)'
                        : 'rgba(99,102,241,0.08)'
                      : 'transparent',
                    borderLeft: active ? '3px solid' : '3px solid transparent',
                    borderColor: active ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {watched ? (
                      <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                    ) : active ? (
                      <PlayCircleFilledIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={active ? 700 : 500}
                        color={active ? 'primary.main' : 'text.primary'}
                        noWrap
                      >
                        {lesson.title || `Lesson ${i + 1}`}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.disabled" noWrap>
                        {lesson.description?.substring(0, 50) ?? ''}
                      </Typography>
                    }
                  />
                </ListItemButton>
                <Divider sx={{ opacity: 0.4 }} />
              </React.Fragment>
            );
          })}

          {!course?.lessons?.length && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No lessons yet
              </Typography>
            </Box>
          )}
        </List>
      </Box>

      {/* Back button */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/explore/${courseId}`)}
          sx={{ borderRadius: '8px', fontWeight: 700 }}
        >
          Course Overview
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}
    >
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: SIDEBAR_W,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {curriculum}
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { width: SIDEBAR_W } }}
        >
          {curriculum}
        </Drawer>
      )}

      {/* Main Video Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'background.paper',
            flexShrink: 0,
          }}
        >
          {isMobile && (
            <IconButton size="small" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="body1" fontWeight={700} noWrap sx={{ flex: 1 }}>
            {activeLesson?.title || 'Select a lesson'}
          </Typography>
          {activeLesson && isWatched(activeLesson.id) && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Completed"
              size="small"
              color="success"
              sx={{ fontWeight: 700, borderRadius: '6px', height: 26 }}
            />
          )}
          <IconButton size="small" onClick={() => navigate(`/explore/${courseId}`)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Video player */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {activeLesson?.url ? (
            <video
              ref={videoRef}
              key={activeLesson.id}
              controls
              onEnded={handleVideoEnd}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                outline: 'none',
              }}
            >
              <source src={activeLesson.url} />
              Your browser does not support the video player.
            </video>
          ) : (
            <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <PlayCircleFilledIcon sx={{ fontSize: 72, mb: 2, opacity: 0.3 }} />
              <Typography>Select a lesson to start watching</Typography>
            </Box>
          )}
        </Box>

        {/* Lesson description */}
        {activeLesson?.description && (
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              maxHeight: 140,
              overflowY: 'auto',
              flexShrink: 0,
            }}
          >
            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
              About this lesson
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {activeLesson.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
