import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// User Management
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, role, status, search, dateFrom, dateTo } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (role) where.role = role;
    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) where.createdAt.lte = new Date(dateTo as string);
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          addresses: true,
          orders: true,
          reviews: true
        }
      }),
      prisma.user.count({ where })
    ]);
    const formatted = users.map(u => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      avatar: u.avatar,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
      orderCount: u.orders.length,
      totalSpent: u.orders.reduce((sum, o) => sum + (o.total ? o.total.toNumber() : 0), 0)
    }));
    res.json({
      success: true,
      data: {
        users: formatted,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: true,
        reviews: true
      }
    });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          addresses: user.addresses,
          orders: user.orders.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            status: o.status,
            total: o.total,
            createdAt: o.createdAt
          })),
          reviews: user.reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            createdAt: r.createdAt
          }))
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, phone, role, isActive } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, phone, role, isActive }
    });
    res.json({ success: true, message: 'User updated successfully', data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // Optionally: handle cascade delete or orphaned data
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.update({ where: { id }, data: { isActive: true } });
    res.json({ success: true, message: 'User activated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.update({ where: { id }, data: { isActive: false } });
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Vendor Management
export const getVendors = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, search, dateFrom, dateTo } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (status === 'approved') where.isApproved = true;
    if (status === 'pending') where.isApproved = false;
    if (search) {
      where.OR = [
        { businessName: { contains: search as string, mode: 'insensitive' } },
        { businessEmail: { contains: search as string, mode: 'insensitive' } },
        { slug: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) where.createdAt.lte = new Date(dateTo as string);
    }
    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          products: true,
        }
      }),
      prisma.vendor.count({ where })
    ]);
    const formatted = vendors.map(v => ({
      id: v.id,
      businessName: v.businessName,
      businessEmail: v.businessEmail,
      businessPhone: v.businessPhone,
      slug: v.slug,
      isApproved: v.isApproved,
      approvedAt: v.approvedAt,
      rating: v.rating,
      totalReviews: v.totalReviews,
      totalProducts: v.products.length,
      totalSales: v.products.reduce((sum, p) => sum + (p.price ? p.price.toNumber() : 0), 0), // Placeholder, real sales should aggregate orders
      createdAt: v.createdAt,
      user: v.user,
    }));
    res.json({
      success: true,
      data: {
        vendors: formatted,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        products: { select: { id: true, name: true, status: true, price: true } },
      }
    });
    if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
    res.json({
      success: true,
      data: {
        vendor: {
          id: vendor.id,
          businessName: vendor.businessName,
          businessEmail: vendor.businessEmail,
          businessPhone: vendor.businessPhone,
          slug: vendor.slug,
          taxId: vendor.taxId,
          description: vendor.description,
          logo: vendor.logo,
          banner: vendor.banner,
          website: vendor.website,
          facebook: vendor.facebook,
          instagram: vendor.instagram,
          twitter: vendor.twitter,
          isApproved: vendor.isApproved,
          approvedAt: vendor.approvedAt,
          rating: vendor.rating,
          totalReviews: vendor.totalReviews,
          createdAt: vendor.createdAt,
          user: vendor.user,
          products: vendor.products,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const approveVendor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isApproved: true, approvedAt: new Date() }
    });
    // Also set the user's role to VENDOR if not already
    const user = await prisma.user.findUnique({ where: { id: vendor.userId } });
    if (user && user.role !== 'VENDOR') {
      await prisma.user.update({ where: { id: vendor.userId }, data: { role: 'VENDOR' } });
    }
    res.json({ success: true, message: 'Vendor approved successfully', data: { vendor } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const rejectVendor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // Optionally: store rejection reason in a log or notes field
    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isApproved: false, approvedAt: null }
    });
    res.json({ success: true, message: 'Vendor rejected successfully', data: { vendor } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const suspendVendor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // Optionally: store suspension reason/duration in a log or notes field
    // For now, just set isApproved to false
    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isApproved: false }
    });
    res.json({ success: true, message: 'Vendor suspended successfully', data: { vendor } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// --- Payout Management ---

/**
 * GET /admin/payout-requests - List all payout requests (paginated)
 */
export const getPayoutRequests = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, vendorId } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (status) where.status = status;
    if (vendorId) where.vendorId = Number(vendorId);
    const [payouts, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: { vendor: { select: { id: true, businessName: true, businessEmail: true } } }
      }),
      prisma.payoutRequest.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        payouts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * PUT /admin/payout-requests/:id/approve - Approve a payout request
 */
export const approvePayoutRequest = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payout = await prisma.payoutRequest.findUnique({ where: { id } });
    if (!payout) { res.status(404).json({ success: false, message: 'Payout request not found' }); return; }
    if (payout.status === 'PAID') { res.status(400).json({ success: false, message: 'Payout already approved' }); return; }
    const updated = await prisma.payoutRequest.update({
      where: { id },
      data: { status: 'PAID', updatedAt: new Date() }
    });
    // Optionally: log admin action
    res.json({ success: true, message: 'Payout request approved', data: { payout: updated } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * PUT /admin/payout-requests/:id/reject - Reject a payout request
 */
export const rejectPayoutRequest = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const payout = await prisma.payoutRequest.findUnique({ where: { id } });
    if (!payout) { res.status(404).json({ success: false, message: 'Payout request not found' }); return; }
    if (payout.status === 'REJECTED') { res.status(400).json({ success: false, message: 'Payout already rejected' }); return; }
    const updated = await prisma.payoutRequest.update({
      where: { id },
      data: { status: 'REJECTED', updatedAt: new Date() }
    });
    // Optionally: log admin action
    res.json({ success: true, message: 'Payout request rejected', data: { payout: updated } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Product Management
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status, vendor, category, search, dateFrom, dateTo } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};
    if (status) where.status = status;
    if (vendor) where.vendor = { slug: vendor };
    if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { slug: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) where.createdAt.lte = new Date(dateTo as string);
    }
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: { select: { businessName: true, slug: true } },
          category: { select: { name: true, slug: true } }
        }
      }),
      prisma.product.count({ where })
    ]);
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const updateProductStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, reason } = req.body;
    if (!status) { res.status(400).json({ success: false, message: 'Status is required' }); return; }
    const product = await prisma.product.update({ where: { id }, data: { status } });
    // Optionally: log reason in an audit table
    res.json({ success: true, message: 'Product status updated successfully', data: { product } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    // Optionally: handle cascade delete or orphaned data
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// System Settings
export const getSettings = async (req: Request, res: Response) => res.json({ success: true, message: 'Not implemented yet' });
export const updateSettings = async (req: Request, res: Response) => res.json({ success: true, message: 'Not implemented yet' });

// Analytics
export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalVendors, pendingVendors, totalSalesResult] = await Promise.all([
      prisma.user.count(),
      prisma.vendor.count(),
      prisma.vendor.count({ where: { isApproved: false } }),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            not: 'CANCELLED',
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        analytics: {
          totalUsers,
          totalVendors,
          pendingVendors,
          totalSales: totalSalesResult._sum.total || 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
export const getUserAnalytics = async (req: Request, res: Response) => res.json({ success: true, message: 'Not implemented yet' });
// Only keep the following implementations:

// GET /admin/analytics/vendor/:vendorId - Vendor analytics
export const getVendorAnalytics = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const [totalSales, totalOrders, totalCommission, totalPayouts] = await Promise.all([
      prisma.orderItem.aggregate({ where: { vendorId: parseInt(vendorId) }, _sum: { price: true } }),
      prisma.orderItem.count({ where: { vendorId: parseInt(vendorId) } }),
      prisma.commission.aggregate({ where: { vendorId: parseInt(vendorId) }, _sum: { amount: true } }),
      prisma.payoutRequest.aggregate({ where: { vendorId: parseInt(vendorId), status: 'PAID' }, _sum: { amount: true } })
    ]);
    res.json({
      success: true,
      data: {
        totalSales: totalSales._sum.price || 0,
        totalOrders,
        totalCommission: totalCommission._sum.amount || 0,
        totalPayouts: totalPayouts._sum.amount || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /admin/analytics/basic - Basic platform analytics
export const getBasicAnalytics = async (req: Request, res: Response) => {
  try {
    const [totalSales, totalOrders, totalProducts, totalUsers, totalVendors] = await Promise.all([
      prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { total: true } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.vendor.count()
    ]);
    res.json({
      success: true,
      data: {
        totalSales: totalSales._sum.total || 0,
        totalOrders,
        totalProducts,
        totalUsers,
        totalVendors
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// GET /admin/analytics/commissions - Platform commission analytics
export const getCommissionAnalytics = async (req: Request, res: Response) => {
  try {
    const [totalCommission, totalPayouts] = await Promise.all([
      prisma.commission.aggregate({ _sum: { amount: true } }),
      prisma.payoutRequest.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } })
    ]);
    res.json({
      success: true,
      data: {
        totalCommission: totalCommission._sum.amount || 0,
        totalPayouts: totalPayouts._sum.amount || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

// Activity Logs
export const getActivities = async (req: Request, res: Response) => res.json({ success: true, message: 'Not implemented yet' });

// Backup & Export
export const createBackup = async (req: Request, res: Response) => res.json({ success: true, message: 'Not implemented yet' });
export const getBackupList = async (req: Request, res: Response) => res.json({ success: true, message: 'Not implemented yet' });
export const exportUsers = async (req: Request, res: Response) => res.json({ success: true, message: 'Not implemented yet' }); 