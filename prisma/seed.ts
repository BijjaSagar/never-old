import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function main() {
    console.log('🌱 Seeding database...')

    // 1. Create Categories
    const menCategory = await prisma.category.upsert({
        where: { slug: 'men' },
        update: {},
        create: {
            name: 'Men',
            slug: 'men',
            description: 'Premium collection for men',
            imageUrl: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59',
            displayOrder: 1,
        },
    })

    const womenCategory = await prisma.category.upsert({
        where: { slug: 'women' },
        update: {},
        create: {
            name: 'Women',
            slug: 'women',
            description: 'Stunning collection for women',
            imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
            displayOrder: 2,
        },
    })

    const kidswearCategory = await prisma.category.upsert({
        where: { slug: 'kids' },
        update: {},
        create: {
            name: 'Kidswear',
            slug: 'kids',
            description: 'Comfortable clothes for kids',
            imageUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc',
            displayOrder: 3,
        },
    })

    const accessoriesCategory = await prisma.category.upsert({
        where: { slug: 'accessories' },
        update: {},
        create: {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Complete your look',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            displayOrder: 4,
        },
    })

    console.log('✅ Categories created')

    // 2. Create Products
    const products = [
        {
            sku: 'AURA-M-001',
            name: 'Blue Denim Jacket',
            slug: 'blue-denim-jacket',
            description: 'Classic blue denim jacket for a timeless look. Made with high-quality organic cotton denim.',
            categoryId: menCategory.id,
            brand: 'AURA Exclusive',
            basePrice: 2499,
            costPrice: 1200,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'AURA-M-001-S', size: 'S', color: 'Blue', stockQuantity: 50 },
                { sku: 'AURA-M-001-M', size: 'M', color: 'Blue', stockQuantity: 75 },
                { sku: 'AURA-M-001-L', size: 'L', color: 'Blue', stockQuantity: 40 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1576872405916-0158462c0fc4', isPrimary: true },
            ],
        },
        {
            sku: 'AURA-W-002',
            name: 'Red Summer Dress',
            slug: 'red-summer-dress',
            description: 'Flowy red summer dress perfect for beach outings and sunny days.',
            categoryId: womenCategory.id,
            brand: 'AURA Women',
            basePrice: 1899,
            costPrice: 900,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'AURA-W-002-S', size: 'S', color: 'Red', stockQuantity: 30 },
                { sku: 'AURA-W-002-M', size: 'M', color: 'Red', stockQuantity: 50 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446', isPrimary: true },
            ],
        },
        {
            sku: 'AURA-U-003',
            name: 'Black Essential T-Shirt',
            slug: 'black-t-shirt',
            description: 'Premium heavy-weight cotton t-shirt in classic black.',
            categoryId: menCategory.id, // Can be both, let's put in men for now
            brand: 'AURA Basics',
            basePrice: 899,
            costPrice: 400,
            isActive: true,
            isFeatured: false,
            variants: [
                { sku: 'AURA-U-003-M', size: 'M', color: 'Black', stockQuantity: 100 },
                { sku: 'AURA-U-003-L', size: 'L', color: 'Black', stockQuantity: 80 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', isPrimary: true },
            ],
        },
        {
            sku: 'AURA-U-004',
            name: 'Green Fleece Hoodie',
            slug: 'green-hoodie',
            description: 'Warm and cozy green fleece hoodie for casual winter wear.',
            categoryId: kidswearCategory.id,
            brand: 'AURA Kids',
            basePrice: 1299,
            costPrice: 600,
            isActive: true,
            isFeatured: false,
            variants: [
                { sku: 'AURA-U-004-S', size: 'S', color: 'Green', stockQuantity: 45 },
                { sku: 'AURA-U-004-M', size: 'M', color: 'Green', stockQuantity: 60 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', isPrimary: true },
            ],
        },
    ]

    for (const p of products) {
        const { variants, images, ...productData } = p

        await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: {
                ...productData,
                variants: {
                    create: variants
                },
                images: {
                    create: images
                }
            },
        })
    }

    console.log('✅ Products created')
    console.log('✨ Seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
