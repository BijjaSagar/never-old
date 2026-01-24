import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch dashboard statistics
        const [
            totalProducts,
            totalOrders,
            totalUsers,
            recentOrders,
        ] = await Promise.all([
            prisma.product.count({ where: { isActive: true } }),
            prisma.order.count(),
            prisma.user.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true },
                    },
                },
            }),
        ]);

        // Calculate total revenue
        const orders = await prisma.order.findMany({
            where: { paymentStatus: 'PAID' },
            select: { totalAmount: true },
        });
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

        // Get top products (placeholder - would need order items aggregation)
        const topProducts = await prisma.product.findMany({
            take: 5,
            where: { isActive: true, isFeatured: true },
            select: {
                id: true,
                name: true,
                basePrice: true,
            },
        });

        const dashboardData = {
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue,
            recentOrders: recentOrders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customerName: order.user.name || order.user.email,
                totalAmount: Number(order.totalAmount),
                status: order.status,
                createdAt: order.createdAt,
            })),
            topProducts: topProducts.map((product, index) => ({
                id: product.id,
                name: product.name,
                sales: Math.floor(Math.random() * 100), // Placeholder
                revenue: Number(product.basePrice),
            })),
        };

        return NextResponse.json({ success: true, data: dashboardData });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
