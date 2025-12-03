const nodemailer = require('nodemailer');
require('dotenv').config(); 
// This is the ONLY place where nodemailer should be configured.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,  // Try this instead of 465
  secure: false,  // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false  // Only for testing
  }
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP configuration error:', error);
  } else {
    console.log('✅ SMTP server is ready to take our messages');
  }
});

/**
 * Sends an email.
 * @param {object} mailOptions - Nodemailer mail options object (from, to, subject, html, etc.)
 * @returns {Promise}
 */
const sendEmail = async (mailOptions) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('SMTP environment variables (SMTP_HOST, EMAIL_USER, EMAIL_PASS) are not configured.');
  }
  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };