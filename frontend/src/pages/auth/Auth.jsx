import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, Typography, Paper, Divider } from '@mui/material';
import axios from 'axios';
import logo from '../../resources/images/logo.png';
import Notification from '../../components/ui/Notification';
import Copyright from '../../components/layout/Copyright';
import {
  selectNotification,
  showNotification,
  closeNotification,
  signup,
  login,
  selectAccessToken,
  selectSignUpStatus
} from '../../store/auth';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useSelector(selectNotification);
  const token = useSelector(selectAccessToken);
  const isSignupSuccess = useSelector(selectSignUpStatus);

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

  const getMainBtnText = () => {
    if (isSignUp) return 'Sign Up';
    if (isForgotPassword) return 'Reset Password';
    return 'Sign In';
  };

  const getSubBtnText = () => {
    if (isSignUp) return 'Already have an account? Sign in';
    if (isForgotPassword) return 'Back to Sign in';
    return `Don't have an account? Sign Up`;
  };

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('access-token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      navigate('/');
    }

    if (isSignupSuccess) navigate('/login');
  }, [token, isSignupSuccess]);

  const switchSignInMode = () => {
    setIsSignUp((state) => !state);
    setIsForgotPassword(false);
  };

  const switchForgotPasswordMode = () => {
    setIsForgotPassword((state) => !state);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', width: '100vw' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(79, 70, 229, 0.8), rgba(16, 185, 129, 0.6))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            p: 4
          }}
        >
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Welcome to Skilgloo
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: '600px', mb: 4, fontWeight: 300 }}>
            The ultimate modern platform to manage courses, students, and curriculum seamlessly.
          </Typography>
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, bgcolor: 'background.default' }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '450px'
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <img src={logo} alt="Logo" width={80} style={{ marginBottom: '16px' }} />
            <Typography component="h1" variant="h4" fontWeight="bold" color="text.primary">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {isSignUp ? 'Join us today to get started' : 'Sign in to access your dashboard'}
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="username"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="mobile"
                      label="Mobile"
                      name="mobile"
                      type="tel"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </Grid>
              {!isForgotPassword && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1.1rem' }}
            >
              {getMainBtnText()}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              {!isSignUp && !isForgotPassword && (
                <Grid item>
                  <Button size="small" onClick={switchForgotPasswordMode} sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Forgot password?
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button size="small" onClick={switchSignInMode} sx={{ textTransform: 'none', fontWeight: 600 }}>
                  {getSubBtnText()}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', pb: 2 }}>
          <Copyright />
        </Box>
      </Grid>
      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
    </Grid>
  );
}
