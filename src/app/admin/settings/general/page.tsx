"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface GeneralSettings {
    siteName: string;
    siteDescription: string;
    siteLogo: string;
    siteFavicon: string;
    contactEmail: string;
    contactPhone: string;
}

export default function GeneralSettingsPage() {
    const [settings, setSettings] = useState<GeneralSettings>({
        siteName: "",
        siteDescription: "",
        siteLogo: "",
        siteFavicon: "",
        contactEmail: "",
        contactPhone: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings");
            const data = await response.json();
            if (data.success) {
                setSettings({
                    siteName: data.data.siteName || "",
                    siteDescription: data.data.siteDescription || "",
                    siteLogo: data.data.siteLogo || "",
                    siteFavicon: data.data.siteFavicon || "",
                    contactEmail: data.data.contactEmail || "",
                    contactPhone: data.data.contactPhone || "",
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: "success", text: "Settings saved successfully!" });
            } else {
                setMessage({ type: "error", text: data.error || "Failed to save settings" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-display font-black text-primary-900 mb-2">
                    General Settings
                </h2>
                <p className="text-gray-600">
                    Manage your site's basic information and contact details
                </p>
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
            <div className="space-y-6">
                {/* Site Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Site Name *
                    </label>
                    <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="NeverOld"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        This will appear in the browser tab and throughout your site
                    </p>
                </div>

                {/* Site Description */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Site Description
                    </label>
                    <textarea
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium resize-none"
                        placeholder="Premium fashion for everyone - Kids, Women, and Men"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        A brief description for SEO and social media
                    </p>
                </div>

                {/* Site Logo URL */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Site Logo URL
                    </label>
                    <input
                        type="url"
                        value={settings.siteLogo}
                        onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="https://example.com/logo.png"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        URL to your site logo (recommended: 200x50px PNG)
                    </p>
                </div>

                {/* Site Favicon URL */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Site Favicon URL
                    </label>
                    <input
                        type="url"
                        value={settings.siteFavicon}
                        onChange={(e) => setSettings({ ...settings, siteFavicon: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="https://example.com/favicon.ico"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        URL to your favicon (recommended: 32x32px ICO or PNG)
                    </p>
                </div>

                {/* Contact Email */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Contact Email
                    </label>
                    <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="support@neverold.com"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Main contact email for customer support
                    </p>
                </div>

                {/* Contact Phone */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Contact Phone
                    </label>
                    <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        placeholder="+91 98765 43210"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Customer support phone number
                    </p>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                    onClick={handleSave}
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
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
