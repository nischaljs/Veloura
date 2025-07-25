import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    'public/images/categories',
    'public/images/products',
    'public/images/users',
    'public/images/banners'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirs();
    
    // Determine destination based on route
    let uploadPath = 'public/images/';
    
    if (req.route?.path === '/banner') {
      uploadPath += 'banners/';
    } else if (req.route?.path?.includes('/categories')) {
      uploadPath += 'categories/';
    } else if (req.route?.path?.includes('/products')) {
      uploadPath += 'products/';
    } else if (req.route?.path?.includes('/users/')) {
      uploadPath += 'users/';
    } else {
      uploadPath += 'misc/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/svg+xml'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG files are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

});

// Error handling middleware
const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed per request.'
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
    return;
  }
  
  if (err.message) {
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }
  
  next(err);
};

export { upload, handleUploadError }; 