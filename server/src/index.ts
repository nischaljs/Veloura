import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.route';
import brandRoutes from './routes/brand.route';
import categoryRoutes from './routes/category.route';
import productRoutes from './routes/product.route';
import cartRoutes from './routes/cart.route';
import wishlistRoutes from './routes/wishlist.route';
import couponRoutes from './routes/coupon.route';
import orderRoutes from './routes/order.route';
import reviewRoutes from './routes/review.route';
import searchRoutes from './routes/search.route';
import shippingRoutes from './routes/shipping.route';
import notificationRoutes from './routes/notification.route';
import userRoutes from './routes/user.route';
import vendorRoutes from './routes/vendor.route';
import adminRoutes from './routes/admin.route';
import paymentRoutes from './routes/payment.route';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
}; 

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Serve static files from public folder
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Global error handler (should be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




