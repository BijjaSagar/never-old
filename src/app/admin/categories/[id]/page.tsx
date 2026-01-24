"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        icon: "",
        displayOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchCategory();
    }, [params.id]);

    const fetchCategory = async () => {
        try {
            const response = await fetch(`/api/admin/categories/${params.id}`);
            const data = await response.json();
            if (data.success) {
                setFormData({
                    name: data.data.name,
                    slug: data.data.slug,
                    description: data.data.description || "",
                    imageUrl: data.data.imageUrl || "",
                    icon: data.data.icon || "",
                    displayOrder: data.data.displayOrder,
                    isActive: data.data.isActive,
                });
            }
        } catch (error) {
            console.error("Failed to fetch category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch(`/api/admin/categories/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Category updated successfully!" });
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update category" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update category" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
            return;
        }

        setDeleting(true);
        try {
            const response = await fetch(`/api/admin/categories/${params.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.push("/admin/categories");
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading category...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/categories"
                        className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-display font-black text-primary-900 mb-2">
                            Edit Category
                        </h1>
                        <p className="text-gray-600">
                            Update category information
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-6 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg disabled:opacity-50 flex items-center gap-3"
                >
                    {deleting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-5 h-5" />
                            Delete Category
                        </>
                    )}
                </button>
            </div>

            {/* Success/Error Message */}
            {message && (
                <div
                    className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-bold">{message.text}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                {/* Category Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="e.g., Kids, Women, Men"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        URL Slug
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-mono text-sm"
                        placeholder="kids"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        URL: /shop/{formData.slug || "category-slug"}
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium resize-none"
                        placeholder="Brief description of this category"
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Image URL
                    </label>
                    <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="https://example.com/image.jpg"
                    />
                    {formData.imageUrl && (
                        <div className="mt-4 relative w-full h-48 rounded-2xl overflow-hidden border-2 border-gray-200">
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "";
                                    e.currentTarget.alt = "Invalid image URL";
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Icon (Emoji) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Icon (Emoji)
                    </label>
                    <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        maxLength={2}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium text-4xl text-center"
                        placeholder="👶"
                    />
                    <p className="mt-2 text-sm text-gray-500 text-center">
                        Use an emoji to represent this category
                    </p>
                </div>

                {/* Display Order */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Display Order
                    </label>
                    <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="0"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Lower numbers appear first
                    </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                    <div>
                        <h3 className="font-bold text-gray-900">Active Status</h3>
                        <p className="text-sm text-gray-600">Make this category visible to customers</p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-bold text-gray-700">
                            {formData.isActive ? "Active" : "Inactive"}
                        </span>
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-6 h-6 rounded border-2 border-gray-300 text-primary-900 focus:ring-primary-900"
                        />
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Link
                        href="/admin/categories"
                        className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
