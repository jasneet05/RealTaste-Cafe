# 🍴 Real Taste Café - Complete Café Management System

A full-stack MERN application for managing a café business with online ordering, admin dashboard, and customer management.

## 🚀 Features

### Customer Features
- **Browse Menu** - View all food items with images, prices, and ratings
- **Online Ordering** - Add items to cart and place orders for pickup
- **Order Tracking** - Real-time order status updates via email
- **Review System** - Rate and review delivered items
- **User Profiles** - Manage personal information and order history

### Admin Features
- **Dashboard** - Overview of orders, revenue, and recent activity
- **Order Management** - Accept, prepare, and update order status
- **Menu Management** - Add, edit, delete menu items with bulk import
- **Category Management** - Organize menu items by categories
- **User Management** - View and manage customer accounts
- **Email Notifications** - Automatic order confirmations and updates

### Business Features
- **Cash Payment** - Pay at pickup system
- **Phone Integration** - Customer contact numbers stored for order coordination
- **Email System** - Automated notifications for orders and status changes
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React.js** + Vite
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form handling

### Backend
- **Node.js** + Express.js
- **TypeScript** - Type safety
- **MongoDB** + Mongoose - Database
- **JWT** - Authentication
- **NodeMailer** - Email service
- **Multer** - File uploads

## 📋 Prerequisites

- Node.js v16 or higher
- MongoDB Atlas account or local MongoDB
- Gmail account for email service
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd real-taste
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d

# Email Configuration
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password

CLIENT_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📱 Usage

### For Customers
1. **Browse Menu** - Visit the menu page to see available items
2. **Place Order** - Add items to cart and checkout with phone number
3. **Track Order** - Receive email updates on order status
4. **Review Items** - Rate delivered items in your order history

### For Admin
1. **Login** - Use admin credentials to access dashboard
2. **Manage Orders** - View, accept, and update order status
3. **Manage Menu** - Add/edit products and categories
4. **View Analytics** - Monitor sales and customer activity

## 🏪 Business Setup

### Initial Configuration
1. **Admin Account** - Create first admin user via registration
2. **Menu Setup** - Add categories and menu items
3. **Email Setup** - Configure Gmail SMTP for notifications
4. **Shop Details** - Update contact information and location

### Daily Operations
1. **Check Orders** - Monitor new orders in admin dashboard
2. **Update Status** - Mark orders as preparing/ready/delivered
3. **Customer Contact** - Call customers using stored phone numbers
4. **Menu Updates** - Add/remove items based on availability

## 📧 Email Notifications

The system automatically sends emails for:
- **Order Confirmation** - When customer places order
- **Admin Notification** - New order alert with customer details
- **Status Updates** - When order status changes
- **OTP Verification** - For secure order placement

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate app-specific password
3. Use app password in SMTP_PASS environment variable

### Database Setup
1. Create MongoDB Atlas cluster
2. Get connection string
3. Add to MONGODB_URI in .env file

## 📊 System Architecture

```
real-taste/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   └── utils/        # Utilities
│   └── ...
│
└── server/                # Node.js backend
    ├── src/
    │   ├── controllers/  # Route handlers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   └── utils/        # Utilities
    └── ...
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy dist folder to hosting service
3. Update API base URL for production

### Backend (Railway/Render/Heroku)
1. Set environment variables on hosting platform
2. Deploy server code
3. Ensure MongoDB connection is accessible

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for API endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📞 Support

For business setup or technical issues:
- Check the admin dashboard for system status
- Verify email configuration for notifications
- Ensure MongoDB connection is stable
- Contact system administrator for advanced configuration

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built for small café businesses to streamline online ordering and customer management.**