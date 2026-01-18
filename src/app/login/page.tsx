"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Github, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
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
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row shadow-2xl overflow-hidden">
            {/* Left: Brand/Marketing */}
            <div className="hidden md:flex md:w-1/2 bg-primary-950 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600 opacity-40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="relative z-10 max-w-md text-white">
                    <Link href="/" className="text-3xl font-display font-bold mb-12 block">NeverOld</Link>
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-secondary-400 text-xs font-bold uppercase tracking-widest">
                            Join the future
                        </div>
                        <h1 className="text-5xl font-display font-bold leading-tight">
                            Reimagine Your <span className="text-secondary-400 italic">Style</span> With Us.
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Login to access your personalized virtual trial room and manage your style profile.
                        </p>
                    </div>
                </div>

                {/* Floating circles */}
                <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-accent-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-secondary-400/20 rounded-full blur-[100px]" />
            </div>

            {/* Right: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm space-y-10">
                    <div className="text-center md:text-left">
                        <Link href="/" className="text-2xl font-display font-bold text-primary-900 md:hidden mb-8 block">NeverOld</Link>
                        <h2 className="text-3xl font-display font-bold text-primary-900">Sign In</h2>
                        <p className="text-text-muted mt-2">Welcome back! Please enter your details.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Social Login */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all font-semibold text-primary-900 shadow-sm"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                            Sign in with Google
                        </button>

                        <div className="relative flex items-center gap-4 text-xs font-bold text-text-muted/40 uppercase tracking-[0.2em]">
                            <div className="h-px flex-1 bg-gray-100" />
                            <span>Or use email</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 italic">
                                    {error}
                                </div>
                            )}

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
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-primary-900 uppercase tracking-widest">Password</label>
                                    <Link href="/forgot-password" title="Coming soon" className="text-xs font-bold text-accent-600 hover:text-accent-700">Forgot?</Link>
                                </div>
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
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-primary-900/10 hover:shadow-primary-900/20 active:scale-95 transition-all text-sm font-bold flex items-center justify-center gap-2"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-text-muted text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-accent-600 font-bold hover:underline">Create account</Link>
                    </p>

                    <div className="pt-4 text-center">
                        <p className="text-[10px] text-text-muted/60 leading-relaxed max-w-[200px] mx-auto uppercase tracking-wider">
                            By signing in, you agree to our <br />
                            <Link href="/terms" className="underline">Terms of Service</Link> & <Link href="/privacy" className="underline">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
