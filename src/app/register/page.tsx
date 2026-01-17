"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
import { Sparkles, ArrowRight, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await axios.post("/api/register", {
                email,
                name,
                password,
            });

            // Automatically sign in after registration
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                router.push("/login");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err: any) {
            setError(err?.response?.data || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row shadow-2xl overflow-hidden">
            {/* Right: Registration Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white order-2 md:order-1">
                <div className="w-full max-w-sm space-y-10">
                    <div className="text-center md:text-left">
                        <Link href="/" className="text-2xl font-display font-bold text-primary-900 md:hidden mb-8 block">AURA FIT</Link>
                        <h2 className="text-3xl font-display font-bold text-primary-900">Create Account</h2>
                        <p className="text-text-muted mt-2">Join AURA FIT today and experience the future of fashion.</p>
                    </div>

                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 italic">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary-900 uppercase tracking-widest px-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-600 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent-600 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary-900 uppercase tracking-widest px-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent-600 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-primary-900 uppercase tracking-widest px-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full py-4 pl-12 pr-12 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent-600 outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary-900"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-muted px-1">Must be at least 8 characters</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-primary-900/10 hover:shadow-primary-900/20 active:scale-95 transition-all text-sm font-bold flex items-center justify-center gap-2"
                            >
                                {isLoading ? "Creating account..." : "Start Shopping"}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-text-muted text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-accent-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>

            {/* Right: Brand/Marketing (now showing on right/bottom) */}
            <div className="hidden md:flex md:w-1/2 bg-primary-950 relative overflow-hidden items-center justify-center p-12 order-1 md:order-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-600 via-primary-800 to-primary-900 opacity-40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="relative z-10 max-w-md text-white">
                    <Link href="/" className="text-3xl font-display font-bold mb-12 block">AURA FIT</Link>
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-secondary-400 text-xs font-bold uppercase tracking-widest">
                            Premium Experience
                        </div>
                        <h1 className="text-5xl font-display font-bold leading-tight">
                            Your World, <br />
                            <span className="text-secondary-400 italic">Your Choice</span>.
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Create an account to save your AI trial room results, track orders, and receive exclusive styling tips.
                        </p>
                    </div>
                </div>

                <div className="absolute top-[10%] right-[-10%] w-80 h-80 bg-accent-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-80 h-80 bg-secondary-400/20 rounded-full blur-[100px]" />
            </div>
        </div>
    );
}
