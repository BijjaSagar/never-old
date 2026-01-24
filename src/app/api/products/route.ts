import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1
                },
                variants: {
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            products: products
        })
    } catch (error) {
        console.error('❌ Error fetching products:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}
