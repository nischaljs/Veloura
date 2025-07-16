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
    await prisma.productImage.deleteMany();
    await prisma.productTag.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.productAttribute.deleteMany();
    await prisma.address.deleteMany();
    await prisma.adminActivity.deleteMany();
    await prisma.bankDetail.deleteMany();
    
    // Delete products and related data
    await prisma.product.deleteMany();
    
    // Delete categories (subcategories will be deleted automatically due to cascade)
    await prisma.category.deleteMany();
    
    // Delete brands
    // await prisma.brand.deleteMany(); // REMOVE this line
    
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

    // --- INHOUSE/ADMIN VENDOR ---
    const adminVendor = await prisma.vendor.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        businessName: 'Inhouse',
        businessEmail: 'admin@inhouse.com',
        businessPhone: '+977-9800009999',
        slug: 'inhouse',
        description: 'Our inhouse products and exclusive items',
        isApproved: true,
        website: 'https://yourstore.com/inhouse',
        logo: '/images/brands/inhouse-logo.jpg',
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

    // REMOVE: Creating brands and all brand upserts
    // REMOVE: All code that creates or upserts brands
    // REMOVE: All code that fetches brands for product seeding

    // --- SEED CATEGORIES ---
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

    // Fetch mensFashion and womensFashion categories for product seeding
    const mensFashion = await prisma.category.findUnique({ where: { slug: 'mens-fashion' } });
    const womensFashion = await prisma.category.findUnique({ where: { slug: 'womens-fashion' } });

    // --- INHOUSE PRODUCTS ---
    const inhouseProducts = [
      {
        name: 'Inhouse Exclusive 1',
        slug: 'inhouse-exclusive-1',
        description: 'Exclusive product from our inhouse brand.',
        shortDescription: 'Inhouse product 1.',
        price: 150,
        sku: 'IH1-001',
        stockQuantity: 100,
        categoryId: mensFashion?.id!,
        vendorId: adminVendor.id,
        image: '/images/products/inhouse1.jpg',
        isFeatured: true,
      },
      {
        name: 'Inhouse Exclusive 2',
        slug: 'inhouse-exclusive-2',
        description: 'Another exclusive inhouse product.',
        shortDescription: 'Inhouse product 2.',
        price: 200,
        sku: 'IH2-001',
        stockQuantity: 80,
        categoryId: womensFashion?.id!,
        vendorId: adminVendor.id,
        image: '/images/products/inhouse2.jpg',
        isFeatured: false,
      },
    ];
    for (const p of inhouseProducts) {
      if (p.categoryId && p.vendorId) {
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
    const sampleProduct1 = await prisma.product.findUnique({ where: { slug: 'sample-product-1' } });
    const sampleProduct2 = await prisma.product.findUnique({ where: { slug: 'sample-product-2' } });

    // --- SEED CARTS & WISHLISTS ---
    console.log('Creating carts and wishlists...');

    // Cart for customer1
    const cart1 = await prisma.cart.upsert({
      where: { userId: customer1.id },
      update: {},
      create: {
        userId: customer1.id,
        items: {
          create: [
            { productId: sampleProduct1?.id!, quantity: 1 },
            { productId: sampleProduct2?.id!, quantity: 1 },
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
            { productId: sampleProduct2?.id!, quantity: 2 },
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
            { productId: sampleProduct1?.id! },
            { productId: sampleProduct2?.id! },
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
            { productId: sampleProduct2?.id! },
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
              productId: sampleProduct1?.id!,
              vendorId: vendor1Db!.id,
              quantity: 1,
              price: 120,
              salePrice: null,
              productSnapshot: productSnapshot(sampleProduct1),
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
              productId: sampleProduct2?.id!,
              vendorId: vendor2Db!.id,
              quantity: 1,
              price: 30,
              salePrice: null,
              productSnapshot: productSnapshot(sampleProduct2),
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
              productId: sampleProduct2?.id!,
              vendorId: vendor2Db!.id,
              quantity: 2,
              price: 20,
              salePrice: null,
              productSnapshot: productSnapshot(sampleProduct2),
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
              productId: sampleProduct1?.id!,
              vendorId: vendor1Db!.id,
              quantity: 1,
              price: 120,
              salePrice: null,
              productSnapshot: productSnapshot(sampleProduct1),
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
              productId: sampleProduct2?.id!,
              vendorId: vendor2Db!.id,
              quantity: 1,
              price: 45,
              salePrice: null,
              productSnapshot: productSnapshot(sampleProduct2),
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
              productId: sampleProduct2?.id!,
              vendorId: vendor2Db!.id,
              quantity: 1,
              price: 20,
              salePrice: null,
              productSnapshot: productSnapshot(sampleProduct2),
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
        product: sampleProduct1,
        orderItem: findOrderItem(customer1Db!.id, sampleProduct1?.id!),
        rating: 5,
        title: 'Great running shoes!',
        comment: 'Comfortable and stylish, perfect for my daily runs.',
        images: JSON.stringify(['/images/reviews/nike-shoes-review.jpg']),
      },
      {
        user: customer1Db,
        product: sampleProduct2,
        orderItem: findOrderItem(customer1Db!.id, sampleProduct2?.id!),
        rating: 4,
        title: 'Good moisturizer',
        comment: 'Leaves my skin feeling soft, but a bit pricey.',
        images: JSON.stringify(['/images/reviews/loreal-cream-review.jpg']),
      },
      {
        user: customer2Db,
        product: sampleProduct2,
        orderItem: findOrderItem(customer2Db!.id, sampleProduct2?.id!),
        rating: 5,
        title: 'Amazing color!',
        comment: 'Love the shade and how long it lasts.',
        images: JSON.stringify(['/images/reviews/sephora-lipstick-review.jpg']),
      },
      {
        user: customer2Db,
        product: sampleProduct1,
        orderItem: findOrderItem(customer2Db!.id, sampleProduct1?.id!),
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
    console.log(`Created: ${await prisma.user.count()} users, ${await prisma.vendor.count()} vendors, ${await prisma.category.count()} categories`);

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