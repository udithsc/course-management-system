import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Stack,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  Paper,
  Chip,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import StarIcon from '@mui/icons-material/Star';

import { useColorMode } from '../../ColorModeProvider';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

/* ──────────────────────────────────────────── Animated Background ──── */
const AnimatedBackground = ({ isDark }) => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      zIndex: 0,
    }}
  >
    {/* Primary gradient orb */}
    <MotionBox
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -30, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      sx={{
        position: 'absolute',
        width: { xs: 400, md: 700 },
        height: { xs: 400, md: 700 },
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
        top: '-10%',
        right: '-5%',
        filter: 'blur(40px)',
      }}
    />
    {/* Secondary gradient orb */}
    <MotionBox
      animate={{
        x: [0, -40, 30, 0],
        y: [0, 20, -30, 0],
        scale: [1, 0.9, 1.1, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      sx={{
        position: 'absolute',
        width: { xs: 350, md: 600 },
        height: { xs: 350, md: 600 },
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        bottom: '5%',
        left: '-10%',
        filter: 'blur(60px)',
      }}
    />
    {/* Tertiary accent orb */}
    <MotionBox
      animate={{
        x: [0, 20, -15, 0],
        y: [0, -20, 15, 0],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      sx={{
        position: 'absolute',
        width: { xs: 200, md: 400 },
        height: { xs: 200, md: 400 },
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)',
        top: '40%',
        left: '50%',
        filter: 'blur(50px)',
      }}
    />
    {/* Grid pattern overlay */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: isDark
          ? `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`
          : `linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)',
      }}
    />
  </Box>
);

/* ──────────────────────────────────────────── Stat Card ──── */
const StatCard = ({ icon, value, label, delay, isDark }) => (
  <MotionBox
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay }}
    whileHover={{ y: -6, transition: { duration: 0.3 } }}
    sx={{
      px: { xs: 3, md: 4 },
      py: { xs: 2.5, md: 3 },
      borderRadius: '20px',
      background: isDark
        ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
      backdropFilter: 'blur(20px)',
      border: isDark
        ? '1px solid rgba(255,255,255,0.08)'
        : '1px solid rgba(0,0,0,0.06)',
      cursor: 'default',
      transition: 'box-shadow 0.3s',
      '&:hover': {
        boxShadow: isDark
          ? '0 20px 40px rgba(0,0,0,0.3)'
          : '0 20px 40px rgba(0,0,0,0.08)',
      },
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          p: 1,
          borderRadius: '12px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(56,189,248,0.2))'
            : 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(56,189,248,0.1))',
          display: 'flex',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.3rem', md: '1.5rem' }, color: 'text.primary', lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 600, letterSpacing: '0.5px' }}>
          {label}
        </Typography>
      </Box>
    </Stack>
  </MotionBox>
);

/* ──────────────────────────────────────────── Feature Card ──── */
const FeatureCard = ({ icon, title, description, gradient, index, isDark }) => (
  <MotionBox
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    sx={{
      p: { xs: 4, md: 5 },
      height: '100%',
      borderRadius: '24px',
      background: isDark
        ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)',
      backdropFilter: 'blur(10px)',
      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      transition: 'all 0.3s',
      '&:hover': {
        border: isDark ? '1px solid rgba(79,70,229,0.3)' : '1px solid rgba(79,70,229,0.2)',
        boxShadow: isDark
          ? '0 20px 50px rgba(79,70,229,0.1)'
          : '0 20px 50px rgba(79,70,229,0.06)',
      },
      '&:hover .feature-icon-bg': {
        transform: 'scale(1.1)',
      },
    }}
  >
    {/* Gradient corner accent */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 120,
        height: 120,
        background: gradient,
        opacity: isDark ? 0.06 : 0.04,
        borderRadius: '0 24px 0 100%',
      }}
    />
    <Box
      className="feature-icon-bg"
      sx={{
        width: 56,
        height: 56,
        borderRadius: '16px',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
        transition: 'transform 0.3s',
        color: 'white',
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
      {title}
    </Typography>
    <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.93rem' }}>
      {description}
    </Typography>
  </MotionBox>
);

/* ──────────────────────────────────────────── Section Header ──── */
const SectionHeader = ({ badge, title, subtitle }) => (
  <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: { xs: 6, md: 10 } }}>
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Chip
        label={badge}
        size="small"
        sx={{
          fontWeight: 800,
          fontSize: '0.7rem',
          letterSpacing: '1.5px',
          px: 1.5,
          background: (theme) => alpha(theme.palette.primary.main, 0.08),
          color: 'primary.main',
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      />
    </motion.div>
    <MotionTypography
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      variant="h2"
      sx={{
        fontWeight: 900,
        letterSpacing: '-2px',
        color: 'text.primary',
        fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
        lineHeight: 1.15,
        maxWidth: 650,
      }}
    >
      {title}
    </MotionTypography>
    {subtitle && (
      <MotionTypography
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        sx={{ color: 'text.secondary', maxWidth: 550, fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.7 }}
      >
        {subtitle}
      </MotionTypography>
    )}
  </Stack>
);

/* ──────────────────────────────────────────────────────────────────── */
/*                           MAIN COMPONENT                           */
/* ──────────────────────────────────────────────────────────────────── */

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  const headerBg = useTransform(
    scrollY,
    [0, 80],
    [isDark ? 'rgba(15, 23, 42, 0)' : 'rgba(248, 250, 252, 0)',
     isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(248, 250, 252, 0.85)']
  );

  const headerBlur = useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(16px)']);

  const navItems = ['Features', 'Services', 'Pricing', 'Team', 'FAQ'];

  const features = [
    {
      icon: <AutoGraphIcon />,
      title: 'Visual Intelligence',
      description: 'Real-time analytics engine that predicts student outcomes and optimizes curriculum engagement rates.',
      gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    },
    {
      icon: <SpeedIcon />,
      title: 'Aero UI',
      description: 'Breathtakingly fast interface designed for minimalist efficiency. Every interaction under 100ms.',
      gradient: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
    },
    {
      icon: <GroupIcon />,
      title: 'Faculty Force',
      description: 'Collaborative management tools built for elite instructor teams. Role-based workflows that scale.',
      gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    },
    {
      icon: <SecurityIcon />,
      title: 'Enterprise Security',
      description: 'AES-256 encryption, FERPA/GDPR compliance, and SOC 2 certified infrastructure at every layer.',
      gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    },
    {
      icon: <IntegrationInstructionsIcon />,
      title: 'Open Integrations',
      description: 'REST & GraphQL APIs with pre-built connectors for Canvas, Moodle, Blackboard, and 40+ tools.',
      gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    },
    {
      icon: <RocketLaunchIcon />,
      title: 'Rapid Deployment',
      description: 'Entire department online in under 48 hours with automated provisioning and guided onboarding.',
      gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    },
  ];

  const services = [
    {
      icon: <ArchitectureIcon sx={{ fontSize: 36 }} />,
      title: 'System Architecture',
      desc: 'Custom enterprise blueprints tailored for your academic scale. We design the backbone of your digital campus.',
      gradient: 'linear-gradient(135deg, #38bdf8, #818cf8)',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 36 }} />,
      title: 'Security & Compliance',
      desc: 'Military-grade encryption and FERPA/GDPR compliance at every layer of your data transmission.',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 36 }} />,
      title: 'Premium Support',
      desc: 'Dedicated Slack channel with our engineering team. 2-hour response time for critical issues.',
      gradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
    },
  ];

  const faqs = [
    { q: "How secure is the student data stored in UDT?", a: "We utilize AES-256 encryption at rest and TLS 1.3 for data in transit. Your data is isolated in secure VPCs with regular third-party audits." },
    { q: "Can we integrate with existing LMS systems?", a: "Yes, UDT provides a comprehensive REST API and pre-built connectors for Canvas, Moodle, and Blackboard integrations." },
    { q: "What kind of support do we get with the Ultimate plan?", a: "The Ultimate plan includes a dedicated Slack channel with our engineering team and a guaranteed 2-hour response time for critical issues." },
    { q: "Is there a limit to the number of courses we can host?", a: "No. All our plans include unlimited course hosting. We scale horizontally to accommodate your growth automatically." },
  ];

  const pricingPlans = [
    {
      title: 'Standard',
      price: '49',
      features: ['Core Module', '5 Staff Seats', '24/7 API Access', 'Email Support'],
      featured: false,
    },
    {
      title: 'Ultimate',
      price: '149',
      features: ['All Core + AI Analytics', 'Unlimited Seats', 'Priority Support', 'White-labeling', 'Custom Integrations'],
      featured: true,
    },
    {
      title: 'Enterprise',
      price: '999',
      features: ['Custom Infrastructure', 'Dedicated Architect', 'On-premise Option', 'SLA Guarantee', '24/7 Phone Support'],
      featured: false,
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', overflowX: 'hidden', transition: 'background-color 0.4s' }}>
      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <MotionBox
        component="nav"
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          py: 1.5,
          px: { xs: 2, md: 6 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SchoolIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.5px',
              background: isDark ? 'linear-gradient(90deg, #38bdf8, #818cf8)' : 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.1rem',
            }}
          >
            UDT
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {!isMobile && navItems.map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'text.secondary',
                px: 1.5,
                py: 0.5,
                borderRadius: '8px',
                transition: 'all 0.2s',
                '&:hover': { color: 'text.primary', bgcolor: alpha(theme.palette.text.primary, 0.04) },
              }}
            >
              {item}
            </Typography>
          ))}

          <IconButton
            onClick={toggleColorMode}
            size="small"
            sx={{
              color: 'text.secondary',
              bgcolor: alpha(theme.palette.text.primary, 0.04),
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
              ml: 1,
            }}
          >
            {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>

          {!isMobile ? (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: 'white',
                fontWeight: 700,
                borderRadius: '10px',
                px: 3,
                py: 0.8,
                textTransform: 'none',
                fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(79,70,229,0.3)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(79,70,229,0.4)',
                  background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
                },
              }}
            >
              Sign In
            </Button>
          ) : (
            <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Stack>
      </MotionBox>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <Box sx={{ position: 'relative', pt: { xs: 16, md: 22 }, pb: { xs: 10, md: 16 }, minHeight: { md: '100vh' }, display: 'flex', alignItems: 'center' }}>
        <AnimatedBackground isDark={isDark} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={5} alignItems="center" textAlign="center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: 16, color: 'primary.main !important' }} />}
                label="Trusted by 500+ Institutions Worldwide"
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: 'text.secondary',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  py: 2,
                  px: 1,
                  '& .MuiChip-icon': { ml: 1 },
                }}
              />
            </motion.div>

            <MotionTypography
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.2rem' },
                fontWeight: 900,
                lineHeight: { xs: 1.1, md: 1.05 },
                letterSpacing: { xs: '-1.5px', md: '-3px' },
                maxWidth: 900,
              }}
            >
              The Next Frontier{' '}
              <br />
              of{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 50%, #10B981 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradientShift 4s ease-in-out infinite',
                  '@keyframes gradientShift': {
                    '0%': { backgroundPosition: '0% center' },
                    '50%': { backgroundPosition: '100% center' },
                    '100%': { backgroundPosition: '0% center' },
                  },
                }}
              >
                Academic Excellence.
              </Box>
            </MotionTypography>

            <MotionTypography
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: 'text.secondary',
                maxWidth: 620,
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              Enterprise-grade course management for modern institutions.
              Empower your faculty, engage your students, and scale without limits.
            </MotionTypography>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    px: 5,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    boxShadow: '0 8px 30px rgba(79,70,229,0.35)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(79,70,229,0.45)',
                      background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    py: 1.8,
                    px: 5,
                    borderRadius: '14px',
                    borderColor: alpha(theme.palette.text.primary, 0.15),
                    color: 'text.primary',
                    fontWeight: 700,
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
            </MotionBox>

            {/* Stats Row */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              sx={{ mt: { xs: 4, md: 6 } }}
            >
              <StatCard icon={<PeopleAltIcon />} value="10K+" label="Students" delay={0.5} isDark={isDark} />
              <StatCard icon={<SchoolIcon />} value="500+" label="Courses" delay={0.6} isDark={isDark} />
              <StatCard icon={<VerifiedIcon />} value="99.9%" label="Uptime" delay={0.7} isDark={isDark} />
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <Box sx={{ py: { xs: 10, md: 16 }, position: 'relative' }}>
        <Container maxWidth="lg">
          <SectionHeader
            badge="FEATURES"
            title="Everything You Need to Dominate"
            subtitle="A comprehensive platform engineered for scale, security, and speed. Every tool your institution needs, unified."
          />
          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <FeatureCard {...f} index={i} isDark={isDark} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: alpha(theme.palette.primary.main, isDark ? 0.03 : 0.02) }}>
        <Container maxWidth="lg">
          <SectionHeader
            badge="SERVICES"
            title="Holistic Platform Care"
            subtitle="Beyond software — we partner with you to architect, secure, and scale your entire digital learning ecosystem."
          />
          <Grid container spacing={4}>
            {services.map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  sx={{
                    p: { xs: 4, md: 5 },
                    height: '100%',
                    borderRadius: '24px',
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    transition: 'all 0.3s',
                    cursor: 'default',
                    '&:hover': {
                      boxShadow: isDark
                        ? '0 25px 50px rgba(0,0,0,0.3)'
                        : '0 25px 50px rgba(0,0,0,0.06)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '18px',
                      background: item.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 4,
                      color: 'white',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.2rem', md: '1.4rem' }, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {item.desc}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <Box sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <SectionHeader
            badge="PRICING"
            title="Elite Access Plans"
            subtitle="Transparent pricing designed to scale with your institution. No hidden fees, no surprises."
          />
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, i) => (
              <Grid item xs={12} md={4} key={i}>
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  sx={{
                    p: { xs: 4, md: 5 },
                    height: '100%',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: plan.featured
                      ? isDark
                        ? 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(124,58,237,0.08) 100%)'
                        : 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.04) 100%)'
                      : isDark
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
                        : 'rgba(255,255,255,0.9)',
                    border: plan.featured
                      ? `2px solid ${alpha(theme.palette.primary.main, 0.4)}`
                      : isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                    transition: 'all 0.3s',
                    cursor: 'default',
                    '&:hover': {
                      boxShadow: plan.featured
                        ? '0 25px 60px rgba(79,70,229,0.2)'
                        : isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.06)',
                    },
                  }}
                >
                  {plan.featured && (
                    <Chip
                      icon={<StarIcon sx={{ fontSize: 14, color: 'white !important' }} />}
                      label="Most Popular"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.7rem',
                        '& .MuiChip-icon': { ml: 0.5 },
                      }}
                    />
                  )}
                  <Typography sx={{ fontWeight: 700, color: plan.featured ? 'primary.main' : 'text.secondary', mb: 3, fontSize: '0.9rem', letterSpacing: '1px' }}>
                    {plan.title.toUpperCase()}
                  </Typography>
                  <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: { xs: '2.5rem', md: '3rem' }, color: 'text.primary', lineHeight: 1 }}>
                      ${plan.price}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>/mo</Typography>
                  </Stack>
                  <Typography sx={{ color: 'text.secondary', mb: 4, fontSize: '0.85rem' }}>billed annually</Typography>

                  <Stack spacing={2} sx={{ mb: 5 }}>
                    {plan.features.map((f, idx) => (
                      <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                        <CheckCircleIcon sx={{ color: plan.featured ? 'primary.main' : 'secondary.main', fontSize: 18 }} />
                        <Typography sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.93rem' }}>{f}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    variant={plan.featured ? 'contained' : 'outlined'}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      ...(plan.featured
                        ? {
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            color: 'white',
                            boxShadow: '0 8px 25px rgba(79,70,229,0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
                              boxShadow: '0 12px 35px rgba(79,70,229,0.4)',
                            },
                          }
                        : {
                            borderColor: alpha(theme.palette.text.primary, 0.15),
                            color: 'text.primary',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                            },
                          }),
                    }}
                  >
                    {plan.featured ? 'Get Started' : 'Select Plan'}
                  </Button>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: alpha(theme.palette.primary.main, isDark ? 0.03 : 0.02) }}>
        <Container maxWidth="md">
          <SectionHeader
            badge="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about UDT Course Manager."
          />
          <Box>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Accordion
                  sx={{
                    bgcolor: 'transparent',
                    color: 'text.primary',
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                    sx={{ px: 0, '& .MuiAccordionSummary-content': { my: 2.5 } }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' } }}>{faq.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pb: 3 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '1rem', lineHeight: 1.8 }}>
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            sx={{
              p: { xs: 5, md: 8 },
              borderRadius: '32px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(14,165,233,0.08) 100%)'
                : 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(14,165,233,0.04) 100%)',
              border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.15 : 0.1)}`,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(79,70,229,0.1), transparent 70%)',
                top: -100,
                right: -100,
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-1.5px', color: 'text.primary', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              Ready to Transform Your Institution?
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 5, maxWidth: 500, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Join hundreds of leading institutions already using UDT to deliver world-class education at scale.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.8,
                px: 6,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: 'white',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 8px 30px rgba(79,70,229,0.35)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(79,70,229,0.45)',
                  background: 'linear-gradient(135deg, #4338CA, #6D28D9)',
                },
              }}
            >
              Start Free Trial
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <Box
        sx={{
          py: 8,
          borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.06)}`,
          bgcolor: isDark ? alpha(theme.palette.background.paper, 0.3) : alpha(theme.palette.background.paper, 0.5),
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SchoolIcon sx={{ color: 'white', fontSize: 18 }} />
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: 'text.primary' }}>
                  UDT Course Manager
                </Typography>
              </Stack>
              <Typography sx={{ color: 'text.secondary', maxWidth: 350, mb: 3, lineHeight: 1.7, fontSize: '0.9rem' }}>
                A sophisticated platform for modern institutions.
                Redefining the relationship between technology and knowledge.
              </Typography>
              <Stack direction="row" spacing={2}>
                {['LinkedIn', 'Twitter', 'GitHub'].map(s => (
                  <Typography
                    key={s}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: 'text.secondary',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {s}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={{ xs: 6, md: 10 }} justifyContent={{ md: 'flex-end' }} flexWrap="wrap">
                {[
                  { title: 'PRODUCT', items: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
                  { title: 'COMPANY', items: ['About', 'Blog', 'Careers', 'Contact'] },
                  { title: 'LEGAL', items: ['Privacy', 'Terms', 'License', 'Security'] },
                ].map((col) => (
                  <Stack key={col.title} spacing={1.5}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '1.5px', mb: 0.5 }}>
                      {col.title}
                    </Typography>
                    {col.items.map(l => (
                      <Typography
                        key={l}
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'color 0.2s',
                          '&:hover': { color: 'text.primary' },
                        }}
                      >
                        {l}
                      </Typography>
                    ))}
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 8, pt: 4, borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.04)}`, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              © 2026 UDT Course Manager. Designed by Udith.cc
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ═══════════════════ MOBILE DRAWER ═══════════════════ */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            width: '100%',
            p: 4,
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={3} alignItems="center">
          {navItems.map(item => (
            <Typography
              key={item}
              variant="h5"
              onClick={() => setMobileOpen(false)}
              sx={{ fontWeight: 800, color: 'text.primary', cursor: 'pointer' }}
            >
              {item}
            </Typography>
          ))}
          <Button
            fullWidth
            variant="contained"
            onClick={() => { setMobileOpen(false); navigate('/login'); }}
            sx={{
              py: 2,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: 'white',
              fontWeight: 900,
              mt: 2,
            }}
          >
            Sign In
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default LandingPage;
