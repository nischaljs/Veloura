import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.route';
import brandRoutes from './routes/brand.route';
import categoryRoutes from './routes/category.route';

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

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
