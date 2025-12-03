const Contact = require('../model/contactForm');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",   // use .com only if you are using Zoho.com, not India region
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,   // yourname@yourdomain.com
    pass: process.env.EMAIL_PASS,   // Zoho App Password (not normal password)
  },
});


exports.submitContact = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      organisation,
      department,
      address,
      country,
      phone,
      email,
      message,
      needCallback,
      verification,
    } = req.body;

    // Verify the captcha
    if (verification.toUpperCase() !== 'EDLED') {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Create contact entry
    const contact = await Contact.create({
      firstName,
      lastName,
      organisation,
      department,
      address,
      country,
      phone,
      email,
      message,
      needCallback,
    });

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_FROM,
      subject: 'New Contact Form Submission',
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', 'Helvetica', sans-serif;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .header {
       
            padding-top:20px;
            text-align: center;
        }
        .header img {
            height: 55px;
            margin-bottom: 12px;
        }
        .header h2 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .subheader {
            background-color: #fff8f5;
            padding: 5px;
            text-align: center;
            border-bottom: 3px solid #ffe8e0;
        }
        .subheader h3 {
            margin: 0;
            color: #e64a19;
            font-size: 22px;
            font-weight: 600;
        }
        .content {
            padding: 0px 35px;
            background-color: #ffffff;
        }
        .intro-text {
            color: #444;
            font-size: 16px;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
        }
        .info-table tr {
            border-bottom: 1px solid #eee;
        }
        .info-table tr:last-child {
            border-bottom: none;
        }
        .info-table td {
            padding: 14px 10px;
            font-size: 15px;
            vertical-align: top;
        }
        .info-table td:first-child {
            font-weight: 600;
            color: #666;
            width: 35%;
        }
        .info-table td:last-child {
            color: #222;
        }
        .message-box {
            background-color: #f9f9f9;
            border-left: 4px solid #ff8c67;
            padding: 18px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 15px;
            line-height: 1.7;
            color: #333;
        }
        .highlight {
            background-color: #fff2ed;
            border-left: 5px solid #ff573c;
            padding: 16px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .highlight p {
            margin: 0;
            font-weight: 600;
            color: #d84315;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #ddd, transparent);
            margin: 30px 0;
        }
        .timestamp {
            text-align: center;
            background-color: #fafafa;
            padding: 12px;
            color: #777;
            font-size: 13px;
            border-top: 1px solid #eaeaea;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 25px 20px;
            text-align: center;
            color: #6c757d;
            font-size: 13px;
            border-top: 1px solid #dee2e6;
        }
        .footer a {
            color: #ff573c;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">

        <!-- Header with Logo & Gradient -->
        <div class="header">
            <img src="https://admin.chemtom.com/api/logo/download/headerLogo_1764672964886.webp" alt="Apurva Chemicals PVT LTD">
           
        </div>

        <!-- Subheader -->
        <div class="subheader">
           
        </div>

        <!-- Main Content -->
        <div class="content">
            <p class="intro-text">
                A new inquiry has been submitted through the contact form. Please find the details below:
            </p>

            <!-- Highlight Callback Request -->
            ${needCallback ? `
            <div class="highlight">
                <p>Callback Requested – Customer expects a call back!</p>
            </div>` : ''}

            <!-- Details Table -->
            <table class="info-table">
                <tr>
                    <td>Full Name:</td>
                    <td>${firstName} ${lastName}</td>
                </tr>
                <tr>
                    <td>Organisation:</td>
                    <td>${organisation || '—'}</td>
                </tr>
                <tr>
                    <td>Department:</td>
                    <td>${department || 'Not specified'}</td>
                </tr>
                <tr>
                    <td>Address:</td>
                    <td>${address || '—'}</td>
                </tr>
                
                <tr>
                    <td>Phone:</td>
                    <td>${phone || '—'}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td><a href="mailto:${email}" style="color:#ff573c;">${email}</a></td>
                </tr>
               
            </table>

            <div class="divider"></div>

            <!-- Message Section -->
            <p style="margin: 0 0 10px 0; color:#555; font-weight:600;">Message:</p>
            <div class="message-box">
                ${message ? message.replace(/\n/g, '<br>') : '<em>No message provided</em>'}
            </div>

            <p style="color:#e64a19; font-weight:600; margin-top:25px;">
                Action Required: Review the inquiry and respond to the customer at your earliest convenience.
            </p>
        </div>

        <!-- Timestamp -->
        <div class="timestamp">
            Submission received on: ${new Date().toLocaleString()}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This is an automated notification from Chemtom Contact Form.</p>
            <p>Please do not reply to this email. For support, contact your web administrator.</p>
        </div>
    </div>
</body>
</html>
      `,
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Error submitting contact form' });
  }
};