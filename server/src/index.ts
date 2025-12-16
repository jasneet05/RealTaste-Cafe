import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db';
import { configureMiddleware } from './config/middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();

// Connect to MongoDB
connectDB();

// Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Configure rate limiting and compression
configureMiddleware(app);

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Real Taste API' });
});

// Import all routes
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/simple-order.routes';
import categoryRoutes from './routes/category.routes';
import contactRoutes from './routes/contact.routes';
import otpRoutes from './routes/otp.routes';
import newSettingsRoutes from './routes/settings.routes';
import bulkRoutes from './routes/bulk.routes';
import adminSettingsRoutes from './routes/admin-settings.routes';

// Mount all API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/settings', newSettingsRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
