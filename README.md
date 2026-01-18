# 🌟 NeverOld - AI Powered Fashion E-commerce Platform

<div align="center">

![NeverOld](https://img.shields.io/badge/NeverOld-Premium_Fashion-E11D48?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38bdf8?style=for-the-badge&logo=tailwind-css)
![AI Powered](https://img.shields.io/badge/AI-Powered-22D3EE?style=for-the-badge)

**World-class, production-ready AI-powered fashion e-commerce platform**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 🎯 Overview

**NeverOld** is a premium, mobile-first, multi-category fashion e-commerce platform featuring an **AI Virtual Trial Room** that allows customers to visualize how clothes look on them before purchasing. Built with enterprise-grade architecture and Silicon Valley-level quality standards.

### 🌟 Core Features

#### 🤖 AI Virtual Trial Room
- **Advanced Body Analysis**: Pose detection, segmentation, and measurement estimation
- **Photorealistic Results**: High-quality garment application with preserved textures
- **Lightning Fast**: Results in 3-5 seconds
- **100% Private**: Encrypted storage, auto-deletion after 7 days
- **GDPR Compliant**: User-controlled data deletion

#### 🛍️ E-commerce Features
- Multi-category support (Kidswear, Men, Women, Accessories)
- Advanced product filtering (size, color, fabric, price)
- Smart shopping cart with session persistence
- Secure checkout with multiple payment options
- Order tracking and management
- User authentication (Email/OTP/OAuth)

#### 🎨 Premium Design
- **Mobile-first** responsive design
- **Luxury aesthetics** with modern gradients and animations
- **Smooth micro-interactions** for enhanced UX
- **Accessibility** compliant (WCAG 2.1 AA)
- **SEO optimized** for maximum visibility

#### 👨‍💼 Admin Dashboard
- Product management (CRUD operations)
- Order processing and fulfillment
- User management
- Analytics and insights
- AI try-on usage statistics

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router, Server Components)
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand + React Context
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js (JWT + OAuth)
- **Validation**: Zod
- **File Upload**: AWS S3 / Cloudflare R2

### Database
- **Primary DB**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **Caching**: Redis (Upstash)
- **Search**: PostgreSQL Full-Text Search

### AI/ML
- **Pose Estimation**: MediaPipe / OpenPose
- **Virtual Try-On**: Stable Diffusion (ControlNet) / VITON-HD
- **Image Processing**: Sharp, Canvas API
- **ML Hosting**: Replicate API / HuggingFace Inference
- **Recommendations**: Custom collaborative filtering

### Infrastructure
- **Hosting**: Vercel (Edge Network)
- **CDN**: Cloudflare / Vercel Edge
- **Storage**: AWS S3 / Cloudflare R2
- **Monitoring**: Sentry, Vercel Analytics
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (Neon recommended)
- AWS account (for S3 storage)
- AI API keys (Replicate/HuggingFace)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aura-fit.git
   cd aura-fit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and fill in your credentials:
   - Database URLs (Neon PostgreSQL)
   - NextAuth secret and OAuth credentials
   - AWS S3 credentials
   - AI API keys (Replicate/HuggingFace)
   - Payment gateway keys (Stripe/Razorpay)
   - Email/SMS service credentials

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database (optional)
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
aura-fit/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── images/                # Static images
│   └── icons/                 # App icons
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── ai/            # AI endpoints
│   │   │   ├── auth/          # Authentication
│   │   │   ├── products/      # Product APIs
│   │   │   ├── cart/          # Cart APIs
│   │   │   └── orders/        # Order APIs
│   │   ├── try-on/            # AI Try-On page
│   │   ├── shop/              # Product catalog
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # UI primitives
│   │   ├── layout/            # Layout components
│   │   ├── product/           # Product components
│   │   ├── cart/              # Cart components
│   │   └── ai/                # AI-specific components
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Auth config
│   │   ├── s3.ts              # S3 utilities
│   │   └── ai/                # AI utilities
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper functions
├── .env.example               # Environment variables template
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
├── PROJECT_ARCHITECTURE.md    # Architecture documentation
└── README.md                  # This file
```

---

## 🎨 Design System

### Color Palette

```css
Primary (Midnight Blue):   #0F172A
Accent (Rose Red):          #E11D48
Secondary (Cyan Glow):      #22D3EE
Background (Soft White):    #F8FAFC
Text (Deep Black):          #020617
```

### Typography

- **Primary Font**: Inter (Google Fonts)
- **Display Font**: Outfit (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

### Components

All components follow a consistent design language:
- Buttons (Primary, Accent, Secondary, Outline, Ghost)
- Cards (Product, Feature, Glass)
- Forms (Input, Select, Checkbox, Radio)
- Badges, Modals, Toasts, Loading States

---

## 🤖 AI Integration

### Virtual Try-On Pipeline

1. **Image Upload & Validation**
   - Format validation (JPEG, PNG, WebP)
   - Size limit (10MB max)
   - Dimension check (512x512 min)
   - EXIF data stripping

2. **Body Analysis**
   - Pose detection (33 keypoints)
   - Body segmentation
   - Measurement estimation
   - Confidence scoring

3. **Garment Application**
   - Pose-based warping
   - Texture preservation
   - Lighting/shadow matching
   - Realistic blending

4. **Result Generation**
   - High-res output (1024x1024+)
   - Quality enhancement
   - CDN upload
   - Secure URL generation

### AI Prompts

#### Virtual Try-On
```
You are a fashion AI.
Apply the selected garment realistically to the uploaded user image.
Preserve body proportions, posture, skin tone, lighting, shadows, and fabric texture.
Ensure the clothing fits naturally and looks wearable.
Generate a high-resolution, photorealistic output.
```

#### Size Recommendation
```
Analyze user body measurements, product size chart, and purchase history.
Recommend the best size with confidence score.
Consider growth patterns for children's clothing.
```

#### Outfit Recommendation
```
Based on user profile, style preferences, and browsing history,
recommend complementary items with high style compatibility.
```

---

## 🔐 Security & Privacy

### Image Security
- ✅ AES-256 encryption at rest
- ✅ Signed URLs with 24-hour expiration
- ✅ Auto-deletion after 7 days
- ✅ User-controlled deletion
- ✅ No EXIF metadata storage

### Authentication
- ✅ JWT with refresh tokens
- ✅ Password hashing (bcrypt, cost 12)
- ✅ Rate limiting (100 req/min)
- ✅ 2FA support (TOTP)
- ✅ Session management

### API Security
- ✅ CORS configuration
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CSRF tokens

### GDPR Compliance
- ✅ Right to deletion
- ✅ Data export
- ✅ Consent management
- ✅ Privacy policy
- ✅ Cookie consent

---

## 📊 Database Schema

See [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) for complete schema documentation.

Key tables:
- `users` - User accounts
- `user_profiles` - Extended user data
- `products` - Product catalog
- `product_variants` - Size/color variants
- `ai_tryon_sessions` - Try-on sessions
- `ai_tryon_results` - Try-on results
- `orders` - Customer orders
- `reviews` - Product reviews

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   ```bash
   vercel
   ```

2. **Configure environment variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Environment-Specific Configuration

- **Development**: `.env.local`
- **Staging**: `.env.staging`
- **Production**: `.env.production`

---

## 📈 Performance

### Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: > 90

### Optimizations
- ✅ Image optimization (Next/Image)
- ✅ Code splitting
- ✅ Server-side rendering
- ✅ Edge caching
- ✅ Database indexing
- ✅ Redis caching

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

---

## 📚 Documentation

- [Architecture](./PROJECT_ARCHITECTURE.md) - System architecture and design
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Component Library](./docs/COMPONENTS.md) - UI component documentation
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deployment instructions
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and edge infrastructure
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

## 📞 Support

- 📧 Email: support@neverold.com
- 💬 Discord: [Join our community](https://discord.gg/neverold)
- 🐦 Twitter: [@neverold](https://twitter.com/neverold)
- 📖 Docs: [docs.neverold.com](https://docs.neverold.com)

---

<div align="center">

**Built with ❤️ and AI by the NeverOld Team**

⭐ Star us on GitHub — it motivates us a lot!

</div>
