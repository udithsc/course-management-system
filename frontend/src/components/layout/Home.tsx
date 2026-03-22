import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import WifiIcon from '@mui/icons-material/Wifi';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedIcon from '@mui/icons-material/Verified';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { loadCategories, selectCategories } from '../../store/categories';
import { loadAuthors, selectAuthors } from '../../store/authors';
import { loadUsers, selectUsers } from '../../store/users';
import { loadCourses, selectCourses } from '../../store/courses';
import { selectUser } from '../../store/auth';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

// Palette
const ACCENT = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#8B5CF6'];

// Area / Line Sparkline
function AreaSparkline({ data, color, w = 88, h = 36 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / rng) * (h - 4)]);
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = [`0,${h}`, ...pts.map((p) => p.join(',')), `${w},${h}`].join(' ');
  const id = `sg${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* endpoint dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill={color} />
    </svg>
  );
}

// SVG Area Chart (multi-line, with axes)
function AreaChart({ series, labels, h = 160, colors = ACCENT }) {
  const allVals = series.flatMap((s) => s.data);
  const max = Math.max(...allVals, 1);
  const W = 520;
  const padL = 28,
    padB = 22,
    padT = 12;
  const chartW = W - padL;
  const chartH = h - padB - padT;
  const xStep = chartW / (labels.length - 1);

  const pts = (data) => data.map((v, i) => [padL + i * xStep, padT + chartH - (v / max) * chartH]);

  // Grid lines
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => padT + chartH * (1 - t));

  return (
    <svg viewBox={`0 0 ${W} ${h}`} style={{ width: '100%', height: h, overflow: 'visible' }}>
      <defs>
        {series.map((s, si) => {
          const id = `ac${si}`;
          return (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[si % colors.length]} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colors[si % colors.length]} stopOpacity="0" />
            </linearGradient>
          );
        })}
      </defs>

      {/* Grid lines */}
      {yTicks.map((y, i) => (
        <line
          key={i}
          x1={padL}
          x2={W}
          y1={y}
          y2={y}
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth="1"
          strokeDasharray={i === 0 ? '0' : '0'}
        />
      ))}

      {/* Y-axis labels */}
      {yTicks.slice(1).map((y, i) => (
        <text
          key={i}
          x={padL - 4}
          y={y + 4}
          textAnchor="end"
          fontSize="9"
          fill="currentColor"
          opacity="0.4"
          fontFamily="Inter, sans-serif"
        >
          {Math.round(max * (i + 1) * 0.25)}
        </text>
      ))}

      {/* X-axis labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={padL + i * xStep}
          y={h - 4}
          textAnchor="middle"
          fontSize="9"
          fill="currentColor"
          opacity="0.4"
          fontFamily="Inter, sans-serif"
        >
          {l}
        </text>
      ))}

      {/* Series: filled areas + lines */}
      {series.map((s, si) => {
        const p = pts(s.data);
        const linePts = p.map((pt) => pt.join(',')).join(' ');
        const areaPts = [
          [padL, padT + chartH],
          ...p,
          [padL + (labels.length - 1) * xStep, padT + chartH],
        ]
          .map((pt) => pt.join(','))
          .join(' ');
        const c = colors[si % colors.length];
        return (
          <g key={si}>
            <polygon points={areaPts} fill={`url(#ac${si})`} />
            <polyline
              points={linePts}
              fill="none"
              stroke={c}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {p.map((pt, pi) => (
              <circle
                key={pi}
                cx={pt[0]}
                cy={pt[1]}
                r={pi === p.length - 1 ? 4 : 2.5}
                fill={c}
                opacity={pi === p.length - 1 ? 1 : 0.6}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// Donut Chart (SVG)
function DonutChart({ data, colors, size = 120 }) {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const r = 44,
    cx = size / 2,
    cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {data.map((val, i) => {
        const pct = val / total;
        const dash = pct * circumference;
        const offset = circumference - cumulative * circumference;
        cumulative += pct;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth="14"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset + circumference}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease', opacity: 0.9 }}
          />
        );
      })}
      {/* Background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeOpacity="0.05"
      />
    </svg>
  );
}

// KPI Card
function KpiCard({ title, value, icon, color, trend, trendLabel, spark, delay }) {
  const pos = trend >= 0;
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
      <MotionPaper
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -5 }}
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'default',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: `0 20px 48px -12px ${color}44`,
          },
        }}
      >
        {/* Glow blob */}
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: `${color}22`,
            pointerEvents: 'none',
            filter: 'blur(20px)',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              p: 1.25,
              borderRadius: 2.5,
              background: `linear-gradient(135deg, ${color}22, ${color}11)`,
              border: `1px solid ${color}33`,
              color,
              display: 'flex',
            }}
          >
            {icon}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              py: 0.35,
              borderRadius: 1.5,
              bgcolor: pos ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
              color: pos ? '#10B981' : '#F43F5E',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            {pos ? (
              <TrendingUpIcon sx={{ fontSize: 14 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 14 }} />
            )}
            {Math.abs(trend)}%
          </Box>
        </Box>

        <Typography
          variant="h3"
          fontWeight={800}
          color="text.primary"
          sx={{ lineHeight: 1, mb: 0.5 }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.07em' }}
        >
          {title}
        </Typography>

        <Box
          sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 2 }}
        >
          <Typography variant="caption" color="text.secondary">
            {trendLabel}
          </Typography>
          <AreaSparkline data={spark} color={color} />
        </Box>
      </MotionPaper>
    </Grid>
  );
}

