import fs from 'fs';
import path from 'path';
import https from 'https';

// Image configuration with reliable URLs from free stock image sites
const IMAGE_CONFIG = {
  brands: {
    apple: {
      url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=400&q=80',
      filename: 'apple-logo.jpg',
    },
    samsung: {
      url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
      filename: 'samsung-logo.jpg',
    },
    nike: {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
      filename: 'nike-logo.jpg',
    },
  },
  categories: {
    electronics: {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      filename: 'electronics.jpg',
    },
    fashion: {
      url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
      filename: 'fashion.jpg',
    },
    mobiles: {
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
      filename: 'mobiles.jpg',
    },
  },
  users: {
    customer1: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      filename: 'customer1-avatar.jpg',
    },
    customer2: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      filename: 'customer2-avatar.jpg',
    },
    vendor1: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      filename: 'vendor1-avatar.jpg',
    },
    vendor2: {
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      filename: 'vendor2-avatar.jpg',
    },
    admin: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      filename: 'admin-avatar.jpg',
    },
  },
};

// Public folder structure
const PUBLIC_FOLDERS = {
  brands: 'public/images/brands',
  categories: 'public/images/categories',
  users: 'public/images/users',
  products: 'public/images/products',
};

// Ensure directories exist
function ensureDirectories() {
  Object.values(PUBLIC_FOLDERS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Check if image already exists
function imageExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

// Download image from URL with better error handling
function downloadImageFromUrl(url: string, filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    const request = https.get(url, response => {
      if (response.statusCode !== 200) {
        console.error(`Failed to download ${url}: Status ${response.statusCode}`);
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return resolve(false);
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(filePath)}`);
        resolve(true);
      });
      
      file.on('error', (err) => {
        console.error(`File write error for ${url}:`, err.message);
        file.close();
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        resolve(false);
      });
    });
    
    request.on('error', err => {
      console.error(`Network error downloading ${url}:`, err.message);
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      resolve(false);
    });
    
    request.setTimeout(15000, () => {
      console.error(`Timeout downloading ${url}`);
      request.destroy();
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      resolve(false);
    });
  });
}

// Download images for a specific type
async function downloadImagesForType(type: string, config: Record<string, any>) {
  console.log(`\nDownloading ${type} images...`);
  for (const [key, imageConfig] of Object.entries(config)) {
    const filePath = path.join(PUBLIC_FOLDERS[type as keyof typeof PUBLIC_FOLDERS], imageConfig.filename);
    
    if (imageExists(filePath)) {
      console.log(`Skipping ${imageConfig.filename} (already exists)`);
      continue;
    }
    
    const success = await downloadImageFromUrl(imageConfig.url, filePath);
    if (!success) {
      console.log(`Failed to download ${imageConfig.filename}, continuing...`);
    }
    
    // Add a small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Main function
async function main() {
  console.log('Starting image download process...');
  try {
    // Ensure all directories exist
    ensureDirectories();
    
    // Download images for each type
    await downloadImagesForType('brands', IMAGE_CONFIG.brands);
    await downloadImagesForType('categories', IMAGE_CONFIG.categories);
    await downloadImagesForType('users', IMAGE_CONFIG.users);
    
    console.log('\nImage download process completed!');
    console.log('\nImage locations:');
    Object.entries(PUBLIC_FOLDERS).forEach(([type, folder]) => {
      console.log(`   ${type}: ${folder}`);
    });
    
    console.log('\nImage URLs will be accessible at:');
    console.log('   http://localhost:5000/images/brands/');
    console.log('   http://localhost:5000/images/categories/');
    console.log('   http://localhost:5000/images/users/');
    
  } catch (error: any) {
    console.error('Error during image download:', error.message || error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main as downloadImages }; 