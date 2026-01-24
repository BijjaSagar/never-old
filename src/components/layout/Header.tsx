"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User, LogOut, Sparkles } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useCategory } from "@/contexts/CategoryContext";
import { motion } from "framer-motion";

export default function Header() {
    const { data: session, status } = useSession();
    const { category, setCategory, theme } = useCategory();

    const categories = [
        { id: 'kids' as const, label: 'Kids', emoji: '🎨' },
        { id: 'men' as const, label: 'Men', emoji: '👔' },
        { id: 'women' as const, label: 'Women', emoji: '👗' },
    ];

    return (
        <header className="fixed top-6 inset-x-0 z-50 px-4 md:px-8 pointer-events-none">
            <div className="container-custom py-3 px-6 bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-between pointer-events-auto">
                <Link href="/" className="flex items-center gap-3 group" onClick={() => setCategory(null)}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform ${theme
                            ? `bg-gradient-to-tr ${theme.gradient}`
                            : 'bg-gradient-to-tr from-accent-600 to-lavender'
                        }`}>
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-display font-black tracking-tighter text-primary-900">
                        NeverOld
                    </span>
                </Link>

                {/* Category Navigation */}
                <nav className="hidden lg:flex items-center gap-2 bg-primary-100/50 p-1.5 rounded-full">
                    {categories.map((cat) => {
                        const isActive = category === cat.id;
                        const categoryTheme = cat.id === 'kids'
                            ? 'from-yellow-400 to-orange-400'
                            : cat.id === 'men'
                                ? 'from-blue-500 to-cyan-500'
                                : 'from-purple-400 to-pink-400';

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className="relative px-5 py-2 rounded-full text-sm font-bold transition-all"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className={`absolute inset-0 bg-gradient-to-r ${categoryTheme} rounded-full shadow-lg`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : 'text-primary-900'
                                    }`}>
                                    <span>{cat.emoji}</span>
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* Secondary Navigation */}
                <nav className="hidden md:flex items-center gap-1 bg-primary-100/50 p-1.5 rounded-full ml-4">
                    <Link href="/shop" className="px-6 py-2 rounded-full text-sm font-bold text-primary-900 hover:bg-white hover:shadow-sm transition-all">
                        Explore
                    </Link>
                    <Link href="/try-on" className="px-6 py-2 rounded-full text-sm font-bold text-primary-900 hover:bg-lavender/40 transition-all flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-600" />
                        Virtual Room
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/cart" className="relative p-3 bg-sky/20 rounded-2xl text-primary-900 hover:bg-sky/30 transition-all group">
                        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                            0
                        </span>
                    </Link>

                    <div className="h-8 w-px bg-gray-100 mx-1" />

                    {status === "authenticated" ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                                <div className="w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-lavender to-mint shadow-md overflow-hidden">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="User" className="w-full h-full rounded-[14px] object-cover" />
                                    ) : (
                                        <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-primary-900">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 mt-4 p-3 rounded-[2rem] shadow-2xl border-white/50 backdrop-blur-xl">
                                <div className="px-4 py-3 mb-2">
                                    <p className="text-xs font-black text-text-muted uppercase tracking-widest">Hey there!</p>
                                    <p className="text-lg font-display font-bold text-primary-900 truncate">{session.user?.name}</p>
                                </div>
                                <DropdownMenuItem className="p-3 rounded-2xl cursor-pointer hover:bg-lavender/20">
                                    <Link href="/profile" className="flex items-center gap-3 w-full font-bold">
                                        <User className="w-4 h-4" />
                                        Style Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-3 rounded-2xl cursor-pointer hover:bg-sky/20">
                                    <Link href="/orders" className="flex items-center gap-3 w-full font-bold">
                                        <ShoppingBag className="w-4 h-4" />
                                        My Closet
                                    </Link>
                                </DropdownMenuItem>
                                {session.user?.role === 'ADMIN' && (
                                    <>
                                        <DropdownMenuSeparator className="my-2 bg-gray-100/50" />
                                        <DropdownMenuItem className="p-3 rounded-2xl cursor-pointer hover:bg-purple-50">
                                            <Link href="/admin" className="flex items-center gap-3 w-full font-bold text-purple-600">
                                                <Sparkles className="w-4 h-4" />
                                                Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator className="my-2 bg-gray-100/50" />
                                <DropdownMenuItem
                                    className="p-3 rounded-2xl cursor-pointer text-red-500 hover:bg-red-50"
                                    onClick={() => signOut()}
                                >
                                    <div className="flex items-center gap-3 w-full font-bold">
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href="/login"
                            className="px-6 py-3 bg-primary-900 text-white rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Join In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
