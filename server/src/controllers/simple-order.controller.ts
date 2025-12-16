import { Request, Response } from 'express';
import { Order, Product, User } from '../models';
import sendEmail from '../utils/sendEmail';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

class SimpleOrderController {
  // Create new order - simplified
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { items, totalAmount, mobileNumber, specialInstructions, paymentMethod } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Items are required'
        });
      }

      if (!totalAmount || totalAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Total amount is required'
        });
      }

      // Create order without complex validation
      const orderData = {
        user: req.user?.id,
        items: items.map(item => ({
          menuItem: item.menuItem,
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        totalAmount: Number(totalAmount),
        status: 'Pending',
        paymentMethod: paymentMethod || 'Cash',
        paymentStatus: 'Pending',
        mobileNumber,
        specialInstructions
      };

      const order = await Order.create(orderData);
      
      // Send email notifications
      try {
        const user = await User.findById(req.user?.id);
        if (user) {
          // Send confirmation to customer
          await sendEmail({
            email: user.email,
            subject: 'Order Confirmation - Real Taste Café',
            html: `
              <h2>Order Confirmation</h2>
              <p>Hi ${user.name},</p>
              <p>Thank you for your order! Order #${String(order._id).slice(-6)} has been received.</p>
              <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p>We'll call you on ${mobileNumber} when ready for pickup.</p>
              <p>Best regards,<br>Real Taste Café Team</p>
            `,
            message: `Order #${String(order._id).slice(-6)} confirmed. Total: ₹${order.totalAmount}`
          });
          
          // Send notification to admin
          await sendEmail({
            email: 'sparmindersingh873@gmail.com',
            subject: 'New Order Received - Real Taste Café',
            html: `
              <h2>New Order Received!</h2>
              <h3>Customer Details:</h3>
              <p>Name: ${user.name}</p>
              <p>Email: ${user.email}</p>
              <p>Mobile: ${mobileNumber || 'Not provided'}</p>
              
              <h3>Order Details:</h3>
              <p>Order ID: #${String(order._id).slice(-6)}</p>
              <p>Total Amount: ₹${order.totalAmount}</p>
              <p>Payment Method: ${orderData.paymentMethod}</p>
              <p>Status: ${order.status}</p>
              <p>Order Time: ${new Date().toLocaleString()}</p>
              
              ${specialInstructions ? `<p>Special Instructions: ${specialInstructions}</p>` : ''}
            `,
            message: `New order #${String(order._id).slice(-6)} received from ${user.name}`
          });
        }
      } catch (emailError) {
        console.error('Failed to send order emails:', emailError);
      }
      
      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order'
      });
    }
  };

  // Get user orders
  getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
      const orders = await Order.find({ user: req.user?.id })
        .populate('items.menuItem', 'name price image images')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  };

  // Get all orders (admin)
  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.menuItem', 'name price image images')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  };

  // Get single order
  getById = async (req: AuthRequest, res: Response) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.menuItem', 'name price image images');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order'
      });
    }
  };

  // Update order status
  updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate('user', 'name email')
       .populate('items.menuItem', 'name price image');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Send status update email
      try {
        const user = order.user as any;
        if (user && user.email) {
          const statusMessages = {
            'Preparing': 'Your order is being prepared',
            'Ready': 'Your order is ready for pickup',
            'Delivered': 'Your order has been delivered',
            'Cancelled': 'Your order has been cancelled'
          };

          await sendEmail({
            email: user.email,
            subject: `Order Update - Real Taste Café`,
            html: `
              <h2>Order Status Update</h2>
              <p>Hi ${user.name},</p>
              <p>Your order #${String(order._id).slice(-6)} status has been updated.</p>
              <p><strong>New Status:</strong> ${status}</p>
              <p>${statusMessages[status as keyof typeof statusMessages] || 'Status updated'}</p>
              <p>Best regards,<br>Real Taste Café Team</p>
            `,
            message: `Order #${String(order._id).slice(-6)} status: ${status}`
          });
        }
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status'
      });
    }
  };
}

export default new SimpleOrderController();