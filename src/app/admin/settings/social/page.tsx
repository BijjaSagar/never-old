"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function SocialLoginSettingsPage() {
    const [settings, setSettings] = useState({
        googleLoginEnabled: false,
        googleClientId: "",
        googleClientSecret: "",
        appleLoginEnabled: false,
        appleClientId: "",
        appleTeamId: "",
        appleKeyId: "",
        applePrivateKey: "",
        facebookLoginEnabled: false,
        facebookAppId: "",
        facebookAppSecret: "",
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
                    googleLoginEnabled: data.data.googleLoginEnabled ?? false,
                    googleClientId: data.data.googleClientId || "",
                    googleClientSecret: data.data.googleClientSecret || "",
                    appleLoginEnabled: data.data.appleLoginEnabled ?? false,
                    appleClientId: data.data.appleClientId || "",
                    appleTeamId: data.data.appleTeamId || "",
                    appleKeyId: data.data.appleKeyId || "",
                    applePrivateKey: data.data.applePrivateKey || "",
                    facebookLoginEnabled: data.data.facebookLoginEnabled ?? false,
                    facebookAppId: data.data.facebookAppId || "",
                    facebookAppSecret: data.data.facebookAppSecret || "",
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
                setMessage({ type: "success", text: "Social login settings saved successfully!" });
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
                    <p className="text-gray-600">Loading social login settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-display font-black text-primary-900 mb-2">
                    Social Login Settings
                </h2>
                <p className="text-gray-600">
                    Configure OAuth providers for social authentication
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="font-bold">{message.text}</span>
                </div>
            )}

            {/* Google OAuth */}
            <div className="bg-white rounded-3xl p-6 space-y-6 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white font-black text-xl">G</div>
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900">Google Sign In</h3>
                            <p className="text-sm text-gray-600">Allow users to sign in with Google</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-bold text-gray-700">Enable</span>
                        <input type="checkbox" checked={settings.googleLoginEnabled} onChange={(e) => setSettings({ ...settings, googleLoginEnabled: e.target.checked })} className="w-6 h-6 rounded border-2 border-gray-300 text-red-500" />
                    </label>
                </div>
                {settings.googleLoginEnabled && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Client ID</label>
                            <input type="text" value={settings.googleClientId} onChange={(e) => setSettings({ ...settings, googleClientId: e.target.value })} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-red-500 outline-none font-mono text-sm" placeholder="123456789-abcdefghijklmnop.apps.googleusercontent.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Client Secret</label>
                            <input type="password" value={settings.googleClientSecret} onChange={(e) => setSettings({ ...settings, googleClientSecret: e.target.value })} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-red-500 outline-none font-mono text-sm" placeholder="••••••••••••••••••••••••" />
                        </div>
                    </div>
                )}
            </div>

            {/* Apple Sign In */}
            <div className="bg-white rounded-3xl p-6 space-y-6 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-black text-xl">🍎</div>
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900">Apple Sign In</h3>
                            <p className="text-sm text-gray-600">Allow users to sign in with Apple</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-bold text-gray-700">Enable</span>
                        <input type="checkbox" checked={settings.appleLoginEnabled} onChange={(e) => setSettings({ ...settings, appleLoginEnabled: e.target.checked })} className="w-6 h-6 rounded border-2 border-gray-300 text-black" />
                    </label>
                </div>
                {settings.appleLoginEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Client ID</label>
                            <input type="text" value={settings.appleClientId} onChange={(e) => setSettings({ ...settings, appleClientId: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-mono text-sm" placeholder="com.neverold.app" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Team ID</label>
                            <input type="text" value={settings.appleTeamId} onChange={(e) => setSettings({ ...settings, appleTeamId: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-mono text-sm" placeholder="ABCD123456" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Key ID</label>
                            <input type="text" value={settings.appleKeyId} onChange={(e) => setSettings({ ...settings, appleKeyId: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-mono text-sm" placeholder="ABCD123456" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Private Key</label>
                            <textarea value={settings.applePrivateKey} onChange={(e) => setSettings({ ...settings, applePrivateKey: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-mono text-xs resize-none" placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----" />
                        </div>
                    </div>
                )}
            </div>

            {/* Facebook Login */}
            <div className="bg-white rounded-3xl p-6 space-y-6 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">f</div>
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900">Facebook Login</h3>
                            <p className="text-sm text-gray-600">Allow users to sign in with Facebook</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-bold text-gray-700">Enable</span>
                        <input type="checkbox" checked={settings.facebookLoginEnabled} onChange={(e) => setSettings({ ...settings, facebookLoginEnabled: e.target.checked })} className="w-6 h-6 rounded border-2 border-gray-300 text-blue-600" />
                    </label>
                </div>
                {settings.facebookLoginEnabled && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">App ID</label>
                            <input type="text" value={settings.facebookAppId} onChange={(e) => setSettings({ ...settings, facebookAppId: e.target.value })} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-600 outline-none font-mono text-sm" placeholder="123456789012345" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">App Secret</label>
                            <input type="password" value={settings.facebookAppSecret} onChange={(e) => setSettings({ ...settings, facebookAppSecret: e.target.value })} className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-600 outline-none font-mono text-sm" placeholder="••••••••••••••••••••••••" />
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
                <button onClick={handleSave} disabled={saving} className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex items-center gap-3">
                    {saving ? (<><Loader2 className="w-5 h-5 animate-spin" />Saving...</>) : (<><Save className="w-5 h-5" />Save Social Login Settings</>)}
                </button>
            </div>
        </div>
    );
}
