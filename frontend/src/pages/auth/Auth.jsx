import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Paper, InputAdornment, IconButton, Grid, Divider, Container } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Phone } from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import Notification from '../../components/ui/Notification';
import {
  selectNotification,
  closeNotification,
  signup,
  login,
  selectAccessToken,
  selectSignUpStatus
} from '../../store/auth';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useSelector(selectNotification);
  const token = useSelector(selectAccessToken);
  const isSignupSuccess = useSelector(selectSignUpStatus);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('access-token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      navigate('/dashboard');
    }
    if (isSignupSuccess) setIsSignUp(false); // smoothly go back to login instead of navigating via router forcefully
  }, [token, isSignupSuccess, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (isSignUp) {
      return dispatch(
        signup({
          username: data.get('username'),
          password: data.get('password'),
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          mobile: data.get('mobile')
        })
      );
    }

    dispatch(
      login({
        email: data.get('email'),
        password: data.get('password')
      })
    );
  };

  const toggleAuthMode = () => setIsSignUp(!isSignUp);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        background: '#f3f4f6',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0) 70%)',
          zIndex: 0
        }}
      />
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
          zIndex: 0
        }}
      />

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          elevation={24}
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: 1000,
            minHeight: 600,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            bgcolor: 'background.paper'
          }}
        >
          {/* Left Side - Graphic (Hidden on mobile) */}
          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 6,
              background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
              color: 'white',
              position: 'relative'
            }}
          >
            <Box sx={{ zIndex: 1, textAlign: 'left', width: '100%' }}>
              <Typography variant="h2" fontWeight={800} gutterBottom sx={{ lineHeight: 1.1 }}>
                UDT <br /> Course Manager.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 300, opacity: 0.9, mt: 2 }}>
                Empowering education through seamless administration and immersive learning experiences.
              </Typography>
            </Box>
            
            {/* Abstract visual art */}
            <Box
              sx={{
                position: 'absolute',
                right: -50,
                bottom: -50,
                width: 300,
                height: 300,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: -20,
                top: -20,
                width: 150,
                height: 150,
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                backdropFilter: 'blur(5px)'
              }}
            />
          </Box>

          {/* Right Side - Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Typography>
            </Box>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {isSignUp ? 'Enter your details to join us today.' : 'Please enter your credentials to login.'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {isSignUp && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <TextField
                        name="firstName"
                        required
                        fullWidth
                        label="First Name"
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="lastName"
                        required
                        fullWidth
                        label="Last Name"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="username"
                        required
                        fullWidth
                        label="Username"
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        name="mobile"
                        required
                        fullWidth
                        label="Phone Number"
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                </motion.div>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus={!isSignUp}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  py: 1.5, 
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.23)'
                  }
                }}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary">Or</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Button 
                  onClick={toggleAuthMode} 
                  variant="text" 
                  disableRipple
                  sx={{ 
                    fontWeight: 700, p: 0, minWidth: 'auto', 
                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } 
                  }}
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
    </Box>
  );
}
