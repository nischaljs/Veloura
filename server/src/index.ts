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

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "*",
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

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
