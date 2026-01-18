import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Star,
  ArrowRight,
  Camera,
  Heart,
  Truck,
  Shield,
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
  });

  return (
    <div className="min-h-screen bg-primary-50 selection:bg-lavender selection:text-primary-900">
      <Header />

      {/* Hero: Gen-Z Street Style */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-lavender/30 border border-lavender/50 text-primary-900 animate-bounce">
                <Sparkles className="w-5 h-5 text-accent-600" />
                <span className="text-sm font-black uppercase tracking-widest">Next-Gen Fashion</span>
              </div>

              <h1 className="text-7xl md:text-9xl font-display font-black text-primary-900 leading-[0.85] tracking-tighter">
                FUTURE <br />
                <span className="text-accent-600 italic">STYLE</span> <br />
                <span className="bg-gradient-to-r from-secondary-500 to-lavender bg-clip-text text-transparent">NOW.</span>
              </h1>

              <p className="text-xl text-text-muted max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                Coolest drops for the coolest kids. Real-time AI Try-On included. No more guessing, just pure swag.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/shop" className="px-10 py-5 bg-primary-900 text-white rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 group">
                  Start Exploring
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/try-on" className="px-10 py-5 bg-white border-4 border-primary-900 text-primary-900 rounded-[2rem] font-black text-lg hover:bg-primary-900 hover:text-white transition-all shadow-xl flex items-center gap-3">
                  <Camera className="w-6 h-6" />
                  AI Try-On
                </Link>
              </div>
            </div>

            <div className="relative lg:h-[700px]">
              <div className="absolute top-10 right-10 w-[80%] h-[90%] bg-mint/40 rounded-[4rem] -rotate-3 -z-10" />
              <div className="absolute top-20 right-20 w-[80%] h-[90%] bg-lavender/40 rounded-[4rem] rotate-3 -z-10" />

              <div className="relative h-full w-full rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl skew-y-1">
                <Image
                  src="https://images.unsplash.com/photo-1519457431-75514f775240"
                  alt="Gen-Z Fashion"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Floating Badge */}
                <div className="absolute bottom-10 left-10 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 max-w-[200px]">
                  <p className="text-xs font-black text-primary-900 uppercase tracking-tighter mb-1">Status</p>
                  <p className="text-xl font-display font-black text-primary-900 leading-none italic uppercase">Verified Cool</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Categories */}
      <section className="section py-24">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-5xl font-display font-black text-primary-900 tracking-tighter">PICK YOUR VIBE</h2>
            <div className="hidden md:block h-3 flex-1 bg-primary-900/5 mx-8 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
            {/* Main Bento Item */}
            <Link
              href={`/shop?category=${categories[0]?.slug}`}
              className="md:col-span-7 relative group rounded-[3rem] overflow-hidden shadow-xl"
            >
              <Image src={categories[0]?.imageUrl || ""} alt={categories[0]?.name || ""} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <span className="bg-accent-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase mb-4 inline-block">Hot Now</span>
                <h3 className="text-5xl font-display font-black tracking-tighter uppercase leading-none">{categories[0]?.name}</h3>
                <p className="mt-2 text-white/80 font-medium">Checkout the latest drops</p>
              </div>
            </Link>

            {/* Smaller Bento Item 1 */}
            <Link
              href={`/shop?category=${categories[1]?.slug}`}
              className="md:col-span-5 relative group rounded-[3rem] overflow-hidden shadow-xl bg-lavender"
            >
              <Image src={categories[1]?.imageUrl || ""} alt={categories[1]?.name || ""} fill className="object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                <h3 className="text-4xl font-display font-black text-primary-900 leading-none tracking-tighter uppercase">{categories[1]?.name}</h3>
              </div>
            </Link>

            {/* Smaller Bento Item 2 */}
            <Link
              href={`/shop?category=${categories[2]?.slug}`}
              className="md:col-span-5 relative group rounded-[3rem] overflow-hidden shadow-xl bg-peach"
            >
              <Image src={categories[2]?.imageUrl || ""} alt={categories[2]?.name || ""} fill className="object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-x-8 bottom-8">
                <h3 className="text-3xl font-display font-black text-primary-900 leading-none tracking-tighter uppercase">{categories[2]?.name}</h3>
              </div>
            </Link>

            {/* Smaller Bento Item 3 */}
            <Link
              href={`/shop?category=${categories[3]?.slug}`}
              className="md:col-span-7 relative group rounded-[3rem] overflow-hidden shadow-xl bg-mint"
            >
              <Image src={categories[3]?.imageUrl || ""} alt={categories[3]?.name || ""} fill className="object-cover mix-blend-multiply opacity-40 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex flex-col justify-center p-12">
                <h3 className="text-4xl font-display font-black text-primary-900 leading-none tracking-tighter uppercase">{categories[3]?.name}</h3>
                <p className="text-primary-900/70 font-bold mt-2">Essential street gear</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Highlight: The Gen-Z Way */}
      <section className="section py-24 bg-white rounded-[5rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-6xl font-display font-black text-primary-900 tracking-tighter">LATEST DROPS</h2>
              <p className="text-xl text-text-muted font-bold italic underline decoration-lavender decoration-4 underline-offset-8">
                Your wardrobe is about to get an upgrade
              </p>
            </div>
            <Link href="/shop" className="group flex items-center gap-3 bg-primary-100 px-8 py-4 rounded-full font-black text-primary-900 hover:bg-lavender transition-all">
              View All
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 mb-6">
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
                    className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-xl border border-white/40 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
                  >
                    <Sparkles className="w-5 h-5 text-accent-600" />
                    <span className="text-sm font-black text-primary-900 uppercase">Try it on AI</span>
                  </Link>

                  <button className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary-900 hover:bg-accent-600 hover:text-white transition-all shadow-md">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>

                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-accent-600 uppercase tracking-widest">{product.brand}</p>
                    <div className="text-xl font-display font-black text-primary-900">
                      ₹{Number(product.basePrice).toLocaleString()}
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-black text-primary-900 tracking-tight leading-tight uppercase truncate">
                    {product.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Virtual Room Promo: Hyper Gen-Z */}
      <section className="section py-32 overflow-hidden bg-primary-900 text-white relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="container-custom relative z-10">
          <div className="bg-lavender p-1 md:p-12 rounded-[5rem] overflow-hidden relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="p-8 md:p-12 space-y-8 order-2 lg:order-1">
                <div className="inline-block px-4 py-1 bg-primary-900 text-white rounded-full text-xs font-black uppercase tracking-widest leading-none">The Future is Here</div>
                <h2 className="text-6xl md:text-8xl font-display font-black text-primary-900 tracking-tighter leading-[0.85] uppercase">
                  SEE IT. <br />
                  <span className="italic outline-text">TRY IT.</span> <br />
                  LOVE IT.
                </h2>
                <p className="text-xl text-primary-900/80 font-bold max-w-sm">
                  Stop guessing sizes. Our AI shows you the fit instantly. It's basically magic for your wardrobe.
                </p>
                <Link href="/try-on" className="px-10 py-5 bg-primary-900 text-white rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-3">
                  Enter Virtual Room
                  <Camera className="w-6 h-6" />
                </Link>
              </div>

              <div className="relative h-[400px] md:h-[600px] order-1 lg:order-2">
                <div className="absolute inset-10 bg-mint rounded-[4rem] rotate-12 blur-3xl opacity-50" />
                <div className="relative h-full w-full rounded-[3rem] overflow-hidden border-4 border-primary-900">
                  <Image
                    src="https://images.unsplash.com/photo-1621451537084-482c73073a0f"
                    alt="AI Try On"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary-900/20 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center animate-ping text-primary-900">
                      <Sparkles className="w-10 h-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Services */}
      <section className="py-24 border-t border-primary-900/5">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Truck, title: "FASTEST SHIPPING", text: "Across India, no questions asked.", color: "bg-sky/20" },
              { icon: Shield, title: "SAFE AF CHECKOUT", text: "Encrypted, secure, and worry-free.", color: "bg-mint/30" },
              { icon: RefreshCw, title: "EZ 30-DAY RETURNS", text: "Didn't vibe? Send it back.", color: "bg-lavender/30" },
            ].map((item, i) => (
              <div key={i} className={`p-10 rounded-[3rem] ${item.color} space-y-6 group hover:scale-105 transition-all`}>
                <item.icon className="w-12 h-12 text-primary-900" />
                <div className="space-y-2">
                  <h4 className="text-2xl font-display font-black text-primary-900 tracking-tight uppercase leading-none">{item.title}</h4>
                  <p className="text-primary-900/60 font-bold">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer: Gen-Z Minimalist */}
      <footer className="bg-white pt-32 pb-12 rounded-t-[5rem] shadow-[0_-10px_50px_rgba(0,0,0,0.05)] border-t border-gray-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <h3 className="text-4xl font-display font-black text-primary-900 tracking-tighter italic uppercase">AURA FIT</h3>
              <p className="font-medium text-text-muted leading-relaxed">
                Reimagining the fashion experience for the next generation. Style powered by AI. Experience redefined.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center hover:bg-lavender transition-all cursor-pointer">
                  <Star className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-display font-black uppercase text-primary-900 tracking-wider">The Store</h4>
              <ul className="space-y-4 font-bold text-text-muted">
                <li><Link href="/shop" className="hover:text-accent-600 transition-colors">Latest Drops</Link></li>
                <li><Link href="/shop?category=girls" className="hover:text-accent-600 transition-colors">Girls Collection</Link></li>
                <li><Link href="/shop?category=boys" className="hover:text-accent-600 transition-colors">Boys Street</Link></li>
                <li><Link href="/try-on" className="hover:text-accent-600 transition-colors">Virtual Room</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-display font-black uppercase text-primary-900 tracking-wider">Support</h4>
              <ul className="space-y-4 font-bold text-text-muted">
                <li><Link href="/help" className="hover:text-accent-600 transition-colors">Track Order</Link></li>
                <li><Link href="/returns" className="hover:text-accent-600 transition-colors">Returns</Link></li>
                <li><Link href="/shipping" className="hover:text-accent-600 transition-colors">Shipping</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-display font-black uppercase text-primary-900 tracking-wider">Don't Miss Out</h4>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-primary-50 border-none rounded-2xl py-5 px-6 font-bold focus:ring-4 focus:ring-lavender/50 outline-none transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary-900 text-white px-6 rounded-xl font-black text-sm">Join</button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-text-muted/60 text-[10px] font-black uppercase tracking-[0.2em]">
            <p>&copy; 2026 AURA FIT. No boundaries.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-primary-900">Privacy</Link>
              <Link href="/terms" className="hover:text-primary-900">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Tailwind Utility for outline text */}
      <style jsx global>{`
        .outline-text {
          -webkit-text-stroke: 2px #09090b;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
