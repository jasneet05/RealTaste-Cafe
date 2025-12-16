import express from 'express';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import categoryRoutes from './category.routes';
import adminSettingsRoutes from './admin-settings.routes';
import settingsRoutes from './settings.routes';
import otpRoutes from './otp.routes';
import bulkRoutes from './bulk.routes';

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/admin/settings', adminSettingsRoutes);
router.use('/api/settings', settingsRoutes);
router.use('/api/otp', otpRoutes);
router.use('/api/bulk', bulkRoutes);

export default router;
