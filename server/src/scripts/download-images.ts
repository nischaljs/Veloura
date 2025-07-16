import fs from "fs";
import path from "path";
import https from "https";

// Updated image configuration with real URLs
const IMAGE_CONFIG = {
  categories: {
    fashion: {
      url: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      filename: "fashion.jpg",
    },
    beauty: {
      url: "https://images.pexels.com/photos/7187156/pexels-photo-7187156.jpeg",
      filename: "beauty.jpg",
    },
    mensFashion: {
      url: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
      filename: "mens-fashion.jpg",
    },
    womensFashion: {
      url: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      filename: "womens-fashion.jpg",
    },
    skincare: {
      url: "https://images.pexels.com/photos/4509086/pexels-photo-4509086.jpeg",
      filename: "skincare.jpg",
    },
    makeup: {
      url: "https://images.pexels.com/photos/7187156/pexels-photo-7187156.jpeg",
      filename: "makeup.jpg",
    },
  },
  products: {
    nikeShoes: {
      url: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
      filename: "nike-shoes.jpg",
    },
    adidasTshirt: {
      url: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
      filename: "adidas-tshirt.jpg",
    },
    lorealCream: {
      url: "https://images.pexels.com/photos/4509086/pexels-photo-4509086.jpeg",
      filename: "loreal-cream.jpg",
    },
    sephoraLipstick: {
      url: "https://images.pexels.com/photos/7187156/pexels-photo-7187156.jpeg",
      filename: "sephora-lipstick.jpg",
    },
    zaraDress: {
      url: "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
      filename: "zara-dress.jpg",
    },
    hmJeans: {
      url: "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg",
      filename: "hm-jeans.jpg",
    },
  },
  users: {
    customer1: {
      url: "https://randomuser.me/api/portraits/men/1.jpg",
      filename: "customer1-avatar.jpg",
    },
    customer2: {
      url: "https://randomuser.me/api/portraits/women/2.jpg",
      filename: "customer2-avatar.jpg",
    },
    vendor1: {
      url: "https://randomuser.me/api/portraits/men/3.jpg",
      filename: "vendor1-avatar.jpg",
    },
    vendor2: {
      url: "https://randomuser.me/api/portraits/women/4.jpg",
      filename: "vendor2-avatar.jpg",
    },
    admin: {
      url: "https://randomuser.me/api/portraits/lego/1.jpg",
      filename: "admin-avatar.jpg",
    },
  },
};

const PUBLIC_FOLDERS = {
  categories: "public/images/categories",
  users: "public/images/users",
  products: "public/images/products",
};

// Ensure directories exist
function ensureDirectories() {
  Object.values(PUBLIC_FOLDERS).forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

function imageExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

// Download image from URL
function downloadImageFromUrl(url: string, filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filePath);

    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(
          `Failed to download ${url}: Status ${response.statusCode}`,
        );
        file.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return resolve(false);
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(`Downloaded: ${path.basename(filePath)}`);
        resolve(true);
      });

      file.on("error", (err) => {
        console.error(`File write error for ${url}:`, err.message);
        file.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        resolve(false);
      });
    });

    request.on("error", (err) => {
      console.error(`Network error downloading ${url}:`, err.message);
      file.close();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      resolve(false);
    });

    request.setTimeout(15000, () => {
      console.error(`Timeout downloading ${url}`);
      request.destroy();
      file.close();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      resolve(false);
    });
  });
}

// Download images for a specific type
async function downloadImagesForType(
  type: string,
  config: Record<string, any>,
) {
  console.log(`\nDownloading ${type} images...`);
  for (const [key, imageConfig] of Object.entries(config)) {
    const filePath = path.join(
      PUBLIC_FOLDERS[type as keyof typeof PUBLIC_FOLDERS],
      imageConfig.filename,
    );

    if (imageExists(filePath)) {
      console.log(`Skipping ${imageConfig.filename} (already exists)`);
      continue;
    }

    const success = await downloadImageFromUrl(imageConfig.url, filePath);
    if (!success) {
      console.log(`Failed to download ${imageConfig.filename}, continuing...`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Main function
async function main() {
  console.log("Starting image download process...");
  try {
    ensureDirectories();

    await downloadImagesForType("categories", IMAGE_CONFIG.categories);
    await downloadImagesForType("products", IMAGE_CONFIG.products);
    await downloadImagesForType("users", IMAGE_CONFIG.users);

    console.log("\nImage download process completed!");
    console.log("\nImage locations:");
    Object.entries(PUBLIC_FOLDERS).forEach(([type, folder]) => {
      console.log(`   ${type}: ${folder}`);
    });

    console.log("\nImage URLs will be accessible at:");
    console.log("   http://localhost:5000/images/categories/");
    console.log("   http://localhost:5000/images/products/");
    console.log("   http://localhost:5000/images/users/");
  } catch (error: any) {
    console.error("Error during image download:", error.message || error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main as downloadImages };