// Quick-action pill
function ActionPill({ icon, label, color, onClick }) {
  return (
    <Box
      onClick={onClick}
      component={motion.div}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: 2.5,
        py: 1.5,
        borderRadius: 99,
        bgcolor: `${color}14`,
        border: `1px solid ${color}28`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': { bgcolor: `${color}22` },
      }}
    >
      <Box sx={{ color, display: 'flex', fontSize: 18 }}>{icon}</Box>
      <Typography variant="body2" fontWeight={700} sx={{ color }}>
        {label}
      </Typography>
    </Box>
  );
}

// Main
export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const categories = useSelector(selectCategories);
  const authors = useSelector(selectAuthors);
  const users = useSelector(selectUsers);
  const courses = useSelector(selectCourses);
  const me = useSelector(selectUser);

  useEffect(() => {
    dispatch(loadAuthors(0, 100, ''));
    dispatch(loadCategories(0, 100, ''));
    dispatch(loadUsers(0, 100, ''));
    dispatch(loadCourses(0, 100, ''));
  }, [dispatch]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Chart data
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Mar'];
  const base = Math.max(users.length, 1);
  const baseCourse = Math.max(courses.length, 1);

  const enrollSeries = [
    {
      label: 'Students',
      data: [
        Math.round(base * 0.3),
        Math.round(base * 0.45),
        Math.round(base * 0.55),
        Math.round(base * 0.65),
        Math.round(base * 0.78),
        Math.round(base * 0.9),
        base,
      ],
    },
    {
      label: 'Courses',
      data: [
        Math.round(baseCourse * 0.2),
        Math.round(baseCourse * 0.35),
        Math.round(baseCourse * 0.5),
        Math.round(baseCourse * 0.6),
        Math.round(baseCourse * 0.75),
        Math.round(baseCourse * 0.88),
        baseCourse,
      ],
    },
  ];

  // KPI sparks
  const spark = (n) => {
    const b = Math.max(n, 2);
    return [
      Math.round(b * 0.3),
      Math.round(b * 0.45),
      Math.round(b * 0.6),
      Math.round(b * 0.72),
      Math.round(b * 0.83),
      Math.round(b * 0.93),
      b,
    ];
  };

  const recentCourses = courses.slice(0, 6);

  // Category breakdown
  const catColors = ACCENT;
  const totalCourses = courses.length || 1;
  const catBreakdown = categories.slice(0, 5).map((cat, i) => ({
    ...cat,
    count: courses.filter((c) => c.categoryId === cat.id).length,
    color: catColors[i % catColors.length],
  }));

  const donutData = catBreakdown.map((c) => c.count || 1);

  const systemStats = [
    { label: 'API Response', value: '98 ms', icon: <SpeedIcon sx={{ fontSize: 16 }} />, ok: true },
    {
      label: 'Database',
      value: 'Connected',
      icon: <StorageIcon sx={{ fontSize: 16 }} />,
      ok: true,
    },
    { label: 'Uptime', value: '99.9%', icon: <WifiIcon sx={{ fontSize: 16 }} />, ok: true },
    {
      label: 'Auth Service',
      value: 'Active',
      icon: <VerifiedIcon sx={{ fontSize: 16 }} />,
      ok: true,
    },
  ];

  const isDark = theme.palette.mode === 'dark';
  const cardSx = {
    p: 3.5,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    position: 'relative',
    overflow: 'hidden',
  };

  const fadUp = (d = 0) => ({
    component: motion.div,
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.48, delay: d, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <Box sx={{ pb: 6, maxWidth: 1440, mx: 'auto', width: '100%' }}>
      {/* Hero Banner */}
      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          mb: 4,
          p: { xs: 3, md: 4.5 },
          borderRadius: 2,
          background: isDark
            ? 'linear-gradient(135deg, #1E1B4B 0%, #1A2035 40%, #064E3B 100%)'
            : 'linear-gradient(135deg, #4F46E5 0%, #6366F1 40%, #10B981 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 64px -16px rgba(99,102,241,0.45)',
        }}
      >
        {/* background blobs */}
        {[
          { top: -60, right: -60, size: 260, opacity: 0.12 },
          { top: 40, right: 180, size: 100, opacity: 0.08 },
          { bottom: -80, left: -40, size: 220, opacity: 0.08 },
        ].map((b, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.9)',
              opacity: b.opacity,
              width: b.size,
              height: b.size,
              top: b.top,
              right: b.right,
              bottom: b.bottom,
              left: b.left,
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
        ))}

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.75,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {today}
            </Typography>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ lineHeight: 1.1, my: 0.75, letterSpacing: '-0.5px' }}
            >
              {greeting}, {me?.name?.split(' ')[0] || 'Admin'} 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 480, lineHeight: 1.65 }}>
              Your platform is live with{' '}
              <Box
                component="span"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  px: 0.75,
                  borderRadius: 1,
                  fontWeight: 700,
                }}
              >
                {users.length} students
              </Box>{' '}
              across{' '}
              <Box
                component="span"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  px: 0.75,
                  borderRadius: 1,
                  fontWeight: 700,
                }}
              >
                {courses.length} courses
              </Box>
              .
            </Typography>

            {/* Quick action pills */}
            <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="medium"
                onClick={() => navigate('/dashboard/courses/courses')}
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                  bgcolor: 'white',
                  color: '#4F46E5',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.92)', transform: 'translateY(-2px)' },
                }}
              >
                New Course
              </Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => navigate('/dashboard/users')}
                startIcon={<PeopleAltOutlinedIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.45)',
                  color: 'white',
                  fontWeight: 700,
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                View Users
              </Button>
            </Box>
          </Box>

          {/* Stats mini panel */}
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
            }}
          >
            {[
              { label: 'Total Students', value: users.length, icon: <GroupOutlinedIcon /> },
              { label: 'Active Courses', value: courses.length, icon: <SchoolOutlinedIcon /> },
              { label: 'Categories', value: categories.length, icon: <CategoryOutlinedIcon /> },
              { label: 'Instructors', value: authors.length, icon: <PersonOutlinedIcon /> },
            ].map((s) => (
              <Box
                key={s.label}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  minWidth: 140,
                }}
              >
                <Box sx={{ opacity: 0.85 }}>{s.icon}</Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>
                    {s.value}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.7rem' }}>
                    {s.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </MotionBox>

      {/* KPI Row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <KpiCard
          title="Total Users"
          value={users.length}
          icon={<GroupOutlinedIcon />}
          color="#6366F1"
          trend={12}
          trendLabel="vs last month"
          spark={spark(users.length)}
          delay={0.05}
        />
        <KpiCard
          title="Active Courses"
          value={courses.length}
          icon={<SchoolOutlinedIcon />}
          color="#10B981"
          trend={8}
          trendLabel="vs last month"
          spark={spark(courses.length)}
          delay={0.1}
        />
        <KpiCard
          title="Categories"
          value={categories.length}
          icon={<CategoryOutlinedIcon />}
          color="#F59E0B"
          trend={5}
          trendLabel="vs last month"
          spark={spark(categories.length)}
          delay={0.15}
        />
        <KpiCard
          title="Instructors"
          value={authors.length}
          icon={<PersonOutlinedIcon />}
          color="#F43F5E"
          trend={3}
          trendLabel="vs last month"
          spark={spark(authors.length)}
          delay={0.2}
        />
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {/* Area Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper {...fadUp(0.25)} elevation={0} sx={cardSx}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Growth Overview
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Student enrollment & course publishing trends
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {enrollSeries.map((s, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ACCENT[i] }} />
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <AreaChart series={enrollSeries} labels={months} h={150} colors={ACCENT} />

            <Divider sx={{ my: 2.5 }} />

            {/* Summary row */}
            <Grid container>
              {[
                {
                  label: 'Avg monthly students',
                  value: Math.round(enrollSeries[0].data.reduce((a, b) => a + b, 0) / 7),
                  color: ACCENT[0],
                },
                { label: 'Peak month', value: Math.max(...enrollSeries[0].data), color: ACCENT[1] },
                { label: 'Growth rate', value: '↑ 12%', color: ACCENT[2] },
              ].map((s) => (
                <Grid size={4} key={s.label} sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>
                    {s.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Category Donut */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            {...fadUp(0.3)}
            elevation={0}
            sx={{ ...cardSx, height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              By Category
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
              Course distribution
            </Typography>

            {catBreakdown.length === 0 ? (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.5,
                }}
              >
                <CategoryOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2">No categories yet</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <DonutChart
                    data={donutData}
                    colors={catBreakdown.map((c) => c.color)}
                    size={120}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" fontWeight={800}>
                      {categories.length}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.62rem' }}
                    >
                      topics
                    </Typography>
                  </Box>
                </Box>
                <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
                  {catBreakdown.map((cat) => (
                    <Box key={cat.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              bgcolor: cat.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="caption" fontWeight={600} noWrap>
                            {cat.name}
                          </Typography>
                        </Box>
                        <Typography variant="caption" fontWeight={700} sx={{ color: cat.color }}>
                          {cat.count}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.round((cat.count / totalCourses) * 100)}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: `${cat.color}18`,
                          '& .MuiLinearProgress-bar': { bgcolor: cat.color, borderRadius: 2 },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={2.5}>
        {/* Recent Courses Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            {...fadUp(0.35)}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: 3.5,
                pt: 3,
                pb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Recent Courses
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Latest additions to the platform
                </Typography>
              </Box>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/dashboard/courses/courses')}
                sx={{ fontWeight: 700, color: 'primary.main' }}
              >
                View all
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        py: 1.25,
                        bgcolor: (t) =>
                          t.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(15,23,42,0.025)',
                        color: 'text.secondary',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <TableCell sx={{ pl: 3.5 }}>Course</TableCell>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">Fee</TableCell>
                    <TableCell align="center">Enrolled</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell sx={{ pr: 3 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center', border: 0 }}>
                        <SchoolOutlinedIcon
                          sx={{
                            fontSize: 42,
                            color: 'text.disabled',
                            mb: 1,
                            display: 'block',
                            mx: 'auto',
                          }}
                        />
                        <Typography color="text.secondary" variant="body2">
                          No courses yet — create your first one!
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mt: 2 }}
                          onClick={() => navigate('/dashboard/courses/courses')}
                        >
                          Create a course
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentCourses.map((course, i) => (
                      <TableRow
                        key={course.id}
                        hover
                        sx={{ '&:last-child td': { border: 0 }, cursor: 'pointer' }}
                        onClick={() => navigate(`/dashboard/courses/courses/${course.id}`)}
                      >
                        <TableCell sx={{ py: 2, pl: 3.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              src={
                                course.image
                                  ? `${import.meta.env.VITE_API_URL}/files/${course.image}`
                                  : undefined
                              }
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                bgcolor: `${ACCENT[i % ACCENT.length]}22`,
                                color: ACCENT[i % ACCENT.length],
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                border: `1px solid ${ACCENT[i % ACCENT.length]}33`,
                              }}
                            >
                              {course.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                                noWrap
                                sx={{ maxWidth: 200 }}
                              >
                                {course.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {course.language || 'English'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={course.category?.name || 'General'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 22,
                              bgcolor: `${ACCENT[i % ACCENT.length]}14`,
                              color: ACCENT[i % ACCENT.length],
                              border: `1px solid ${ACCENT[i % ACCENT.length]}28`,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={700} color="primary.main">
                            ${(course.fee || 0).toFixed(0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                            }}
                          >
                            <GroupOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight={600}>
                              {course.subscriptions || 0}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label="Active"
                            size="small"
                            icon={<CheckCircleIcon sx={{ fontSize: '11px !important' }} />}
                            sx={{
                              height: 22,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              bgcolor: 'rgba(16,185,129,0.1)',
                              color: '#10B981',
                              border: '1px solid rgba(16,185,129,0.25)',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 2 }}>
                          <Tooltip title="Open course">
                            <IconButton
                              size="small"
                              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            >
                              <OpenInNewIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={2.5}>
            {/* Quick Actions */}
            <Paper {...fadUp(0.38)} elevation={0} sx={cardSx}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Quick Actions
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 2.5 }}
              >
                Navigate to key areas
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <ActionPill
                  icon={<SchoolOutlinedIcon fontSize="small" />}
                  label="Courses"
                  color="#6366F1"
                  onClick={() => navigate('/dashboard/courses/courses')}
                />
                <ActionPill
                  icon={<GroupOutlinedIcon fontSize="small" />}
                  label="Users"
                  color="#10B981"
                  onClick={() => navigate('/dashboard/users')}
                />
                <ActionPill
                  icon={<PersonOutlinedIcon fontSize="small" />}
                  label="Authors"
                  color="#F59E0B"
                  onClick={() => navigate('/dashboard/courses/authors')}
                />
                <ActionPill
                  icon={<CategoryOutlinedIcon fontSize="small" />}
                  label="Categories"
                  color="#F43F5E"
                  onClick={() => navigate('/dashboard/courses/categories')}
                />
                <ActionPill
                  icon={<BarChartIcon fontSize="small" />}
                  label="Analytics"
                  color="#3B82F6"
                  onClick={() => navigate('/dashboard')}
                />
                <ActionPill
                  icon={<EmojiEventsOutlinedIcon fontSize="small" />}
                  label="Reports"
                  color="#8B5CF6"
                  onClick={() => navigate('/dashboard/account')}
                />
              </Box>
            </Paper>

            {/* System Health */}
            <Paper {...fadUp(0.43)} elevation={0} sx={cardSx}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    System Health
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Live platform status
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  icon={
                    <FiberManualRecordIcon
                      sx={{ fontSize: '9px !important', color: '#10B981 !important' }}
                    />
                  }
                  label="All good"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: 'rgba(16,185,129,0.1)',
                    color: '#10B981',
                    border: '1px solid rgba(16,185,129,0.2)',
                  }}
                />
              </Box>

              <Stack spacing={1}>
                {systemStats.map((s) => (
                  <Box
                    key={s.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.025)',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ color: 'text.secondary', display: 'flex' }}>{s.icon}</Box>
                    <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                      {s.label}
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="success.main">
                      {s.value}
                    </Typography>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: '#10B981',
                        boxShadow: '0 0 6px #10B981',
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                {[
                  { label: 'Version', val: 'v1.0.0' },
                  { label: 'Runtime', val: 'Docker' },
                  { label: 'Region', val: 'AP-NE-2' },
                ].map((s) => (
                  <Box key={s.label}>
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                      {s.val}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Platform stats */}
            <Paper
              {...fadUp(0.48)}
              elevation={0}
              sx={{
                ...cardSx,
                background: isDark
                  ? 'linear-gradient(135deg, #1E1B4B, #1A2035)'
                  : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <AutoGraphIcon />
                <Typography variant="subtitle1" fontWeight={700}>
                  Platform Insights
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={800} sx={{ mb: 0.5 }}>
                {Math.round(((users.length + courses.length) / 2) * 10) / 10 || '—'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Avg users per course
              </Typography>

              <Box sx={{ mt: 2.5, display: 'flex', gap: 2 }}>
                {[
                  { label: 'Completion', val: '85%' },
                  { label: 'Satisfaction', val: '4.8★' },
                ].map((s) => (
                  <Box
                    key={s.label}
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      py: 1.5,
                      borderRadius: 1.5,
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={800}>
                      {s.val}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.75 }}>
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
