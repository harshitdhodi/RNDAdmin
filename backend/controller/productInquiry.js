require('dotenv').config();
const Inquiry = require('../model/productInquiry');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in',    // or smtp.zoho.eu if you're in Europe
  port: 465,                // 587 for TLS, 465 for SSL
  secure: true,            // true only if port 465
  auth: {
    user: process.env.EMAIL_USER || 'sales@chemtom.com',        // e.g., inquiry@yourdomain.com
    pass: process.env.EMAIL_PASS || '3itpmNuTzkHc'        // ← your 12-character app password
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log('Environment Variables', process.env.EMAIL_USER, process.env.EMAIL_PASS);
// Verify on startup
transporter.verify((error, success) => {
  if (error) console.error('SMTP Error:', error);
  else console.log('Zoho SMTP Ready');
});

exports.createInquiry = async (req, res) => {
 
  try {
    // Verify email configuration first
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
      throw new Error('Email configuration is missing');
    }

    const newInquiry = new Inquiry(req.body); 
    await newInquiry.save();
console.log('New Inquiry Saved:', newInquiry);
    // HTML Email Template
    const emailHTML = `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Inquiry</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            max-width: 600px;
            margin: 20px auto;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center; /* Center the heading */
        }
        p {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
        }
        .field {
            font-weight: bold;
            color: #333;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
            text-align: center;
        }
        .centered-text {
            text-align: center; /* Center text */
            margin: 20px 0; /* Add margin above and below */
            font-size: 20px; /* Adjust font size as needed */
            color: #333; /* Text color */
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>OSTECH</h2>
        <p class="centered-text">New Inquiry!!</p>
        <p><span class="field">Name:</span> ${newInquiry.name}</p>
        <p><span class="field">Email:</span> ${newInquiry.email}</p>
        <p><span class="field">Phone:</span> ${newInquiry.phone}</p>
        <p><span class="field">Message:</span> ${newInquiry.message}</p>
        
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body> 
</html>
        `;

const mailOptions = {
  from: `"Website Inquiry" <${process.env.EMAIL_USER}>`,  // Safe & verified sender
  to: process.env.EMAIL_FROM,
  replyTo: newInquiry.email,   // User gets replies
  subject: `New Inquiry from ${newInquiry.name}`,
  html: emailHTML
};
        

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(201).json({ success: true, data: newInquiry });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get counts and data based on field presence
exports.getCountsAndData = async (req, res) => {
  try {
    const totalCount = await Inquiry.countDocuments();

    const countWithFields = await Inquiry.countDocuments({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const countWithoutFields = await Inquiry.countDocuments({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const dataWithFields = await Inquiry.find({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });
  
    const dataWithoutFields = await Inquiry.find({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const inquiries = await Inquiry.find();

    res.status(200).json({  
      totalCount,
      countWithFields,
      countWithoutFields,
      dataWithFields,
      dataWithoutFields,
      inquiries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  const { id } = req.query;
  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(id);
    if (!deletedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
