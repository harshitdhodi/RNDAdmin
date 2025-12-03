// controllers/msdsController.js
import nodemailer from 'nodemailer';

export const handleMsdsRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message = '',
      subject = '',
      docType = '  ',
      productName = '',
      path = '',
      url = '',
      
      from,
      adminEmail: adminEmailFromBody
    } = req.body || {};

    // Basic validation
    if (!name || !email || !phone || !url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, phone, and url are required.'
      });
    }

    // Prepare email content for admin
    const fullSubject = subject || `New inquiry${productName ? `: ${productName}` : ''}`;
    const plainText = `
New Request Received

Name: ${name}
Email: ${email}
Phone: ${phone}
Product: ${productName}
Path: ${path}
Message: ${message || '—'}
    `.trim();

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', 'Helvetica', sans-serif;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #ffbc90;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h2 {
            margin: 0;
            font-size: 26px;
            font-weight: 600;
            letter-spacing: 1px;
        }
        .subheader {
            background-color: #f8f9fa;
            padding: 20px;
            border-bottom: 3px solid #f5f5f5;
        }
        .subheader h3 {
            margin: 0;
            color: #ff573c;
            font-size: 20px;
            font-weight: 600;
        }
        .content {
            padding: 30px 40px;
            background-color: #ffffff;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .info-table tr {
            border-bottom: 1px solid #e9ecef;
        }
        .info-table tr:last-child {
            border-bottom: none;
        }
        .info-table td {
            padding: 15px 10px;
            font-size: 15px;
            line-height: 1.6;
        }
        .info-table td:first-child {
            font-weight: 600;
            color: #6c757d;
            width: 35%;
        }
        .info-table td:last-child {
            color: #212529;
        }
        .request-type {
            background-color: #fff5f3;
            border-left: 4px solid #f5f5f5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .request-type p {
            margin: 0;
            color: #ff573c;
            font-weight: 600;
            font-size: 14px;
        }
        .divider {
            height: 2px;
            background: #f5f5f5;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 0;
            color: #6c757d;
            font-size: 13px;
        }
        .timestamp {
            text-align: center;
            color: #6c757d;
            font-size: 12px;
            padding: 10px;
            background-color: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://admin.chemtom.com/api/logo/download/headerLogo_1764672964886.webp" alt="Apurva Chemicals PVT LTD" style="height: 50px; margin-bottom: 10px;">
        </div>
        
        <div class="subheader">
            <h3>📄 Document Request Received</h3>
        </div>
        
        <div class="content">
            <p style="color: #495057; margin-bottom: 20px;">A customer has requested product documentation. Please find the request details below:</p>
            
            <div class="request-type">
                <p>🔔 Request Type: MSDS / Product Specification Document</p>
            </div>
            
            <table class="info-table">
                <tr>
                    <td>Requested By:</td>
                    <td>${name}</td>
                </tr>
                <tr>
                    <td>Email Address:</td>
                    <td>${email}</td>
                </tr>
                <tr>
                    <td>Phone Number:</td>
                    <td>${phone}</td>
                </tr>
                <tr>
                    <td>Product Name:</td>
                    <td>${productName}</td>
                </tr>
                <tr>
                    <td>Request Source:</td>
                    <td>${path}</td>
                </tr>
            </table>
            
            <div class="divider"></div>
            
            <p style="color: #495057; font-size: 14px; margin-top: 20px;">
                <strong>Action Required:</strong> Please send the requested MSDS file and/or product specification document to the customer's email address.
            </p>
        </div>
        
        <div class="timestamp">
            <p>Request received on: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from Chemtom.</p>
            <p style="margin-top: 5px;">Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Prefer admin email from body, then env vars
    const adminEmail = adminEmailFromBody || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpUser = process.env.EMAIL_USER;
    const smtpPass = process.env.EMAIL_PASS;

    // Resolve from address: body 'from' -> sender email field -> smtp user
    const fromAddress = from || (process.env.SMTP_FROM || smtpUser) || 'no-reply@example.com';

    const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

    if (smtpConfigured) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || '465', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      // Send admin notification (if admin email resolved)
      if (adminEmail) {
        try {
          await transporter.sendMail({
            from: fromAddress,
            to: adminEmail,
            subject: fullSubject,
            text: plainText,
            html: htmlBody
          });
        } catch (err) {
          console.error('Failed to send admin notification email:', err);
        }
      } else {
        console.warn('Admin email not configured; skipping admin notification.');
      }

      // Prepare acknowledgement email to user
      const companyName = process.env.COMPANY_NAME || 'Our Team';
      const ackSubject = `We received your request${productName ? ` — ${productName}` : ''}`;
      const ackPlain = `
Dear ${name},

Thank you for your request regarding "${productName || 'your inquiry'}".
We have received your request successfully and will contact you as soon as possible.

Summary of your request:
Name: ${name}
Email: ${email}
Phone: ${phone}
Product: ${productName}
Message: ${message || '—'}
Page: ${path || '—'}

Kind regards,
${companyName}
      `.trim();

      const ackHtml = `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5">
          <div style="max-width:600px;margin:0 auto;border:1px solid #e6e6e6;padding:20px;border-radius:8px">
            <h2 style="color:#bf2e2e6;margin-bottom:6px">Request Received</h2>
            <p style="margin-top:0">Dear ${name},</p>
            <p>Thank you for your request regarding <strong>${productName || 'your inquiry'}</strong>. We have received your request successfully and will contact you as soon as possible.</p>

            <div style="background:#fafafa;border:1px solid #eee;padding:12px;border-radius:6px;margin:16px 0">
              <p style="margin:6px 0"><strong>Summary</strong></p>
              <p style="margin:4px 0"><strong>Name:</strong> ${name}</p>
              <p style="margin:4px 0"><strong>Email:</strong> ${email}</p>
              <p style="margin:4px 0"><strong>Phone:</strong> ${phone}</p>
              <p style="margin:4px 0"><strong>Product:</strong> ${productName || '—'}</p>
              <p style="margin:4px 0"><strong>Page:</strong> ${path || '—'}</p>
            </div>

            <p>We appreciate your interest. A member of ${companyName} will reach out to you shortly.</p>

            <p style="margin-top:18px">Kind regards,<br/><strong>${companyName}</strong></p>
            <hr style="border:none;border-top:1px solid #eee;margin:18px 0"/>
            <p style="font-size:12px;color:#777;margin:0">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `;

      // Send acknowledgement to the requester (best-effort)
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: ackSubject,
          text: ackPlain,
          html: ackHtml
        });
      } catch (err) {
        console.error('Failed to send acknowledgement email to user:', err);
      }
    } else {
      // Best-effort fallback: log payload when email not configured
      console.warn('Skipping all email sends - SMTP not configured. Resolved adminEmail:', adminEmail, 'Inquiry:', { name, email, phone, productName, path, message, from: fromAddress });
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you, I will contact you soon'
    });
  } catch (err) {
    console.error('Error in MSDS request handler:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};