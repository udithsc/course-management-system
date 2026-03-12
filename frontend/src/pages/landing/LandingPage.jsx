import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Divider,
  useTheme,
  Chip,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

// Images
import heroImg from '../../resources/images/landing/hero.png';
import team1 from '../../resources/images/landing/team1.png';
import team2 from '../../resources/images/landing/team2.png';
import team3 from '../../resources/images/landing/team3.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const navItems = ['Features', 'Pricing', 'Team'];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        UDT.
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemText primary={item} sx={{ textAlign: 'center', py: 1, '& .MuiTypography-root': { fontWeight: 600 } }} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate('/login')}
        sx={{ mt: 2, borderRadius: '12px', fontWeight: 700, py: 1.5 }}
      >
        Dashboard
      </Button>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff', overflow: 'hidden' }}>
      {/* Header/Navbar */}
      <Box
        component="nav"
        sx={{
          py: 2,
          px: { xs: 2, sm: 4, md: 8 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <Typography
          variant="h5"
          onClick={() => navigate('/')}
          sx={{
            fontWeight: 900,
            letterSpacing: '-1px',
            cursor: 'pointer',
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          UDT.
        </Typography>

        {isMobile ? (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Stack direction="row" spacing={3} alignItems="center">
            {navItems.map((item) => (
              <Button key={item} sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}>{item}</Button>
            ))}
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.3)'
              }}
            >
              Dashboard
            </Button>
          </Stack>
        )}

        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRadius: '20px 0 0 20px' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 15 }, pb: { xs: 8, md: 12 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
              <Chip 
                label="Version 2.0 is out" 
                color="primary" 
                variant="soft" 
                sx={{ mb: 2, fontWeight: 700, bgcolor: 'rgba(25, 118, 210, 0.1)', color: 'primary.main' }} 
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5.5rem' },
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: { xs: 1.1, md: 1 },
                  mb: 3,
                  letterSpacing: { xs: '-1px', md: '-2px' },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Elevate Your <br />
                <span style={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Learning System.
                </span>
              </Typography>
              <Typography variant="h5" sx={{ color: '#475569', mb: 6, fontWeight: 400, maxWidth: 580, lineHeight: 1.6, textAlign: { xs: 'center', md: 'left' }, mx: { xs: 'auto', md: 0 } }}>
                The all-in-one platform for educational excellence. Manage courses, track progress, and empower your educators with UDT Course Manager.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 2.5,
                    px: 5,
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    textTransform: 'none',
                    boxShadow: '0 20px 35px -10px rgba(25, 118, 210, 0.5)'
                  }}
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 2.5,
                    px: 5,
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderWidth: '2px',
                    '&:hover': { borderWidth: '2px' }
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 1, ease: 'easeOut' }}
            >
              <Box 
                sx={{ 
                    position: 'relative',
                    maxWidth: { xs: 500, md: '100%' },
                    mx: 'auto',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '120%',
                        height: '100%',
                        top: '-10%',
                        left: '-10%',
                        background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: -1
                    }
                }}
              >
                <Box
                  component="img"
                  src={heroImg}
                  alt="UDT Hero"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '32px',
                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25)',
                    transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                    transition: 'transform 0.5s',
                    '&:hover': {
                        transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
                    }
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Features Overview */}
      <Box sx={{ py: { xs: 8, md: 15 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: '#0f172a', fontSize: { xs: '2rem', md: '3rem' } }}>
              Why Choose UDT?
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto', px: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              We provide the tools you need to scale your educational institution with ease and efficiency.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { 
                icon: <DashboardIcon sx={{ fontSize: 40 }} />, 
                title: 'Powerful Dashboard', 
                desc: 'Get instant insights into your academic performance and student engagement metrics.',
                color: '#1976d2'
              },
              { 
                icon: <SchoolIcon sx={{ fontSize: 40 }} />, 
                title: 'Seamless Management', 
                desc: 'Intuitive tools to create, categorize and manage complex course structures effortlessly.',
                color: '#10b981'
              },
              { 
                icon: <GroupIcon sx={{ fontSize: 40 }} />, 
                title: 'Collaborative Authors', 
                desc: 'Connect with expert instructors and manage their contributions in a unified gateway.',
                color: '#f59e0b'
              }
            ].map((feature, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div whileHover={{ y: -15 }} transition={{ duration: 0.3 }}>
                  <Paper
                    sx={{
                      p: 5,
                      borderRadius: '24px',
                      height: '100%',
                      textAlign: 'left',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)'
                    }}
                  >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: 70, 
                        height: 70, 
                        bgcolor: `${feature.color}15`, 
                        color: feature.color, 
                        borderRadius: '20px', 
                        mb: 3 
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{feature.title}</Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.7 }}>{feature.desc}</Typography>
                    <Button color="primary" sx={{ fontWeight: 700, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                      Learn more
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 15 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 2 }}>PRICING PLANS</Typography>
          <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>Scalable for Any Size</Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {[
            { 
                title: 'Standard', 
                price: '49', 
                features: ['Unlimited Courses', 'Up to 5 Authors', 'Basic Analytics', 'Community Support'],
                featured: false
            },
            { 
                title: 'Premium', 
                price: '99', 
                features: ['Unlimited Courses', 'Unlimited Authors', 'Advanced Dashboard', 'Priority Support', 'White-labeling'],
                featured: true
            },
            { 
                title: 'Enterprise', 
                price: 'Custom', 
                features: ['Custom Integration', 'Dedicated Manager', 'SSO Security', '24/7 Expert Support'],
                featured: false
            }
          ].map((plan, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card 
                sx={{ 
                    p: 2, 
                    borderRadius: '32px', 
                    height: '100%', 
                    position: 'relative',
                    border: plan.featured ? '2px solid' : '1px solid',
                    borderColor: plan.featured ? 'primary.main' : 'rgba(0,0,0,0.08)',
                    boxShadow: plan.featured ? '0 30px 60px -15px rgba(25, 118, 210, 0.2)' : 'none',
                    transform: plan.featured ? 'scale(1.05)' : 'none'
                }}
              >
                {plan.featured && (
                    <Chip 
                        label="MOST POPULAR" 
                        color="primary" 
                        sx={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', fontWeight: 900 }} 
                    />
                )}
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary', mb: 3 }}>{plan.title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 4 }}>
                    <Typography variant="h2" sx={{ fontWeight: 900 }}>${plan.price}</Typography>
                    {plan.price !== 'Custom' && <Typography variant="h6" color="text.secondary">/mo</Typography>}
                  </Box>
                  <Divider sx={{ mb: 4 }} />
                  <Stack spacing={2} sx={{ mb: 6 }}>
                    {plan.features.map((feature, idx) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }} key={idx}>
                        <CheckIcon sx={{ color: 'success.main', mr: 2, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{feature}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Button 
                    fullWidth 
                    variant={plan.featured ? 'contained' : 'outlined'} 
                    size="large"
                    sx={{ borderRadius: '14px', py: 1.5, fontWeight: 700 }}
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ py: { xs: 8, md: 15 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>The Minds Behind UDT</Typography>
            <Typography variant="h6" sx={{ color: '#64748b', fontSize: { xs: '1rem', md: '1.25rem' }, px: 2 }}>A passionate team committed to revolutionizing digital education.</Typography>
          </Box>
          <Grid container spacing={6}>
            {[
              { name: 'David Chen', role: 'CEO & Founder', bio: 'Visionary leader with 15+ years in EdTech.', img: team1 },
              { name: 'Sarah Jenkins', role: 'Head of Engineering', bio: 'Expert architect specialized in scalable systems.', img: team2 },
              { name: 'Mark Tanaka', role: 'Product Strategy', bio: 'Driving user-centric design and innovative features.', img: team3 }
            ].map((member, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    src={member.img} 
                    sx={{ 
                        width: 240, 
                        height: 240, 
                        mx: 'auto', 
                        mb: 4, 
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                        border: '8px solid #ffffff'
                    }} 
                  />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{member.name}</Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700, mb: 2 }}>{member.role}</Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', px: 2 }}>{member.bio}</Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
                    <IconButton size="small"><TwitterIcon fontSize="small" /></IconButton>
                    <IconButton size="small"><LinkedInIcon fontSize="small" /></IconButton>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 15 }, textAlign: 'center' }}>
        <Paper 
            sx={{ 
                p: { xs: 4, sm: 6, md: 10 }, 
                borderRadius: { xs: '24px', md: '40px' }, 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#ffffff',
                boxShadow: '0 40px 80px -20px rgba(15, 23, 42, 0.4)'
            }}
        >
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' } }}>Ready to Transform?</Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, mb: { xs: 4, md: 6 }, maxWidth: 500, mx: 'auto', fontSize: { xs: '1rem', md: '1.25rem' } }}>
            Join hundreds of institutions already using UDT to deliver world-class education.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/login')}
            sx={{ 
                py: { xs: 1.5, md: 2.5 }, 
                px: { xs: 4, md: 8 }, 
                borderRadius: '16px', 
                bgcolor: '#ffffff', 
                color: '#0f172a', 
                fontWeight: 900,
                fontSize: { xs: '1rem', md: '1.2rem' },
                '&:hover': { bgcolor: '#f1f5f9' }
            }}
          >
            Go to Platform
          </Button>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                UDT.
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.8 }}>
                Crafting the future of educational management with cutting-edge technology and human-centric design.
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton color="inherit"><TwitterIcon /></IconButton>
                <IconButton color="inherit"><GitHubIcon /></IconButton>
                <IconButton color="inherit"><LinkedInIcon /></IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Product</Typography>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Features</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Integrations</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Pricing</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Changelog</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Company</Typography>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>About Us</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Our Team</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Careers</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>Contact</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Subscribe to Updates</Typography>
              <Stack direction="row" spacing={1}>
                <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: 'none' }}>
                  <Box component="input" placeholder="Email Address" sx={{ ml: 1, flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%' }} />
                  <Button variant="contained" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Join</Button>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: { xs: 6, md: 10 }, pt: 8, borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © 2026 UDT Course Manager. All rights reserved. Made by [Your Name/Company].
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
