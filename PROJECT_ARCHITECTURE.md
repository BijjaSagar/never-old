# AURA FIT - AI Powered Fashion E-commerce Platform
## Enterprise-Grade Architecture Document

---

## 🎯 PROJECT OVERVIEW

**AURA FIT** is a premium, AI-powered fashion e-commerce platform specializing in kidswear with multi-category support (Men, Women, Accessories). The platform features an innovative AI Virtual Trial Room that allows customers to visualize garments on their own images before purchase.

**Target Quality**: Silicon Valley / Global Brand Level (Zara, Nike, Amazon Fashion)

---

## 🏗️ SYSTEM ARCHITECTURE

### Technology Stack

#### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Zustand
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Image Handling**: Next/Image, Sharp
- **PWA**: next-pwa

#### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **Authentication**: NextAuth.js (JWT + OAuth)
- **Validation**: Zod
- **File Upload**: Uploadthing / AWS S3
- **Email**: Resend / SendGrid
- **SMS/OTP**: Twilio

#### Database
- **Primary DB**: Neon PostgreSQL (Serverless)
- **ORM**: Prisma
- **Caching**: Redis (Upstash)
- **Search**: PostgreSQL Full-Text Search + Algolia (optional)

#### AI/ML Stack
- **Pose Estimation**: MediaPipe / OpenPose
- **Virtual Try-On**: 
  - Stable Diffusion (ControlNet)
  - VITON-HD (Virtual Try-On Network)
  - Custom fine-tuned models
- **Image Processing**: Sharp, Canvas API
- **ML Hosting**: Replicate API / HuggingFace Inference API
- **Recommendation Engine**: TensorFlow.js / Custom collaborative filtering

#### Infrastructure
- **Hosting**: Vercel (Frontend + API)
- **CDN**: Vercel Edge Network / Cloudflare
- **Storage**: AWS S3 / Cloudflare R2
- **Monitoring**: Sentry, Vercel Analytics
- **CI/CD**: GitHub Actions

---

## 📊 DATABASE SCHEMA

### Core Tables

#### 1. Users
```sql
users
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- phone (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- avatar_url (VARCHAR)
- role (ENUM: customer, admin, vendor)
- email_verified (BOOLEAN)
- phone_verified (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_login (TIMESTAMP)
```

