import fs from 'fs';
import path from 'path';
import https from 'https';

// Image configuration with direct URLs
const IMAGE_CONFIG = {
  brands: {
    apple: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      filename: 'apple-logo.svg',
    },
    samsung: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
      filename: 'samsung-logo.svg',
    },
    nike: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
      filename: 'nike-logo.svg',
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
      url: 'https://randomuser.me/api/portraits/men/1.jpg',
      filename: 'customer1-avatar.jpg',
    },
    customer2: {
      url: 'https://randomuser.me/api/portraits/men/2.jpg',
      filename: 'customer2-avatar.jpg',
    },
    vendor1: {
      url: 'https://randomuser.me/api/portraits/women/1.jpg',
      filename: 'vendor1-avatar.jpg',
    },
    vendor2: {
      url: 'https://randomuser.me/api/portraits/women/2.jpg',
      filename: 'vendor2-avatar.jpg',
    },
    admin: {
      url: 'https://randomuser.me/api/portraits/men/3.jpg',
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
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// Check if image already exists
function imageExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

// Download image from direct URL
function downloadImageFromUrl(url: string, filePath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, response => {
      if (response.statusCode !== 200) {
        console.error(`❌ Failed to download ${url}: Status ${response.statusCode}`);
        file.close();
        fs.unlinkSync(filePath);
        return resolve(false);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filePath)}`);
        resolve(true);
      });
    }).on('error', err => {
      console.error(`❌ Error downloading ${url}:`, err.message);
      file.close();
      fs.unlinkSync(filePath);
      resolve(false);
    });
  });
}

// Download images for a specific type
async function downloadImagesForType(type: string, config: Record<string, any>) {
  console.log(`\n📸 Downloading ${type} images...`);
  for (const [key, imageConfig] of Object.entries(config)) {
    const filePath = path.join(PUBLIC_FOLDERS[type as keyof typeof PUBLIC_FOLDERS], imageConfig.filename);
    if (imageExists(filePath)) {
      console.log(`⏭️ Skipping ${imageConfig.filename} (already exists)`);
      continue;
    }
    await downloadImageFromUrl(imageConfig.url, filePath);
    // Add a small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Main function
async function main() {
  console.log('🖼️ Starting image download process...');
  try {
    // Ensure all directories exist
    ensureDirectories();
    // Download images for each type
    await downloadImagesForType('brands', IMAGE_CONFIG.brands);
    await downloadImagesForType('categories', IMAGE_CONFIG.categories);
    await downloadImagesForType('users', IMAGE_CONFIG.users);
    console.log('\n✅ Image download process completed!');
    console.log('\n📁 Image locations:');
    Object.entries(PUBLIC_FOLDERS).forEach(([type, folder]) => {
      console.log(`   ${type}: ${folder}`);
    });
  } catch (error: any) {
    console.error('💥 Error during image download:', error.message || error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main as downloadImages }; 