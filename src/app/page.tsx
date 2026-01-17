"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  RefreshCw
} from "lucide-react";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600 opacity-95" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000" />
        </div>

        {/* Hero Content */}
        <div className={`container-custom relative z-10 text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by Advanced AI Technology</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 animate-slide-up">
            Welcome to <span className="gradient-text bg-gradient-to-r from-secondary-400 to-white bg-clip-text text-transparent">AURA FIT</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-slide-up animation-delay-200">
            Experience the future of fashion shopping with our AI-powered Virtual Trial Room.
            See how clothes look on you before you buy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
            <Link href="/try-on" className="btn-accent btn-lg group">
              <Camera className="w-5 h-5" />
              Try AI Virtual Room
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/shop" className="btn bg-white text-primary-900 hover:bg-white/90 btn-lg">
              <ShoppingBag className="w-5 h-5" />
              Shop Now
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {[
              { label: "Happy Customers", value: "50K+", icon: Heart },
              { label: "Products", value: "10K+", icon: ShoppingBag },
              { label: "AI Try-Ons", value: "100K+", icon: Camera },
              { label: "Satisfaction", value: "98%", icon: Star },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${600 + index * 100}ms` }}>
                <stat.icon className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-4">
              Why Choose AURA FIT?
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Experience shopping like never before with cutting-edge technology and premium quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "AI Virtual Try-On",
                description: "See how clothes look on you with our advanced AI technology. Upload your photo and try unlimited outfits instantly.",
                color: "accent",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get AI try-on results in seconds. Our optimized pipeline ensures the fastest processing times in the industry.",
                color: "secondary",
              },
              {
                icon: Shield,
                title: "100% Secure & Private",
                description: "Your images are encrypted and auto-deleted after 7 days. We never store or share your personal data.",
                color: "success",
              },
              {
                icon: TrendingUp,
                title: "Smart Recommendations",
                description: "AI-powered outfit suggestions based on your style, body type, and fashion trends.",
                color: "accent",
              },
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Enjoy free shipping on all orders above ₹999. Fast delivery across India within 3-5 days.",
                color: "secondary",
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                description: "30-day hassle-free returns. If you're not satisfied, we'll make it right.",
                color: "success",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card-feature group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Discover our curated collections for the whole family
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kidswear", image: "👶", color: "from-pink-400 to-purple-400" },
              { name: "Men", image: "👔", color: "from-blue-400 to-indigo-400" },
              { name: "Women", image: "👗", color: "from-rose-400 to-pink-400" },
              { name: "Accessories", image: "👜", color: "from-amber-400 to-orange-400" },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/shop/${category.name.toLowerCase()}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">
                    {category.image}
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-2">{category.name}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Transform Your Shopping Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who are already using AI to shop smarter
          </p>
          <Link href="/try-on" className="btn-accent btn-lg inline-flex">
            <Camera className="w-5 h-5" />
            Start AI Try-On Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-950 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">AURA FIT</h3>
              <p className="text-white/70">
                AI-powered fashion e-commerce platform bringing the future of shopping to you.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/shop/kidswear" className="hover:text-white transition-colors">Kidswear</Link></li>
                <li><Link href="/shop/men" className="hover:text-white transition-colors">Men</Link></li>
                <li><Link href="/shop/women" className="hover:text-white transition-colors">Women</Link></li>
                <li><Link href="/shop/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/70">
            <p>&copy; 2026 AURA FIT. All rights reserved. Built with ❤️ and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
