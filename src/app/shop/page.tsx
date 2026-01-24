'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Filter, Search, Sparkles, Heart, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import { useCategory } from '@/contexts/CategoryContext';
import { useSearchParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    brand: string;
    basePrice: number;
    isFeatured: boolean;
    categoryId: string;
    images: { url: string }[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

function ShopContent() {
    const { category: selectedCategory } = useCategory();
    const searchParams = useSearchParams();
    const categoryParam = searchParams?.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch products and categories
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                setProducts(productsData.products || []);
                setCategories(categoriesData.categories || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Filter products based on category context, URL params, and selected filters
    const filteredProducts = products.filter(product => {
        // Filter by category from header navigation
        if (selectedCategory) {
            const categoryMatch = categories.find(cat =>
                cat.slug.toLowerCase().includes(selectedCategory.toLowerCase())
            );
            if (categoryMatch && product.categoryId !== categoryMatch.id) {
                return false;
            }
        }

        // Filter by URL category parameter
        if (categoryParam) {
            const categoryMatch = categories.find(cat => cat.slug === categoryParam);
            if (categoryMatch && product.categoryId !== categoryMatch.id) {
                return false;
            }
        }

        // Filter by sidebar checkboxes
        if (selectedFilters.length > 0 && !selectedFilters.includes(product.categoryId)) {
            return false;
        }

        // Filter by search query
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const toggleFilter = (categoryId: string) => {
        setSelectedFilters(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const clearFilters = () => {
        setSelectedFilters([]);
        setSearchQuery('');
    };

    return (
        <main className="container-custom pt-40 pb-20">
            {/* Search & Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-display font-black text-primary-900 tracking-tighter uppercase leading-none">
                        THE <span className="bg-lavender px-4 py-1 rounded-3xl">DROP</span>
                    </h1>
                    <p className="text-xl text-text-muted font-bold tracking-tight">
                        {selectedCategory
                            ? `Browse ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} collection`
                            : 'Browse the freshest gear for the next generation.'}
                    </p>
                </div>

                <div className="relative w-full lg:w-[400px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Find your vibe..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-none py-6 pl-16 pr-8 rounded-[2.5rem] shadow-xl shadow-primary-900/5 focus:ring-4 focus:ring-lavender/50 transition-all font-bold outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="lg:w-80 space-y-10">
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl space-y-10 border border-gray-50">
                        <div>
                            <h3 className="text-xl font-display font-black text-primary-900 uppercase tracking-widest mb-6">Vibe Check</h3>
                            <div className="space-y-3">
                                {categories.map((category) => (
                                    <label key={category.id} className="flex items-center gap-4 group cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.includes(category.id)}
                                            onChange={() => toggleFilter(category.id)}
                                            className="w-5 h-5 rounded-md border-2 border-primary-900/10 checked:bg-lavender checked:border-lavender transition-all"
                                        />
                                        <span className="font-bold text-text-muted group-hover:text-primary-900 transition-colors uppercase text-sm tracking-wider">
                                            {category.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-primary-900/5" />

                        <button
                            onClick={clearFilters}
                            className="w-full py-5 bg-primary-900 text-white rounded-3xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Promo Bubble */}
                    <div className="bg-mint p-10 rounded-[3rem] shadow-xl space-y-6">
                        <Sparkles className="w-10 h-10 text-primary-900" />
                        <h4 className="text-3xl font-display font-black text-primary-900 leading-none tracking-tighter uppercase">AI TRIAL NOW LIVE!</h4>
                        <p className="font-bold text-primary-900/60 leading-tight">Unsure about size? Try it on virtually in seconds.</p>
                        <Link href="/try-on" className="inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest border-b-2 border-primary-900 pb-1">
                            Enter Room <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="text-center py-40">
                            <div className="animate-spin w-16 h-16 border-4 border-lavender border-t-transparent rounded-full mx-auto mb-6"></div>
                            <p className="text-xl font-bold text-text-muted">Loading products...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                                {filteredProducts.map((product) => (
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

                            {/* Empty State */}
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-40 space-y-6">
                                    <div className="text-8xl">🏜️</div>
                                    <h3 className="text-4xl font-display font-black text-primary-900 tracking-tighter uppercase">No Gear Found</h3>
                                    <p className="text-text-muted font-bold">Try checking another vibe or clear your filters.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="px-10 py-5 bg-lavender text-primary-900 rounded-[2rem] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                                    >
                                        Clear All Vibes
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-primary-50 selection:bg-lavender selection:text-primary-900">
            <Header />
            <Suspense fallback={
                <main className="container-custom pt-40 pb-20">
                    <div className="text-center py-40">
                        <div className="animate-spin w-16 h-16 border-4 border-lavender border-t-transparent rounded-full mx-auto mb-6"></div>
                        <p className="text-xl font-bold text-text-muted">Loading shop...</p>
                    </div>
                </main>
            }>
                <ShopContent />
            </Suspense>
        </div>
    );
}
