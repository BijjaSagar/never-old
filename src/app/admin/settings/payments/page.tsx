"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle, CreditCard, Eye, EyeOff } from "lucide-react";

interface PaymentSettings {
    paymentGateway: string;
    currency: string;
    taxRate: number;
    // Razorpay
    razorpayKeyId: string;
    razorpayKeySecret: string;
    // Stripe
    stripePublicKey: string;
    stripeSecretKey: string;
}

export default function PaymentSettingsPage() {
    const [settings, setSettings] = useState<PaymentSettings>({
        paymentGateway: "razorpay",
        currency: "INR",
        taxRate: 0,
        razorpayKeyId: "",
        razorpayKeySecret: "",
        stripePublicKey: "",
        stripeSecretKey: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [showSecrets, setShowSecrets] = useState({
        razorpaySecret: false,
        stripeSecret: false,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings");
            const data = await response.json();
            if (data.success) {
                setSettings({
                    paymentGateway: data.data.paymentGateway || "razorpay",
                    currency: data.data.currency || "INR",
                    taxRate: Number(data.data.taxRate) || 0,
                    razorpayKeyId: data.data.razorpayKeyId || "",
                    razorpayKeySecret: data.data.razorpayKeySecret || "",
                    stripePublicKey: data.data.stripePublicKey || "",
                    stripeSecretKey: data.data.stripeSecretKey || "",
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
                setMessage({ type: "success", text: "Payment settings saved successfully!" });
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
                    <p className="text-gray-600">Loading payment settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-display font-black text-primary-900 mb-2">
                    Payment Settings
                </h2>
                <p className="text-gray-600">
                    Configure payment gateways and transaction settings
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

            {/* General Payment Settings */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
                <h3 className="text-xl font-display font-black text-primary-900 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    General Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Payment Gateway */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Payment Gateway *
                        </label>
                        <select
                            value={settings.paymentGateway}
                            onChange={(e) => setSettings({ ...settings, paymentGateway: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        >
                            <option value="razorpay">Razorpay (India)</option>
                            <option value="stripe">Stripe (International)</option>
                            <option value="both">Both</option>
                        </select>
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Currency *
                        </label>
                        <select
                            value={settings.currency}
                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>

                    {/* Tax Rate */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Tax Rate (%)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={settings.taxRate}
                            onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 outline-none transition-all font-medium"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>

            {/* Razorpay Settings */}
            {(settings.paymentGateway === "razorpay" || settings.paymentGateway === "both") && (
                <div className="bg-blue-50 rounded-3xl p-6 space-y-6 border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                            R
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900">
                                Razorpay Configuration
                            </h3>
                            <p className="text-sm text-gray-600">
                                Get your API keys from{" "}
                                <a
                                    href="https://dashboard.razorpay.com/app/keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline font-bold"
                                >
                                    Razorpay Dashboard
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Razorpay Key ID */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Razorpay Key ID *
                            </label>
                            <input
                                type="text"
                                value={settings.razorpayKeyId}
                                onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-mono"
                                placeholder="rzp_test_xxxxxxxxxxxxxxxx"
                            />
                        </div>

                        {/* Razorpay Key Secret */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Razorpay Key Secret *
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.razorpaySecret ? "text" : "password"}
                                    value={settings.razorpayKeySecret}
                                    onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-mono"
                                    placeholder="••••••••••••••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSecrets({ ...showSecrets, razorpaySecret: !showSecrets.razorpaySecret })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    {showSecrets.razorpaySecret ? (
                                        <EyeOff className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stripe Settings */}
            {(settings.paymentGateway === "stripe" || settings.paymentGateway === "both") && (
                <div className="bg-purple-50 rounded-3xl p-6 space-y-6 border-2 border-purple-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black text-xl">
                            S
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900">
                                Stripe Configuration
                            </h3>
                            <p className="text-sm text-gray-600">
                                Get your API keys from{" "}
                                <a
                                    href="https://dashboard.stripe.com/apikeys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:underline font-bold"
                                >
                                    Stripe Dashboard
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Stripe Publishable Key */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Stripe Publishable Key *
                            </label>
                            <input
                                type="text"
                                value={settings.stripePublicKey}
                                onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-mono"
                                placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
                            />
                        </div>

                        {/* Stripe Secret Key */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Stripe Secret Key *
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecrets.stripeSecret ? "text" : "password"}
                                    value={settings.stripeSecretKey}
                                    onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 outline-none transition-all font-mono"
                                    placeholder="••••••••••••••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSecrets({ ...showSecrets, stripeSecret: !showSecrets.stripeSecret })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    {showSecrets.stripeSecret ? (
                                        <EyeOff className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            Save Payment Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
