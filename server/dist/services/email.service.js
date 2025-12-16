"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    async sendWelcomeEmail(email, name) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to Real Taste!',
            html: `
        <h1>Welcome to Real Taste, ${name}!</h1>
        <p>Thank you for joining our community. We're excited to have you on board!</p>
        <p>Start exploring our delicious menu and place your first order.</p>
      `
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendOrderConfirmation(email, order) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Order Confirmation - Real Taste',
            html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <h2>Order Details:</h2>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: $${order.totalPrice}</p>
        <p>Status: ${order.orderStatus}</p>
        <h3>Items:</h3>
        ${order.items.map((item) => `
          <div>
            <p>${item.name} x ${item.quantity}</p>
            <p>Price: $${item.price}</p>
          </div>
        `).join('')}
      `
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendPasswordReset(email, resetToken) {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset - Real Taste',
            html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 10 minutes.</p>
      `
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendOrderStatusUpdate(email, order) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Order Status Update - Real Taste',
            html: `
        <h1>Order Status Update</h1>
        <p>Your order status has been updated!</p>
        <h2>Order Details:</h2>
        <p>Order ID: ${order._id}</p>
        <p>New Status: ${order.orderStatus}</p>
        <p>Updated At: ${new Date(order.updatedAt).toLocaleString()}</p>
      `
        };
        await this.transporter.sendMail(mailOptions);
    }
}
exports.default = new EmailService();
