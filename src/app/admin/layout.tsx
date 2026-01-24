"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    FolderTree,
    Palette,
    CreditCard,
    Mail,
    MessageSquare,
    BarChart3,
    LogOut
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
        children: [
            { name: "General", href: "/admin/settings/general" },
            { name: "Theme", href: "/admin/settings/theme" },
            { name: "Payments", href: "/admin/settings/payments" },
            { name: "SMS & Email", href: "/admin/settings/communications" },
            { name: "Social Login", href: "/admin/settings/social" },
        ]
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/admin");
        } else if (session?.user?.role !== "ADMIN") {
            router.push("/");
        }
    }, [status, session, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-primary-900 font-bold">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-primary-900 text-white overflow-y-auto">
                <div className="p-8">
                    <h1 className="text-3xl font-display font-black tracking-tighter">
                        NeverOld
                        <span className="block text-sm font-normal text-white/60 mt-1">Admin Panel</span>
                    </h1>
                </div>

                <nav className="px-4 pb-8 space-y-2">
                    {navigation.map((item) => (
                        <div key={item.name}>
                            <Link
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors group"
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-bold">{item.name}</span>
                            </Link>

                            {item.children && (
                                <div className="ml-8 mt-2 space-y-1">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.name}
                                            href={child.href}
                                            className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={() => router.push("/api/auth/signout")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors mt-8"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-bold">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-72 min-h-screen">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-display font-black text-primary-900">
                                Welcome back, {session.user.name || "Admin"}!
                            </h2>
                            <p className="text-sm text-gray-600">Manage your e-commerce platform</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-primary-900">{session.user.email}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{session.user.role}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-900 font-black text-lg">
                                {session.user.name?.[0] || "A"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
