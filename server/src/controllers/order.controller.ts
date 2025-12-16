import { Request, Response, NextFunction } from 'express';
import { Order, Product, User } from '../models';
import BaseController from './base.controller';
import sendEmail from '../utils/sendEmail';

class OrderController extends BaseController {
  constructor() {
    super(Order);
  }

  // Create new order
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { items, paymentMethod, mobileNumber, specialInstructions, totalAmount } = req.body;


      // Verify products and calculate total
      let calculatedTotal = 0;
      for (const item of items) {
        const product = await Product.findById(item.menuItem);
        if (!product) {
          res.status(404).json({
            success: false,
            message: `Product not found: ${item.menuItem}`
          });
          return;
        }

        // Stock check removed - stock is now optional

        calculatedTotal += product.price * item.quantity;
      }

      // Create order (takeaway - no shipping address needed)
      const order = await Order.create({
        user: req.user?.id,
        items,
        paymentMethod,
        mobileNumber,
        specialInstructions,
        totalAmount: totalAmount || calculatedTotal
      });

      // Stock update removed - stock is now optional

      // Send order confirmation email and admin notification
      try {
        const user = await User.findById(req.user?.id);
        if (user) {
          // Send confirmation to customer
          await sendEmail({
            email: user.email,
            subject: 'Order Confirmation - Real Taste',
            html: `
              <h2>Order Confirmation</h2>
              <p>Hi ${user.name},</p>
              <p>Thank you for your takeaway order! Your order #${String(order._id).slice(-6)} has been received.</p>
              <p><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Pickup Location:</strong> UpalHeri, Rajpura, Punjab 140401</p>
              <p>We'll call you on ${mobileNumber} when your order is ready for pickup.</p>
              <p>Best regards,<br>Real Taste Team</p>
            `,
            message: `Order #${String(order._id).slice(-6)} confirmed. Total: ₹${order.totalAmount.toFixed(2)}`
          });
          
          // Send notification to admin
          const adminEmail = 'sparmindersingh873@gmail.com';
          if (adminEmail) {
            const populatedOrder = await Order.findById(order._id).populate('items.menuItem');
            if (populatedOrder) {
              await sendEmail({
                email: adminEmail,
                subject: 'New Order Received - Real Taste',
                html: `
                  <h2>New Order Received!</h2>
                  <h3>Customer Details:</h3>
                  <p>Name: ${user.name}</p>
                  <p>Email: ${user.email}</p>
                  <p>Mobile: ${mobileNumber || 'Not provided'}</p>
                  
                  <h3>Order Details:</h3>
                  <p>Order ID: #${String(order._id).slice(-6)}</p>
                  <p>Total Amount: ₹${order.totalAmount}</p>
                  <p>Payment Method: ${paymentMethod}</p>
                  <p>Status: ${order.status}</p>
                  <p>Order Time: ${new Date(order.createdAt).toLocaleString()}</p>
                  
                  ${specialInstructions ? `<p>Special Instructions: ${specialInstructions}</p>` : ''}
                  
                  <h3>Items Ordered:</h3>
                  ${populatedOrder.items.map((item: any) => `
                    <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;">
                      <p><strong>Item:</strong> ${item.menuItem?.name || 'Unknown Item'}</p>
                      <p><strong>Quantity:</strong> ${item.quantity}</p>
                      <p><strong>Price:</strong> ₹${item.price}</p>
                      <p><strong>Total:</strong> ₹${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  `).join('')}
                `,
                message: `New order #${String(order._id).slice(-6)} received from ${user.name}`
              });
            }
          }
        }
      } catch (emailError) {
        console.error('Failed to send order emails:', emailError);
      }

      // Return populated order data
      const populatedOrder = await Order.findById(order._id)
        .populate('items.menuItem')
        .populate('user', 'name email');

      res.status(201).json({
        success: true,
        data: populatedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user orders
  getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({ user: req.user?.id })
        .populate('items.menuItem')
        .populate('user', 'name email')
        .sort('-createdAt');

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all orders (admin)
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find()
        .populate('items.menuItem', 'name image price')
        .populate('user', 'name email')
        .sort('-createdAt');



      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  };

  // Update order status
  updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      ).populate('user', 'name email')
       .populate('items.menuItem', 'name image price');

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
            'Ready': 'Your order is ready for pickup/delivery',
            'Delivered': 'Your order has been delivered',
            'Cancelled': 'Your order has been cancelled'
          };

          await sendEmail({
            email: user.email,
            subject: `Order Update - Real Taste`,
            html: `
              <h2>Order Status Update</h2>
              <p>Hi ${user.name},</p>
              <p>Your order #${String(order._id).slice(-6)} status has been updated.</p>
              <p><strong>New Status:</strong> ${status}</p>
              <p>${statusMessages[status as keyof typeof statusMessages] || 'Status updated'}</p>
              <p>Best regards,<br>Real Taste Team</p>
            `,
            message: `Order #${String(order._id).slice(-6)} status: ${status}`
          });
        }
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }

      // Return fully populated order
      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.menuItem', 'name image price');

      res.status(200).json({
        success: true,
        data: populatedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  // Mark order as paid
  markOrderAsPaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        updateTime: req.body.update_time,
        email: req.body.email_address
      };

      const updatedOrder = await order.save();

      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  // Get single order by ID
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('items.menuItem')
        .populate('user', 'name email');

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if user owns the order or is admin
      if (order.user._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this order'
        });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  // Get order statistics
  getOrderStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalOrders = await Order.countDocuments();
      const totalSales = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);

      const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            orders: { $sum: 1 },
            sales: { $sum: '$totalAmount' }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalOrders,
          totalSales: totalSales[0]?.total || 0,
          dailyOrders
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();