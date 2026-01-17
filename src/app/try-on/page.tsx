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
} from "lucide-react";

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

        // Simulate AI processing
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95;
                }
                return prev + 5;
            });
        }, 200);

        try {
            const product = products.find((p) => p.id === selectedProduct);
            const variantId = product?.variants?.[0]?.id;

            // Real API call
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
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
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
                            <Link href="/try-on" className="text-accent-600 font-medium">
                                AI Try-On
                            </Link>
                            <Link href="/cart" className="btn-primary btn-sm">
                                <ShoppingCart className="w-4 h-4" />
                                Cart
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">AI-Powered Virtual Try-On</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-4">
                        See How It Looks On You
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Upload your photo and try on any outfit instantly with our advanced AI technology
                    </p>
                </div>

                {/* Upload Step */}
                {step === "upload" && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                        {/* Image Upload */}
                        <div className="card p-8">
                            <h2 className="text-2xl font-display font-semibold text-primary-900 mb-6 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-accent-600 text-white flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                                Upload Your Photo
                            </h2>

                            {!uploadedImage ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-accent-600 hover:bg-accent-50/50 transition-all group"
                                >
                                    <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-10 h-10 text-accent-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary-900 mb-2">
                                        Drop your image here or click to browse
                                    </h3>
                                    <p className="text-text-muted mb-4">
                                        Supports: JPG, PNG, WebP (Max 10MB)
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-sm text-accent-600">
                                        <Camera className="w-4 h-4" />
                                        <span>Best results with full or half-body photos</span>
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
                                <div className="relative">
                                    <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-xl overflow-hidden">
                                        <Image
                                            src={uploadedImage}
                                            alt="Uploaded"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={resetTryOn}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-success">
                                        <Check className="w-5 h-5" />
                                        <span className="font-medium">Image uploaded successfully</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-4 rounded-lg bg-error-light border border-error flex items-center gap-2 text-error-dark">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        {/* Product Selection */}
                        {uploadedImage && (
                            <div className="card p-8 animate-slide-up">
                                <h2 className="text-2xl font-display font-semibold text-primary-900 mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-accent-600 text-white flex items-center justify-center text-sm font-bold">
                                        2
                                    </div>
                                    Select a Product to Try
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {isLoadingProducts ? (
                                        [1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-48 rounded-xl bg-gray-100 animate-pulse" />
                                        ))
                                    ) : (
                                        products.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => setSelectedProduct(product.id)}
                                                className={`relative h-48 rounded-xl overflow-hidden transition-all ${selectedProduct === product.id
                                                    ? "ring-4 ring-accent-600 scale-105"
                                                    : "hover:scale-105"
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
                                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-5xl">
                                                        🧥
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                                                    <div className="text-sm font-medium text-center">{product.name}</div>
                                                </div>
                                                {selectedProduct === product.id && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-accent-600" />
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>

                                <button
                                    onClick={handleTryOn}
                                    disabled={!selectedProduct || isProcessing}
                                    className="btn-accent w-full btn-lg"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Generate AI Try-On
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Info Cards */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: Camera,
                                    title: "High Quality",
                                    description: "AI generates photorealistic results",
                                },
                                {
                                    icon: Sparkles,
                                    title: "Fast Processing",
                                    description: "Results ready in 3-5 seconds",
                                },
                                {
                                    icon: Info,
                                    title: "100% Private",
                                    description: "Images auto-deleted after 7 days",
                                },
                            ].map((info, index) => (
                                <div key={index} className="card p-6 text-center">
                                    <info.icon className="w-8 h-8 text-accent-600 mx-auto mb-3" />
                                    <h3 className="font-semibold text-primary-900 mb-1">{info.title}</h3>
                                    <p className="text-sm text-text-muted">{info.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Processing Step */}
                {step === "processing" && (
                    <div className="max-w-2xl mx-auto text-center animate-fade-in">
                        <div className="card p-12">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-600 to-secondary-400 flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-display font-bold text-primary-900 mb-4">
                                AI is Working Its Magic...
                            </h2>
                            <p className="text-text-muted mb-8">
                                Our AI is analyzing your photo and applying the garment
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-600 to-secondary-400 transition-all duration-300 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-sm text-text-muted">{progress}% Complete</div>

                            {/* Processing Steps */}
                            <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
                                {[
                                    { label: "Analyzing body pose", done: progress > 25 },
                                    { label: "Detecting body segments", done: progress > 50 },
                                    { label: "Applying garment", done: progress > 75 },
                                    { label: "Enhancing quality", done: progress > 90 },
                                ].map((step, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        {step.done ? (
                                            <Check className="w-5 h-5 text-success flex-shrink-0" />
                                        ) : (
                                            <Loader2 className="w-5 h-5 text-accent-600 animate-spin flex-shrink-0" />
                                        )}
                                        <span className={step.done ? "text-success" : "text-text-muted"}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Step */}
                {step === "result" && result && (
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        <div className="card p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-primary-900 mb-2">
                                        Your AI Try-On Result
                                    </h2>
                                    <p className="text-text-muted">
                                        Processed in {result.processingTime}s • {result.productName}
                                    </p>
                                </div>
                                <button onClick={resetTryOn} className="btn-outline">
                                    <RefreshCw className="w-4 h-4" />
                                    Try Another
                                </button>
                            </div>

                            {/* Before/After Comparison */}
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-primary-900 mb-4">Original</h3>
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                                        <Image
                                            src={result.originalImage}
                                            alt="Original"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
                                        AI Try-On Result
                                        <span className="badge-success">New</span>
                                    </h3>
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden ring-4 ring-accent-600">
                                        <Image
                                            src={result.resultImage}
                                            alt="Result"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-4 right-4 badge-accent">
                                            <Sparkles className="w-3 h-3" />
                                            AI Generated
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4">
                                <Link href={`/product/${result.productId}`} className="btn-accent flex-1 sm:flex-none">
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </Link>
                                <button className="btn-outline flex-1 sm:flex-none">
                                    <Download className="w-5 h-5" />
                                    Download
                                </button>
                                <button className="btn-ghost flex-1 sm:flex-none">
                                    <Share2 className="w-5 h-5" />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
