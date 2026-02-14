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

**File:** `.env.production`

Create React App automatically uses `.env.production` when building for production:

```bash
npm run build
```

### Step 1: Get Your Railway Backend URL

After deploying the backend to Railway, you'll have a URL like:
```
https://habit-tracker-backend-production.up.railway.app
```

### Step 2: Update `.env.production`

Replace the placeholder with your actual Railway backend URL:

```dotenv
REACT_APP_API_URL=https://habit-tracker-backend-production.up.railway.app
```

### Step 3: Build Production Bundle

```bash
npm run build
```

The production build will embed the `REACT_APP_API_URL` value into the compiled JavaScript.

### Step 4: Deploy to Vercel

When you deploy to Vercel (via GitHub push), Vercel will:
1. Run `npm install`
2. Run `npm run build` (uses `.env.production`)
3. Deploy the `/build` folder
4. The app will connect to your Railway backend URL

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

Then in browser console, verify `process.env.REACT_APP_API_URL` shows your Railway URL.

### Test API Connection

1. Login with valid credentials
2. Check Network tab in DevTools
3. Verify all API requests go to your Railway URL
4. Verify responses include habit data

## Troubleshooting

### "Cannot GET /habits" in Production

**Problem:** App is trying to fetch from wrong backend URL  
**Solution:** 
1. Check that `.env.production` has correct Railway URL
2. Run `npm run build` again
3. Verify build output in `/build/static/js/main.*.js` contains your Railway URL

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

1. **Backend Deployment** → Deploy backend to Railway
2. **Get Railway URL** → Note the final backend URL
3. **Update `.env.production`** → Replace placeholder with real URL
4. **Build & Deploy** → Push to GitHub, Vercel auto-deploys

After deployment, verify in browser DevTools that:
- API requests go to correct Railway URL
- All HABIT_LIST, CREATE, UPDATE, DELETE operations work
- Auth token is persisted and used correctly
