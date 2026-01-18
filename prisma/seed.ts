import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function main() {
    console.log('🌱 Seeding database with Gen-Z Cool Kids Fashion...')

    // 1. Create Categories
    const categories = [
        {
            name: 'New Drops',
            slug: 'new-drops',
            description: 'Latest street-style for modern kids',
            imageUrl: 'https://images.unsplash.com/photo-1519457431-75514f775240',
            displayOrder: 1,
        },
        {
            name: 'Girls Rock',
            slug: 'girls',
            description: 'Trend-setting outfits for girls',
            imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f',
            displayOrder: 2,
        },
        {
            name: 'Boys Street',
            slug: 'boys',
            description: 'Cool and comfortable gear for boys',
            imageUrl: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2',
            displayOrder: 3,
        },
        {
            name: 'Basics+',
            slug: 'basics',
            description: 'Essential gear for everyday cool',
            imageUrl: 'https://images.unsplash.com/photo-1519233939211-1936acc7a641',
            displayOrder: 4,
        },
    ]

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        })
    }

    const catMap = await prisma.category.findMany().then(cats =>
        Object.fromEntries(cats.map(c => [c.slug, c.id]))
    )

    console.log('✅ Categories updated')

    // 2. Create Products
    const products = [
        {
            sku: 'GENZ-001',
            name: 'Oversized Pastel Hoodie',
            slug: 'oversized-pastel-hoodie',
            description: 'Ultra-soft lilac hoodie with a relaxed fit. The ultimate Gen-Z staple for cool kids.',
            categoryId: catMap['new-drops'],
            brand: 'AURA STREET',
            basePrice: 1999,
            costPrice: 800,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'GENZ-001-S', size: 'S', color: 'Lilac', stockQuantity: 50 },
                { sku: 'GENZ-001-M', size: 'M', color: 'Lilac', stockQuantity: 50 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7', isPrimary: true },
            ],
        },
        {
            sku: 'GENZ-002',
            name: 'Tie-Dye Urban Joggers',
            slug: 'tie-dye-joggers',
            description: 'Unique hand-dyed joggers for a standout look. Breathable cotton for all-day play.',
            categoryId: catMap['girls'],
            brand: 'AURA ROCK',
            basePrice: 1499,
            costPrice: 600,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'GENZ-002-S', size: 'S', color: 'Multi', stockQuantity: 30 },
                { sku: 'GENZ-002-M', size: 'M', color: 'Multi', stockQuantity: 30 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1519457431-75514f775240', isPrimary: true },
            ],
        },
        {
            sku: 'GENZ-003',
            name: 'Cyber Mint Windbreaker',
            slug: 'cyber-mint-windbreaker',
            description: 'Lightweight tech-wear windbreaker in neon mint. Rainproof and street-ready.',
            categoryId: catMap['boys'],
            brand: 'AURA TECH',
            basePrice: 2499,
            costPrice: 1100,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'GENZ-003-L', size: 'L', color: 'Mint', stockQuantity: 40 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2', isPrimary: true },
            ],
        },
        {
            sku: 'GENZ-004',
            name: 'Retro Smile Denim Vest',
            slug: 'retro-smile-vest',
            description: 'Classic denim vest with embroidered smileys. Vintage vibes for the new generation.',
            categoryId: catMap['new-drops'],
            brand: 'AURA VINTAGE',
            basePrice: 1799,
            costPrice: 750,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'GENZ-004-M', size: 'M', color: 'Denim', stockQuantity: 25 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f', isPrimary: true },
            ],
        }
    ]

    for (const p of products) {
        const { variants, images, ...productData } = p

        await prisma.product.upsert({
            where: { sku: p.sku },
            update: productData,
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

    console.log('✅ Products updated')
    console.log('✨ Gen-Z Seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
