"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, AlertCircle, Mail, MessageSquare, Eye, EyeOff } from "lucide-react";

interface CommunicationSettings {
    // SMS Settings
    smsEnabled: boolean;
    otpProvider: string;
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioPhoneNumber: string;
    msg91AuthKey: string;
    msg91SenderId: string;
    fast2smsApiKey: string;

    // Email Settings
    emailEnabled: boolean;
    emailProvider: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    smtpSecure: boolean;
    fromEmail: string;
    fromName: string;
    sendgridApiKey: string;
    resendApiKey: string;

    // Notification Settings
    orderConfirmationEmail: boolean;
    orderConfirmationSms: boolean;
    shippingUpdateEmail: boolean;
    shippingUpdateSms: boolean;
}

export default function CommunicationsSettingsPage() {
    const [settings, setSettings] = useState<CommunicationSettings>({
        smsEnabled: true,
        otpProvider: "twilio",
        twilioAccountSid: "",
        twilioAuthToken: "",
        twilioPhoneNumber: "",
        msg91AuthKey: "",
        msg91SenderId: "",
        fast2smsApiKey: "",
        emailEnabled: true,
        emailProvider: "smtp",
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: "",
        smtpSecure: true,
        fromEmail: "",
        fromName: "",
        sendgridApiKey: "",
        resendApiKey: "",
        orderConfirmationEmail: true,
        orderConfirmationSms: true,
        shippingUpdateEmail: true,
        shippingUpdateSms: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [showSecrets, setShowSecrets] = useState({
        twilioAuth: false,
        msg91: false,
        fast2sms: false,
        smtp: false,
        sendgrid: false,
        resend: false,
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
                    smsEnabled: data.data.smsEnabled ?? true,
                    otpProvider: data.data.otpProvider || "twilio",
                    twilioAccountSid: data.data.twilioAccountSid || "",
                    twilioAuthToken: data.data.twilioAuthToken || "",
                    twilioPhoneNumber: data.data.twilioPhoneNumber || "",
                    msg91AuthKey: data.data.msg91AuthKey || "",
                    msg91SenderId: data.data.msg91SenderId || "",
                    fast2smsApiKey: data.data.fast2smsApiKey || "",
                    emailEnabled: data.data.emailEnabled ?? true,
                    emailProvider: data.data.emailProvider || "smtp",
                    smtpHost: data.data.smtpHost || "",
                    smtpPort: data.data.smtpPort || 587,
                    smtpUser: data.data.smtpUser || "",
                    smtpPass: data.data.smtpPass || "",
                    smtpSecure: data.data.smtpSecure ?? true,
                    fromEmail: data.data.fromEmail || "",
                    fromName: data.data.fromName || "",
                    sendgridApiKey: data.data.sendgridApiKey || "",
                    resendApiKey: data.data.resendApiKey || "",
                    orderConfirmationEmail: data.data.orderConfirmationEmail ?? true,
                    orderConfirmationSms: data.data.orderConfirmationSms ?? true,
                    shippingUpdateEmail: data.data.shippingUpdateEmail ?? true,
                    shippingUpdateSms: data.data.shippingUpdateSms ?? true,
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
                setMessage({ type: "success", text: "Communication settings saved successfully!" });
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
                    <p className="text-gray-600">Loading communication settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-display font-black text-primary-900 mb-2">
                    Communications Settings
                </h2>
                <p className="text-gray-600">
                    Configure SMS, Email, and notification preferences
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

            {/* SMS Settings */}
            <div className="bg-green-50 rounded-3xl p-6 space-y-6 border-2 border-green-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-green-600" />
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900">
                                SMS & OTP Settings
                            </h3>
                            <p className="text-sm text-gray-600">Configure SMS providers for OTP and notifications</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-bold text-gray-700">Enable SMS</span>
                        <input
                            type="checkbox"
                            checked={settings.smsEnabled}
                            onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                            className="w-6 h-6 rounded border-2 border-gray-300 text-green-600 focus:ring-green-500"
                        />
                    </label>
                </div>

                {settings.smsEnabled && (
                    <>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                SMS Provider
                            </label>
                            <select
                                value={settings.otpProvider}
                                onChange={(e) => setSettings({ ...settings, otpProvider: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-600/10 outline-none transition-all font-medium"
                            >
                                <option value="twilio">Twilio</option>
                                <option value="msg91">MSG91</option>
                                <option value="fast2sms">Fast2SMS</option>
                            </select>
                        </div>

                        {/* Twilio Settings */}
                        {settings.otpProvider === "twilio" && (
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h4 className="font-black text-primary-900">Twilio Configuration</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Account SID</label>
                                        <input
                                            type="text"
                                            value={settings.twilioAccountSid}
                                            onChange={(e) => setSettings({ ...settings, twilioAccountSid: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-mono text-sm"
                                            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Auth Token</label>
                                        <div className="relative">
                                            <input
                                                type={showSecrets.twilioAuth ? "text" : "password"}
                                                value={settings.twilioAuthToken}
                                                onChange={(e) => setSettings({ ...settings, twilioAuthToken: e.target.value })}
                                                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-mono text-sm"
                                                placeholder="••••••••••••••••••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecrets({ ...showSecrets, twilioAuth: !showSecrets.twilioAuth })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                {showSecrets.twilioAuth ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={settings.twilioPhoneNumber}
                                            onChange={(e) => setSettings({ ...settings, twilioPhoneNumber: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-medium"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MSG91 Settings */}
                        {settings.otpProvider === "msg91" && (
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h4 className="font-black text-primary-900">MSG91 Configuration</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Auth Key</label>
                                        <div className="relative">
                                            <input
                                                type={showSecrets.msg91 ? "text" : "password"}
                                                value={settings.msg91AuthKey}
                                                onChange={(e) => setSettings({ ...settings, msg91AuthKey: e.target.value })}
                                                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-mono text-sm"
                                                placeholder="••••••••••••••••••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecrets({ ...showSecrets, msg91: !showSecrets.msg91 })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                {showSecrets.msg91 ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sender ID</label>
                                        <input
                                            type="text"
                                            value={settings.msg91SenderId}
                                            onChange={(e) => setSettings({ ...settings, msg91SenderId: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-medium"
                                            placeholder="NVROLD"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fast2SMS Settings */}
                        {settings.otpProvider === "fast2sms" && (
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h4 className="font-black text-primary-900">Fast2SMS Configuration</h4>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">API Key</label>
                                    <div className="relative">
                                        <input
                                            type={showSecrets.fast2sms ? "text" : "password"}
                                            value={settings.fast2smsApiKey}
                                            onChange={(e) => setSettings({ ...settings, fast2smsApiKey: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-mono text-sm"
                                            placeholder="••••••••••••••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecrets({ ...showSecrets, fast2sms: !showSecrets.fast2sms })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            {showSecrets.fast2sms ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Email Settings */}
            <div className="bg-blue-50 rounded-3xl p-6 space-y-6 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-blue-600" />
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900">
                                Email Settings
                            </h3>
                            <p className="text-sm text-gray-600">Configure email providers for notifications</p>
                        </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-bold text-gray-700">Enable Email</span>
                        <input
                            type="checkbox"
                            checked={settings.emailEnabled}
                            onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                            className="w-6 h-6 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </label>
                </div>

                {settings.emailEnabled && (
                    <>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email Provider
                            </label>
                            <select
                                value={settings.emailProvider}
                                onChange={(e) => setSettings({ ...settings, emailProvider: e.target.value })}
                                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-medium"
                            >
                                <option value="smtp">SMTP (Custom Server)</option>
                                <option value="sendgrid">SendGrid</option>
                                <option value="resend">Resend</option>
                            </select>
                        </div>

                        {/* SMTP Settings */}
                        {settings.emailProvider === "smtp" && (
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h4 className="font-black text-primary-900">SMTP Configuration</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Host</label>
                                        <input
                                            type="text"
                                            value={settings.smtpHost}
                                            onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-medium"
                                            placeholder="smtp.gmail.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Port</label>
                                        <input
                                            type="number"
                                            value={settings.smtpPort}
                                            onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-medium"
                                            placeholder="587"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">SMTP User</label>
                                        <input
                                            type="text"
                                            value={settings.smtpUser}
                                            onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-medium"
                                            placeholder="your-email@gmail.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Password</label>
                                        <div className="relative">
                                            <input
                                                type={showSecrets.smtp ? "text" : "password"}
                                                value={settings.smtpPass}
                                                onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                                                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-mono text-sm"
                                                placeholder="••••••••••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSecrets({ ...showSecrets, smtp: !showSecrets.smtp })}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                {showSecrets.smtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">From Email</label>
                                        <input
                                            type="email"
                                            value={settings.fromEmail}
                                            onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-medium"
                                            placeholder="noreply@neverold.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">From Name</label>
                                        <input
                                            type="text"
                                            value={settings.fromName}
                                            onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-medium"
                                            placeholder="NeverOld"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.smtpSecure}
                                                onChange={(e) => setSettings({ ...settings, smtpSecure: e.target.checked })}
                                                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600"
                                            />
                                            <span className="text-sm font-bold text-gray-700">Use Secure Connection (TLS)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SendGrid Settings */}
                        {settings.emailProvider === "sendgrid" && (
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h4 className="font-black text-primary-900">SendGrid Configuration</h4>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">API Key</label>
                                    <div className="relative">
                                        <input
                                            type={showSecrets.sendgrid ? "text" : "password"}
                                            value={settings.sendgridApiKey}
                                            onChange={(e) => setSettings({ ...settings, sendgridApiKey: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-mono text-sm"
                                            placeholder="SG.••••••••••••••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecrets({ ...showSecrets, sendgrid: !showSecrets.sendgrid })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            {showSecrets.sendgrid ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Resend Settings */}
                        {settings.emailProvider === "resend" && (
                            <div className="bg-white rounded-2xl p-6 space-y-4">
                                <h4 className="font-black text-primary-900">Resend Configuration</h4>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">API Key</label>
                                    <div className="relative">
                                        <input
                                            type={showSecrets.resend ? "text" : "password"}
                                            value={settings.resendApiKey}
                                            onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
                                            className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none font-mono text-sm"
                                            placeholder="re_••••••••••••••••••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecrets({ ...showSecrets, resend: !showSecrets.resend })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            {showSecrets.resend ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
                <h3 className="text-xl font-display font-black text-primary-900">
                    Notification Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center justify-between p-4 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <span className="font-bold text-gray-700">Order Confirmation Email</span>
                        <input
                            type="checkbox"
                            checked={settings.orderConfirmationEmail}
                            onChange={(e) => setSettings({ ...settings, orderConfirmationEmail: e.target.checked })}
                            className="w-6 h-6 rounded border-2 border-gray-300 text-primary-900"
                        />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <span className="font-bold text-gray-700">Order Confirmation SMS</span>
                        <input
                            type="checkbox"
                            checked={settings.orderConfirmationSms}
                            onChange={(e) => setSettings({ ...settings, orderConfirmationSms: e.target.checked })}
                            className="w-6 h-6 rounded border-2 border-gray-300 text-primary-900"
                        />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <span className="font-bold text-gray-700">Shipping Update Email</span>
                        <input
                            type="checkbox"
                            checked={settings.shippingUpdateEmail}
                            onChange={(e) => setSettings({ ...settings, shippingUpdateEmail: e.target.checked })}
                            className="w-6 h-6 rounded border-2 border-gray-300 text-primary-900"
                        />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-white rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <span className="font-bold text-gray-700">Shipping Update SMS</span>
                        <input
                            type="checkbox"
                            checked={settings.shippingUpdateSms}
                            onChange={(e) => setSettings({ ...settings, shippingUpdateSms: e.target.checked })}
                            className="w-6 h-6 rounded border-2 border-gray-300 text-primary-900"
                        />
                    </label>
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
                            Save Communication Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
