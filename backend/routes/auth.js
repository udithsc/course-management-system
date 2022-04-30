const router = require('express').Router();
const bcrypt = require('bcryptjs');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Joi = require('joi');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');
const { User, validateModel } = require('../models/user.model');
const { Token } = require('../models/token.model');

router.post('/login', validate(validateLogin), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('User not found.');

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).send('Login failed');

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.token = refreshToken;
    await user.save();

    logger.info(`login|${user.username}`);

    return res.json({
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.send(error.message);
  }
});

function validateLogin(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.object().keys(schema).validate(user);
}

router.post('/forgotPassword', async (req, res) => {
  const validationKey = Math.random().toString(36).substring(7);
  const password = await bcrypt.hash(validationKey, 10);

  // TODO validate email
  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    { $set: { password } }
  );

  if (!user) return res.send('user not found');
  // return res.send(validationKey);

  const transporter = nodemailer.createTransport(
    nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY })
  );

  const mailOptions = {
    from: 'no-reply@udith.cc',
    to: user.email,
    subject: 'Account Verification Link',
    text: `Hello ${user.username},  
              
              'Your validation key for account password reset is ${validationKey}            
               
              Thank You!`
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(`forgot_password|${user.username}|${info}`);

  return res.json(
    `A verification code has been sent to ${user.email}. It will be expire after one day. If you not get verification Email click on resend token.`
  );
});

router.post('/changePassword', [auth], async (req, res) => {
  let user = await User.findOne(req.user.id);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.send(`password doesn't match`);

  const password = await bcrypt.hash(req.body.newPassword, 10);

  user.password = password;
  user = user.save();

  logger.info(`password_changed|${user.username}`);

  return res.send('password changes successfully');
});

router.get('/tokens/:token', [auth], async (req, res) => {
  const token = req.params.token;
  if (!token) return res.status(401).send('token not found');

  let user = await User.findOne({ token });
  if (!user) return res.status(400).send('user not found');

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error) => {
    if (error) return res.status(403).send(error.message);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.token = refreshToken;
    user = user.save();
    return res.json({
      accessToken,
      refreshToken
    });
  });
});

router.post('/signup', validate(validateModel), async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const { username, email, firstName, lastName, mobile } = req.body;

    let user = new User({
      username,
      email,
      firstName,
      lastName,
      mobile,
      password
    });

    user = await user.save();

    let token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString('hex')
    });
    token = await token.save();

    const transporter = nodemailer.createTransport(
      nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY })
    );

    const mailOptions = {
      from: 'no-reply@udith.cc',
      to: user.email,
      subject: 'Account Verification',
      text: `Hello ${user.username},
              Please verify your account by clicking the link: http://${req.headers.host}/users/confirmation/${user.email}/${token.token}

              Thank You!`
    };

    const info = await transporter.sendMail(mailOptions);

    return res.send(
      `A verification email has been sent to ${user.email}. It will be expire after one day. If you not get verification Email click on resend token.`
    );
  } catch (error) {
    let message = error.message;

    switch (error.code) {
      case 11000:
        message = 'username already taken';
        break;

      default:
        break;
    }
    return res.send(message);
  }
});

router.get('/confirmation/:email/:token', [auth], async (req, res) => {
  const token = await Token.findOne({ token: req.params.token });
  if (!token)
    return res
      .status(404)
      .send(
        'Your verification link may have expired. Please click on resend for verify your Email.'
      );

  let user = await User.findOne({
    _id: token._userId,
    email: req.params.email
  });

  if (!user) return res.res.status(404).send('user not found');
  if (user.isVerified)
    return res.send('User has been already verified. Please Login');

  user.isVerified = true;
  user = await user.save();

  return res.send('Your account has been successfully verified');
});

router.get('/resendLink/:email', [auth], async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user)
    return res.send(
      'We were unable to find a user with that email. Make sure your Email is correct!'
    );
  if (!user.isVerified)
    return res.send('This account has been already verified. Please log in.');

  let token = new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString('hex')
  });

  token = await token.save();

  const transporter = nodemailer.createTransport(
    nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY })
  );

  const mailOptions = {
    from: 'no-reply@udith.cc',
    to: user.email,
    subject: 'Account Verification',
    text: `Hello ${req.body.username},
               
              Please verify your account by clicking the link: http://${req.headers.host}/users/confirmation/${user.email}/${token.token}
      
              Thank You!`
  };

  const info = await transporter.sendMail(mailOptions);

  return res.send(
    `A verification email has been sent to ${user.email}. It will be expire after one day. If you not get verification Email click on resend token.`
  );
});

module.exports = router;
