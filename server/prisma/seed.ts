
import { PrismaClient, UserRole, OrderStatus, PaymentMethod, PaymentStatus, ProductStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up all data in correct order
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.payoutRequest.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Passwords
  const customerPassword = await bcrypt.hash('customer123', 10);
  const vendor1Password = await bcrypt.hash('vendor123', 10);
  const vendor2Password = await bcrypt.hash('vendor456', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Users
  const customer = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      passwordHash: customerPassword,
      firstName: 'Anita',
      lastName: 'Sharma',
      phone: '+977-9800000001',
      role: UserRole.CUSTOMER,
      avatar: '/images/users/customer1-avatar.jpg',
      lastLogin: new Date(),
    },
  });
  const vendorUser1 = await prisma.user.create({
    data: {
      email: 'vendor1@example.com',
      passwordHash: vendor1Password,
      firstName: 'Ravi',
      lastName: 'Gurung',
      phone: '+977-9800000003',
      role: UserRole.VENDOR,
      avatar: '/images/users/vendor1-avatar.jpg',
      lastLogin: new Date(),
    },
  });
  const vendorUser2 = await prisma.user.create({
    data: {
      email: 'vendor2@example.com',
      passwordHash: vendor2Password,
      firstName: 'Priya',
      lastName: 'Tamang',
      phone: '+977-9800000004',
      role: UserRole.VENDOR,
      avatar: '/images/users/vendor2-avatar.jpg',
      lastLogin: new Date(),
    },
  });
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+977-9800000000',
      role: UserRole.ADMIN,
      avatar: '/images/users/admin-avatar.jpg',
      lastLogin: new Date(),
    },
  });

  // Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      userId: vendorUser1.id,
      businessName: 'Beauty Bliss',
      businessEmail: 'vendor1biz@example.com',
      businessPhone: '+977-9800001001',
      slug: 'beauty-bliss',
      description: 'Premium beauty and skincare products',
      isApproved: true,
      isAdminTeam: true,
      approvedAt: new Date(),
      website: 'https://beautybliss.com',
    },
  });
  const vendor2 = await prisma.vendor.create({
    data: {
      userId: vendorUser2.id,
      businessName: 'Tech Trends',
      businessEmail: 'vendor2biz@example.com',
      businessPhone: '+977-9800001002',
      slug: 'tech-trends',
      description: 'Latest electronics and gadgets',
      isApproved: true,
      isAdminTeam: false,
      approvedAt: new Date(),
      website: 'https://techtrends.com',
    },
  });

  // Categories (with working PNG images)
  const categories = [
    { name: 'Skincare', slug: 'skincare', image: '/images/categories/skincare.png' },
    { name: 'Home Appliances', slug: 'home-appliances', image: '/images/categories/home-appliances.png' },
    { name: 'Computers and Tech', slug: 'computers-and-tech', image: '/images/categories/computers-and-tech.png' },
    { name: 'Male Skincare', slug: 'male-skincare', image: '/images/categories/male-skincare.png' },
    { name: 'Women’s Fashion', slug: 'womens-fashion', image: '/images/categories/womens-fashion.png' },
    { name: 'Men’s Fashion', slug: 'mens-fashion', image: '/images/categories/mens-fashion.png' },
  ];
  const categoryRecords = {} as Record<string, any>;
  for (const cat of categories) {
    categoryRecords[cat.slug] = await prisma.category.create({ data: cat });
  }

  // Products (4 per vendor, 8 total, all with working PNG images and sensible categories)
  const products = [
    // Vendor 1
    { name: 'Hydrating Moisturizer', slug: 'hydrating-moisturizer', category: 'skincare', vendor: vendor1, price: 25, image: 'hydrating-moisturizer.png', isFeatured: true },
    { name: 'Men’s Face Wash', slug: 'mens-face-wash', category: 'male-skincare', vendor: vendor1, price: 18, image: 'mens-face-wash.png', isFeatured: false },
    { name: 'Matte Lipstick Red', slug: 'matte-lipstick-red', category: 'womens-fashion', vendor: vendor1, price: 15, image: 'matte-lipstick-red.png', isFeatured: false },
    { name: 'Men’s Casual Shirt', slug: 'mens-casual-shirt', category: 'mens-fashion', vendor: vendor1, price: 30, image: 'mens-casual-shirt.png', isFeatured: true },
    // Vendor 2
    { name: 'Air Fryer 5L', slug: 'air-fryer-5l', category: 'home-appliances', vendor: vendor2, price: 120, image: 'air-fryer-5l.png', isFeatured: true },
    { name: 'Wireless Mouse', slug: 'wireless-mouse', category: 'computers-and-tech', vendor: vendor2, price: 25, image: 'wireless-mouse.png', isFeatured: false },
    { name: 'Smartphone 128GB', slug: 'smartphone-128gb', category: 'computers-and-tech', vendor: vendor2, price: 500, image: 'smartphone-128gb.png', isFeatured: false },
    { name: 'Women’s Kurta Set', slug: 'womens-kurta-set', category: 'womens-fashion', vendor: vendor2, price: 45, image: 'womens-kurta-set.png', isFeatured: true },
  ];
  const productRecords = {} as Record<string, any>;
  for (const p of products) {
    productRecords[p.slug] = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.name + ' description',
        shortDescription: p.name,
        price: p.price,
        sku: p.slug.toUpperCase(),
        stockQuantity: 100,
        status: ProductStatus.ACTIVE,
        categoryId: categoryRecords[p.category].id,
        vendorId: p.vendor.id,
        isFeatured: p.isFeatured,
        weight: 0.2,
        images: {
          create: [
            { url: `/images/products/${p.image}`, altText: p.name, isPrimary: true, order: 1 },
          ],
        },
      },
    });
  }

  // Orders (2 orders, each referencing existing products)
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-1001',
      userId: customer.id,
      status: OrderStatus.DELIVERED,
      paymentMethod: PaymentMethod.KHALTI,
      paymentStatus: PaymentStatus.COMPLETED,
      subtotal: 40,
      shippingFee: 5,
      total: 45,
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
      createdAt: new Date(),
      completedAt: new Date(),
      items: {
        create: [
          {
            productId: productRecords['hydrating-moisturizer'].id,
            vendorId: vendor1.id,
            quantity: 1,
            price: 25,
            productSnapshot: {
              id: productRecords['hydrating-moisturizer'].id,
              name: 'Hydrating Moisturizer',
              slug: 'hydrating-moisturizer',
              price: 25,
              sku: 'HYDRATING-MOISTURIZER',
            },
          },
          {
            productId: productRecords['air-fryer-5l'].id,
            vendorId: vendor2.id,
            quantity: 1,
            price: 120,
            productSnapshot: {
              id: productRecords['air-fryer-5l'].id,
              name: 'Air Fryer 5L',
              slug: 'air-fryer-5l',
              price: 120,
              sku: 'AIR-FRYER-5L',
            },
          },
        ],
      },
      payments: {
        create: {
          amount: 45,
          method: PaymentMethod.KHALTI,
          transactionId: 'TXN-ORD-1001',
          status: PaymentStatus.COMPLETED,
          processedAt: new Date(),
          paymentDetails: { gateway: PaymentMethod.KHALTI, status: 'success' },
        },
      },
    },
  });
  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-1002',
      userId: customer.id,
      status: OrderStatus.PENDING,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      subtotal: 15,
      shippingFee: 5,
      total: 20,
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
      createdAt: new Date(),
      items: {
        create: [
          {
            productId: productRecords['matte-lipstick-red'].id,
            vendorId: vendor1.id,
            quantity: 1,
            price: 15,
            productSnapshot: {
              id: productRecords['matte-lipstick-red'].id,
              name: 'Matte Lipstick Red',
              slug: 'matte-lipstick-red',
              price: 15,
              sku: 'MATTE-LIPSTICK-RED',
            },
          },
        ],
      },
    },
  });

  // Reviews (only for products in the 2 orders)
  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: productRecords['hydrating-moisturizer'].id,
      orderItemId: (await prisma.orderItem.findFirst({ where: { productId: productRecords['hydrating-moisturizer'].id, orderId: order1.id } }))?.id!,
      rating: 5,
      title: 'Great Moisturizer',
      comment: 'Really hydrating!',
      images: JSON.stringify([]),
      isApproved: true,
      createdAt: new Date(),
    },
  });
  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: productRecords['matte-lipstick-red'].id,
      orderItemId: (await prisma.orderItem.findFirst({ where: { productId: productRecords['matte-lipstick-red'].id, orderId: order2.id } }))?.id!,
      rating: 4,
      title: 'Nice Lipstick',
      comment: 'Color is bold and lasts long.',
      images: JSON.stringify([]),
      isApproved: true,
      createdAt: new Date(),
    },
  });

  // Commissions (only for delivered order items)
  const deliveredOrderItems = await prisma.orderItem.findMany({ where: { orderId: order1.id } });
  for (const item of deliveredOrderItems) {
    await prisma.commission.create({
      data: {
        vendorId: item.vendorId!,
        orderItemId: item.id,
        amount: Number(item.price) * 0.1,
        rate: 0.1,
        createdAt: new Date(),
      },
    });
  }

  // Payouts (one for each vendor)
  await prisma.payoutRequest.create({
    data: {
      vendorId: vendor1.id,
      amount: 10,
      status: 'pending',
      createdAt: new Date(),
    },
  });
  await prisma.payoutRequest.create({
    data: {
      vendorId: vendor2.id,
      amount: 20,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('Minimal seed data created successfully!');
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
