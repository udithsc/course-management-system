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

// Theme Context
import { useColorMode } from '../../ColorModeProvider';

// Assets
import bgMesh from '../../resources/images/landing/bg_mesh.png';
import iconBook from '../../resources/images/landing/icon_book.png';
import iconChart from '../../resources/images/landing/icon_chart.png';
import team1 from '../../resources/images/landing/team1.png';
import team2 from '../../resources/images/landing/team2.png';
import team3 from '../../resources/images/landing/team3.png';
import service1 from '../../resources/images/landing/service1.png';
import service2 from '../../resources/images/landing/service2.png';
import service3 from '../../resources/images/landing/service3.png';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

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
    [0, 50],
    [isDark ? 'rgba(15, 23, 42, 0)' : 'rgba(255, 255, 255, 0)', 
     isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)']
  );

  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(12px)']
  );

  const navItems = ['Features', 'Services', 'Pricing', 'Team', 'FAQ'];

  const services = [
    { title: 'System Architecture', desc: 'Custom enterprise blueprints tailored for your academic scale. We design the backbone of your digital campus.', icon: service1, color: '#38bdf8' },
    { title: 'Security & Compliance', desc: 'Military-grade encryption and FERPA/GDPR compliance at every layer of your data transmission.', icon: service2, color: '#10b981' },
    { title: 'Rapid Deployment', desc: 'Get your entire department online in under 48 hours with our automated provisioning engine.', icon: service3, color: '#a855f7' }
  ];

  const faqs = [
    { q: "How secure is the student data stored in UDT?", a: "We utilize AES-256 encryption at rest and TLS 1.3 for data in transit. Your data is isolated in secure VPCs with regular third-party audits." },
    { q: "Can we integrate with existing LMS systems?", a: "Yes, UDT provides a comprehensive REST API and pre-built connectors for Canvas, Moodle, and Blackboard integrations." },
    { q: "What kind of support do we get with the Ultimate plan?", a: "The Ultimate plan includes a dedicated Slack channel with our engineering team and a guaranteed 2-hour response time for critical issues." },
    { q: "Is there a limit to the number of courses we can host?", a: "No. All our plans include unlimited course hosting. We scale horizontally to accommodate your growth automatically." }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', overflowX: 'hidden', transition: 'background-color 0.3s' }}>
      {/* Dynamic Navbar */}
      <MotionBox
        component="nav"
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          py: 2,
          px: { xs: 2, md: 8 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Typography
          variant="h5"
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 900,
            cursor: 'pointer',
            background: isDark ? 'linear-gradient(90deg, #38bdf8, #818cf8)' : 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1.5px'
          }}
        >
          UDT COURSE MANAGER
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          {!isMobile && navItems.map((item) => (
            <Typography
              key={item}
              sx={{
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {item}
            </Typography>
          ))}
          
          <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {!isMobile ? (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 800,
                borderRadius: '50px',
                px: 4,
                textTransform: 'none'
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

      {/* Hero Section */}
      <Box sx={{ position: 'relative', pt: { xs: 15, md: 25 }, pb: { xs: 10, md: 20 } }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage: `url(${bgMesh})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isDark ? 0.4 : 0.8,
            zIndex: 0,
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            filter: isDark ? 'none' : 'hue-rotate(180deg) brightness(1.2)'
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Chip
                label="Revolutionizing Education"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 800,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  mb: 3,
                  py: 2,
                  px: 1
                }}
              />
            </motion.div>
            
            <MotionTypography
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              variant="h1"
              sx={{
                fontSize: { xs: '2.8rem', sm: '4rem', md: '6rem' },
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-3px',
                maxWidth: 900,
                color: 'text.primary'
              }}
            >
              The Next Frontier <br />
              of <span style={{ color: theme.palette.primary.main }}>Academic Excellence.</span>
            </MotionTypography>

            <MotionTypography
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                color: 'text.secondary',
                maxWidth: 700,
                lineHeight: 1.6
              }}
            >
              Enterprise-grade course management for modern scale. 
              Empower your faculty, engage your students, and dominate your niche.
            </MotionTypography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 2,
                  px: 6,
                  borderRadius: '50px',
                  bgcolor: 'text.primary',
                  color: 'background.default',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'scale(1.05)', opacity: 0.9 }
                }}
              >
                Join the Future
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  py: 2,
                  px: 6,
                  borderRadius: '50px',
                  borderColor: 'divider',
                  color: 'text.primary',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s',
                  '&:hover': { borderColor: 'text.primary', bgcolor: alpha(theme.palette.text.primary, 0.05) }
                }}
              >
                Watch Demo
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 8, md: 20 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ mb: { xs: 6, md: 10 }, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: { xs: 2, md: 3 }, fontSize: { xs: '0.75rem', md: '1rem' } }}>
                OUR SERVICES
            </Typography>
            <Typography 
                variant="h2" 
                sx={{ 
                    fontWeight: 900, 
                    letterSpacing: '-2px', 
                    color: 'text.primary',
                    fontSize: { xs: '2.4rem', sm: '3rem', md: '3.75rem' },
                    lineHeight: 1.1
                }}
            >
                Holistic Platform <br />Care.
            </Typography>
          </Stack>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {services.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 5 },
                    height: '100%',
                    borderRadius: { xs: '32px', md: '40px' },
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    textAlign: { xs: 'center', md: 'left' },
                    '&:hover': { border: `1px solid ${item.color}`, bgcolor: alpha(item.color, 0.05) }
                  }}
                >
                  <Box 
                    component="img" 
                    src={item.icon} 
                    sx={{ 
                        width: { xs: 80, md: 100 }, 
                        mb: 4, 
                        filter: isDark ? 'none' : 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' 
                    }} 
                  />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Bento Grid Features */}
      <Container maxWidth="lg" sx={{ py: 20 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <MotionBox
              whileHover={{ scale: 1.01 }}
              sx={{
                height: 400,
                borderRadius: '32px',
                p: 6,
                background: isDark 
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1))'
                  : 'linear-gradient(135deg, #eff6ff, #eef2ff)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box component="img" src={iconChart} sx={{ position: 'absolute', right: -50, bottom: -50, width: 350, opacity: isDark ? 0.6 : 0.8 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>Visual Intelligence</Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 400 }}>
                Real-time analytics engine that predicts student outcomes and optimizes curriculum engagement.
              </Typography>
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MotionBox
              whileHover={{ scale: 1.01 }}
              sx={{
                height: 400,
                borderRadius: '32px',
                p: 6,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Box sx={{ p: 2, borderRadius: '24px', bgcolor: 'primary.main', color: 'white', alignSelf: 'center', mb: 3 }}>
                <DashboardIcon fontSize="large" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>Aero UI</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Breathtakingly fast interface designed for minimalist efficiency.
              </Typography>
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <MotionBox
              whileHover={{ scale: 1.01 }}
              sx={{
                height: 400,
                borderRadius: '32px',
                p: 6,
                bgcolor: alpha(theme.palette.primary.light, 0.05),
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <GroupIcon sx={{ fontSize: 50, color: 'primary.main', mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>Faculty Force</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Collaborative management for elite instructor teams.
              </Typography>
            </MotionBox>
          </Grid>
          <Grid item xs={12} md={8}>
            <MotionBox
              whileHover={{ scale: 1.01 }}
              sx={{
                height: 400,
                borderRadius: '32px',
                p: 6,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box component="img" src={iconBook} sx={{ position: 'absolute', right: -20, top: -20, width: 300, opacity: isDark ? 0.5 : 0.7 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>Smart Library</Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 500 }}>
                AI-powered categorization and knowledge mapping for complex course hierarchies.
              </Typography>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ py: 20, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" sx={{ mb: 10 }}>
            <Typography sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 3 }}>INVESTMENT</Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary' }}>Elite Access Plans</Typography>
          </Stack>

          <Grid container spacing={4} justifyContent="center">
            {[
              { title: 'Standard', price: '49', features: ['Core Module', '5 Staff Seats', '24/7 API Access'], color: 'text.primary' },
              { title: 'Ultimate', price: '149', features: ['All Core + AI', 'Unlimited Seats', 'Premium Support', 'White-labeling'], color: 'primary.main', featured: true },
              { title: 'Enterprise', price: '999', features: ['Custom Infrastructure', 'Dedicated Architect', 'On-premise Options'], color: 'text.primary' }
            ].map((plan, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    height: '100%',
                    borderRadius: '40px',
                    bgcolor: plan.featured ? alpha(theme.palette.primary.main, 0.1) : theme.palette.background.paper,
                    border: `1px solid ${plan.featured ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.1)}`,
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-10px)', bgcolor: plan.featured ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.text.primary, 0.03) }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, color: plan.color, mb: 4 }}>{plan.title}</Typography>
                  <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>${plan.price}</Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 4 }}>per month, billed annually</Typography>
                  
                  <Stack spacing={2} sx={{ mb: 6 }}>
                    {plan.features.map((f, idx) => (
                      <Stack key={idx} direction="row" spacing={2} alignItems="center">
                        <CheckCircleIcon sx={{ color: plan.color, fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 500, color: 'text.primary', opacity: 0.8 }}>{f}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    variant={plan.featured ? 'contained' : 'outlined'}
                    sx={{
                      borderRadius: '50px',
                      py: 2,
                      fontWeight: 900,
                      bgcolor: plan.featured ? 'primary.main' : 'transparent',
                      color: plan.featured ? 'white' : 'text.primary',
                      borderColor: plan.featured ? 'primary.main' : 'divider',
                      '&:hover': { bgcolor: plan.featured ? 'primary.dark' : alpha(theme.palette.text.primary, 0.1) }
                    }}
                  >
                    Select Plan
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 20 }}>
        <Container maxWidth="md">
          <Stack spacing={2} textAlign="center" sx={{ mb: 10 }}>
            <Typography sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 3 }}>KNOWLEDGE BASE</Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary' }}>Frequently Asked Questions</Typography>
          </Stack>
          <Box>
            {faqs.map((faq, i) => (
              <Accordion 
                key={i} 
                sx={{ 
                  bgcolor: 'transparent', 
                  color: 'text.primary', 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  mb: 2
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                  sx={{ px: 0, '& .MuiAccordionSummary-content': { my: 3 } }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pb: 4 }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 20 }}>
        <Stack spacing={2} textAlign="center" sx={{ mb: 12 }}>
          <Typography variant="h2" sx={{ fontWeight: 900, color: 'text.primary' }}>Architected for You</Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Built by engineers, educators, and designers who believe in the power of frictionless software.
          </Typography>
        </Stack>

        <Grid container spacing={8}>
          {[
            { name: 'Adam Vance', role: 'Architect', img: team1 },
            { name: 'Elena Rossi', role: 'Platform Lead', img: team2 },
            { name: 'Kenji Wu', role: 'CTO', img: team3 }
          ].map((m, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Stack spacing={3} alignItems="center">
                <Avatar 
                  src={m.img} 
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    borderRadius: '60px', 
                    filter: isDark ? 'grayscale(100%)' : 'none',
                    transition: 'all 0.5s',
                    '&:hover': { filter: 'grayscale(0%)', borderRadius: '40px' }
                  }} 
                />
                <Box textAlign="center">
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>{m.name}</Typography>
                  <Typography sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}>{m.role}</Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 10, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 4, letterSpacing: '-2px', color: 'text.primary' }}>UDT.</Typography>
              <Typography sx={{ color: 'text.secondary', maxWidth: 400, mb: 4 }}>
                A sophisticated platform for modern institutions. 
                Redefining the relationship between technology and knowledge.
              </Typography>
              <Stack direction="row" spacing={3}>
                {['LinkedIn', 'Twitter', 'GitHub'].map(s => (
                  <Typography key={s} sx={{ fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{s}</Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={10} justifyContent={{ md: 'flex-end' }}>
                <Stack spacing={2}>
                  <Typography sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>PRODUCT</Typography>
                  {['Features', 'Engine', 'Aero UI'].map(l => (
                    <Typography key={l} sx={{ color: 'text.secondary', fontSize: '0.9rem', cursor: 'pointer' }}>{l}</Typography>
                  ))}
                </Stack>
                <Stack spacing={2}>
                  <Typography sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>LEGAL</Typography>
                  {['Privacy', 'Terms', 'License'].map(l => (
                    <Typography key={l} sx={{ color: 'text.secondary', fontSize: '0.9rem', cursor: 'pointer' }}>{l}</Typography>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 15, pt: 8, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              © 2026 UDT COURSE MANAGER. DESIGNED BY UDITH.CC
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { bgcolor: 'background.default', width: '100%', p: 4 } }}
      >
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 6 }}>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack spacing={4} alignItems="center">
          {navItems.map(item => (
            <Typography key={item} variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>{item}</Typography>
          ))}
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ py: 2, borderRadius: '50px', bgcolor: 'primary.main', color: 'white', fontWeight: 900, mt: 4 }}
          >
            Dashboard
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default LandingPage;
