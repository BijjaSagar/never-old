import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
    ShoppingCart,
    Camera,
    Heart,
    Share2,
    Star,
    Truck,
    Shield,
    RefreshCw,
    ChevronRight,
    Check
} from 'lucide-react'
import prisma from '@/lib/prisma'

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = params

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: true,
            variants: true,
            category: true,
        }
    })

    if (!product) {
        notFound()
    }

    const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-display font-bold text-primary-900">
                            AURA FIT
                        </Link>
                        <nav className="flex items-center gap-6">
                            <Link href="/shop" className="text-primary-900 font-medium hover:text-accent-600 transition-colors">
                                Shop
                            </Link>
                            <Link href="/try-on" className="text-primary-900 font-medium hover:text-accent-600 transition-colors">
                                AI Try-On
                            </Link>
                            {/* Simple Cart Indicator */}
                            <Link href="/cart" className="relative p-2 text-primary-900">
                                <ShoppingCart className="w-6 h-6" />
                                <span className="absolute top-0 right-0 w-4 h-4 bg-accent-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    0
                                </span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
                    <Link href="/" className="hover:text-primary-900">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/shop" className="hover:text-primary-900">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-primary-900 font-medium truncate">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
                            {primaryImage ? (
                                <Image
                                    src={primaryImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-6xl">🧥</div>
                            )}
                            {/* AI Watermark */}
                            <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                                Premium Quality
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, i) => (
                                <div key={i} className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${img.url === primaryImage ? 'border-accent-600' : 'border-transparent hover:border-gray-200'}`}>
                                    <Image
                                        src={img.url}
                                        alt={`${product.name} ${i}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">
                                <Sparkles className="w-4 h-4" />
                                {product.brand}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-amber-500">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span className="text-sm text-text-muted">(24 Reviews)</span>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-display font-extrabold text-primary-900">
                                    ₹{Number(product.basePrice).toLocaleString()}
                                </span>
                                {product.salePrice && (
                                    <span className="text-xl text-text-muted line-through">
                                        ₹{Number(product.salePrice).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Variants (Size/Color) */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-primary-900 uppercase tracking-wider mb-3">
                                    Select Size
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {Array.from(new Set(product.variants.map(v => v.size))).map(size => (
                                        <button key={size} className="w-14 h-14 rounded-xl border-2 border-gray-100 flex items-center justify-center font-bold text-primary-900 hover:border-accent-600 transition-all">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-primary-900 uppercase tracking-wider mb-3">
                                    Color
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                                        <button key={color} className="group p-1 rounded-full border-2 border-transparent hover:border-accent-600 transition-all">
                                            <div
                                                className="w-8 h-8 rounded-full border border-gray-100"
                                                style={{ backgroundColor: color.toLowerCase() }}
                                                title={color}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Primary Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="flex-1 btn-primary btn-lg py-5 rounded-2xl flex items-center justify-center gap-3">
                                <ShoppingCart className="w-6 h-6" />
                                Add to Shopping Bag
                            </button>
                            <Link href={`/try-on?productId=${product.id}`} className="flex-1 btn-accent btn-lg py-5 rounded-2xl flex items-center justify-center gap-3">
                                <Camera className="w-6 h-6" />
                                Virtual Try-On
                            </Link>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex items-center gap-8 pt-2">
                            <button className="flex items-center gap-2 text-primary-900 font-bold text-sm hover:text-accent-600 transition-colors">
                                <Heart className="w-5 h-5" />
                                Save to Wishlist
                            </button>
                            <button className="flex items-center gap-2 text-primary-900 font-bold text-sm hover:text-accent-600 transition-colors">
                                <Share2 className="w-5 h-5" />
                                Share Product
                            </button>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-primary-900">Product Details</h3>
                            <p className="text-text-muted leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            {[
                                { icon: Truck, label: "Free Shipping", sub: "On orders above ₹999" },
                                { icon: RefreshCw, label: "Easy Returns", sub: "30-day hassle-free" },
                                { icon: Shield, label: "Secure", sub: "100% genuine products" },
                            ].map((b, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="p-2 rounded-lg bg-primary-50">
                                        <b.icon className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-primary-900 text-sm">{b.label}</div>
                                        <div className="text-xs text-text-muted">{b.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* AI Experience Banner */}
            <section className="bg-primary-900 py-16 my-20">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="w-20 h-20 rounded-3xl bg-accent-600 flex items-center justify-center text-white mx-auto shadow-2xl">
                            <Camera className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                            See this Outfit on <span className="text-accent-500">You</span>
                        </h2>
                        <p className="text-xl text-white/70">
                            Our AI technology lets you see exactly how this {product.name} fits your unique body proportions before you click buy.
                        </p>
                        <Link href={`/try-on?productId=${product.id}`} className="btn-accent btn-lg px-12 inline-flex">
                            Open Virtual Trial Room
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-2xl font-display font-bold text-primary-900 italic">AURA FIT</div>
                    <p className="text-text-muted text-sm">© 2026 AURA FIT. Premium AI-Powered Fashion.</p>
                </div>
            </footer>
        </div>
    )
}
