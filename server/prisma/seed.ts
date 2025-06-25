import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { downloadImages } from '../src/scripts/download-images';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  try {
    // Download images first
    console.log('Downloading images...');
    await downloadImages();

    // Passwords
    const password1 = await bcrypt.hash('customer123', 10);
    const password2 = await bcrypt.hash('customer456', 10);
    const password3 = await bcrypt.hash('vendor123', 10);
    const password4 = await bcrypt.hash('vendor456', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    console.log('Creating users...');

    // Users - Using upsert to avoid unique constraint errors
    const customer1 = await prisma.user.upsert({
      where: { email: 'customer1@example.com' },
      update: {},
      create: {
        email: 'customer1@example.com',
        passwordHash: password1,
        firstName: 'Alice',
        lastName: 'Smith',
        phone: '+977-9800000001',
        role: UserRole.CUSTOMER,
        avatar: '/images/users/customer1-avatar.jpg',
      },
    });

    const customer2 = await prisma.user.upsert({
      where: { email: 'customer2@example.com' },
      update: {},
      create: {
        email: 'customer2@example.com',
        passwordHash: password2,
        firstName: 'Bob',
        lastName: 'Johnson',
        phone: '+977-9800000002',
        role: UserRole.CUSTOMER,
        avatar: '/images/users/customer2-avatar.jpg',
      },
    });

    const vendorUser1 = await prisma.user.upsert({
      where: { email: 'vendor1@example.com' },
      update: {},
      create: {
        email: 'vendor1@example.com',
        passwordHash: password3,
        firstName: 'Charlie',
        lastName: 'Vendor',
        phone: '+977-9800000003',
        role: UserRole.VENDOR,
        avatar: '/images/users/vendor1-avatar.jpg',
      },
    });

    const vendorUser2 = await prisma.user.upsert({
      where: { email: 'vendor2@example.com' },
      update: {},
      create: {
        email: 'vendor2@example.com',
        passwordHash: password4,
        firstName: 'Diana',
        lastName: 'Vendor',
        phone: '+977-9800000004',
        role: UserRole.VENDOR,
        avatar: '/images/users/vendor2-avatar.jpg',
      },
    });

    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+977-9800000000',
        role: UserRole.ADMIN,
        avatar: '/images/users/admin-avatar.jpg',
      },
    });

    console.log('Creating vendors...');

    // Vendors - Using upsert to avoid unique constraint errors
    const vendor1 = await prisma.vendor.upsert({
      where: { slug: 'tech-store' },
      update: {},
      create: {
        userId: vendorUser1.id,
        businessName: 'Tech Store',
        businessEmail: 'vendor1biz@example.com',
        businessPhone: '+977-9800001001',
        slug: 'tech-store',
        description: 'Best tech products',
        isApproved: true,
        website: 'https://techstore.com',
        logo: '/images/brands/apple-logo.jpg',
      },
    });

    const vendor2 = await prisma.vendor.upsert({
      where: { slug: 'fashion-hub' },
      update: {},
      create: {
        userId: vendorUser2.id,
        businessName: 'Fashion Hub',
        businessEmail: 'vendor2biz@example.com',
        businessPhone: '+977-9800001002',
        slug: 'fashion-hub',
        description: 'Trendy fashion items',
        isApproved: true,
        website: 'https://fashionhub.com',
        logo: '/images/brands/nike-logo.jpg',
      },
    });

    console.log('Creating brands...');

    // Brands - Using upsert for each brand
    const brands = [
      { name: 'Apple', slug: 'apple', description: 'Apple Inc.', isFeatured: true, featuredOrder: 1, logo: '/images/brands/apple-logo.jpg' },
      { name: 'Samsung', slug: 'samsung', description: 'Samsung Electronics', isFeatured: true, featuredOrder: 2, logo: '/images/brands/samsung-logo.jpg' },
      { name: 'Nike', slug: 'nike', description: 'Nike Sportswear', isFeatured: false, logo: '/images/brands/nike-logo.jpg' },
    ];

    for (const brandData of brands) {
      await prisma.brand.upsert({
        where: { slug: brandData.slug },
        update: {},
        create: brandData,
      });
    }

    console.log('Creating categories...');

    // Categories - Using upsert for each category
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices', isFeatured: true, featuredOrder: 1, image: '/images/categories/electronics.jpg' },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', isFeatured: true, featuredOrder: 2, image: '/images/categories/fashion.jpg' },
    ];

    for (const categoryData of categories) {
      await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: { image: categoryData.image },
        create: categoryData,
      });
    }

    // Create subcategory after parent exists
    const electronicsCategory = await prisma.category.findUnique({
      where: { slug: 'electronics' },
    });

    if (electronicsCategory) {
      await prisma.category.upsert({
        where: { slug: 'mobiles' },
        update: { image: '/images/categories/mobiles.jpg' },
        create: {
          name: 'Mobiles',
          slug: 'mobiles',
          description: 'Mobile phones',
          parentId: electronicsCategory.id,
          image: '/images/categories/mobiles.jpg',
        },
      });
    }

    // --- SEED PRODUCTS ---
    console.log('Creating products...');

    // Get required foreign keys
    const apple = await prisma.brand.findUnique({ where: { slug: 'apple' } });
    const samsung = await prisma.brand.findUnique({ where: { slug: 'samsung' } });
    const nike = await prisma.brand.findUnique({ where: { slug: 'nike' } });
    const electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } });
    const fashion = await prisma.category.findUnique({ where: { slug: 'fashion' } });
    const mobiles = await prisma.category.findUnique({ where: { slug: 'mobiles' } });

    // Use available images
    const productImages = [
      '/images/categories/electronics.jpg',
      '/images/categories/fashion.jpg',
      '/images/categories/mobiles.jpg',
      '/images/brands/apple-logo.jpg',
      '/images/brands/samsung-logo.jpg',
      '/images/brands/nike-logo.jpg',
    ];

    // Seed 5 products
    const products = [
      {
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Latest Apple iPhone 15 smartphone.',
        shortDescription: 'Apple flagship phone.',
        price: 1200,
        sku: 'IP15-001',
        stockQuantity: 50,
        categoryId: electronics?.id,
        brandId: apple?.id,
        vendorId: vendor1.id,
        image: productImages[0],
      },
      {
        name: 'Samsung Galaxy S24',
        slug: 'galaxy-s24',
        description: 'Newest Samsung Galaxy S24 smartphone.',
        shortDescription: 'Samsung flagship phone.',
        price: 1100,
        sku: 'SGS24-001',
        stockQuantity: 40,
        categoryId: mobiles?.id,
        brandId: samsung?.id,
        vendorId: vendor1.id,
        image: productImages[1],
      },
      {
        name: 'Nike Air Max',
        slug: 'nike-air-max',
        description: 'Popular Nike Air Max running shoes.',
        shortDescription: 'Comfortable running shoes.',
        price: 200,
        sku: 'NAM-001',
        stockQuantity: 100,
        categoryId: fashion?.id,
        brandId: nike?.id,
        vendorId: vendor2.id,
        image: productImages[2],
      },
      {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-9',
        description: 'Apple Watch Series 9 with advanced health features.',
        shortDescription: 'Smartwatch by Apple.',
        price: 500,
        sku: 'AW9-001',
        stockQuantity: 30,
        categoryId: electronics?.id,
        brandId: apple?.id,
        vendorId: vendor1.id,
        image: productImages[3],
      },
      {
        name: 'Samsung QLED TV',
        slug: 'samsung-qled-tv',
        description: 'Samsung 55-inch QLED 4K Smart TV.',
        shortDescription: 'Stunning 4K TV.',
        price: 1500,
        sku: 'SQT-001',
        stockQuantity: 20,
        categoryId: electronics?.id,
        brandId: samsung?.id,
        vendorId: vendor1.id,
        image: productImages[4],
      },
    ];

    for (const p of products) {
      if (typeof p.categoryId === 'number' && typeof p.brandId === 'number' && typeof p.vendorId === 'number') {
        await prisma.product.upsert({
          where: { slug: p.slug },
          update: {},
          create: {
            name: p.name,
            slug: p.slug,
            description: p.description,
            shortDescription: p.shortDescription,
            price: p.price,
            sku: p.sku,
            stockQuantity: p.stockQuantity,
            categoryId: p.categoryId,
            brandId: p.brandId,
            vendorId: p.vendorId,
            images: {
              create: [{ url: p.image, altText: p.name, isPrimary: true, order: 1 }]
            }
          },
        });
      }
    }
    console.log('Products created!');

    // --- SEED COUPONS ---
    console.log('Creating coupons...');

    // Get required foreign keys for categories and vendors
    const electronicsCat = await prisma.category.findUnique({ where: { slug: 'electronics' } });
    const fashionCat = await prisma.category.findUnique({ where: { slug: 'fashion' } });
    const techStoreVendor = await prisma.vendor.findUnique({ where: { slug: 'tech-store' } });
    const fashionHubVendor = await prisma.vendor.findUnique({ where: { slug: 'fashion-hub' } });

    // Create coupons
    const coupon1 = await prisma.coupon.upsert({
      where: { code: 'SAVE10' },
      update: {},
      create: {
        code: 'SAVE10',
        description: 'Save 10% on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 1000,
        maxUses: 100,
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-12-31T23:59:59Z'),
        isActive: true,
      },
    });
    const coupon2 = await prisma.coupon.upsert({
      where: { code: 'FASHION20' },
      update: {},
      create: {
        code: 'FASHION20',
        description: '20% off on fashion',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 500,
        maxUses: 50,
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-12-31T23:59:59Z'),
        isActive: true,
      },
    });
    const coupon3 = await prisma.coupon.upsert({
      where: { code: 'FLAT100' },
      update: {},
      create: {
        code: 'FLAT100',
        description: 'Flat 100 off on any order',
        discountType: 'fixed',
        discountValue: 100,
        minOrderAmount: 0,
        maxUses: 200,
        startDate: new Date('2024-01-01T00:00:00Z'),
        endDate: new Date('2024-12-31T23:59:59Z'),
        isActive: true,
      },
    });

    // Link coupons to categories/vendors
    if (electronicsCat) {
      await prisma.couponCategory.create({
        data: { couponId: coupon1.id, categoryId: electronicsCat.id }
      });
    }
    if (fashionCat) {
      await prisma.couponCategory.create({
        data: { couponId: coupon2.id, categoryId: fashionCat.id }
      });
    }
    if (techStoreVendor) {
      await prisma.couponVendor.create({
        data: { couponId: coupon1.id, vendorId: techStoreVendor.id }
      });
    }
    if (fashionHubVendor) {
      await prisma.couponVendor.create({
        data: { couponId: coupon2.id, vendorId: fashionHubVendor.id }
      });
    }

    // Seed a user-coupon claim for demo
    await prisma.userCoupon.create({
      data: {
        userId: customer1.id,
        couponId: coupon1.id,
        usedAt: null,
        orderId: null,
      },
    });
    console.log('Coupons created!');

    // --- SEED CARTS & WISHLISTS ---
    console.log('Creating carts and wishlists...');

    // Get some products and variants
    const iphone = await prisma.product.findUnique({ where: { slug: 'iphone-15' } });
    const galaxy = await prisma.product.findUnique({ where: { slug: 'galaxy-s24' } });
    const nike = await prisma.product.findUnique({ where: { slug: 'nike-air-max' } });
    const iphoneVariant = await prisma.productVariant.findFirst({ where: { productId: iphone?.id } });
    const galaxyVariant = await prisma.productVariant.findFirst({ where: { productId: galaxy?.id } });

    // Cart for customer1
    const cart1 = await prisma.cart.create({
      data: {
        userId: customer1.id,
        items: {
          create: [
            { productId: iphone?.id!, variantId: iphoneVariant?.id, quantity: 2 },
            { productId: galaxy?.id!, variantId: galaxyVariant?.id, quantity: 1 },
          ]
        }
      }
    });
    // Cart for customer2
    const cart2 = await prisma.cart.create({
      data: {
        userId: customer2.id,
        items: {
          create: [
            { productId: nike?.id!, quantity: 3 },
          ]
        }
      }
    });
    // Wishlist for customer1
    const wishlist1 = await prisma.wishlist.create({
      data: {
        userId: customer1.id,
        items: {
          create: [
            { productId: iphone?.id! },
            { productId: nike?.id! },
          ]
        }
      }
    });
    // Wishlist for customer2
    const wishlist2 = await prisma.wishlist.create({
      data: {
        userId: customer2.id,
        items: {
          create: [
            { productId: galaxy?.id! },
          ]
        }
      }
    });
    console.log('Carts and wishlists created!');

    console.log('Seed data created successfully!');
    console.log(`Created: ${await prisma.user.count()} users, ${await prisma.vendor.count()} vendors, ${await prisma.brand.count()} brands, ${await prisma.category.count()} categories`);

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }); 