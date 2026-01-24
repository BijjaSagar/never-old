# Google OAuth Setup Guide for NeverOld

## Current Status
✅ Category navigation (Kids/Men/Women) implemented with dynamic theming
✅ Auth routes fixed (login/register pages working)
❌ Google OAuth needs credentials configuration

## Google OAuth Error
The error you're seeing ("invalid_client") means Google OAuth credentials are not configured in Vercel.

## How to Fix Google Login

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name**: NeverOld Production
   - **Authorized JavaScript origins**:
     ```
     https://aura-fit-sagar-bijjas-projects.vercel.app
     ```
   - **Authorized redirect URIs**:
     ```
     https://aura-fit-sagar-bijjas-projects.vercel.app/api/auth/callback/google
     ```
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 2: Add to Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/sagar-bijjas-projects/aura-fit/settings/environment-variables)
2. Add these environment variables:
   - **Name**: `GOOGLE_CLIENT_ID`
     - **Value**: (paste your Client ID)
     - **Environment**: Production, Preview, Development
   
   - **Name**: `GOOGLE_CLIENT_SECRET`
     - **Value**: (paste your Client Secret)
     - **Environment**: Production, Preview, Development

3. Click **Save**
4. Redeploy the application (Vercel will auto-deploy on next push, or manually trigger)

### Step 3: Test Google Login

1. Visit https://aura-fit-sagar-bijjas-projects.vercel.app/login
2. Click "Sign in with Google"
3. Should now work without errors!

## Features Implemented

### 1. Category Navigation
- **Kids** 🎨 - Yellow/Orange gradient theme
- **Men** 👔 - Blue/Cyan gradient theme
- **Women** 👗 - Purple/Pink gradient theme

### 2. Dynamic Theming
- Background colors change based on selected category
- Logo gradient adapts to category
- Smooth animated transitions between categories
- Category state managed globally via React Context

### 3. Header Enhancements
- Category pills with active state animation
- Emoji indicators for each category
- Admin panel link (for ADMIN users only)
- Responsive design

## Next Steps

1. **Configure Google OAuth** (follow steps above)
2. **Optional**: Add Apple Sign-In credentials (similar process)
3. **Optional**: Configure SMS/OTP providers (Twilio, MSG91)

## Testing Locally

To test Google OAuth locally:

1. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

2. In Google Cloud Console, add to redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

3. Run `npm run dev`

## Category Theme Colors

```typescript
Kids:
  Primary: #FCD34D (Yellow)
  Gradient: yellow-400 → orange-400 → pink-400

Men:
  Primary: #0EA5E9 (Sky Blue)
  Gradient: blue-500 → cyan-500 → teal-500

Women:
  Primary: #D8B4FE (Lavender)
  Gradient: purple-400 → pink-400 → rose-400
```

## Files Modified

1. `src/contexts/CategoryContext.tsx` - New category management context
2. `src/components/layout/Header.tsx` - Enhanced with category navigation
3. `src/app/layout.tsx` - Wrapped with CategoryProvider
4. `src/app/api/auth/[...nextauth]/route.ts` - Fixed auth page routes

---

**Need Help?** Check the Vercel deployment logs or test locally first!
