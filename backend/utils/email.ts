import nodemailer from 'nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';
import logger from './logger';

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY! }),
);

const FROM_EMAIL = 'no-reply@udith.cc';

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text,
    });
  } catch (err: any) {
    logger.warn(`Failed to send email to ${options.to}: ${err.message}`);
  }
};

export const sendVerificationEmail = async (user: any, token: string, host: string) => {
  const url = `http://${host}/api/auth/confirmation/${user.email}/${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Account Verification',
    text: `Hello ${user.username},\n\nPlease verify your account by clicking the link:\n${url}\n\nThank You!`,
  });
};

export const sendPasswordResetEmail = async (user: any, resetCode: string) => {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Code',
    text: `Hello ${user.username},\n\nYour password reset code is: ${resetCode}\n\nThis code will expire in 24 hours.\n\nThank You!`,
  });
};
