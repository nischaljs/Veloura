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
    const appleBrand = await prisma.brand.findUnique({ where: { slug: 'apple' } });
    const samsungBrand = await prisma.brand.findUnique({ where: { slug: 'samsung' } });
    const nikeBrand = await prisma.brand.findUnique({ where: { slug: 'nike' } });
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
        brandId: appleBrand?.id,
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
        brandId: samsungBrand?.id,
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
        brandId: nikeBrand?.id,
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
        brandId: appleBrand?.id,
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
        brandId: samsungBrand?.id,
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
    const nikeProduct = await prisma.product.findUnique({ where: { slug: 'nike-air-max' } });
    const iphoneVariant = await prisma.productVariant.findFirst({ where: { productId: iphone?.id } });
    const galaxyVariant = await prisma.productVariant.findFirst({ where: { productId: galaxy?.id } });

    // Clean up all dependent data before seeding to avoid unique constraint errors
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

    // Cart for customer1
    const cart1 = await prisma.cart.upsert({
      where: { userId: customer1.id },
      update: {},
      create: {
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
    const cart2 = await prisma.cart.upsert({
      where: { userId: customer2.id },
      update: {},
      create: {
        userId: customer2.id,
        items: {
          create: [
            { productId: nikeProduct?.id!, quantity: 3 },
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
            { productId: nikeProduct?.id! },
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
        subtotal: 2400,
        shippingFee: 100,
        taxAmount: 0,
        discountAmount: 0,
        total: 2500,
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
              productId: iphone?.id!,
              vendorId: vendor1.id,
              variantId: iphoneVariant?.id,
              quantity: 2,
              price: 1200,
              salePrice: null,
              productSnapshot: productSnapshot(iphone),
              variantSnapshot: variantSnapshot(iphoneVariant),
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
        subtotal: 1100,
        shippingFee: 80,
        taxAmount: 0,
        discountAmount: 0,
        total: 1180,
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
              productId: galaxy?.id!,
              vendorId: vendor1.id,
              variantId: galaxyVariant?.id,
              quantity: 1,
              price: 1100,
              salePrice: null,
              productSnapshot: productSnapshot(galaxy),
              variantSnapshot: variantSnapshot(galaxyVariant),
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
        subtotal: 600,
        shippingFee: 50,
        taxAmount: 0,
        discountAmount: 0,
        total: 650,
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
              productId: nikeProduct?.id!,
              vendorId: vendor2.id,
              quantity: 3,
              price: 200,
              salePrice: null,
              productSnapshot: productSnapshot(nikeProduct),
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
        subtotal: 500,
        shippingFee: 40,
        taxAmount: 0,
        discountAmount: 0,
        total: 540,
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
              productId: iphone?.id!,
              vendorId: vendor1.id,
              variantId: iphoneVariant?.id,
              quantity: 1,
              price: 500,
              salePrice: null,
              productSnapshot: productSnapshot(iphone),
              variantSnapshot: variantSnapshot(iphoneVariant),
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
        subtotal: 1500,
        shippingFee: 60,
        taxAmount: 0,
        discountAmount: 0,
        total: 1560,
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
              productId: galaxy?.id!,
              vendorId: vendor1.id,
              variantId: galaxyVariant?.id,
              quantity: 1,
              price: 1500,
              salePrice: null,
              productSnapshot: productSnapshot(galaxy),
              variantSnapshot: variantSnapshot(galaxyVariant),
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
        subtotal: 200,
        shippingFee: 30,
        taxAmount: 0,
        discountAmount: 0,
        total: 230,
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
              productId: nikeProduct?.id!,
              vendorId: vendor2.id,
              quantity: 1,
              price: 200,
              salePrice: null,
              productSnapshot: productSnapshot(nikeProduct),
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
          userId: { in: [customer1.id, customer2.id] },
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
        user: customer1,
        product: iphone,
        orderItem: findOrderItem(customer1.id, iphone?.id!),
        rating: 5,
        title: 'Amazing iPhone!',
        comment: 'The iPhone 15 exceeded my expectations. Super fast and great camera.',
        images: JSON.stringify(['/images/reviews/iphone1.jpg']),
      },
      {
        user: customer1,
        product: galaxy,
        orderItem: findOrderItem(customer1.id, galaxy?.id!),
        rating: 4,
        title: 'Solid Android phone',
        comment: 'Galaxy S24 is a great device, but battery life could be better.',
        images: JSON.stringify(['/images/reviews/galaxy1.jpg']),
      },
      {
        user: customer2,
        product: nikeProduct,
        orderItem: findOrderItem(customer2.id, nikeProduct?.id!),
        rating: 5,
        title: 'Super comfy shoes',
        comment: 'Nike Air Max are the most comfortable shoes I have owned.',
        images: JSON.stringify(['/images/reviews/nike1.jpg']),
      },
      {
        user: customer2,
        product: iphone,
        orderItem: findOrderItem(customer2.id, iphone?.id!),
        rating: 3,
        title: 'Good, but expensive',
        comment: 'iPhone 15 is good, but the price is a bit high for my taste.',
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
          message: 'iPhone 15 price dropped by 10%',
          type: 'promotion',
          isRead: true,
          link: '/products/iphone-15',
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
          message: 'Thank you for reviewing Nike Air Max',
          type: 'review',
          isRead: true,
          link: '/products/nike-air-max/reviews',
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
          message: 'New review received for Nike Air Max',
          type: 'review',
          isRead: true,
          link: '/vendors/products/nike-air-max/reviews',
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