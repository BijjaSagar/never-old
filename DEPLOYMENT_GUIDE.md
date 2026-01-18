# 🚀 NeverOld - Deployment Guide

## ✅ GitHub Repository
**Repository**: https://github.com/BijjaSagar/never-old.git  
**Status**: ✅ Code pushed successfully  
**Branch**: main

---

## 📋 Deployment Checklist

### Step 1: Create Neon Database ✅ (Next)
1. Go to https://console.neon.tech
2. Create new project: "aura-fit-production"
3. Select region: US East (or closest to your users)
4. Copy the connection strings:
   - `DATABASE_URL` (for Prisma migrations)
   - `DIRECT_URL` (for direct connections)

### Step 2: Deploy to Vercel ✅ (Next)
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from GitHub: `BijjaSagar/never-old`
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./` (or leave blank)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Configure Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

#### Required (Minimum for deployment)
```bash
# Database (from Neon)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Next.js
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NEXT_PUBLIC_APP_NAME="NeverOld"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-generated-secret-here"
```

#### Optional (Add later as needed)
```bash
# AI Services
REPLICATE_API_KEY="your-key"
HUGGINGFACE_API_KEY="your-key"

# Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."

# Storage
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="aura-fit-images"
AWS_REGION="us-east-1"

# Email
RESEND_API_KEY="re_..."

# SMS
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-token"
```

### Step 4: Run Database Migrations
After deployment, run migrations:
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

### Step 5: Verify Deployment
1. Check deployment logs in Vercel
2. Visit your deployed URL
3. Test homepage loads
4. Test AI Try-On page

---

## 🗄️ Neon Database Setup

### Create Database
1. **Login**: https://console.neon.tech
2. **Create Project**:
   - Name: `aura-fit-production`
   - Region: `US East (Ohio)` or closest
   - Postgres Version: 16 (latest)

3. **Get Connection Strings**:
   ```
   Connection String (DATABASE_URL):
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   
   Direct Connection (DIRECT_URL):
   postgresql://[user]:[password]@[host]/[database]?sslmode=require&connect_timeout=10
   ```

4. **Copy to Vercel**:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` and `DIRECT_URL`

### Initialize Database Schema
```bash
# From your local machine
# Make sure .env.local has the Neon connection strings

# Generate Prisma client
npx prisma generate

# Create initial migration
npx prisma migrate dev --name init

# Or deploy directly (for production)
npx prisma migrate deploy
```

---

## 🔧 Vercel Configuration

### Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Environment Variables (Priority Order)
1. **Production**: Used for `vercel.app` domain
2. **Preview**: Used for PR deployments
3. **Development**: Used for local development

### Custom Domain (Optional)
1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Wait for SSL certificate (automatic)

---

## 📊 Post-Deployment Tasks

### 1. Database Seeding (Optional)
```bash
# Create seed file: prisma/seed.ts
# Then run:
npx prisma db seed
```

### 2. Test All Features
- [ ] Homepage loads correctly
- [ ] AI Try-On page accessible
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] No console errors

### 3. Performance Optimization
- [ ] Enable Vercel Analytics
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Enable compression

### 4. Monitoring Setup
- [ ] Add Sentry for error tracking
- [ ] Set up Vercel Analytics
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation

---

## 🔐 Security Checklist

### Before Going Live
- [ ] All environment variables set
- [ ] NEXTAUTH_SECRET is strong (32+ chars)
- [ ] Database connection uses SSL
- [ ] API routes have rate limiting
- [ ] CORS configured properly
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel
# Common issues:
1. Missing environment variables
2. TypeScript errors
3. Missing dependencies
4. Prisma client not generated

# Fix:
- Add all required env vars
- Run `npm run build` locally first
- Ensure prisma generate runs in build
```

### Database Connection Issues
```bash
# Check:
1. DATABASE_URL format is correct
2. SSL mode is enabled (?sslmode=require)
3. Neon database is active
4. IP whitelist (Neon allows all by default)

# Test connection:
npx prisma db push
```

### Runtime Errors
```bash
# Check Vercel logs:
vercel logs [deployment-url]

# Common issues:
1. Missing env vars in production
2. API route errors
3. Database query failures
4. Image optimization issues
```

---

## 📈 Scaling Considerations

### When Traffic Grows
1. **Database**: Upgrade Neon plan for more compute
2. **Vercel**: Pro plan for better performance
3. **CDN**: Add Cloudflare for static assets
4. **Caching**: Implement Redis (Upstash)
5. **Images**: Move to dedicated CDN (Cloudinary)

---

## 🎯 Next Steps After Deployment

### Phase 1: Essential Features (Week 1-2)
1. Set up authentication (NextAuth.js)
2. Add product seeding script
3. Implement basic shopping cart
4. Test AI Try-On with real API

### Phase 2: Payment Integration (Week 3-4)
1. Add Stripe/Razorpay
2. Implement checkout flow
3. Set up order management
4. Configure email notifications

### Phase 3: AI Enhancement (Week 5-6)
1. Integrate Replicate API
2. Add pose detection
3. Implement garment application
4. Optimize AI processing

---

## 📞 Support Resources

### Documentation
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

### Community
- Vercel Discord: https://vercel.com/discord
- Next.js Discord: https://nextjs.org/discord
- GitHub Issues: https://github.com/BijjaSagar/never-old/issues

---

## ✅ Deployment Status

- [x] Code pushed to GitHub
- [ ] Neon database created
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Deployment successful
- [ ] Domain configured (optional)
- [ ] SSL certificate active

---

## 🎉 Success!

Once deployed, your NeverOld platform will be live at:
- **Production**: https://your-app.vercel.app
- **GitHub**: https://github.com/BijjaSagar/never-old

**Next**: Follow the steps above to complete deployment to Vercel and Neon DB.

---

**Last Updated**: January 17, 2026  
**Status**: Code pushed to GitHub ✅  
**Next**: Deploy to Vercel + Neon DB
