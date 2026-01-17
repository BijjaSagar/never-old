import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, CreditCard } from 'lucide-react'

export default function CartPage() {
    // Basic empty cart state for now as shopping cart logic is planned for Phase 1 Week 3-4
    return (
        <div className="min-h-screen bg-primary-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-display font-bold text-primary-900">
                            AURA FIT
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link href="/shop" className="text-text-muted hover:text-primary-900 transition-colors">
                                Shop
                            </Link>
                            <Link href="/try-on" className="text-text-muted hover:text-primary-900 transition-colors">
                                AI Try-On
                            </Link>
                            <Link href="/cart" className="text-accent-600 font-medium flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                Cart
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container-custom py-12">
                <h1 className="text-3xl font-display font-bold text-primary-900 mb-8">
                    Your Shopping Cart
                </h1>

                <div className="max-w-4xl mx-auto">
                    <div className="card p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-10 h-10 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-primary-900 mb-4">
                            Your cart is currently empty
                        </h2>
                        <p className="text-text-muted mb-8 max-w-md mx-auto">
                            Looks like you haven't added anything to your cart yet. Explore our latest collection and try on outfits with AI!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/shop" className="btn-primary w-full sm:w-auto">
                                <ArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                            <Link href="/try-on" className="btn-accent w-full sm:w-auto">
                                Try with AI
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Placeholder */}
            <footer className="bg-white border-t border-border py-12">
                <div className="container-custom text-center text-text-muted text-sm">
                    © 2026 AURA FIT. All rights reserved. Premium AI Fashion Experience.
                </div>
            </footer>
        </div>
    )
}