#### 2. User Profiles
```sql
user_profiles
- id (UUID, PK)
- user_id (UUID, FK -> users.id)
- gender (ENUM: male, female, other)
- date_of_birth (DATE)
- body_measurements (JSONB)
  {
    height: number,
    weight: number,
    chest: number,
    waist: number,
    hips: number
  }
- preferences (JSONB)
  {
    favorite_brands: string[],
    preferred_colors: string[],
    size_preferences: object
  }
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. Categories
```sql
categories
- id (UUID, PK)
- name (VARCHAR)
- slug (VARCHAR, UNIQUE)
- parent_id (UUID, FK -> categories.id, NULLABLE)
- description (TEXT)
- image_url (VARCHAR)
- icon (VARCHAR)
- display_order (INTEGER)
- is_active (BOOLEAN)
- metadata (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. Products
```sql
products
- id (UUID, PK)
- sku (VARCHAR, UNIQUE)
- name (VARCHAR)
- slug (VARCHAR, UNIQUE)
- description (TEXT)
- category_id (UUID, FK -> categories.id)
- brand (VARCHAR)
- base_price (DECIMAL)
- sale_price (DECIMAL, NULLABLE)
- cost_price (DECIMAL)
- currency (VARCHAR, DEFAULT 'INR')
- is_active (BOOLEAN)
- is_featured (BOOLEAN)
- stock_status (ENUM: in_stock, out_of_stock, pre_order)
- metadata (JSONB)
  {
    fabric: string,
    care_instructions: string[],
    country_of_origin: string,
    age_group: string
  }
- seo_title (VARCHAR)
- seo_description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 5. Product Variants
```sql
product_variants
- id (UUID, PK)
- product_id (UUID, FK -> products.id)
- sku (VARCHAR, UNIQUE)
- size (VARCHAR)
- color (VARCHAR)
- color_hex (VARCHAR)
- stock_quantity (INTEGER)
- price_adjustment (DECIMAL, DEFAULT 0)
- weight (DECIMAL)
- dimensions (JSONB)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 6. Product Images
```sql
product_images
- id (UUID, PK)
- product_id (UUID, FK -> products.id)
- variant_id (UUID, FK -> product_variants.id, NULLABLE)
- url (VARCHAR)
- alt_text (VARCHAR)
- display_order (INTEGER)
- is_primary (BOOLEAN)
- image_type (ENUM: product, lifestyle, detail, model)
- created_at (TIMESTAMP)
```

#### 7. AI Try-On Sessions
```sql
ai_tryon_sessions
- id (UUID, PK)
- user_id (UUID, FK -> users.id, NULLABLE)
- session_token (VARCHAR, UNIQUE)
- uploaded_image_url (VARCHAR)
- uploaded_image_hash (VARCHAR)
- body_analysis (JSONB)
  {
    pose_keypoints: object,
    body_measurements: object,
    segmentation_mask: string,
    confidence_score: number
  }
- status (ENUM: pending, processing, completed, failed)
- created_at (TIMESTAMP)
- expires_at (TIMESTAMP)
- deleted_at (TIMESTAMP, NULLABLE)
```

#### 8. AI Try-On Results
```sql
ai_tryon_results
- id (UUID, PK)
- session_id (UUID, FK -> ai_tryon_sessions.id)
- product_id (UUID, FK -> products.id)
- variant_id (UUID, FK -> product_variants.id)
- result_image_url (VARCHAR)
- processing_time_ms (INTEGER)
- quality_score (DECIMAL)
- metadata (JSONB)
  {
    model_version: string,
    parameters: object,
    warnings: string[]
  }
- created_at (TIMESTAMP)
```

#### 9. Shopping Cart
```sql
shopping_carts
- id (UUID, PK)
- user_id (UUID, FK -> users.id, NULLABLE)
- session_id (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 10. Cart Items
```sql
cart_items
- id (UUID, PK)
- cart_id (UUID, FK -> shopping_carts.id)
- product_id (UUID, FK -> products.id)
- variant_id (UUID, FK -> product_variants.id)
- quantity (INTEGER)
- price_at_addition (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 11. Orders
```sql
orders
- id (UUID, PK)
- order_number (VARCHAR, UNIQUE)
- user_id (UUID, FK -> users.id)
- status (ENUM: pending, confirmed, processing, shipped, delivered, cancelled, refunded)
- payment_status (ENUM: pending, paid, failed, refunded)
- subtotal (DECIMAL)
- tax_amount (DECIMAL)
- shipping_amount (DECIMAL)
- discount_amount (DECIMAL)
- total_amount (DECIMAL)
- currency (VARCHAR)
- shipping_address (JSONB)
- billing_address (JSONB)
- customer_notes (TEXT)
- admin_notes (TEXT)
- tracking_number (VARCHAR)
- shipped_at (TIMESTAMP)
- delivered_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 12. Order Items
```sql
order_items
- id (UUID, PK)
- order_id (UUID, FK -> orders.id)
- product_id (UUID, FK -> products.id)
- variant_id (UUID, FK -> product_variants.id)
- quantity (INTEGER)
- unit_price (DECIMAL)
- total_price (DECIMAL)
- product_snapshot (JSONB)
- created_at (TIMESTAMP)
```

#### 13. Addresses
```sql
addresses
- id (UUID, PK)
- user_id (UUID, FK -> users.id)
- type (ENUM: shipping, billing, both)
- full_name (VARCHAR)
- phone (VARCHAR)
- address_line1 (VARCHAR)
- address_line2 (VARCHAR)
- city (VARCHAR)
- state (VARCHAR)
- postal_code (VARCHAR)
- country (VARCHAR)
- is_default (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 14. Reviews
```sql
reviews
- id (UUID, PK)
- product_id (UUID, FK -> products.id)
- user_id (UUID, FK -> users.id)
- order_item_id (UUID, FK -> order_items.id)
- rating (INTEGER, 1-5)
- title (VARCHAR)
- comment (TEXT)
- images (JSONB)
- is_verified_purchase (BOOLEAN)
- helpful_count (INTEGER)
- is_approved (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🔐 SECURITY & PRIVACY

### Image Handling Security
1. **Encryption at Rest**: All uploaded images encrypted using AES-256
2. **Secure URLs**: Signed URLs with expiration (24 hours)
3. **Auto-Purge**: Images deleted after 7 days
4. **User Control**: Users can delete their images anytime
5. **No Metadata Storage**: EXIF data stripped on upload
6. **GDPR Compliance**: Right to deletion, data export

### Authentication
- JWT tokens with refresh mechanism
- Rate limiting on auth endpoints
- Password hashing with bcrypt (cost factor 12)
- 2FA support (TOTP)
- Session management with Redis

### API Security
- CORS configuration
- Rate limiting (100 req/min per IP)
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF tokens

---

## 🎨 DESIGN SYSTEM

### Color Palette
```css
--primary: #0F172A (Midnight Blue)
--accent: #E11D48 (Rose Red)
--secondary: #22D3EE (Cyan Glow)
--background: #F8FAFC (Soft White)
--text: #020617 (Deep Black)
--text-muted: #64748B
--border: #E2E8F0
--success: #10B981
--warning: #F59E0B
--error: #EF4444
```

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Accent Font**: Outfit (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

### Component Library
- Buttons (Primary, Secondary, Ghost, Outline)
- Cards (Product, Category, Feature)
- Forms (Input, Select, Checkbox, Radio)
- Modals & Dialogs
- Toast Notifications
- Loading States
- Skeleton Screens

---

## 🤖 AI INTEGRATION

### Virtual Try-On Pipeline

#### Phase 1: Image Upload & Validation
```typescript
1. User uploads image
2. Validate format (JPEG, PNG, WebP)
3. Validate size (max 10MB)
4. Validate dimensions (min 512x512)
5. Strip EXIF data
6. Generate secure hash
7. Upload to S3 with encryption
```

#### Phase 2: Body Analysis
```typescript
1. Pose detection (MediaPipe)
   - Detect 33 body landmarks
   - Validate pose quality (>0.7 confidence)
   - Extract body proportions

2. Segmentation
   - Separate person from background
   - Identify clothing regions
   - Generate segmentation mask

3. Measurement Estimation
   - Estimate height, shoulder width
   - Calculate body ratios
   - Store in session metadata
```

#### Phase 3: Garment Application
```typescript
1. Load product image
2. Extract garment from background
3. Apply pose-based warping
4. Match lighting and shadows
5. Blend with body image
6. Preserve skin tones
7. Add realistic folds and wrinkles
```

#### Phase 4: Result Generation
```typescript
1. Generate high-res output (1024x1024+)
2. Apply quality enhancement
3. Create comparison view
4. Upload to CDN
5. Return secure URL
6. Log analytics
```

### AI Prompts

#### Virtual Try-On Prompt
```
You are a professional fashion AI assistant.

Task: Apply the selected garment realistically to the uploaded user image.

Requirements:
- Preserve exact body proportions and posture
- Match skin tone and lighting conditions
- Maintain fabric texture and patterns
- Add natural shadows and highlights
- Ensure clothing fits anatomically correct
- Keep background unchanged
- Generate photorealistic output at 1024x1024 resolution

Output: High-quality image showing the user wearing the garment naturally.
```

#### Size Recommendation Prompt
```
Analyze the following data:
- User body measurements: {measurements}
- Product size chart: {size_chart}
- Previous purchase history: {history}
- Return reasons: {returns}

Recommend the best size with confidence score.
Consider growth patterns for children's clothing.
Provide alternative sizes if confidence < 0.8.
```

#### Outfit Recommendation Prompt
```
User Profile:
- Age: {age}
- Gender: {gender}
- Style preferences: {preferences}
- Browsing history: {history}
- Current cart: {cart}

Recommend 5 complementary items that:
1. Match the user's style
2. Are currently in stock
3. Fit within typical budget range
4. Follow current fashion trends
5. Have high ratings (>4.0)

Return as JSON with product IDs and reasoning.
```

---

## 📱 MOBILE-FIRST DESIGN

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: > 90

---

## 🚀 DEPLOYMENT STRATEGY

### Environment Variables
```env
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=

# AI Services
REPLICATE_API_KEY=
HUGGINGFACE_API_KEY=

# Payment
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email/SMS
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Redis
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
```

### CI/CD Pipeline
1. Code push to GitHub
2. Run ESLint & TypeScript checks
3. Run unit tests
4. Build Next.js app
5. Run E2E tests (Playwright)
6. Deploy to Vercel preview
7. Manual approval for production
8. Deploy to production
9. Run smoke tests
10. Notify team

---

## 📈 ANALYTICS & MONITORING

### Key Metrics
- Conversion rate
- Average order value
- Cart abandonment rate
- AI try-on usage rate
- AI try-on to purchase conversion
- Page load times
- API response times
- Error rates
- User retention

### Tools
- Google Analytics 4
- Vercel Analytics
- Sentry (Error tracking)
- LogRocket (Session replay)
- Hotjar (Heatmaps)

---

## 🎯 PHASE 1 DELIVERABLES (MVP)

### Week 1-2: Foundation
- ✅ Project setup
- ✅ Database schema
- ✅ Authentication system
- ✅ Basic UI components

### Week 3-4: Core E-commerce
- Product catalog
- Shopping cart
- Checkout flow
- Order management

### Week 5-6: AI Integration
- Image upload system
- Basic try-on pipeline
- Result display

### Week 7-8: Polish & Launch
- Admin dashboard
- Testing & QA
- Performance optimization
- Production deployment

---

## 📚 API ENDPOINTS

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/verify-otp
- POST /api/auth/refresh-token

### Products
- GET /api/products
- GET /api/products/[id]
- GET /api/products/category/[slug]
- GET /api/products/search

### Cart
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove

### Orders
- POST /api/orders/create
- GET /api/orders
- GET /api/orders/[id]
- PUT /api/orders/[id]/cancel

### AI Try-On
- POST /api/ai/upload-image
- POST /api/ai/try-on
- GET /api/ai/results/[sessionId]
- DELETE /api/ai/delete-image

### Admin
- GET /api/admin/dashboard
- POST /api/admin/products
- PUT /api/admin/products/[id]
- GET /api/admin/orders
- PUT /api/admin/orders/[id]/status

---

This architecture provides a solid foundation for building a world-class e-commerce platform. The system is designed to be scalable, secure, and maintainable while delivering exceptional user experience.
