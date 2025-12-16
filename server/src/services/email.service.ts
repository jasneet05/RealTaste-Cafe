import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
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

  async sendOrderConfirmation(email: string, order: any): Promise<void> {
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
        ${order.items.map((item: any) => `
          <div>
            <p>${item.name} x ${item.quantity}</p>
            <p>Price: $${item.price}</p>
          </div>
        `).join('')}
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
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

  async sendOrderStatusUpdate(email: string, order: any): Promise<void> {
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

  async sendAdminOrderNotification(order: any, user: any): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: adminEmail,
      subject: 'New Order Received - Real Taste',
      html: `
        <h1>New Order Received!</h1>
        <h2>Customer Details:</h2>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Mobile: ${order.mobileNumber || 'Not provided'}</p>
        
        <h2>Order Details:</h2>
        <p>Order ID: #${String(order._id).slice(-6)}</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <p>Payment Method: ${order.paymentMethod}</p>
        <p>Status: ${order.status}</p>
        <p>Order Time: ${new Date(order.createdAt).toLocaleString()}</p>
        
        ${order.specialInstructions ? `<p>Special Instructions: ${order.specialInstructions}</p>` : ''}
        
        <h3>Items Ordered:</h3>
        ${order.items.map((item: any) => `
          <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;">
            <p><strong>Item:</strong> ${item.menuItem?.name || 'Unknown Item'}</p>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <p><strong>Price:</strong> ₹${item.price}</p>
            <p><strong>Total:</strong> ₹${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        `).join('')}
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
