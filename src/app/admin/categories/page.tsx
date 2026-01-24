"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    icon: string | null;
    displayOrder: number;
    isActive: boolean;
    _count?: {
        products: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/admin/categories");
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (response.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to toggle category:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
            return;
        }

        setDeleting(id);
        try {
            const response = await fetch(`/api/admin/categories/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-display font-black text-primary-900 mb-2">
                        Categories
                    </h1>
                    <p className="text-gray-600">
                        Manage your product categories and organize your store
                    </p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="px-6 py-4 bg-primary-900 text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </Link>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                        <Plus className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-primary-900 mb-2">
                        No Categories Yet
                    </h3>
                    <p className="text-gray-600 mb-8">
                        Create your first category to start organizing your products
                    </p>
                    <Link
                        href="/admin/categories/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-2xl font-black hover:scale-105 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Create Category
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
                        >
                            {/* Category Image */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        {category.icon || "📦"}
                                    </div>
                                )}
                                {!category.isActive && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-black">
                                            INACTIVE
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Category Info */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-2xl font-display font-black text-primary-900 mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {category.description || "No description"}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        <span className="font-bold text-primary-900">
                                            {category._count?.products || 0}
                                        </span>{" "}
                                        products
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full font-mono text-xs">
                                        /{category.slug}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleToggleActive(category.id, category.isActive)}
                                        className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${category.isActive
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {category.isActive ? (
                                            <><Eye className="w-4 h-4 inline mr-1" />Active</>
                                        ) : (
                                            <><EyeOff className="w-4 h-4 inline mr-1" />Inactive</>
                                        )}
                                    </button>
                                    <Link
                                        href={`/admin/categories/${category.id}`}
                                        className="px-4 py-2 bg-primary-100 text-primary-900 rounded-xl font-bold text-sm hover:bg-primary-200 transition-all"
                                    >
                                        <Edit className="w-4 h-4 inline" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        disabled={deleting === category.id}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold text-sm hover:bg-red-200 transition-all disabled:opacity-50"
                                    >
                                        {deleting === category.id ? (
                                            <Loader2 className="w-4 h-4 inline animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4 inline" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
