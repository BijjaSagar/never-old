import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Filter, Search } from 'lucide-react'
import prisma from '@/lib/prisma'

import Header from '@/components/layout/Header'

export default async function ShopPage() {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        include: {
            images: {
                where: { isPrimary: true },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
    })

    return (
        <div className="min-h-screen bg-primary-50">
            <Header />

            <main className="container-custom py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Categories
                            </h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/shop?category=${category.slug}`}
                                        className="block px-3 py-2 rounded-lg hover:bg-white hover:text-accent-600 transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-display font-bold text-primary-900">
                                All Products
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-text-muted text-sm">{products.length} Products</span>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-600 w-48 md:w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    className="card group"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        {product.images?.[0]?.url ? (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        {product.salePrice && (
                                            <div className="absolute top-4 left-4 badge-accent">
                                                Sale
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-primary-900 mb-1 group-hover:text-accent-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-text-muted text-sm mb-3 truncate">
                                            {product.brand}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-primary-900">₹{Number(product.basePrice).toLocaleString()}</span>
                                                {product.salePrice && (
                                                    <span className="text-text-muted text-sm line-through">₹{Number(product.salePrice).toLocaleString()}</span>
                                                )}
                                            </div>
                                            <button className="p-2 rounded-full bg-primary-100 text-primary-900 hover:bg-accent-600 hover:text-white transition-colors">
                                                <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
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
