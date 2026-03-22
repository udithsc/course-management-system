import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Avatar, LinearProgress, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PropTypes from 'prop-types';

const MotionBox = motion(Box);
const ACCENT = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#8B5CF6'];

export default function CourseCard({ course, progress, enrolled, index = 0 }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = ACCENT[index % ACCENT.length];
  const imageSrc = course.image
    ? course.image.startsWith('http')
      ? course.image
      : `${import.meta.env.VITE_API_URL}/files/${course.image}`
    : null;

  const avgRating = course.reviews?.length
    ? (course.reviews.reduce((s, r) => s + r.rating, 0) / course.reviews.length).toFixed(1)
    : null;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => navigate(`/explore/${course.id}`)}
      sx={{
        cursor: 'pointer',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDark
            ? `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${accent}44`
            : `0 16px 48px rgba(15,23,42,0.14), 0 0 0 1px ${accent}44`,
          borderColor: `${accent}44`,
        },
      }}
    >
      {/* Thumbnail */}
      <Box sx={{ position: 'relative', height: 160, bgcolor: `${accent}15`, flexShrink: 0 }}>
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
            <PlayCircleOutlineIcon sx={{ fontSize: 48, color: accent, opacity: 0.5 }} />
          </Box>
        )}
        {/* Category chip */}
        {course.category?.name && (
          <Chip
            label={course.category.name}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: accent,
              color: 'white',
              fontWeight: 700,
              fontSize: '0.68rem',
              height: 22,
              borderRadius: '6px',
            }}
          />
        )}
        {/* Enrolled badge */}
        {enrolled && (
          <Chip
            label="Enrolled"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: '#10B981',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.68rem',
              height: 22,
              borderRadius: '6px',
            }}
          />
        )}
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            color: 'text.primary',
          }}
        >
          {course.name}
        </Typography>

        {/* Instructor */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Avatar
            sx={{
              width: 18,
              height: 18,
              bgcolor: `${accent}22`,
              color: accent,
              fontSize: '0.6rem',
            }}
          >
            {course.author?.name?.charAt(0) ?? <PersonOutlinedIcon sx={{ fontSize: 12 }} />}
          </Avatar>
          <Typography variant="caption" color="text.secondary" noWrap>
            {course.author?.name ?? 'UDT Academy'}
          </Typography>
        </Box>

        {/* Rating */}
        {avgRating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
            <Typography variant="caption" fontWeight={700} color="#F59E0B">
              {avgRating}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              ({course.reviews.length})
            </Typography>
          </Box>
        )}

        {/* Lessons count */}
        <Typography variant="caption" color="text.secondary">
          {course.lessons?.length ?? 0} lesson{course.lessons?.length !== 1 ? 's' : ''}
        </Typography>

        {/* Progress bar if enrolled */}
        {enrolled && typeof progress === 'number' && (
          <Box sx={{ mt: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" fontWeight={700} color={accent}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 5,
                borderRadius: 3,
                bgcolor: `${accent}18`,
                '& .MuiLinearProgress-bar': { bgcolor: accent, borderRadius: 3 },
              }}
            />
          </Box>
        )}

        {/* Footer: price */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 'auto',
            pt: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={800} color={accent}>
            {course.fee === 0 ? 'Free' : `$${course.fee}`}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {course.subscriptions ?? 0} students
          </Typography>
        </Box>
      </Box>
    </MotionBox>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  progress: PropTypes.number,
  enrolled: PropTypes.bool,
  index: PropTypes.number,
};

CourseCard.defaultProps = {
  progress: 0,
  enrolled: false,
  index: 0,
};
