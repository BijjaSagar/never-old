import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
    ShoppingBag,
    Heart,
    Share2,
    Star,
    Camera,
    Shield,
    RefreshCw,
    ChevronRight,
    Check,
    Sparkles,
    Zap,
    Truck
} from 'lucide-react'
import prisma from '@/lib/prisma'
import Header from '@/components/layout/Header'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

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

    const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || "https://images.unsplash.com/photo-1519457431-75514f775240"

    return (
        <div className="min-h-screen bg-primary-50 selection:bg-mint selection:text-primary-900">
            <Header />

            <main className="container-custom pt-40 pb-20">
                {/* Breadcrumbs: Bubbly Style */}
                <nav className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
                    <Link href="/" className="px-5 py-2 bg-white rounded-full text-xs font-black uppercase tracking-widest text-text-muted hover:text-primary-900 shadow-sm">Home</Link>
                    <ChevronRight className="w-4 h-4 text-primary-900/20 shrink-0" />
                    <Link href="/shop" className="px-5 py-2 bg-white rounded-full text-xs font-black uppercase tracking-widest text-text-muted hover:text-primary-900 shadow-sm">The Drop</Link>
                    <ChevronRight className="w-4 h-4 text-primary-900/20 shrink-0" />
                    <span className="px-5 py-2 bg-lavender rounded-full text-xs font-black uppercase tracking-widest text-primary-900 shadow-sm whitespace-nowrap">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Visuals: Adventure Layout */}
                    <div className="space-y-6">
                        <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl bg-white border-8 border-white group">
                            <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-8 left-8">
                                <span className="bg-primary-900 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg">New Season</span>
                            </div>
                            <button className="absolute bottom-8 right-8 w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary-900 shadow-2xl hover:bg-accent-600 hover:text-white transition-all">
                                <Heart className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Secondary Gallery */}
                        <div className="grid grid-cols-3 gap-6">
                            {product.images.slice(0, 3).map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-all">
                                    <Image src={img.url} alt={`Gallery ${i}`} fill className="object-cover" />
                                </div>
                            ))}
                            {/* Empty gallery slots */}
                            {Array.from({ length: Math.max(0, 3 - product.images.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square rounded-[2rem] bg-gray-100 flex items-center justify-center text-gray-300 border-4 border-white shadow-inner">
                                    <Zap className="w-8 h-8" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details: Hyper Content */}
                    <div className="flex flex-col">
                        <div className="flex-1 space-y-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-black text-accent-600 uppercase tracking-widest italic bg-accent-600/10 px-4 py-1 rounded-full">{product.brand}</span>
                                    <div className="flex text-canary">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-xs font-black text-text-muted">(12 VIBE REVIEWS)</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-display font-black text-primary-900 tracking-tighter leading-[0.85] uppercase">
                                    {product.name.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 !== 0 ? 'text-accent-600 italic outline-text' : ''}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>
                                <div className="text-5xl font-display font-black text-primary-900">
                                    ₹{Number(product.basePrice).toLocaleString()}
                                </div>
                                <p className="text-xl text-text-muted font-bold leading-relaxed max-w-xl italic">
                                    "{product.description}"
                                </p>
                            </div>

                            <hr className="border-primary-900/5" />

                            {/* AI TRIAL ROOM CTA: MAGICAL */}
                            <div className="bg-gradient-to-br from-lavender to-sky p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-900 shadow-xl">
                                            <Sparkles className="w-8 h-8 text-accent-600 animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-display font-black text-primary-900 leading-none">VIRTUAL TRY-ON</h3>
                                            <p className="text-primary-900/60 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">POWERED BY AURA AI</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-primary-900 leading-snug">Unsure about the fit? See it on your kid virtually before buying. It’s magic.</p>
                                    <Link
                                        href={`/try-on?productId=${product.id}`}
                                        className="w-full py-5 bg-primary-900 text-white rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Camera className="w-5 h-5" />
                                        Launch AI Fitting Room
                                    </Link>
                                </div>
                            </div>

                            {/* Selectors: Bubbly */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-primary-900">Select Vibe Size</h4>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-accent-600 underline">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {['S', 'M', 'L', 'XL'].map((size) => (
                                            <button
                                                key={size}
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl border-4 transition-all ${size === 'M'
                                                    ? 'bg-primary-900 border-primary-900 text-white shadow-xl scale-110'
                                                    : 'bg-white border-transparent text-primary-900 hover:border-lavender'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-primary-900 text-left px-2">Color Palette</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {['bg-primary-900', 'bg-lavender', 'bg-mint', 'bg-sky'].map((color, i) => (
                                            <button
                                                key={i}
                                                className={`w-12 h-12 rounded-full border-4 ${color === 'bg-primary-900' ? 'border-primary-900 ring-4 ring-primary-900/20 shadow-lg' : 'border-white'}`}
                                            >
                                                <div className={`w-full h-full rounded-full ${color}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Final CTAs */}
                            <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                <button className="flex-1 py-7 bg-primary-900 text-white rounded-[2.5rem] font-black uppercase text-lg tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                                    <ShoppingBag className="w-6 h-6" />
                                    Add to Closet
                                </button>
                                <button className="p-7 bg-white border-4 border-primary-900 text-primary-900 rounded-[2.5rem] shadow-xl hover:bg-primary-900 hover:text-white transition-all group">
                                    <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* High-End Trust Badges */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { icon: Truck, title: "Super Sonic Delivery", text: "2-3 business days max." },
                                { icon: RefreshCw, title: "Zero Stress Returns", text: "30-day window, free of charge." },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-6 p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm">
                                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-900 shrink-0">
                                        <badge.icon className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black uppercase text-primary-900 leading-none">{badge.title}</h4>
                                        <p className="text-xs font-bold text-text-muted">{badge.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Technical Details: Gen-Z Minimalist */}
                <div className="mt-32 bg-white rounded-[5rem] p-12 md:p-24 shadow-sm border border-gray-50">
                    <div className="max-w-4xl mx-auto space-y-16 text-center">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-display font-black text-primary-900 tracking-tighter uppercase leading-none">THE DETAILS MATTER</h2>
                            <p className="text-xl text-text-muted font-bold italic">Because looking good should feel good too.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { label: "Material", value: "100% Street-Ready Cotton" },
                                { label: "Fit", value: "Gen-Z Oversized / Relaxed" },
                                { label: "Care", value: "Machine Wash, No Boundaries" }
                            ].map((spec, i) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-[10px] font-black text-accent-600 uppercase tracking-[0.3em]">{spec.label}</p>
                                    <p className="text-2xl font-display font-black text-primary-900 uppercase tracking-tighter">{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-16 space-y-10 text-left bg-primary-50 p-12 rounded-[4rem]">
                            <h3 className="text-2xl font-display font-black text-primary-900 uppercase">Why this vibes:</h3>
                            <ul className="grid md:grid-cols-2 gap-8">
                                {[
                                    "Hyper-durable stitching for all-day energy",
                                    "Next-gen dye technology for zero fade",
                                    "Premium weighted fabric for that luxury street feel",
                                    "Designed in-house by AURA style curators",
                                    "Eco-conscious production with minimal waste",
                                    "Perfectly compatible with our AI Try-On engine"
                                ].map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-4 text-primary-900 font-bold">
                                        <div className="w-6 h-6 bg-mint rounded-full flex items-center justify-center shrink-0">
                                            <Check className="w-4 h-4 text-primary-900" />
                                        </div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Footer CTA on Mobile */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
                <button className="w-full py-6 bg-primary-900 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl flex items-center justify-center gap-4">
                    <ShoppingBag className="w-6 h-6" />
                    Quick Add to Closet
                </button>
            </div>

        </div>
    )
}
