"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle, Palette } from "lucide-react";

interface ThemeSettings {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    kidsThemeColor: string;
    womenThemeColor: string;
    menThemeColor: string;
}

export default function ThemeSettingsPage() {
    const [settings, setSettings] = useState<ThemeSettings>({
        primaryColor: "#0F172A",
        secondaryColor: "#7C3AED",
        accentColor: "#F59E0B",
        fontFamily: "Inter",
        kidsThemeColor: "#FCD34D",
        womenThemeColor: "#D8B4FE",
        menThemeColor: "#0EA5E9",
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
                    primaryColor: data.data.primaryColor || "#0F172A",
                    secondaryColor: data.data.secondaryColor || "#7C3AED",
                    accentColor: data.data.accentColor || "#F59E0B",
                    fontFamily: data.data.fontFamily || "Inter",
                    kidsThemeColor: data.data.kidsThemeColor || "#FCD34D",
                    womenThemeColor: data.data.womenThemeColor || "#D8B4FE",
                    menThemeColor: data.data.menThemeColor || "#0EA5E9",
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
                setMessage({ type: "success", text: "Theme settings saved successfully!" });
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
                    <p className="text-gray-600">Loading theme settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-display font-black text-primary-900 mb-2">
                    Theme & Design Settings
                </h2>
                <p className="text-gray-600">
                    Customize your site's colors and typography, including category-specific themes
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

            {/* Global Theme Colors */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
                <h3 className="text-xl font-display font-black text-primary-900 flex items-center gap-2">
                    <Palette className="w-6 h-6" />
                    Global Theme Colors
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Primary Color */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Primary Color
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                className="w-20 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.primaryColor}
                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-900 outline-none font-mono"
                                placeholder="#0F172A"
                            />
                        </div>
                        <div
                            className="mt-3 h-12 rounded-xl"
                            style={{ backgroundColor: settings.primaryColor }}
                        />
                    </div>

                    {/* Secondary Color */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Secondary Color
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={settings.secondaryColor}
                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                className="w-20 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.secondaryColor}
                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-900 outline-none font-mono"
                                placeholder="#7C3AED"
                            />
                        </div>
                        <div
                            className="mt-3 h-12 rounded-xl"
                            style={{ backgroundColor: settings.secondaryColor }}
                        />
                    </div>

                    {/* Accent Color */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Accent Color
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={settings.accentColor}
                                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                className="w-20 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.accentColor}
                                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-900 outline-none font-mono"
                                placeholder="#F59E0B"
                            />
                        </div>
                        <div
                            className="mt-3 h-12 rounded-xl"
                            style={{ backgroundColor: settings.accentColor }}
                        />
                    </div>
                </div>

                {/* Font Family */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Font Family
                    </label>
                    <select
                        value={settings.fontFamily}
                        onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                    >
                        <option value="Inter">Inter (Default)</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                    </select>
                </div>
            </div>

            {/* Category-Specific Theme Colors */}
            <div className="bg-gradient-to-br from-yellow-50 via-purple-50 to-blue-50 rounded-3xl p-6 space-y-6">
                <div>
                    <h3 className="text-xl font-display font-black text-primary-900 flex items-center gap-2 mb-2">
                        🎨 Category-Specific Themes
                    </h3>
                    <p className="text-sm text-gray-600">
                        Each category will have its own unique color scheme for a personalized shopping experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kids Theme */}
                    <div className="bg-white rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">👶</div>
                            <div>
                                <h4 className="font-black text-primary-900">Kids</h4>
                                <p className="text-xs text-gray-500">Playful & Fun</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={settings.kidsThemeColor}
                                onChange={(e) => setSettings({ ...settings, kidsThemeColor: e.target.value })}
                                className="w-16 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.kidsThemeColor}
                                onChange={(e) => setSettings({ ...settings, kidsThemeColor: e.target.value })}
                                className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-yellow-400 outline-none font-mono text-sm"
                                placeholder="#FCD34D"
                            />
                        </div>
                        <div
                            className="h-20 rounded-xl flex items-center justify-center text-white font-black text-lg"
                            style={{ backgroundColor: settings.kidsThemeColor }}
                        >
                            KIDS
                        </div>
                    </div>

                    {/* Women Theme */}
                    <div className="bg-white rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">👗</div>
                            <div>
                                <h4 className="font-black text-primary-900">Women</h4>
                                <p className="text-xs text-gray-500">Elegant & Sophisticated</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={settings.womenThemeColor}
                                onChange={(e) => setSettings({ ...settings, womenThemeColor: e.target.value })}
                                className="w-16 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.womenThemeColor}
                                onChange={(e) => setSettings({ ...settings, womenThemeColor: e.target.value })}
                                className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none font-mono text-sm"
                                placeholder="#D8B4FE"
                            />
                        </div>
                        <div
                            className="h-20 rounded-xl flex items-center justify-center text-white font-black text-lg"
                            style={{ backgroundColor: settings.womenThemeColor }}
                        >
                            WOMEN
                        </div>
                    </div>

                    {/* Men Theme */}
                    <div className="bg-white rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">👔</div>
                            <div>
                                <h4 className="font-black text-primary-900">Men</h4>
                                <p className="text-xs text-gray-500">Modern & Bold</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={settings.menThemeColor}
                                onChange={(e) => setSettings({ ...settings, menThemeColor: e.target.value })}
                                className="w-16 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.menThemeColor}
                                onChange={(e) => setSettings({ ...settings, menThemeColor: e.target.value })}
                                className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 outline-none font-mono text-sm"
                                placeholder="#0EA5E9"
                            />
                        </div>
                        <div
                            className="h-20 rounded-xl flex items-center justify-center text-white font-black text-lg"
                            style={{ backgroundColor: settings.menThemeColor }}
                        >
                            MEN
                        </div>
                    </div>
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
                            Save Theme Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
