# Environment Configuration Guide

## Overview

The Habit Tracker frontend uses environment variables to configure the backend API URL. This allows the same codebase to connect to different backends for development, staging, and production environments.

## Local Development Setup

**File:** `.env` (already configured)

```dotenv
REACT_APP_API_URL=http://127.0.0.1:8000
```

To start the dev server with local backend:
```bash
npm start
```

The app will run at `http://localhost:3000` and connect to `http://127.0.0.1:8000` (local backend).

## Production Deployment Setup

**⚠️ IMPORTANT:** Do NOT commit `.env.production` to git. Configure environment variables in Vercel's dashboard instead.

### Step 1: Deploy Backend to Railway

After deploying the backend to Railway, you'll have a URL like:
```
https://habit-tracker-backend-production.up.railway.app
```

### Step 2: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://habit-tracker-backend-production.up.railway.app`
   - **Environments:** Select **Production** (and optionally Preview, Development)
4. Click **Save**

### Step 3: Redeploy

Vercel will automatically redeploy your app with the new environment variable. If not, trigger a manual redeploy:
```bash
git commit --allow-empty -m "trigger redeploy with env vars"
git push origin main
```

### Alternative: Local Production Build Testing

If you want to test a production build locally BEFORE deploying to Vercel:

1. Create `.env.production` **locally only** (this file is in `.gitignore`)
2. Add:
   ```dotenv
   REACT_APP_API_URL=https://habit-tracker-backend-production.up.railway.app
   ```
3. Build:
   ```bash
   npm run build
   ```
4. Test:
   ```bash
   npx serve -s build
   ```

**Never commit `.env.production` to git.**

## Environment Variables

### `REACT_APP_API_URL` (Required)

- **Default:** `http://127.0.0.1:8000` (fallback in code)
- **Development:** `http://127.0.0.1:8000` (set in `.env`)
- **Production:** `https://your-railway-url.up.railway.app` (set in `.env.production`)

**Important:** React environment variables must start with `REACT_APP_` to be bundled into the app.

## How It Works

In `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
```

1. If `REACT_APP_API_URL` is set (via `.env` or `.env.production`), use it
2. Otherwise, fall back to `http://127.0.0.1:8000` (local development server)

## Testing Your Configuration

### Local Development Test

```bash
npm start
```

Open DevTools and check:
```javascript
// In browser console
console.log(process.env.REACT_APP_API_URL);
// Should show: http://127.0.0.1:8000
```

### Production Build Test

```bash
npm run build
serve -s build  # or use any static server
```

Then in browser console:
```javascript
// Check ALL XHR/fetch requests in Network tab
// They should point to your Railway backend URL
```

**Note:** In production, `process.env.REACT_APP_API_URL` is embedded during build time and won't be visible in console. Check the Network tab instead.

### Test API Connection

1. Login with valid credentials
2. Check Network tab in DevTools
3. Verify all API requests go to your Railway URL
4. Verify responses include habit data

## Troubleshooting

### "Cannot GET /habits" in Production

**Problem:** App is trying to fetch from wrong backend URL  
**Solution:** 
1. Verify environment variable in Vercel dashboard: Settings → Environment Variables
2. Check that `REACT_APP_API_URL` is set to your Railway URL
3. Trigger a redeploy in Vercel to pick up the change
4. Use Network tab in DevTools to confirm requests go to Railway URL

### CORS Errors (Backend Needed Fix)

**Problem:** Browser blocks requests to backend  
**Solution:** Backend must include your Vercel URL in CORS allowed origins
```python
# Backend - app/main.py
CORS_ORIGINS = ["https://your-vercel-domain.vercel.app"]
```

### 401 Unauthorized After Deployment

**Problem:** JWT tokens not working with production backend  
**Solution:**
1. Verify `JWT_SECRET` is set on Railway backend
2. Ensure same `JWT_SECRET` on both local and production
3. Try logging out, clearing localStorage, and logging back in

## Environment Variable Reference

| Env Var | Dev | Prod | Notes |
|---------|-----|------|-------|
| `REACT_APP_API_URL` | `http://127.0.0.1:8000` | `https://railway-url.*.app` | Backend API base URL |

## Next Steps

1. **Backend Deployment** → Deploy backend to Railway and note the URL
2. **Configure Vercel** → Add `REACT_APP_API_URL` in Vercel dashboard Settings → Environment Variables
3. **Redeploy** → Push to GitHub (or manual redeploy) to apply new env var
4. **Verify** → Check Network tab that API calls go to Railway URL

After deployment, verify in browser DevTools that:
- API requests go to correct Railway URL (not localhost)
- All HABIT_LIST, CREATE, UPDATE, DELETE operations work
- Auth token is persisted and used correctly

## Security Best Practices

✅ **DO:**
- Keep `.env` committed (contains example/default values only)
- Configure sensitive values in hosting provider dashboard (Vercel, Railway)
- Use `.env.local` for local testing overrides (automatically ignored)

❌ **DON'T:**
- Commit `.env.production` to git (use Vercel env vars instead)
- Store API keys or secrets in committed `.env` files
- Share environment files containing real credentials
