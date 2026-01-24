"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Settings,
    Palette,
    CreditCard,
    Mail,
    Users as UsersIcon,
    Package,
    Truck,
    Sparkles,
    BarChart3
} from "lucide-react";

const settingsTabs = [
    { name: "General", href: "/admin/settings/general", icon: Settings },
    { name: "Theme", href: "/admin/settings/theme", icon: Palette },
    { name: "Payments", href: "/admin/settings/payments", icon: CreditCard },
    { name: "Communications", href: "/admin/settings/communications", icon: Mail },
    { name: "Social Login", href: "/admin/settings/social", icon: UsersIcon },
    { name: "Shipping", href: "/admin/settings/shipping", icon: Truck },
    { name: "Business", href: "/admin/settings/business", icon: Package },
    { name: "AI & Analytics", href: "/admin/settings/ai", icon: Sparkles },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-display font-black text-primary-900 mb-2">
                    Site Settings
                </h1>
                <p className="text-gray-600">
                    Configure your e-commerce platform settings
                </p>
            </div>

            {/* Settings Tabs */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200 overflow-x-auto">
                    <nav className="flex space-x-2 p-4">
                        {settingsTabs.map((tab) => {
                            const isActive = pathname === tab.href;
                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${isActive
                                            ? "bg-primary-900 text-white shadow-lg"
                                            : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
