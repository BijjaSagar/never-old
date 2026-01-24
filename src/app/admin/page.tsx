"use client";

import { useEffect, useState } from "react";
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Eye,
    Sparkles
} from "lucide-react";

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    recentOrders: any[];
    topProducts: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            name: "Total Products",
            value: stats?.totalProducts || 0,
            icon: Package,
            change: "+12%",
            changeType: "positive",
            color: "bg-blue-500",
        },
        {
            name: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: ShoppingCart,
            change: "+23%",
            changeType: "positive",
            color: "bg-green-500",
        },
        {
            name: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            change: "+8%",
            changeType: "positive",
            color: "bg-purple-500",
        },
        {
            name: "Revenue",
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            change: "+15%",
            changeType: "positive",
            color: "bg-yellow-500",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-display font-black text-primary-900 mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-gray-600">
                    Here's what's happening with your store today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                                }`}>
                                {stat.changeType === "positive" ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-display font-black text-primary-900 mb-1">
                                {stat.value}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-display font-black text-primary-900 mb-6">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/products/new"
                        className="flex items-center gap-4 p-6 rounded-2xl bg-primary-50 hover:bg-primary-100 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-900 flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-primary-900 group-hover:underline">Add Product</p>
                            <p className="text-sm text-gray-600">Create a new product</p>
                        </div>
                    </a>

                    <a
                        href="/admin/categories"
                        className="flex items-center gap-4 p-6 rounded-2xl bg-lavender/20 hover:bg-lavender/30 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-primary-900 group-hover:underline">Manage Categories</p>
                            <p className="text-sm text-gray-600">Organize your products</p>
                        </div>
                    </a>

                    <a
                        href="/admin/settings"
                        className="flex items-center gap-4 p-6 rounded-2xl bg-mint/20 hover:bg-mint/30 transition-colors group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-primary-900 group-hover:underline">Site Settings</p>
                            <p className="text-sm text-gray-600">Configure your store</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-display font-black text-primary-900 mb-6">
                        Recent Orders
                    </h2>
                    <div className="space-y-4">
                        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order: any) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <p className="font-bold text-primary-900">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-600">{order.customerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-900">₹{order.totalAmount}</p>
                                        <p className="text-xs text-gray-500">{order.status}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No recent orders</p>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-display font-black text-primary-900 mb-6">
                        Top Products
                    </h2>
                    <div className="space-y-4">
                        {stats?.topProducts && stats.topProducts.length > 0 ? (
                            stats.topProducts.map((product: any, index: number) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-primary-900 text-white flex items-center justify-center font-black">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-primary-900">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                                    </div>
                                    <p className="font-bold text-primary-900">₹{product.revenue}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">No sales data yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
