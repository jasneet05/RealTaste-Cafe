"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
class ContactController {
    constructor() {
        // Send contact message
        this.sendMessage = async (req, res, next) => {
            try {
                const { name, email, subject, message } = req.body;
                // Validate required fields
                if (!name || !email || !subject || !message) {
                    return res.status(400).json({
                        success: false,
                        message: 'All fields are required',
                    });
                }
                // Email content for admin
                const adminEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6F4E37;">New Contact Message - Real Taste Café</h2>
          <div style="background: #FFF5E1; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
          <p style="color: #6F4E37;">Please respond to this customer inquiry promptly.</p>
        </div>
      `;
                // Email content for customer
                const customerEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6F4E37;">Thank you for contacting Real Taste Café! ☕</h2>
          <div style="background: #FFF5E1; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p>Dear ${name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p><strong>Your message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px; font-style: italic;">"${message}"</p>
          </div>
          <p style="color: #6F4E37;">Thank you for choosing Real Taste Café!</p>
          <p style="color: #6F4E37;">Best regards,<br>The Real Taste Team</p>
        </div>
      `;
                // Send email to admin
                await (0, sendEmail_1.default)({
                    email: process.env.ADMIN_EMAIL || 'admin@realtastecafe.com',
                    subject: `Contact Form: ${subject}`,
                    message: `Contact from ${name}: ${message}`,
                    html: adminEmailContent,
                });
                // Send confirmation email to customer
                await (0, sendEmail_1.default)({
                    email: email,
                    subject: 'Thank you for contacting Real Taste Café!',
                    message: `Thank you ${name} for contacting us!`,
                    html: customerEmailContent,
                });
                res.status(200).json({
                    success: true,
                    message: 'Message sent successfully! We will get back to you soon.',
                });
            }
            catch (error) {
                console.error('Contact form error:', error);
                next(error);
            }
        };
    }
}
exports.default = new ContactController();
