import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Filter, Search, Sparkles, Heart, ArrowRight } from 'lucide-react'
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
        <div className="min-h-screen bg-primary-50 selection:bg-lavender selection:text-primary-900">
            <Header />

            <main className="container-custom pt-40 pb-20">
                {/* Search & Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-display font-black text-primary-900 tracking-tighter uppercase leading-none">
                            THE <span className="bg-lavender px-4 py-1 rounded-3xl">DROP</span>
                        </h1>
                        <p className="text-xl text-text-muted font-bold tracking-tight">Browse the freshest gear for the next generation.</p>
                    </div>

                    <div className="relative w-full lg:w-[400px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Find your vibe..."
                            className="w-full bg-white border-none py-6 pl-16 pr-8 rounded-[2.5rem] shadow-xl shadow-primary-900/5 focus:ring-4 focus:ring-lavender/50 transition-all font-bold outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidbar Filters: Bubbly Style */}
                    <aside className="lg:w-80 space-y-10">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-10 border border-gray-50">
                            <div>
                                <h3 className="text-xl font-display font-black text-primary-900 uppercase tracking-widest mb-6">Vibe Check</h3>
                                <div className="space-y-3">
                                    {categories.map((category) => (
                                        <label key={category.id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-5 h-5 rounded-md border-2 border-primary-900/10 group-hover:border-lavender transition-all" />
                                            <span className="font-bold text-text-muted group-hover:text-primary-900 transition-colors uppercase text-sm tracking-wider">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-primary-900/5" />

                            <div>
                                <h3 className="text-xl font-display font-black text-primary-900 uppercase tracking-widest mb-6">Price Range</h3>
                                <div className="px-2">
                                    <div className="h-2 w-full bg-primary-100 rounded-full relative">
                                        <div className="absolute inset-y-0 left-[20%] right-[40%] bg-lavender rounded-full" />
                                        <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary-900 rounded-full shadow-lg" />
                                        <div className="absolute top-1/2 right-[40%] -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary-900 rounded-full shadow-lg" />
                                    </div>
                                    <div className="flex justify-between mt-6 font-black text-xs uppercase tracking-widest text-text-muted">
                                        <span>₹0</span>
                                        <span>₹5000+</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-5 bg-primary-900 text-white rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                                Apply Filter
                            </button>
                        </div>

                        {/* Promo Bubble */}
                        <div className="bg-mint p-10 rounded-[3rem] shadow-xl space-y-6">
                            <Sparkles className="w-10 h-10 text-primary-900" />
                            <h4 className="text-3xl font-display font-black text-primary-900 leading-none tracking-tighter uppercase">AI TRIAL NOW LIVE!</h4>
                            <p className="font-bold text-primary-900/60 leading-tight">Unsure about size? Try it on virtually in seconds.</p>
                            <Link href="/try-on" className="inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest border-b-2 border-primary-900 pb-1">Enter Room <ArrowRight className="w-4 h-4" /></Link>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                            {products.map((product) => (
                                <div key={product.id} className="group flex flex-col">
                                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-500 mb-6 border border-gray-100">
                                        <Link href={`/product/${product.id}`} className="block h-full">
                                            {product.images?.[0]?.url ? (
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-4xl">🧥</div>
                                            )}
                                        </Link>

                                        {/* AI Quick Try Button */}
                                        <Link
                                            href={`/try-on?productId=${product.id}`}
                                            className="absolute bottom-6 left-6 right-6 bg-white/40 backdrop-blur-2xl border border-white/40 py-5 px-6 rounded-3xl flex items-center justify-center gap-3 shadow-2xl opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-300 hover:bg-white/60"
                                        >
                                            <Sparkles className="w-6 h-6 text-accent-600" />
                                            <span className="text-sm font-black text-primary-900 uppercase tracking-widest underline decoration-lavender decoration-4 underline-offset-4">Try on AI</span>
                                        </Link>

                                        <button className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-white border border-gray-50 flex items-center justify-center text-primary-900 hover:bg-accent-600 hover:text-white transition-all shadow-md">
                                            <Heart className="w-7 h-7" />
                                        </button>

                                        {/* Status Badge */}
                                        <div className="absolute top-6 left-6 px-4 py-1 bg-primary-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {product.isFeatured ? 'Fire' : 'New'}
                                        </div>
                                    </div>

                                    <div className="px-4 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-black text-accent-600 uppercase tracking-widest italic">{product.brand}</p>
                                            <div className="text-2xl font-display font-black text-primary-900">
                                                ₹{Number(product.basePrice).toLocaleString()}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-display font-black text-primary-900 tracking-tighter leading-none uppercase truncate">
                                            {product.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State if no products */}
                        {products.length === 0 && (
                            <div className="text-center py-40 space-y-6">
                                <div className="text-8xl">🏜️</div>
                                <h3 className="text-4xl font-display font-black text-primary-900 tracking-tighter uppercase">No Gear Found</h3>
                                <p className="text-text-muted font-bold">Try checking another vibe or clear your filters.</p>
                                <button className="px-10 py-5 bg-lavender text-primary-900 rounded-[2rem] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl">Clear All Vibes</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Pagination / Load More */}
            <div className="container-custom pb-40 text-center">
                <button className="px-12 py-6 bg-white border-4 border-primary-900 text-primary-900 rounded-[2.5rem] font-black text-xl hover:bg-primary-900 hover:text-white transition-all shadow-2xl uppercase tracking-tighter group">
                    Load More Swag
                    <ArrowRight className="w-6 h-6 inline ml-4 group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    )
}
