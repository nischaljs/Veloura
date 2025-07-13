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

    // Clean up all existing data before seeding (in correct order to respect foreign key constraints)
    console.log('Cleaning up existing data...');
    
    // Delete all dependent records first
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.shipment.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.order.deleteMany();
    await prisma.userCoupon.deleteMany();
    await prisma.couponVendor.deleteMany();
    await prisma.couponCategory.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productTag.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productAttribute.deleteMany();
    await prisma.address.deleteMany();
    await prisma.adminActivity.deleteMany();
    await prisma.bankDetail.deleteMany();
    await prisma.vendorPolicy.deleteMany();
    
    // Delete products and related data
    await prisma.product.deleteMany();
    
    // Delete categories (subcategories will be deleted automatically due to cascade)
    await prisma.category.deleteMany();
    
    // Delete brands
    await prisma.brand.deleteMany();
    
    // Delete vendors
    await prisma.vendor.deleteMany();
    
    // Delete users last
    await prisma.user.deleteMany();
    
    console.log('Existing data cleaned up!');

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

    // After user upserts
    // Fetch users for later use
    const customer1Db = await prisma.user.findUnique({ where: { email: 'customer1@example.com' } });
    const customer2Db = await prisma.user.findUnique({ where: { email: 'customer2@example.com' } });
    const vendorUser1Db = await prisma.user.findUnique({ where: { email: 'vendor1@example.com' } });
    const vendorUser2Db = await prisma.user.findUnique({ where: { email: 'vendor2@example.com' } });

    console.log('Creating vendors...');

    // Vendors - Using upsert to avoid unique constraint errors
    const vendor1 = await prisma.vendor.upsert({
      where: { userId: vendorUser1.id },
      update: {},
      create: {
        userId: vendorUser1.id,
        businessName: 'Fashion Boutique',
        businessEmail: 'vendor1biz@example.com',
        businessPhone: '+977-9800001001',
        slug: 'fashion-boutique',
        description: 'Trendy fashion items',
        isApproved: true,
        website: 'https://fashionboutique.com',
        logo: '/images/brands/zara-logo.jpg',
      },
    });

    const vendor2 = await prisma.vendor.upsert({
      where: { userId: vendorUser2.id },
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

    // After vendor upserts
    // Fetch vendors for later use
    const vendor1Db = await prisma.vendor.findUnique({ where: { slug: 'fashion-boutique' } });
    const vendor2Db = await prisma.vendor.findUnique({ where: { slug: 'fashion-hub' } });

    console.log('Creating brands...');

    // Brands - Using upsert for each brand
    const brands = [
      { name: 'Nike', slug: 'nike', description: 'Nike Sportswear', isFeatured: true, featuredOrder: 1, logo: '/images/brands/nike-logo.jpg' },
      { name: 'Adidas', slug: 'adidas', description: 'Adidas Sportswear', isFeatured: true, featuredOrder: 2, logo: '/images/brands/adidas-logo.jpg' },
      { name: `L'Oreal`, slug: 'loreal', description: `L'Oreal Cosmetics`, isFeatured: true, featuredOrder: 3, logo: '/images/brands/loreal-logo.jpg' },
      { name: 'Sephora', slug: 'sephora', description: 'Sephora Beauty', isFeatured: true, featuredOrder: 4, logo: '/images/brands/sephora-logo.jpg' },
      { name: 'Zara', slug: 'zara', description: 'Zara Fashion', isFeatured: false, logo: '/images/brands/zara-logo.jpg' },
      { name: 'H&M', slug: 'hm', description: 'H&M Fashion', isFeatured: false, logo: '/images/brands/hm-logo.jpg' },
    ];

    for (const brandData of brands) {
      await prisma.brand.upsert({
        where: { slug: brandData.slug },
        update: { 
          featuredOrder: brandData.featuredOrder,
          isFeatured: brandData.isFeatured,
          logo: brandData.logo
        },
        create: brandData,
      });
    }

    console.log('Creating categories...');

    // Categories - Using upsert for each category
    const categories = [
      { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', isFeatured: true, featuredOrder: 1, image: '/images/categories/fashion.jpg' },
      { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products', isFeatured: true, featuredOrder: 2, image: '/images/categories/beauty.jpg' },
    ];

    for (const categoryData of categories) {
      await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: { image: categoryData.image },
        create: categoryData,
      });
    }

    // Create subcategory after parent exists
    const fashionCategoryForSub = await prisma.category.findUnique({
      where: { slug: 'fashion' },
    });

    if (fashionCategoryForSub) {
      await prisma.category.upsert({
        where: { slug: 'mens-fashion' },
        update: { image: '/images/categories/mens-fashion.jpg' },
        create: {
          name: `Men's Fashion`,
          slug: 'mens-fashion',
          description: 'Fashion for men',
          parentId: fashionCategoryForSub.id,
          image: '/images/categories/mens-fashion.jpg',
        },
      });
      await prisma.category.upsert({
        where: { slug: 'womens-fashion' },
        update: { image: '/images/categories/womens-fashion.jpg' },
        create: {
          name: `Women's Fashion`,
          slug: 'womens-fashion',
          description: 'Fashion for women',
          parentId: fashionCategoryForSub.id,
          image: '/images/categories/womens-fashion.jpg',
        },
      });
    }

    const beautyCategoryForSub = await prisma.category.findUnique({
      where: { slug: 'beauty' },
    });

    if (beautyCategoryForSub) {
      await prisma.category.upsert({
        where: { slug: 'skincare' },
        update: { image: '/images/categories/skincare.jpg' },
        create: {
          name: 'Skincare',
          slug: 'skincare',
          description: 'Skincare products',
          parentId: beautyCategoryForSub.id,
          image: '/images/categories/skincare.jpg',
        },
      });
      await prisma.category.upsert({
        where: { slug: 'makeup' },
        update: { image: '/images/categories/makeup.jpg' },
        create: {
          name: 'Makeup',
          slug: 'makeup',
          description: 'Makeup products',
          parentId: beautyCategoryForSub.id,
          image: '/images/categories/makeup.jpg',
        },
      });
    }

    // --- SEED PRODUCTS ---
    console.log('Creating products...');

    // Get required foreign keys
    const nikeBrand = await prisma.brand.findUnique({ where: { slug: 'nike' } });
    const adidasBrand = await prisma.brand.findUnique({ where: { slug: 'adidas' } });
    const lorealBrand = await prisma.brand.findUnique({ where: { slug: 'loreal' } });
    const sephoraBrand = await prisma.brand.findUnique({ where: { slug: 'sephora' } });
    const zaraBrand = await prisma.brand.findUnique({ where: { slug: 'zara' } });
    const hmBrand = await prisma.brand.findUnique({ where: { slug: 'hm' } });

    const fashionCategoryForProducts = await prisma.category.findUnique({ where: { slug: 'fashion' } });
    const beautyCategoryForProducts = await prisma.category.findUnique({ where: { slug: 'beauty' } });
    const mensFashion = await prisma.category.findUnique({ where: { slug: 'mens-fashion' } });
    const womensFashion = await prisma.category.findUnique({ where: { slug: 'womens-fashion' } });
    const skincare = await prisma.category.findUnique({ where: { slug: 'skincare' } });
    const makeup = await prisma.category.findUnique({ where: { slug: 'makeup' } });

    // Use available images
    const productImages = [
      '/images/products/nike-shoes.jpg',
      '/images/products/adidas-tshirt.jpg',
      '/images/products/loreal-cream.jpg',
      '/images/products/sephora-lipstick.jpg',
      '/images/products/zara-dress.jpg',
      '/images/products/hm-jeans.jpg',
    ];

    // Seed 6 products
    const products = [
      {
        name: 'Nike Running Shoes',
        slug: 'nike-running-shoes',
        description: 'High-performance running shoes from Nike.',
        shortDescription: 'Lightweight and comfortable.',
        price: 120,
        sku: 'NRS-001',
        stockQuantity: 100,
        categoryId: mensFashion?.id!,
        brandId: nikeBrand?.id!,
        vendorId: vendor1Db!.id,
        image: productImages[0],
        isFeatured: true,
      },
      {
        name: 'Adidas Training T-Shirt',
        slug: 'adidas-training-tshirt',
        description: 'Breathable training t-shirt from Adidas.',
        shortDescription: 'Perfect for workouts.',
        price: 45,
        sku: 'ATT-001',
        stockQuantity: 150,
        categoryId: womensFashion?.id!,
        brandId: adidasBrand?.id!,
        vendorId: vendor2Db!.id,
        image: productImages[1],
        isFeatured: true,
      },
      {
        name: `L'Oreal Revitalift Cream`,
        slug: 'loreal-revitalift-cream',
        description: `Anti-aging cream from L'Oreal.`,
        shortDescription: 'Reduces wrinkles and fine lines.',
        price: 30,
        sku: 'LRC-001',
        stockQuantity: 200,
        categoryId: skincare?.id!,
        brandId: lorealBrand?.id!,
        vendorId: vendor2Db!.id,
        image: productImages[2],
        isFeatured: true,
      },
      {
        name: 'Sephora Cream Lipstick',
        slug: 'sephora-cream-lipstick',
        description: 'Long-lasting cream lipstick from Sephora.',
        shortDescription: 'Vibrant color and smooth finish.',
        price: 20,
        sku: 'SCL-001',
        stockQuantity: 180,
        categoryId: makeup?.id!,
        brandId: sephoraBrand?.id!,
        vendorId: vendor2Db!.id,
        image: productImages[3],
        isFeatured: true,
      },
      {
        name: `Zara Men's Slim Fit Jeans`,
        slug: 'zara-mens-jeans',
        description: `Stylish slim fit jeans for men from Zara.`,
        shortDescription: 'Comfortable and modern.',
        price: 70,
        sku: 'ZMJ-001',
        stockQuantity: 90,
        categoryId: mensFashion?.id!,
        brandId: zaraBrand?.id!,
        vendorId: vendor1Db!.id,
        image: productImages[4],
        isFeatured: false,
      },
      {
        name: `H&M Women's Summer Dress`,
        slug: 'hm-womens-dress',
        description: `Light and airy summer dress from H&M.`,
        shortDescription: 'Perfect for warm weather.',
        price: 50,
        sku: 'HMWD-001',
        stockQuantity: 120,
        categoryId: womensFashion?.id!,
        brandId: hmBrand?.id!,
        vendorId: vendor2Db!.id,
        image: productImages[5],
        isFeatured: false,
      },
    ];

    for (const p of products) {
      if (p.categoryId && p.brandId && p.vendorId) { // Ensure all required IDs are present
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
            isFeatured: p.isFeatured,
            images: {
              create: [{ url: p.image, altText: p.name, isPrimary: true, order: 1 }]
            }
          },
        });
      }
    }
    console.log('Products created!');

    // After product upserts
    // Fetch products for later use
    const nikeShoes = await prisma.product.findUnique({ where: { slug: 'nike-running-shoes' } });
    const adidasTshirt = await prisma.product.findUnique({ where: { slug: 'adidas-training-tshirt' } });
    const lorealCream = await prisma.product.findUnique({ where: { slug: 'loreal-revitalift-cream' } });
    const sephoraLipstick = await prisma.product.findUnique({ where: { slug: 'sephora-cream-lipstick' } });

    // --- SEED COUPONS ---
    console.log('Creating coupons...');

    // Get required foreign keys for categories and vendors
    const fashionCat = await prisma.category.findUnique({ where: { slug: 'fashion' } });
    const beautyCat = await prisma.category.findUnique({ where: { slug: 'beauty' } });
    const fashionBoutiqueVendor = await prisma.vendor.findUnique({ where: { slug: 'fashion-boutique' } });
    const fashionHubVendor = await prisma.vendor.findUnique({ where: { slug: 'fashion-hub' } });

    // Create coupons
    const coupon1 = await prisma.coupon.upsert({
      where: { code: 'SAVE10' },
      update: {},
      create: {
        code: 'SAVE10',
        description: 'Save 10% on your first fashion order',
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
      where: { code: 'BEAUTY20' },
      update: {},
      create: {
        code: 'BEAUTY20',
        description: '20% off on beauty products',
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
    if (fashionCat) {
      await prisma.couponCategory.create({
        data: { couponId: coupon1.id, categoryId: fashionCat.id }
      });
    }
    if (beautyCat) {
      await prisma.couponCategory.create({
        data: { couponId: coupon2.id, categoryId: beautyCat.id }
      });
    }
    if (fashionBoutiqueVendor) {
      await prisma.couponVendor.create({
        data: { couponId: coupon1.id, vendorId: fashionBoutiqueVendor.id }
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

    // Use these variables (customer1Db, customer2Db, vendorUser1Db, vendorUser2Db, vendor1Db, vendor2Db) instead of customer1, customer2, vendorUser1, vendorUser2, vendor1, vendor2 in later code.
    // Cart for customer1
    const cart1 = await prisma.cart.upsert({
      where: { userId: customer1.id },
      update: {},
      create: {
        userId: customer1.id,
        items: {
          create: [
            { productId: nikeShoes?.id!, quantity: 1 },
            { productId: lorealCream?.id!, quantity: 1 },
          ]
        }
      }
    });
    // Cart for customer2
    const cart2 = await prisma.cart.upsert({
      where: { userId: customer2.id },
      update: {},
      create: {
        userId: customer2.id,
        items: {
          create: [
            { productId: sephoraLipstick?.id!, quantity: 2 },
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
            { productId: nikeShoes?.id! },
            { productId: sephoraLipstick?.id! },
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
            { productId: lorealCream?.id! },
          ]
        }
      }
    });
    console.log('Carts and wishlists created!');

    // --- SEED ORDERS ---
    console.log('Creating demo orders...');

    // Helper: snapshot for product and variant
    const productSnapshot = (product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      sku: product.sku,
    });
    const variantSnapshot = (variant: any) => variant ? ({
      id: variant.id,
      name: variant.name,
      value: variant.value,
      priceDifference: variant.priceDifference,
      sku: variant.sku,
    }) : undefined;

    // Order 1: PENDING
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-1001',
        userId: customer1.id,
        status: 'PENDING',
        paymentMethod: 'KHALTI',
        paymentStatus: 'PENDING',
        subtotal: 120,
        shippingFee: 50,
        taxAmount: 0,
        discountAmount: 0,
        total: 170,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Alice Smith',
          street: '123 Main St',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44600',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: {
          create: [
            {
              productId: nikeShoes?.id!,
              vendorId: vendor1Db!.id,
              quantity: 1,
              price: 120,
              salePrice: null,
              productSnapshot: productSnapshot(nikeShoes),
              variantSnapshot: undefined,
            },
          ],
        },
      },
    });

    // Order 2: PROCESSING
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-1002',
        userId: customer1.id,
        status: 'PROCESSING',
        paymentMethod: 'ESEWA',
        paymentStatus: 'COMPLETED',
        subtotal: 30,
        shippingFee: 50,
        taxAmount: 0,
        discountAmount: 0,
        total: 80,
        shippingAddress: {
          label: 'Office',
          recipientName: 'Alice Smith',
          street: '456 Office Rd',
          city: 'Lalitpur',
          state: 'Bagmati',
          postalCode: '44700',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: {
          create: [
            {
              productId: lorealCream?.id!,
              vendorId: vendor2Db!.id,
              quantity: 1,
              price: 30,
              salePrice: null,
              productSnapshot: productSnapshot(lorealCream),
              variantSnapshot: undefined,
            },
          ],
        },
      },
    });

    // Order 3: SHIPPED
    const order3 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-1003',
        userId: customer2.id,
        status: 'SHIPPED',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        subtotal: 40,
        shippingFee: 50,
        taxAmount: 0,
        discountAmount: 0,
        total: 90,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Bob Johnson',
          street: '789 Home St',
          city: 'Bhaktapur',
          state: 'Bagmati',
          postalCode: '44800',
          country: 'Nepal',
          phone: '+977-9800000002',
        },
        items: {
          create: [
            {
              productId: sephoraLipstick?.id!,
              vendorId: vendor2Db!.id,
              quantity: 2,
              price: 20,
              salePrice: null,
              productSnapshot: productSnapshot(sephoraLipstick),
              variantSnapshot: undefined,
            },
          ],
        },
      },
    });
    // Seed shipment for SHIPPED order
    await prisma.shipment.create({
      data: {
        orderId: order3.id,
        trackingNumber: 'TRK1003',
        carrier: 'Nepal Post',
        status: 'shipped',
        shippedAt: new Date('2024-01-16T10:30:00Z'),
        deliveredAt: null,
      }
    });

    // Order 4: DELIVERED
    const order4 = await prisma.order.create({
      data: {
        orderNumber: 'ORD-1004',
        userId: customer2.id,
        status: 'DELIVERED',
        paymentMethod: 'CARD',
        paymentStatus: 'COMPLETED',
        subtotal: 120,
        shippingFee: 40,
        taxAmount: 0,
        discountAmount: 0,
        total: 160,
        shippingAddress: {
          label: 'Work',
          recipientName: 'Bob Johnson',
          street: '321 Work Ave',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44601',
          country: 'Nepal',
          phone: '+977-9800000002',
        },
        items: {
          create: [
            {
              productId: nikeShoes?.id!,
              vendorId: vendor1Db!.id,
              quantity: 1,
              price: 120,
              salePrice: null,
              productSnapshot: productSnapshot(nikeShoes),
              variantSnapshot: undefined,
            },
          ],
        },
      },
    });
    // Seed shipment for DELIVERED order
    await prisma.shipment.create({
      data: {
        orderId: order4.id,
        trackingNumber: 'TRK1004',
        carrier: 'DHL',
        status: 'delivered',
        shippedAt: new Date('2024-01-17T09:00:00Z'),
        deliveredAt: new Date('2024-01-19T15:30:00Z'),
      }
    });

    // Order 5: CANCELLED
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-1005',
        userId: customer1.id,
        status: 'CANCELLED',
        paymentMethod: 'WALLET',
        paymentStatus: 'FAILED',
        subtotal: 45,
        shippingFee: 60,
        taxAmount: 0,
        discountAmount: 0,
        total: 105,
        shippingAddress: {
          label: 'Other',
          recipientName: 'Alice Smith',
          street: '999 Cancelled St',
          city: 'Pokhara',
          state: 'Gandaki',
          postalCode: '33700',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: {
          create: [
            {
              productId: adidasTshirt?.id!,
              vendorId: vendor2Db!.id,
              quantity: 1,
              price: 45,
              salePrice: null,
              productSnapshot: productSnapshot(adidasTshirt),
              variantSnapshot: undefined,
            },
          ],
        },
      },
    });

    // Order 6: RETURNED
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-1006',
        userId: customer2.id,
        status: 'RETURNED',
        paymentMethod: 'COD',
        paymentStatus: 'REFUNDED',
        subtotal: 20,
        shippingFee: 30,
        taxAmount: 0,
        discountAmount: 0,
        total: 50,
        shippingAddress: {
          label: 'Return',
          recipientName: 'Bob Johnson',
          street: '111 Return Rd',
          city: 'Lalitpur',
          state: 'Bagmati',
          postalCode: '44701',
          country: 'Nepal',
          phone: '+977-9800000002',
        },
        items: {
          create: [
            {
              productId: sephoraLipstick?.id!,
              vendorId: vendor2Db!.id,
              quantity: 1,
              price: 20,
              salePrice: null,
              productSnapshot: productSnapshot(sephoraLipstick),
              variantSnapshot: undefined,
            },
          ],
        },
      },
    });
    console.log('Demo orders created!');

    // --- SEED REVIEWS ---
    console.log('Creating demo reviews...');

    // Fetch order items for reviews
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
      where: {
        order: {
          userId: { in: [customer1Db!.id, customer2Db!.id] },
        },
      },
    });

    // Helper to find order item for a user and product
    function findOrderItem(userId: number, productId: number) {
      return orderItems.find(
        (oi) => oi.order.userId === userId && oi.productId === productId
      );
    }

    // Demo reviews
    const demoReviews = [
      {
        user: customer1Db,
        product: nikeShoes,
        orderItem: findOrderItem(customer1Db!.id, nikeShoes?.id!),
        rating: 5,
        title: 'Great running shoes!',
        comment: 'Comfortable and stylish, perfect for my daily runs.',
        images: JSON.stringify(['/images/reviews/nike-shoes-review.jpg']),
      },
      {
        user: customer1Db,
        product: lorealCream,
        orderItem: findOrderItem(customer1Db!.id, lorealCream?.id!),
        rating: 4,
        title: 'Good moisturizer',
        comment: 'Leaves my skin feeling soft, but a bit pricey.',
        images: JSON.stringify(['/images/reviews/loreal-cream-review.jpg']),
      },
      {
        user: customer2Db,
        product: sephoraLipstick,
        orderItem: findOrderItem(customer2Db!.id, sephoraLipstick?.id!),
        rating: 5,
        title: 'Amazing color!',
        comment: 'Love the shade and how long it lasts.',
        images: JSON.stringify(['/images/reviews/sephora-lipstick-review.jpg']),
      },
      {
        user: customer2Db,
        product: adidasTshirt,
        orderItem: findOrderItem(customer2Db!.id, adidasTshirt?.id!),
        rating: 3,
        title: 'Decent t-shirt',
        comment: 'Comfortable, but the fit is a bit loose.',
        images: JSON.stringify([]),
      },
    ];

    for (const r of demoReviews) {
      if (r.user && r.product && r.orderItem) {
        await prisma.review.create({
          data: {
            userId: r.user.id,
            productId: r.product.id,
            orderItemId: r.orderItem.id,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            images: r.images,
            isApproved: true,
          },
        });
      }
    }
    console.log('Demo reviews created!');

    // --- SEED NOTIFICATIONS ---
    console.log('Creating demo notifications...');
    // User notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: customer1.id,
          title: 'Order Shipped',
          message: 'Your order ORD-1001 has been shipped',
          type: 'order',
          isRead: false,
          link: '/orders/1',
          createdAt: new Date('2024-01-15T10:30:00Z'),
        },
        {
          userId: customer1.id,
          title: 'Price Drop Alert',
          message: 'Nike Running Shoes price dropped by 10%',
          type: 'promotion',
          isRead: true,
          link: '/products/nike-running-shoes',
          createdAt: new Date('2024-01-14T15:20:00Z'),
        },
        {
          userId: customer2.id,
          title: 'Order Delivered',
          message: 'Your order ORD-1004 has been delivered',
          type: 'order',
          isRead: false,
          link: '/orders/4',
          createdAt: new Date('2024-01-19T15:30:00Z'),
        },
        {
          userId: customer2.id,
          title: 'Product Review',
          message: 'Thank you for reviewing Sephora Cream Lipstick',
          type: 'review',
          isRead: true,
          link: '/products/sephora-cream-lipstick/reviews',
          createdAt: new Date('2024-01-14T15:20:00Z'),
        },
        // Vendor notifications (using vendorUser1 and vendorUser2)
        {
          userId: vendorUser1.id,
          title: 'New Order Received',
          message: 'You have received a new order ORD-1003',
          type: 'order',
          isRead: false,
          link: '/vendors/orders/3',
          createdAt: new Date('2024-01-15T10:30:00Z'),
        },
        {
          userId: vendorUser2.id,
          title: 'Product Review',
          message: 'New review received for L\'Oreal Revitalift Cream',
          type: 'review',
          isRead: true,
          link: '/vendors/products/loreal-revitalift-cream/reviews',
          createdAt: new Date('2024-01-14T15:20:00Z'),
        },
      ]
    });
    console.log('Demo notifications created!');

    // --- SEED PAYMENT OPTIONS & SHIPPING METHODS ---
    console.log('Seeding payment options and shipping methods...');

    // Payment options (from PaymentMethod enum)
    const paymentOptions = [
      { method: 'KHALTI', label: 'Khalti', description: 'Pay with Khalti wallet', enabled: true },
      { method: 'ESEWA', label: 'eSewa', description: 'Pay with eSewa wallet', enabled: true },
      { method: 'COD', label: 'Cash on Delivery', description: 'Pay with cash on delivery', enabled: true },
      { method: 'CARD', label: 'Credit/Debit Card', description: 'Pay with card (coming soon)', enabled: false },
      { method: 'WALLET', label: 'Wallet', description: 'Pay with site wallet (coming soon)', enabled: false },
    ];
    await prisma.systemSetting.upsert({
      where: { key: 'payment_options' },
      update: { value: paymentOptions },
      create: { key: 'payment_options', value: paymentOptions, description: 'Available payment options for checkout' },
    });

    // Shipping methods
    const shippingMethods = [
      { id: 1, name: 'Standard Delivery', description: '3-5 business days', fee: 100, estimatedDays: '3-5' },
      { id: 2, name: 'Express Delivery', description: '1-2 business days', fee: 200, estimatedDays: '1-2' },
      { id: 3, name: 'Same Day Delivery', description: 'Same day delivery in Kathmandu', fee: 300, estimatedDays: '0-1' },
    ];
    await prisma.systemSetting.upsert({
      where: { key: 'shipping_methods' },
      update: { value: shippingMethods },
      create: { key: 'shipping_methods', value: shippingMethods, description: 'Available shipping methods for checkout' },
    });
    console.log('Payment options and shipping methods seeded!');

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