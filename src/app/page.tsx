import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
  Camera,
  Heart,
  Truck,
  RefreshCw,
} from "lucide-react";
import prisma from "@/lib/prisma";
import Header from "@/components/layout/Header";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    take: 4,
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    take: 4,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Modern Fashion Hero Section */}
      <section className="relative h-[calc(100vh-72px)] flex items-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04"
            alt="Hero Fashion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-900/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-600/20 backdrop-blur-md border border-accent-600/30 text-accent-400 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">New Collection 2026</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-6 leading-tight">
              Elevate Your <br />
              <span className="text-secondary-400 font-extrabold italic">Style</span> With AI
            </h1>

            <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
              Discover a curated collection of premium fashion. Experience the world's first AI Virtual Trial Room and see yourself in any outfit instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="btn-accent btn-lg group px-10">
                <ShoppingBag className="w-5 h-5" />
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/try-on" className="btn bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20 btn-lg px-8">
                <Camera className="w-5 h-5" />
                Virtual Trial Room
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-10 flex items-center gap-4 text-white/50">
          <div className="w-px h-12 bg-white/20" />
          <span className="text-xs uppercase tracking-widest vertical-text">Scroll to explore</span>
        </div>
      </section>

      {/* Featured Products Section - ECOM CORE */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-4">
                Featured Arrivals
              </h2>
              <p className="text-xl text-text-muted">
                Handpicked premium styles just for you
              </p>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-accent-600 font-bold hover:gap-3 transition-all">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🧥</div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-900 hover:text-accent-600 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full btn-primary btn-sm py-3 rounded-xl backdrop-blur-md">
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-primary-900 group-hover:text-accent-600 transition-colors mb-1">
                    {product.name}
                  </h3>
                  <p className="text-text-muted text-sm mb-2">{product.brand}</p>
                  <div className="text-xl font-display font-extrabold text-primary-900">
                    ₹{Number(product.basePrice).toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-4">
              Browse Collections
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Shop the latest trends by category
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <h3 className="text-3xl font-display font-bold mb-2">{category.name}</h3>
                  <p className="text-white/70 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 font-bold tracking-wider uppercase text-sm">
                    <span>Shop Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Trial Feature Section - UNIQUE USP */}
      <section className="section bg-primary-950 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-600/10 blur-[120px] rounded-full" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-400/10 border border-secondary-400/20 text-secondary-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-widest">World's First AI Fashion Tech</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
                Try On Clothes <br />
                <span className="text-accent-500">Virtually</span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Stop guessing your size or how a color looks on you. Our proprietary AI analyzes your body shape and applies the garment realistically in seconds.
              </p>

              <ul className="space-y-4">
                {[
                  "100% Photorealistic Results",
                  "Fits your body proportions exactly",
                  "Compare different styles instantly",
                  "Secure & Private - Images auto-deleted"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90">
                    <div className="w-6 h-6 rounded-full bg-accent-600 flex items-center justify-center text-white scale-75">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link href="/try-on" className="btn-accent btn-lg inline-flex group">
                  <Camera className="w-5 h-5" />
                  Experience Virtual Room
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border-8 border-white/5 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
                  alt="AI Try On Mockup"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent flex items-end p-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full animate-pulse-slow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent-600 flex items-center justify-center text-white">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-white/40 rounded mb-2" />
                        <div className="h-2 w-16 bg-white/20 rounded" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-1 w-full bg-white/10 rounded" />
                      <div className="h-1 w-4/5 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-600/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", text: "On orders over ₹999" },
              { icon: Shield, title: "Secure Payment", text: "100% encrypted checkout" },
              { icon: RefreshCw, title: "Easy Returns", text: "30-day return policy" },
              { icon: Star, title: "Premium Quality", text: "Certified fashion brands" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2">
                <badge.icon className="w-8 h-8 text-accent-600" />
                <h4 className="font-bold text-primary-900">{badge.title}</h4>
                <p className="text-xs text-text-muted uppercase tracking-widest font-semibold">{badge.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-950 text-white py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-display font-bold">AURA FIT</h3>
              <p className="text-white/60 leading-relaxed">
                Redefining the digital fashion experience through cutting-edge AI and premium curation.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent-600 transition-all cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
                {/* Social icons would go here */}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Explore</h4>
              <ul className="space-y-4 text-white/50">
                <li><Link href="/shop" className="hover:text-white transition-colors">Latest Drops</Link></li>
                <li><Link href="/shop?category=men" className="hover:text-white transition-colors">Men's Fashion</Link></li>
                <li><Link href="/shop?category=women" className="hover:text-white transition-colors">Women's Collection</Link></li>
                <li><Link href="/try-on" className="hover:text-white transition-colors">Virtual Room</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Customer Care</h4>
              <ul className="space-y-4 text-white/50">
                <li><Link href="/help" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-bold">Newsletter</h4>
              <p className="text-white/50 text-sm">Join the AURA circle for exclusive drops and AI fashion insights.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-accent-600"
                />
                <button className="bg-white text-primary-900 rounded-xl px-4 font-bold text-sm">Join</button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm">
            <p>&copy; 2026 AURA FIT. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
