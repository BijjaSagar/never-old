"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Camera,
    Upload,
    Sparkles,
    ArrowRight,
    Check,
    AlertCircle,
    Loader2,
    Download,
    Share2,
    ShoppingCart,
    RefreshCw,
    X,
    Info,
    Zap,
} from "lucide-react";
import Header from "@/components/layout/Header";

type UploadStep = "upload" | "processing" | "result";

interface TryOnResult {
    originalImage: string;
    resultImage: string;
    productName: string;
    productId: string;
    processingTime: number;
}

export default function TryOnPage() {
    const [step, setStep] = useState<UploadStep>("upload");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [result, setResult] = useState<TryOnResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch products from database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const result = await response.json();
                if (result.success) {
                    setProducts(result.data);
                }
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("Image size must be less than 10MB");
            return;
        }

        // Read file
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
            setError(null);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const fakeEvent = {
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileSelect(fakeEvent);
        }
    }, [handleFileSelect]);

    const handleTryOn = async () => {
        if (!uploadedImage || !selectedProduct) return;

        setIsProcessing(true);
        setStep("processing");
        setProgress(0);
        setError(null);

        // Simulate AI processing progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                return prev + 5;
            });
        }, 300);

        try {
            const product = products.find((p) => p.id === selectedProduct);
            const variantId = product?.variants?.[0]?.id;

            const response = await fetch('/api/ai/try-on', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: uploadedImage,
                    productId: selectedProduct,
                    variantId: variantId,
                }),
            });

            const apiResult = await response.json();

            if (!apiResult.success) {
                throw new Error(apiResult.error || 'Failed to process image');
            }

            setResult({
                originalImage: uploadedImage,
                resultImage: apiResult.data.resultImageUrl,
                productName: product?.name || "Product",
                productId: selectedProduct,
                processingTime: apiResult.data.processingTimeMs / 1000,
            });

            setProgress(100);
            setStep("result");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to process image. Please try again.");
            setStep("upload");
        } finally {
            clearInterval(progressInterval);
            setIsProcessing(false);
        }
    };

    const resetTryOn = () => {
        setStep("upload");
        setUploadedImage(null);
        setSelectedProduct(null);
        setResult(null);
        setError(null);
        setProgress(0);
    };

    return (
        <div className="min-h-screen bg-primary-50 selection:bg-lavender selection:text-primary-900">
            <Header />

            <main className="container-custom pt-40 pb-20">
                {/* Page Header: Gen-Z Bubbles */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-lavender/30 border border-lavender/50 text-primary-900 animate-pulse">
                        <Sparkles className="w-5 h-5 text-accent-600" />
                        <span className="text-sm font-black uppercase tracking-widest">Magic Trial Room</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display font-black text-primary-900 tracking-tighter uppercase leading-none">
                        VIRTUAL <span className="italic outline-text">VIBE</span> CHECK
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto font-bold">
                        Upload your photo and see how the freshest gear looks on you instantly.
                    </p>
                </div>

                {/* Upload Step */}
                {step === "upload" && (
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 animate-fade-in">
                        {/* 1. Photo Selection */}
                        <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-[4rem] p-12 shadow-xl border border-gray-100">
                            <h2 className="text-4xl font-display font-black text-primary-900 mb-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-xl font-black">
                                    1
                                </div>
                                YOUR PHOTO
                            </h2>

                            {!uploadedImage ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-8 border-dashed border-primary-50 rounded-[3rem] p-20 text-center cursor-pointer hover:border-lavender hover:bg-lavender/5 transition-all group"
                                >
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-lavender/20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                        <Camera className="w-12 h-12 text-primary-900" />
                                    </div>
                                    <h3 className="text-3xl font-display font-black text-primary-900 mb-4 uppercase tracking-tighter">
                                        Drop your selfie here
                                    </h3>
                                    <p className="text-text-muted font-bold mb-8 uppercase tracking-widest text-xs">
                                        Full or half-body works best
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 text-white rounded-2xl text-sm font-black uppercase">
                                        <Upload className="w-5 h-5" />
                                        <span>Browse Files</span>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="relative group">
                                    <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl skew-y-1">
                                        <Image
                                            src={uploadedImage}
                                            alt="Uploaded"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={resetTryOn}
                                        className="absolute top-4 right-4 w-14 h-14 rounded-3xl bg-white shadow-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-7 h-7" />
                                    </button>
                                    <div className="mt-8 flex items-center justify-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center">
                                            <Check className="w-5 h-5 text-primary-900" />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-sm italic">Looking Good!</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mt-8 p-6 rounded-[2rem] bg-red-50 border-4 border-red-100 flex items-center gap-4 text-red-600 font-bold italic">
                                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        {/* 2. Style Selection */}
                        <div className="lg:col-span-12 xl:col-span-5 space-y-8 animate-slide-up">
                            <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-gray-100">
                                <h2 className="text-4xl font-display font-black text-primary-900 mb-10 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-xl font-black">
                                        2
                                    </div>
                                    PICK GEAR
                                </h2>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    {isLoadingProducts ? (
                                        [1, 2, 3, 4].map((i) => (
                                            <div key={i} className="aspect-square rounded-[2rem] bg-gray-50 animate-pulse" />
                                        ))
                                    ) : (
                                        products.slice(0, 4).map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => setSelectedProduct(product.id)}
                                                className={`relative aspect-square rounded-[2.5rem] overflow-hidden transition-all duration-500 border-4 ${selectedProduct === product.id
                                                    ? "border-lavender scale-105 shadow-2xl rotate-2"
                                                    : "border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                                    }`}
                                            >
                                                {product.images?.[0]?.url ? (
                                                    <Image
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-primary-100 flex items-center justify-center text-5xl">🧥</div>
                                                )}
                                                {selectedProduct === product.id && (
                                                    <div className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-lavender flex items-center justify-center shadow-lg">
                                                        <Check className="w-6 h-6 text-primary-900" />
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>

                                <button
                                    onClick={handleTryOn}
                                    disabled={!uploadedImage || !selectedProduct || isProcessing}
                                    className="w-full py-7 bg-primary-900 text-white rounded-[2.5rem] font-black uppercase text-lg tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale disabled:scale-100"
                                >
                                    <Sparkles className="w-7 h-7 text-lavender" />
                                    Wipe On Style
                                    <ArrowRight className="w-7 h-7" />
                                </button>
                            </div>

                            {/* Gen-Z Pro Tips */}
                            <div className="bg-peach rounded-[4rem] p-12 shadow-xl border border-white/50 space-y-6">
                                <Zap className="w-12 h-12 text-primary-900" />
                                <h3 className="text-3xl font-display font-black text-primary-900 tracking-tighter uppercase leading-none">PRO STYLE TIPS</h3>
                                <ul className="space-y-4 font-bold text-primary-900/70">
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary-900" />
                                        Stand facing the light
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary-900" />
                                        Use a plain background
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary-900" />
                                        Keep hair back for shirts
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Processing Step: Hyper Visual */}
                {step === "processing" && (
                    <div className="max-w-4xl mx-auto text-center animate-fade-in py-20">
                        <div className="bg-white rounded-[5rem] p-20 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-lavender/20 to-sky/20" />

                            <div className="relative z-10">
                                <div className="w-40 h-40 rounded-[3rem] bg-primary-900 flex items-center justify-center mx-auto mb-10 animate-spin-slow">
                                    <Sparkles className="w-20 h-20 text-white" />
                                </div>

                                <h2 className="text-5xl md:text-7xl font-display font-black text-primary-900 mb-6 tracking-tighter uppercase">
                                    WIPING <span className="italic outline-text">STYLE</span>...
                                </h2>
                                <p className="text-xl text-primary-900/60 font-bold uppercase tracking-widest mb-12">
                                    AI is analyzing your vibe and applying the gear
                                </p>

                                {/* Bubbly Progress Bar */}
                                <div className="max-w-md mx-auto">
                                    <div className="w-full bg-primary-50 rounded-full h-8 mb-6 overflow-hidden border-4 border-white shadow-inner">
                                        <div
                                            className="h-full bg-primary-900 transition-all duration-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="text-3xl font-display font-black text-primary-900 tracking-tighter italic">{progress}% LOADED</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Step: The Glow Up */}
                {step === "result" && result && (
                    <div className="max-w-6xl mx-auto animate-fade-in group">
                        <div className="bg-white rounded-[5rem] p-12 md:p-20 shadow-2xl border-8 border-white">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                                <div className="text-center md:text-left">
                                    <span className="bg-mint text-primary-900 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">Glow Up Complete</span>
                                    <h2 className="text-5xl md:text-7xl font-display font-black text-primary-900 tracking-tighter uppercase leading-none">
                                        YOU LOOK <span className="text-accent-600 outline-text italic">FIRE</span>
                                    </h2>
                                    <p className="text-xl text-text-muted font-bold mt-2 uppercase tracking-tight">
                                        Vibe match: 100% • Processed in {result.processingTime}s
                                    </p>
                                </div>
                                <button onClick={resetTryOn} className="px-10 py-5 bg-primary-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                                    <RefreshCw className="w-6 h-6" />
                                    New Look
                                </button>
                            </div>

                            {/* Comparison: Skewed & Fun */}
                            <div className="grid md:grid-cols-2 gap-12 mb-16">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-display font-black text-primary-900 uppercase tracking-tighter italic bg-primary-100 px-6 py-2 rounded-full inline-block">Before</h3>
                                    <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden border-8 border-primary-50">
                                        <Image
                                            src={result.originalImage}
                                            alt="Original"
                                            fill
                                            className="object-cover grayscale"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-display font-black text-primary-900 uppercase tracking-tighter italic bg-lavender px-6 py-2 rounded-full inline-block">The Fit</h3>
                                    <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden border-8 border-lavender shadow-[0_30px_60px_-15px_rgba(216,180,254,0.5)] scale-105 skew-y-1">
                                        <Image
                                            src={result.resultImage}
                                            alt="Result"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-8 right-8 bg-primary-900 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-lavender" />
                                            AI Vision
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Capsule */}
                            <div className="bg-primary-50 p-10 rounded-[4rem] flex flex-wrap gap-6 items-center justify-center">
                                <Link href={`/product/${result.productId}`} className="px-12 py-7 bg-primary-900 text-white rounded-[2.5rem] font-black uppercase text-xl tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 flex-1 md:flex-none">
                                    <ShoppingCart className="w-7 h-7" />
                                    Cop This Look
                                </Link>
                                <button className="p-7 bg-white rounded-[2.5rem] text-primary-900 shadow-xl hover:bg-sky/20 transition-all">
                                    <Download className="w-7 h-7" />
                                </button>
                                <button className="p-7 bg-white rounded-[2.5rem] text-primary-900 shadow-xl hover:bg-lavender/20 transition-all">
                                    <Share2 className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
                .outline-text {
                    -webkit-text-stroke: 1px #09090b;
                    color: transparent;
                }
                .animate-spin-slow {
                    animation: spin 10s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
