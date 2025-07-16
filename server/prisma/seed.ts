
import { PrismaClient, UserRole, OrderStatus, PaymentMethod, PaymentStatus, ProductStatus } from '@prisma/client';
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
    
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.shipment.deleteMany();
    await prisma.commission.deleteMany();
    await prisma.payoutRequest.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productTag.deleteMany();
    await prisma.productAttribute.deleteMany();
    await prisma.address.deleteMany(); // address references userId
    await prisma.order.deleteMany(); // <-- add this line to delete orders before vendor and user
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.vendor.deleteMany(); // vendor references userId
    // Now it's safe to delete users
    await prisma.user.deleteMany();
    
    console.log('Existing data cleaned up!');

    // Passwords
    const password1 = await bcrypt.hash('customer123', 10);
    const password2 = await bcrypt.hash('customer456', 10);
    const password3 = await bcrypt.hash('vendor123', 10);
    const password4 = await bcrypt.hash('vendor456', 10);
    const password5 = await bcrypt.hash('vendor789', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    console.log('Creating users...');

    // Users
    const customer1 = await prisma.user.upsert({
      where: { email: 'customer1@example.com' },
      update: {},
      create: {
        email: 'customer1@example.com',
        passwordHash: password1,
        firstName: 'Anita',
        lastName: 'Sharma',
        phone: '+977-9800000001',
        role: UserRole.CUSTOMER,
        avatar: '/images/users/customer1-avatar.jpg',
        lastLogin: new Date('2025-07-15T10:00:00+05:45'),
      },
    });

    const customer2 = await prisma.user.upsert({
      where: { email: 'customer2@example.com' },
      update: {},
      create: {
        email: 'customer2@example.com',
        passwordHash: password2,
        firstName: 'Suman',
        lastName: 'Thapa',
        phone: '+977-9800000002',
        role: UserRole.CUSTOMER,
        avatar: '/images/users/customer2-avatar.jpg',
        lastLogin: new Date('2025-07-14T14:30:00+05:45'),
      },
    });

    const vendorUser1 = await prisma.user.upsert({
      where: { email: 'vendor1@example.com' },
      update: {},
      create: {
        email: 'vendor1@example.com',
        passwordHash: password3,
        firstName: 'Ravi',
        lastName: 'Gurung',
        phone: '+977-9800000003',
        role: UserRole.VENDOR,
        avatar: '/images/users/vendor1-avatar.jpg',
        lastLogin: new Date('2025-07-16T09:15:00+05:45'),
      },
    });

    const vendorUser2 = await prisma.user.upsert({
      where: { email: 'vendor2@example.com' },
      update: {},
      create: {
        email: 'vendor2@example.com',
        passwordHash: password4,
        firstName: 'Priya',
        lastName: 'Tamang',
        phone: '+977-9800000004',
        role: UserRole.VENDOR,
        avatar: '/images/users/vendor2-avatar.jpg',
        lastLogin: new Date('2025-07-15T16:20:00+05:45'),
      },
    });

    const vendorUser3 = await prisma.user.upsert({
      where: { email: 'vendor3@example.com' },
      update: {},
      create: {
        email: 'vendor3@example.com',
        passwordHash: password5,
        firstName: 'Kiran',
        lastName: 'Rai',
        phone: '+977-9800000005',
        role: UserRole.VENDOR,
        avatar: '/images/users/vendor3-avatar.jpg',
        lastLogin: new Date('2025-07-13T11:00:00+05:45'),
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
        lastLogin: new Date('2025-07-16T15:00:00+05:45'),
      },
    });

    console.log('Creating vendors...');

    // Vendors (one approved, one unapproved, one admin team)
    const vendor1 = await prisma.vendor.upsert({
      where: { userId: vendorUser1.id },
      update: {},
      create: {
        userId: vendorUser1.id,
        businessName: 'Beauty Bliss',
        businessEmail: 'vendor1biz@example.com',
        businessPhone: '+977-9800001001',
        slug: 'beauty-bliss',
        description: 'Premium beauty and skincare products',
        isApproved: true,
        approvedAt: new Date('2025-07-08T12:00:00+05:45'),
        website: 'https://beautybliss.com',
      },
    });

    const vendor2 = await prisma.vendor.upsert({
      where: { userId: vendorUser2.id },
      update: {},
      create: {
        userId: vendorUser2.id,
        businessName: 'Tech Trends',
        businessEmail: 'vendor2biz@example.com',
        businessPhone: '+977-9800001002',
        slug: 'tech-trends',
        description: 'Latest electronics and gadgets',
        isApproved: false, // Unapproved vendor
        website: 'https://techtrends.com',
      },
    });

    const adminVendor = await prisma.vendor.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        businessName: 'Platform Store',
        businessEmail: 'admin@platformstore.com',
        businessPhone: '+977-9800009999',
        slug: 'platform-store',
        description: 'Exclusive products from our platform',
        isApproved: true,
        approvedAt: new Date('2025-07-07T09:00:00+05:45'),
        website: 'https://platformstore.com',
      },
    });

    console.log('Creating addresses...');

    // Addresses
    await prisma.address.createMany({
      data: [
        {
          userId: customer1.id,
          label: 'Home',
          recipientName: 'Anita Sharma',
          street: '123 Main St',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44600',
          country: 'Nepal',
          phone: '+977-9800000001',
          isDefault: true,
        },
        {
          userId: customer1.id,
          label: 'Office',
          recipientName: 'Anita Sharma',
          street: '456 Office Rd',
          city: 'Lalitpur',
          state: 'Bagmati',
          postalCode: '44700',
          country: 'Nepal',
          phone: '+977-9800000001',
          isDefault: false,
        },
        {
          userId: customer2.id,
          label: 'Home',
          recipientName: 'Suman Thapa',
          street: '789 Home St',
          city: 'Bhaktapur',
          state: 'Bagmati',
          postalCode: '44800',
          country: 'Nepal',
          phone: '+977-9800000002',
          isDefault: true,
        },
      ],
    });

    console.log('Creating categories...');

    // Categories
    const categories = [
      { name: 'Skincare', slug: 'skincare', description: 'Skincare products for all skin types', isFeatured: true, featuredOrder: 1, image: '/images/categories/skincare.jpg' },
      { name: 'Home Appliances', slug: 'home-appliances', description: 'Appliances for your home', isFeatured: true, featuredOrder: 2, image: '/images/categories/home-appliances.jpg' },
      { name: 'Computers and Tech', slug: 'computers-and-tech', description: 'Latest tech gadgets', isFeatured: true, featuredOrder: 3, image: '/images/categories/computers-and-tech.jpg' },
      { name: 'Male Skincare', slug: 'male-skincare', description: 'Skincare tailored for men', isFeatured: false, image: '/images/categories/male-skincare.jpg' },
      { name: 'Women’s Fashion', slug: 'womens-fashion', description: 'Trendy fashion for women', isFeatured: true, featuredOrder: 4, image: '/images/categories/womens-fashion.jpg' },
      { name: 'Men’s Fashion', slug: 'mens-fashion', description: 'Stylish fashion for men', isFeatured: false, image: '/images/categories/mens-fashion.jpg' },
    ];

    for (const categoryData of categories) {
      await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: { image: categoryData.image },
        create: categoryData,
      });
    }

    // Subcategories
    const skincareCategory = await prisma.category.findUnique({ where: { slug: 'skincare' } });
    const homeAppliancesCategory = await prisma.category.findUnique({ where: { slug: 'home-appliances' } });
    const computersAndTechCategory = await prisma.category.findUnique({ where: { slug: 'computers-and-tech' } });

    if (skincareCategory) {
      await prisma.category.upsert({
        where: { slug: 'moisturizers' },
        update: { image: '/images/categories/moisturizers.jpg' },
        create: {
          name: 'Moisturizers',
          slug: 'moisturizers',
          description: 'Hydrating skincare products',
          parentId: skincareCategory.id,
          image: '/images/categories/moisturizers.jpg',
        },
      });
    }

    if (homeAppliancesCategory) {
      await prisma.category.upsert({
        where: { slug: 'kitchen-appliances' },
        update: { image: '/images/categories/kitchen-appliances.jpg' },
        create: {
          name: 'Kitchen Appliances',
          slug: 'kitchen-appliances',
          description: 'Appliances for your kitchen',
          parentId: homeAppliancesCategory.id,
          image: '/images/categories/kitchen-appliances.jpg',
        },
      });
    }

    if (computersAndTechCategory) {
      await prisma.category.upsert({
        where: { slug: 'smartphones' },
        update: { image: '/images/categories/smartphones.jpg' },
        create: {
          name: 'Smartphones',
          slug: 'smartphones',
          description: 'Latest smartphones',
          parentId: computersAndTechCategory.id,
          image: '/images/categories/smartphones.jpg',
        },
      });
    }

    console.log('Creating products...');

    // Products (10 products across categories, including platform store)
    const maleSkincareCategory = await prisma.category.findUnique({ where: { slug: 'male-skincare' } });
    const womensFashionCategory = await prisma.category.findUnique({ where: { slug: 'womens-fashion' } });
    const mensFashionCategory = await prisma.category.findUnique({ where: { slug: 'mens-fashion' } });

    const products = [
      {
        name: 'Hydrating Moisturizer',
        slug: 'hydrating-moisturizer',
        description: 'Lightweight moisturizer for daily use',
        shortDescription: 'Hydrates all skin types',
        price: 25.00,
        salePrice: 20.00,
        costPrice: 15.00,
        sku: 'BB-MOIST-001',
        stockQuantity: 100,
        status: ProductStatus.ACTIVE,
        categoryId: skincareCategory?.id!,
        vendorId: vendor1.id,
        isFeatured: true,
        weight: 0.2,
      },
      {
        name: 'Matte Lipstick Red',
        slug: 'matte-lipstick-red',
        description: 'Long-lasting red matte lipstick',
        shortDescription: 'Bold red color',
        price: 15.00,
        sku: 'BB-LIP-001',
        stockQuantity: 50,
        status: ProductStatus.ACTIVE,
        categoryId: skincareCategory?.id!,
        vendorId: vendor1.id,
        isFeatured: false,
        weight: 0.05,
      },
      {
        name: 'Air Fryer 5L',
        slug: 'air-fryer-5l',
        description: 'Healthy cooking with 5L air fryer',
        shortDescription: 'Oil-free frying',
        price: 120.00,
        salePrice: 100.00,
        costPrice: 80.00,
        sku: 'TT-AIRFRY-001',
        stockQuantity: 30,
        status: ProductStatus.ACTIVE,
        categoryId: homeAppliancesCategory?.id!,
        vendorId: vendor2.id,
        isFeatured: true,
        weight: 5.0,
      },
      {
        name: 'Smartphone 128GB',
        slug: 'smartphone-128gb',
        description: 'High-performance smartphone with 128GB storage',
        shortDescription: 'Fast and reliable',
        price: 500.00,
        salePrice: 450.00,
        costPrice: 400.00,
        sku: 'TT-PHONE-001',
        stockQuantity: 20,
        status: ProductStatus.ACTIVE,
        categoryId: computersAndTechCategory?.id!,
        vendorId: vendor2.id,
        isFeatured: true,
        weight: 0.3,
      },
      {
        name: 'Men’s Face Wash',
        slug: 'mens-face-wash',
        description: 'Gentle face wash for men',
        shortDescription: 'Cleanses without drying',
        price: 18.00,
        sku: 'BB-MFACE-001',
        stockQuantity: 80,
        status: ProductStatus.ACTIVE,
        categoryId: maleSkincareCategory?.id,
        vendorId: vendor1.id,
        isFeatured: false,
        weight: 0.15,
      },
      {
        name: 'Women’s Kurta Set',
        slug: 'womens-kurta-set',
        description: 'Elegant kurta set for women',
        shortDescription: 'Traditional style',
        price: 45.00,
        sku: 'BB-KURTA-001',
        stockQuantity: 40,
        status: ProductStatus.ACTIVE,
        categoryId: womensFashionCategory?.id,
        vendorId: vendor1.id,
        isFeatured: true,
        weight: 0.5,
      },
      {
        name: 'Men’s Casual Shirt',
        slug: 'mens-casual-shirt',
        description: 'Comfortable casual shirt for men',
        shortDescription: 'Stylish and comfy',
        price: 30.00,
        sku: 'BB-SHIRT-001',
        stockQuantity: 60,
        status: ProductStatus.ACTIVE,
        categoryId: mensFashionCategory?.id,
        vendorId: vendor1.id,
        isFeatured: false,
        weight: 0.3,
      },
      {
        name: 'Platform Vitamin C Serum',
        slug: 'platform-vitamin-c-serum',
        description: 'Brightening vitamin C serum by platform',
        shortDescription: 'Brightens skin',
        price: 30.00,
        sku: 'PS-SERUM-001',
        stockQuantity: 50,
        status: ProductStatus.ACTIVE,
        categoryId: skincareCategory?.id!,
        vendorId: adminVendor.id,
        isFeatured: true,
        weight: 0.15,
      },
      {
        name: 'Platform Wireless Mouse',
        slug: 'platform-wireless-mouse',
        description: 'Ergonomic wireless mouse by platform',
        shortDescription: 'Smooth and precise',
        price: 25.00,
        sku: 'PS-MOUSE-001',
        stockQuantity: 70,
        status: ProductStatus.ACTIVE,
        categoryId: computersAndTechCategory?.id!,
        vendorId: adminVendor.id,
        isFeatured: false,
        weight: 0.1,
      },
      {
        name: 'Electric Kettle 1.8L',
        slug: 'electric-kettle-1.8l',
        description: 'Fast-boiling 1.8L electric kettle',
        shortDescription: 'Quick and efficient',
        price: 35.00,
        sku: 'TT-KETTLE-001',
        stockQuantity: 0,
        status: ProductStatus.OUT_OF_STOCK,
        categoryId: homeAppliancesCategory?.id!,
        vendorId: vendor2.id,
        isFeatured: false,
        weight: 1.2,
      },
      {
        name: 'Men’s Beard Oil',
        slug: 'mens-beard-oil',
        description: 'Nourishing beard oil for men',
        shortDescription: 'Softens beard',
        price: 20.00,
        sku: 'BB-BEARD-001',
        stockQuantity: 90,
        status: ProductStatus.DRAFT,
        categoryId: maleSkincareCategory?.id,
        vendorId: vendor1.id,
        isFeatured: false,
        weight: 0.1,
      },
    ];

    for (const p of products) {
      if (p.categoryId) {
        await prisma.product.upsert({
          where: { slug: p.slug },
          update: {},
          create: {
            name: p.name,
            slug: p.slug,
            description: p.description,
            shortDescription: p.shortDescription,
            price: p.price,
            salePrice: p.salePrice,
            costPrice: p.costPrice,
            sku: p.sku,
            stockQuantity: p.stockQuantity,
            status: p.status,
            categoryId: p.categoryId,
            vendorId: p.vendorId,
            isFeatured: p.isFeatured,
            weight: p.weight,
            images: {
              create: [
                { url: `/images/products/${p.slug}.jpg`, altText: p.name, isPrimary: true, order: 1 },
                { url: `/images/products/${p.slug}-2.jpg`, altText: `${p.name} Alternate`, isPrimary: false, order: 2 },
              ],
            },
            tags: {
          create: [
                { name: p.status === ProductStatus.ACTIVE ? 'Active' : p.status === ProductStatus.OUT_OF_STOCK ? 'Out of Stock' : 'Draft' },
                { name: p.isFeatured ? 'Featured' : 'Standard' },
              ],
            },
            attributes: {
          create: [
                { name: 'Brand', value: p.vendorId === vendor1.id ? 'Beauty Bliss' : p.vendorId === vendor2.id ? 'Tech Trends' : 'Platform Store' },
                { name: 'Category', value: p.categoryId === skincareCategory?.id ? 'Skincare' : p.categoryId === homeAppliancesCategory?.id ? 'Home Appliances' : p.categoryId === computersAndTechCategory?.id ? 'Computers and Tech' : p.categoryId === maleSkincareCategory?.id ? 'Male Skincare' : p.categoryId === womensFashionCategory?.id ? 'Women’s Fashion' : mensFashionCategory?.id ? 'Men’s Fashion' : 'Unknown' },
              ],
            },
          },
        });
      }
    }

    console.log('Creating orders...');

    // Helper: product snapshot
    const productSnapshot = (product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      sku: product.sku,
    });

    // Fetch products for orders
    const moisturizer = await prisma.product.findUnique({ where: { slug: 'hydrating-moisturizer' } });
    const lipstick = await prisma.product.findUnique({ where: { slug: 'matte-lipstick-red' } });
    const airFryer = await prisma.product.findUnique({ where: { slug: 'air-fryer-5l' } });
    const smartphone = await prisma.product.findUnique({ where: { slug: 'smartphone-128gb' } });
    const faceWash = await prisma.product.findUnique({ where: { slug: 'mens-face-wash' } });
    const kurta = await prisma.product.findUnique({ where: { slug: 'womens-kurta-set' } });
    const shirt = await prisma.product.findUnique({ where: { slug: 'mens-casual-shirt' } });
    const serum = await prisma.product.findUnique({ where: { slug: 'platform-vitamin-c-serum' } });

    // Orders (covering all statuses)
    const orders = [
      {
        orderNumber: 'ORD-1001',
        userId: customer1.id,
        status: OrderStatus.DRAFT,
        paymentMethod: PaymentMethod.KHALTI,
        paymentStatus: PaymentStatus.PENDING,
        subtotal: 20.00,
        shippingFee: 5.00,
        total: 25.00,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Anita Sharma',
          street: '123 Main St',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44600',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: [
            {
            productId: moisturizer?.id!,
            vendorId: moisturizer?.vendorId,
              quantity: 1,
            price: 20.00,
            salePrice: 20.00,
            productSnapshot: productSnapshot(moisturizer),
          },
        ],
        createdAt: new Date('2025-07-16T10:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1002',
        userId: customer1.id,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.KHALTI,
        paymentStatus: PaymentStatus.PENDING,
        subtotal: 15.00,
        shippingFee: 5.00,
        total: 20.00,
        shippingAddress: {
          label: 'Office',
          recipientName: 'Anita Sharma',
          street: '456 Office Rd',
          city: 'Lalitpur',
          state: 'Bagmati',
          postalCode: '44700',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: [
            {
            productId: lipstick?.id!,
            vendorId: lipstick?.vendorId,
              quantity: 1,
            price: 15.00,
            productSnapshot: productSnapshot(lipstick),
          },
        ],
        createdAt: new Date('2025-07-15T14:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1003',
        userId: customer2.id,
        status: OrderStatus.RESERVED,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.PENDING,
        subtotal: 450.00,
        shippingFee: 10.00,
        total: 460.00,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Suman Thapa',
          street: '789 Home St',
          city: 'Bhaktapur',
          state: 'Bagmati',
          postalCode: '44800',
          country: 'Nepal',
          phone: '+977-9800000002',
        },
        items: [
          {
            productId: smartphone?.id!,
            vendorId: smartphone?.vendorId,
            quantity: 1,
            price: 450.00,
            salePrice: 450.00,
            productSnapshot: productSnapshot(smartphone),
          },
        ],
        createdAt: new Date('2025-07-14T09:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1004',
        userId: customer2.id,
        status: OrderStatus.PROCESSING,
        paymentMethod: PaymentMethod.KHALTI,
        paymentStatus: PaymentStatus.COMPLETED,
        subtotal: 100.00,
        shippingFee: 10.00,
        total: 110.00,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Suman Thapa',
          street: '789 Home St',
          city: 'Bhaktapur',
          state: 'Bagmati',
          postalCode: '44800',
          country: 'Nepal',
          phone: '+977-9800000002',
        },
        items: [
            {
            productId: airFryer?.id!,
            vendorId: airFryer?.vendorId,
              quantity: 1,
            price: 100.00,
            salePrice: 100.00,
            productSnapshot: productSnapshot(airFryer),
          },
        ],
        createdAt: new Date('2025-07-13T11:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1005',
        userId: customer1.id,
        status: OrderStatus.SHIPPED,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.PENDING,
        subtotal: 18.00,
        shippingFee: 5.00,
        total: 23.00,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Anita Sharma',
          street: '123 Main St',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44600',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: [
            {
            productId: faceWash?.id!,
            vendorId: faceWash?.vendorId,
              quantity: 1,
            price: 18.00,
            productSnapshot: productSnapshot(faceWash),
          },
        ],
        createdAt: new Date('2025-07-12T12:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1006',
        userId: customer2.id,
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.KHALTI,
        paymentStatus: PaymentStatus.COMPLETED,
        subtotal: 45.00,
        shippingFee: 5.00,
        total: 50.00,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Suman Thapa',
          street: '789 Home St',
          city: 'Bhaktapur',
          state: 'Bagmati',
          postalCode: '44800',
          country: 'Nepal',
          phone: '+977-9800000002',
        },
        items: [
          {
            productId: kurta?.id!,
            vendorId: kurta?.vendorId,
            quantity: 1,
            price: 45.00,
            productSnapshot: productSnapshot(kurta),
          },
        ],
        createdAt: new Date('2025-07-11T10:00:00+05:45'),
        completedAt: new Date('2025-07-13T15:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1007',
        userId: customer1.id,
        status: OrderStatus.CANCELLED,
        paymentMethod: PaymentMethod.KHALTI,
        paymentStatus: PaymentStatus.FAILED,
        subtotal: 65.00,
        shippingFee: 10.00,
        total: 75.00,
        shippingAddress: {
          label: 'Office',
          recipientName: 'Anita Sharma',
          street: '456 Office Rd',
          city: 'Lalitpur',
          state: 'Bagmati',
          postalCode: '44700',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: [
          {
            productId: moisturizer?.id!,
            vendorId: moisturizer?.vendorId,
            quantity: 1,
            price: 20.00,
            salePrice: 20.00,
            productSnapshot: productSnapshot(moisturizer),
          },
          {
            productId: kurta?.id!,
            vendorId: kurta?.vendorId,
            quantity: 1,
            price: 45.00,
            productSnapshot: productSnapshot(kurta),
          },
        ],
        createdAt: new Date('2025-07-10T14:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1008',
        userId: customer2.id,
        status: OrderStatus.RETURNED,
        paymentMethod: PaymentMethod.COD,
        paymentStatus: PaymentStatus.PENDING,
        subtotal: 30.00,
        shippingFee: 5.00,
        total: 35.00,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Suman Thapa',
          street: '789 Home St',
          city: 'Bhaktapur',
          state: 'Bagmati',
          postalCode: '44800',
          country: 'Nepal',
          phone: '+977-9800000002',
        },
        items: [
            {
            productId: shirt?.id!,
            vendorId: shirt?.vendorId,
              quantity: 1,
            price: 30.00,
            productSnapshot: productSnapshot(shirt),
          },
        ],
        createdAt: new Date('2025-07-09T09:00:00+05:45'),
        completedAt: new Date('2025-07-12T12:00:00+05:45'),
      },
      {
        orderNumber: 'ORD-1009',
        userId: customer1.id,
        status: OrderStatus.DELIVERED,
        paymentMethod: PaymentMethod.KHALTI,
        paymentStatus: PaymentStatus.COMPLETED,
        subtotal: 30.00,
        shippingFee: 5.00,
        total: 35.00,
        shippingAddress: {
          label: 'Home',
          recipientName: 'Anita Sharma',
          street: '123 Main St',
          city: 'Kathmandu',
          state: 'Bagmati',
          postalCode: '44600',
          country: 'Nepal',
          phone: '+977-9800000001',
        },
        items: [
          {
            productId: serum?.id!,
            vendorId: serum?.vendorId,
            quantity: 1,
            price: 30.00,
            productSnapshot: productSnapshot(serum),
          },
        ],
        createdAt: new Date('2025-07-08T11:00:00+05:45'),
        completedAt: new Date('2025-07-10T15:00:00+05:45'),
      },
    ];

    for (const order of orders) {
      await prisma.order.create({
        data: {
          orderNumber: order.orderNumber,
          userId: order.userId,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          total: order.total,
          shippingAddress: order.shippingAddress,
          createdAt: order.createdAt,
          completedAt: order.completedAt,
          items: {
            create: order.items.map((item) => ({
              product: { connect: { id: item.productId } },
              Vendor: { connect: { id: item.vendorId } }, // Capital V
              quantity: item.quantity,
              price: item.price,
              ...("salePrice" in item ? { salePrice: item.salePrice } : {}),
              productSnapshot: item.productSnapshot,
            })),
          },
          payments: order.paymentStatus === PaymentStatus.COMPLETED ? {
            create: {
              amount: order.total,
              method: order.paymentMethod,
              transactionId: `TXN-${order.orderNumber}`,
              status: PaymentStatus.COMPLETED,
              processedAt: order.createdAt,
              paymentDetails: { gateway: order.paymentMethod, status: 'success' },
            },
          } : undefined,
      },
    });
    }

    console.log('Creating shipments...');

    // Shipments for SHIPPED, DELIVERED, and RETURNED orders
    const order5 = await prisma.order.findUnique({ where: { orderNumber: 'ORD-1005' } });
    const order6 = await prisma.order.findUnique({ where: { orderNumber: 'ORD-1006' } });
    const order8 = await prisma.order.findUnique({ where: { orderNumber: 'ORD-1008' } });
    const order9 = await prisma.order.findUnique({ where: { orderNumber: 'ORD-1009' } });

    await prisma.shipment.createMany({
      data: [
        {
          orderId: order5?.id!,
          trackingNumber: 'TRK1005',
          carrier: 'Nepal Post',
          status: 'shipped',
          shippedAt: new Date('2025-07-13T10:00:00+05:45'),
        },
        {
          orderId: order6?.id!,
          trackingNumber: 'TRK1006',
          carrier: 'DHL',
          status: 'delivered',
          shippedAt: new Date('2025-07-12T09:00:00+05:45'),
          deliveredAt: new Date('2025-07-13T15:00:00+05:45'),
        },
        {
          orderId: order8?.id!,
          trackingNumber: 'TRK1008',
          carrier: 'Nepal Post',
          status: 'returned',
          shippedAt: new Date('2025-07-10T10:00:00+05:45'),
          deliveredAt: new Date('2025-07-11T12:00:00+05:45'),
        },
        {
          orderId: order9?.id!,
          trackingNumber: 'TRK1009',
          carrier: 'DHL',
          status: 'delivered',
          shippedAt: new Date('2025-07-09T09:00:00+05:45'),
          deliveredAt: new Date('2025-07-10T15:00:00+05:45'),
        },
      ],
    });

    console.log('Creating reviews...');

    // Reviews
    const orderItems = await prisma.orderItem.findMany({
      include: { order: true, product: true },
      where: { order: { userId: { in: [customer1.id, customer2.id] } } },
    });

    const findOrderItem = (userId: number, productId: number) => {
      return orderItems.find(oi => oi.order.userId === userId && oi.productId === productId);
    };

    const reviews = [
      {
        userId: customer1.id,
        productId: moisturizer?.id!,
        orderItemId: findOrderItem(customer1.id, moisturizer?.id!)?.id!,
        rating: 5,
        title: 'Amazing Moisturizer',
        comment: 'Keeps my skin hydrated all day!',
        images: JSON.stringify(['/images/reviews/moisturizer-review.jpg']),
        createdAt: new Date('2025-07-14T14:00:00+05:45'),
        isApproved: true,
      },
      {
        userId: customer1.id,
        productId: kurta?.id!,
        orderItemId: findOrderItem(customer1.id, kurta?.id!)?.id!,
        rating: 4,
        title: 'Elegant Kurta',
        comment: 'Beautiful design, but sizing is slightly off.',
        images: JSON.stringify([]),
        createdAt: new Date('2025-07-13T16:00:00+05:45'),
        isApproved: true,
      },
      {
        userId: customer2.id,
        productId: smartphone?.id!,
        orderItemId: findOrderItem(customer2.id, smartphone?.id!)?.id!,
        rating: 5,
        title: 'Fantastic Phone',
        comment: 'Super fast and great camera!',
        images: JSON.stringify(['/images/reviews/smartphone-review.jpg']),
        createdAt: new Date('2025-07-15T10:00:00+05:45'),
        isApproved: true,
      },
      {
        userId: customer2.id,
        productId: kurta?.id!,
        orderItemId: findOrderItem(customer2.id, kurta?.id!)?.id!,
        rating: 5,
        title: 'Love This Kurta',
        comment: 'Perfect fit and vibrant colors!',
        images: JSON.stringify(['/images/reviews/kurta-review.jpg']),
        createdAt: new Date('2025-07-14T12:00:00+05:45'),
        isApproved: true,
      },
      {
        userId: customer2.id,
        productId: shirt?.id!,
        orderItemId: findOrderItem(customer2.id, shirt?.id!)?.id!,
        rating: 3,
        title: 'Okay Shirt',
        comment: 'Comfortable but faded after wash.',
        images: JSON.stringify([]),
        createdAt: new Date('2025-07-12T18:00:00+05:45'),
        isApproved: false, // Unapproved review
      },
      {
        userId: customer1.id,
        productId: serum?.id!,
        orderItemId: findOrderItem(customer1.id, serum?.id!)?.id!,
        rating: 4,
        title: 'Good Serum',
        comment: 'Brightens skin, but takes time to see results.',
        images: JSON.stringify([]),
        createdAt: new Date('2025-07-11T10:00:00+05:45'),
        isApproved: true,
      },
    ];

    for (const r of reviews) {
      if (r.orderItemId) {
        await prisma.review.create({
          data: {
            userId: r.userId,
            productId: r.productId,
            orderItemId: r.orderItemId,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            images: r.images,
            isApproved: r.isApproved,
            createdAt: r.createdAt,
          },
        });
      }
    }

    console.log('Creating commissions...');

    // Commissions for DELIVERED orders
    for (const item of orderItems) {
      if (item.order.status === OrderStatus.DELIVERED) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (product && product.vendorId) {
          const commissionRate = 0.1; // 10% commission
          const commissionAmount = Number(item.salePrice || item.price) * commissionRate;
          await prisma.commission.create({
            data: {
              vendorId: product.vendorId,
              orderItemId: item.id,
              amount: commissionAmount,
              rate: commissionRate,
              createdAt: item.order.completedAt || item.createdAt,
            },
          });
        }
      }
    }

    console.log('Creating payout requests...');

    // Payout Requests (pending and completed)
    await prisma.payoutRequest.createMany({
      data: [
        {
          vendorId: vendor1.id,
          amount: 50.00,
          status: 'pending',
          createdAt: new Date('2025-07-15T12:00:00+05:45'),
        },
        {
          vendorId: adminVendor.id,
          amount: 100.00,
          status: 'completed',
          createdAt: new Date('2025-07-14T10:00:00+05:45'),
          updatedAt: new Date('2025-07-15T14:00:00+05:45'),
        },
      ],
    });

    console.log('Seed data created successfully!');
    console.log(`Created: ${await prisma.user.count()} users, ${await prisma.vendor.count()} vendors, ${await prisma.category.count()} categories, ${await prisma.product.count()} products, ${await prisma.order.count()} orders`);

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
