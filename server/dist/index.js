"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const middleware_1 = require("./config/middleware");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, db_1.default)();
// Basic Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static folder for uploads
app.use('/uploads', express_1.default.static('uploads'));
// Configure rate limiting and compression
(0, middleware_1.configureMiddleware)(app);
// Logger
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Real Taste API' });
});
// Import all routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const simple_order_routes_1 = __importDefault(require("./routes/simple-order.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const bulk_routes_1 = __importDefault(require("./routes/bulk.routes"));
const admin_settings_routes_1 = __importDefault(require("./routes/admin-settings.routes"));
// Mount all API routes
app.use('/api/users', user_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/cart', cart_routes_1.default);
app.use('/api/orders', simple_order_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/contact', contact_routes_1.default);
app.use('/api/otp', otp_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use('/api/bulk', bulk_routes_1.default);
app.use('/api/admin/settings', admin_settings_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
