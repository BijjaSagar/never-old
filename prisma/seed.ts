import 'dotenv/config'
import prisma from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
    console.log('🌱 Seeding NeverOld database...')

    // 1. Create Admin User
    console.log('👤 Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 12)
    await prisma.user.upsert({
        where: { email: 'admin@neverold.com' },
        update: {},
        create: {
            email: 'admin@neverold.com',
            name: 'Admin User',
            passwordHash: adminPassword,
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    })
    console.log('✅ Admin user created (admin@neverold.com / admin123)')

    // 2. Create Site Settings
    console.log('⚙️  Creating site settings...')
    await prisma.siteSettings.upsert({
        where: { id: 'global' },
        update: {},
        create: {
            id: 'global',
            siteName: 'NeverOld',
            siteDescription: 'Premium fashion for everyone - Kids, Women, and Men',
            primaryColor: '#0F172A',
            secondaryColor: '#7C3AED',
            accentColor: '#F59E0B',
            kidsThemeColor: '#FCD34D',
            womenThemeColor: '#D8B4FE',
            menThemeColor: '#0EA5E9',
            currency: 'INR',
            taxRate: 0,
            flatShippingRate: 0,
            freeShippingThreshold: 999,
            orderPrefix: 'NO',
            returnPolicyDays: 30,
        },
    })
    console.log('✅ Site settings created')

    // 3. Create Categories
    console.log('📁 Creating categories...')
    const categories = [
        {
            name: 'Kids',
            slug: 'kids',
            description: 'Trendy and comfortable fashion for kids',
            imageUrl: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2',
            icon: '👶',
            displayOrder: 1,
            metadata: { themeColor: '#FCD34D', style: 'playful' },
        },
        {
            name: 'Women',
            slug: 'women',
            description: 'Elegant and sophisticated fashion for women',
            imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
            icon: '👗',
            displayOrder: 2,
            metadata: { themeColor: '#D8B4FE', style: 'elegant' },
        },
        {
            name: 'Men',
            slug: 'men',
            description: 'Modern and stylish fashion for men',
            imageUrl: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891',
            icon: '👔',
            displayOrder: 3,
            metadata: { themeColor: '#0EA5E9', style: 'modern' },
        },
        {
            name: 'Accessories',
            slug: 'accessories',
            description: 'Complete your look with premium accessories',
            imageUrl: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561',
            icon: '👜',
            displayOrder: 4,
            metadata: { themeColor: '#F59E0B', style: 'versatile' },
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

    console.log('✅ Categories created')

    // 4. Create Sample Products
    console.log('📦 Creating sample products...')
    const products = [
        // Kids Products
        {
            sku: 'KIDS-001',
            name: 'Colorful Graphic T-Shirt',
            slug: 'kids-colorful-graphic-tshirt',
            description: 'Vibrant and fun graphic t-shirt perfect for active kids. Made with soft, breathable cotton.',
            categoryId: catMap['kids'],
            brand: 'NeverOld Kids',
            basePrice: 599,
            costPrice: 250,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'KIDS-001-S-RED', size: 'S', color: 'Red', colorHex: '#EF4444', stockQuantity: 50 },
                { sku: 'KIDS-001-M-BLUE', size: 'M', color: 'Blue', colorHex: '#3B82F6', stockQuantity: 50 },
                { sku: 'KIDS-001-L-YELLOW', size: 'L', color: 'Yellow', colorHex: '#FCD34D', stockQuantity: 40 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2', isPrimary: true },
            ],
        },
        {
            sku: 'KIDS-002',
            name: 'Denim Dungarees',
            slug: 'kids-denim-dungarees',
            description: 'Classic denim dungarees with adjustable straps. Perfect for playtime!',
            categoryId: catMap['kids'],
            brand: 'NeverOld Kids',
            basePrice: 1299,
            costPrice: 550,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'KIDS-002-S', size: 'S', color: 'Denim Blue', colorHex: '#1E40AF', stockQuantity: 30 },
                { sku: 'KIDS-002-M', size: 'M', color: 'Denim Blue', colorHex: '#1E40AF', stockQuantity: 30 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1519457431-75514f775240', isPrimary: true },
            ],
        },

        // Women Products
        {
            sku: 'WOMEN-001',
            name: 'Elegant Floral Dress',
            slug: 'women-elegant-floral-dress',
            description: 'Beautiful floral print dress with a flattering silhouette. Perfect for any occasion.',
            categoryId: catMap['women'],
            brand: 'NeverOld Women',
            basePrice: 2499,
            costPrice: 1100,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'WOMEN-001-S-LAVENDER', size: 'S', color: 'Lavender', colorHex: '#D8B4FE', stockQuantity: 25 },
                { sku: 'WOMEN-001-M-LAVENDER', size: 'M', color: 'Lavender', colorHex: '#D8B4FE', stockQuantity: 30 },
                { sku: 'WOMEN-001-L-LAVENDER', size: 'L', color: 'Lavender', colorHex: '#D8B4FE', stockQuantity: 20 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b', isPrimary: true },
            ],
        },
        {
            sku: 'WOMEN-002',
            name: 'Casual Linen Blouse',
            slug: 'women-casual-linen-blouse',
            description: 'Lightweight linen blouse for effortless style. Breathable and comfortable.',
            categoryId: catMap['women'],
            brand: 'NeverOld Women',
            basePrice: 1799,
            costPrice: 750,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'WOMEN-002-S-WHITE', size: 'S', color: 'White', colorHex: '#FFFFFF', stockQuantity: 40 },
                { sku: 'WOMEN-002-M-BEIGE', size: 'M', color: 'Beige', colorHex: '#D4C5B9', stockQuantity: 35 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f', isPrimary: true },
            ],
        },

        // Men Products
        {
            sku: 'MEN-001',
            name: 'Classic Polo Shirt',
            slug: 'men-classic-polo-shirt',
            description: 'Timeless polo shirt in premium cotton. Perfect for casual and semi-formal occasions.',
            categoryId: catMap['men'],
            brand: 'NeverOld Men',
            basePrice: 1499,
            costPrice: 650,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'MEN-001-M-NAVY', size: 'M', color: 'Navy', colorHex: '#1E3A8A', stockQuantity: 50 },
                { sku: 'MEN-001-L-SKY', size: 'L', color: 'Sky Blue', colorHex: '#0EA5E9', stockQuantity: 45 },
                { sku: 'MEN-001-XL-BLACK', size: 'XL', color: 'Black', colorHex: '#000000', stockQuantity: 40 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891', isPrimary: true },
            ],
        },
        {
            sku: 'MEN-002',
            name: 'Slim Fit Chinos',
            slug: 'men-slim-fit-chinos',
            description: 'Modern slim-fit chinos for a sharp, contemporary look. Versatile and comfortable.',
            categoryId: catMap['men'],
            brand: 'NeverOld Men',
            basePrice: 2199,
            costPrice: 950,
            isActive: true,
            isFeatured: true,
            variants: [
                { sku: 'MEN-002-32-KHAKI', size: '32', color: 'Khaki', colorHex: '#C3B091', stockQuantity: 30 },
                { sku: 'MEN-002-34-GREY', size: '34', color: 'Grey', colorHex: '#6B7280', stockQuantity: 35 },
            ],
            images: [
                { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a', isPrimary: true },
            ],
        },
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

    console.log('✅ Sample products created')
    console.log('')
    console.log('🎉 Database seeding complete!')
    console.log('')
    console.log('📝 Admin Credentials:')
    console.log('   Email: admin@neverold.com')
    console.log('   Password: admin123')
    console.log('')
    console.log('🚀 Next steps:')
    console.log('   1. Run: npm run dev')
    console.log('   2. Visit: http://localhost:3000/admin')
    console.log('   3. Login with admin credentials')
    console.log('')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

