import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const isActive = searchParams.get('isActive');
        const search = searchParams.get('search');

        const where: any = {};

        if (categoryId) where.categoryId = categoryId;
        if (isActive !== null) where.isActive = isActive === 'true';
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: {
                    select: { name: true, slug: true },
                },
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
                variants: {
                    select: {
                        id: true,
                        size: true,
                        color: true,
                        stockQuantity: true,
                    },
                },
                _count: {
                    select: { reviews: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            slug,
            description,
            categoryId,
            brand,
            basePrice,
            salePrice,
            costPrice,
            sku,
            isActive,
            isFeatured,
            variants,
            images,
            seoTitle,
            seoDescription,
        } = body;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                categoryId,
                brand,
                basePrice,
                salePrice,
                costPrice,
                sku,
                isActive: isActive ?? true,
                isFeatured: isFeatured ?? false,
                seoTitle,
                seoDescription,
                variants: variants ? {
                    create: variants,
                } : undefined,
                images: images ? {
                    create: images,
                } : undefined,
            },
            include: {
                variants: true,
                images: true,
            },
        });

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
