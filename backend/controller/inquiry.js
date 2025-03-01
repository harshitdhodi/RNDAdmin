const Inquiry = require('../model/inquiry');
const axios = require('axios');
const nodemailer = require('nodemailer');

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find();
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get inquiry by ID
exports.getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.query.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const inquiryData = {
            ...req.body,
            needCallback: req.body.needCallback || false,
            status: req.body.status || "New Inquiry",
            source: req.body.source || "",
        };

        const inquiry = new Inquiry(inquiryData);
        await inquiry.save();

        console.log("Owner Email:", inquiryData.ownerEmail || "Not provided");

        // Fetch SMTP configuration
        const { data: smtpResponse } = await axios.get("http://localhost:3028/api/smtp/get");
        const smtpConfig = smtpResponse.data[0];

        if (!smtpConfig || !smtpConfig.host) {
            throw new Error("SMTP configuration missing");
        }

        // Fetch email templates (only for customer template now)
        const { data: emailTemplateResponse } = await axios.get("http://localhost:3028/api/template/get");
        const emailTemplates = emailTemplateResponse.data;

        if (!emailTemplates || emailTemplates.length === 0) {
            throw new Error("Email templates missing");
        }

        // Static owner template
        const ownerTemplate = {
            subject: "New Inquiry Received",
            body: `
                <h1>New Inquiry Notification</h1>
                <p>Hello,</p>
                <p>A new inquiry has been received from [First Name].</p>
                <p>Please check the details in your dashboard.</p>
                <p>Regards,<br>Your Business Team</p>
            `
        };

        const customerTemplate = emailTemplates.find((template) => template.name === "Auto Thank You");

        if (!customerTemplate) {
            throw new Error("Required customer email template not found");
        }

        // **Set Default Owner Email if Not Provided**
        const ownerEmail = inquiryData.ownerEmail || smtpConfig.name; // Fallback to SMTP user email

        // Create email transporter
        const transporter = nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port || 587,
            secure: smtpConfig.isSSL,
            auth: {
                user: smtpConfig.name,
                pass: smtpConfig.password,
            },
        });

        // **Send Email to Owner**
        if (ownerEmail) {
            const ownerMailOptions = {
                from: `"Your Business Name" <${smtpConfig.name}>`,
                to: ownerEmail,
                subject: ownerTemplate.subject,
                html: ownerTemplate.body.replace("[First Name]", inquiryData.firstName || "Customer"),
                replyTo: inquiryData.email || smtpConfig.name, // Allow owner to reply
            };

            try {
                await transporter.sendMail(ownerMailOptions);
                console.log("Owner Email Sent Successfully to:", ownerEmail);
            } catch (error) {
                console.error("Error Sending Owner Email:", error);
            }
        } else {
            console.warn("Owner email is missing, skipping owner email notification.");
        }

        // **Send Email to Customer**
        if (inquiryData.email) {
            const customerMailOptions = {
                from: `"Your Business Name" <${smtpConfig.name}>`,
                to: inquiryData.email,
                subject: customerTemplate.subject,
                html: customerTemplate.body.replace("[First Name]", inquiryData.customerName || "Customer"),
            };

            try {
                await transporter.sendMail(customerMailOptions);
                console.log("Customer Email Sent Successfully to:", inquiryData.email);
            } catch (error) {
                console.error("Error Sending Customer Email:", error);
            }
        } else {
            console.warn("Customer email is missing, skipping customer email notification.");
        }

        res.status(201).json({ message: "Inquiry created and emails sent successfully", inquiry });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};


// Update inquiry by ID
exports.updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(req.query.id, req.body, { new: true });
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete inquiry by ID
exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.query.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.status(200).json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTodayInquiries = async (req, res) => {
    try {
        // Get the start and end of the current day
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set to 12:00:00 AM
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set to 11:59:59 PM
        console.log(startOfDay , endOfDay)
        // Fetch inquiries created today
        const todayInquiries = await Inquiry.find({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        res.status(200).json(todayInquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

