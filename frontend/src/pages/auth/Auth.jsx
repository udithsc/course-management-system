import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Grid, Box, Typography } from '@mui/material';
import axios from 'axios';
import { grey } from '@mui/material/colors';
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
  const [isLoading, setIsLoading] = useState(false);

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
    // if (authMessage) toast(authMessage);
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
    if (isForgotPassword) setIsSignUp(false);
  };

  const switchForgotPasswordMode = () => {
    setIsForgotPassword((state) => !state);
  };

  return (
    <Box
      component="div"
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: grey[200],
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          width: 450,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'white',
          p: 3,
          pt: 5,
          mb: 3
        }}
      >
        <img src={logo} alt="Logo" width={100} />
        <Typography component="h1" variant="h5">
          {isSignUp ? 'Sign Up' : 'Sign in'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2} sx={{ display: 'inline-flex' }}>
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
                    type="text"
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
                    type="text"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    type="text"
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
                  autoComplete="new-password"
                />
              </Grid>
            )}
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {getMainBtnText()}
          </Button>
          {/* <Grid container justifyContent="space-between">
            {!isSignUp && !isForgotPassword && (
              <Grid item>
                <Button size="small" onClick={switchForgotPasswordMode}>
                  Forgot Password?
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button size="small" onClick={switchSignInMode}>
                {getSubBtnText()}
              </Button>
            </Grid>
          </Grid> */}
        </Box>
      </Box>
      <Copyright />

      {notify.isOpen && <Notification notify={notify} closeNotification={closeNotification} />}
    </Box>
  );
}
