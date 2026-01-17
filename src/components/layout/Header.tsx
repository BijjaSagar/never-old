"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User, LogOut, LogIn, Camera } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

export default function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="container-custom py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-display font-bold text-primary-900 flex items-center gap-2">
                        <span className="bg-primary-900 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">A</span>
                        AURA FIT
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/shop" className="text-text-muted hover:text-primary-900 font-medium transition-colors">
                            Shop
                        </Link>
                        <Link href="/try-on" className="text-text-muted hover:text-primary-900 font-medium transition-colors flex items-center gap-2">
                            <Camera className="w-4 h-4 text-accent-600" />
                            AI Try-On
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative p-2 text-primary-900 hover:text-accent-600 transition-colors">
                            <ShoppingBag className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-4 h-4 bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                0
                            </span>
                        </Link>

                        <div className="h-6 w-px bg-gray-200" />

                        {status === "authenticated" ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 border border-primary-200">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}
                                    <span className="text-sm font-semibold text-primary-900 hidden lg:block">
                                        {session.user?.name?.split(' ')[0]}
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl shadow-xl border-gray-100">
                                    <DropdownMenuItem className="p-3 rounded-lg cursor-pointer">
                                        <Link href="/profile" className="flex items-center gap-3 w-full">
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-3 rounded-lg cursor-pointer">
                                        <Link href="/orders" className="flex items-center gap-3 w-full">
                                            <ShoppingBag className="w-4 h-4" />
                                            My Orders
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1 bg-gray-50" />
                                    <DropdownMenuItem
                                        className="p-3 rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                        onClick={() => signOut()}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/login"
                                className="btn-primary btn-sm px-6 rounded-full flex items-center gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
