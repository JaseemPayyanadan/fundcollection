# Troubleshooting Guide

## 🚨 Common Error: "Missing connection_string" / POSTGRES_URL not found

**Error Message**: 
```
Failed to create collection: VercelPostgresError - 'missing_connection_string': 
You did not supply a 'connectionString' and no 'POSTGRES_URL' env var was found.
```

**This is the #1 error!** Here's how to fix it:

---

### ✅ Solution A: For Local Development

1. **Create a `.env.local` file** in your project root:
```bash
touch .env.local
```

2. **Add your Postgres connection string**. Choose one option:

**Option 1 - Use Vercel Postgres (Recommended):**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Create a new project if you haven't
   - Go to **Storage** → **Create Database** → **Postgres**
   - Click on your database → **".env.local" tab**
   - Copy ALL the environment variables
   - Paste them into your local `.env.local` file

**Option 2 - Use Local Postgres:**
   ```
   POSTGRES_URL="postgresql://username:password@localhost:5432/fundcollection"
   ```
   Replace `username`, `password`, and database name with your local Postgres credentials.

3. **Restart your dev server**:
```bash
# Stop current server (Ctrl+C), then:
npm run dev
```

4. **Test**: Try creating a collection again!

---

### ✅ Solution B: For Vercel Deployment

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your deployed project**
3. **Go to Storage tab** (top navigation)
4. **If no database exists**:
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Name it: `fundcollection-db`
   - Select region closest to your users
   - Click **"Create"**
   - **Important**: Click **"Connect"** to link it to your project
5. **Verify connection**:
   - Go to **Settings** → **Environment Variables**
   - You should see `POSTGRES_URL` and related variables
6. **Redeploy**: 
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Click **"Redeploy"**
7. **Initialize database**: Visit `https://your-app.vercel.app/api/init-db`

---

### 1. ⚠️ Database Not Initialized

**Problem**: Tables don't exist in your database yet.

**Error**: `relation "collections" does not exist`

**Solution**:
1. Make sure `.env.local` is configured (see above)
2. Visit: `http://localhost:3000/api/init-db` (local) or `https://your-app.vercel.app/api/init-db` (production)
3. You should see: `{"message": "Database initialized successfully"}`

### 2. 🔄 Dev Server Not Restarted

**Problem**: The dev server needs to be restarted after adding `.env.local`

**Solution**:
1. Stop the dev server (press `Ctrl + C` in terminal)
2. Start it again:
```bash
npm run dev
```

### 3. 🌐 Browser Cache Issue

**Problem**: Browser is caching old version without database connection

**Solution**:
1. Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
2. Or open in incognito/private mode
3. Clear browser cache and reload

### 4. 🔍 Check Browser Console for Errors

**Important Step**: Open your browser's developer console to see detailed errors

**How to open console**:
- Chrome/Edge: `F12` or `Cmd + Option + J` (Mac) or `Ctrl + Shift + J` (Windows)
- Firefox: `F12` or `Cmd + Option + K` (Mac)
- Safari: Enable Developer menu first, then `Cmd + Option + C`

**What to look for**:
- ✗ Any red error messages about database/Postgres
- ✗ "missing_connection_string" errors
- ✗ Network errors (API calls failing)

### 5. 📝 Verify Environment Variables Are Loading

**Check that `.env.local` exists**:
```bash
cat .env.local
```

**What you should see**:
```
POSTGRES_URL=postgresql://...
```

**Solutions if missing**:
- Make sure `.env.local` is in the root directory (same level as package.json)
- Restart the dev server after creating/editing `.env.local`
- Check that the variable name is exactly `POSTGRES_URL` (case-sensitive)

## Quick Diagnosis Steps

Run through this checklist:

- [ ] **Step 1**: `.env.local` file exists in project root with `POSTGRES_URL`
- [ ] **Step 2**: Postgres database is created (Vercel or local)
- [ ] **Step 3**: Dev server restarted after creating `.env.local`
- [ ] **Step 4**: Database initialized (visited `/api/init-db`)
- [ ] **Step 5**: Browser console shows no red errors
- [ ] **Step 6**: Hard refresh browser (Cmd+Shift+R)

## Test Database Connection

Try this minimal test to verify database is working:

1. Open browser console (F12)
2. Visit: `http://localhost:3000/api/init-db`
3. You should see: `{"message": "Database initialized successfully"}`
4. Create a new collection (click "Create New Collection" button)
5. Watch the console for any error messages

## Still Not Working?

### Get More Debug Info

1. Open browser console
2. Go to Network tab
3. Try creating a collection
4. Look for requests to `/api/collections`
5. Check if they're failing (red with 500 error) or succeeding (green with 200)
6. Click on failed requests to see error details

### Common Error Messages

**"missing_connection_string" or "POSTGRES_URL not found"**
- Solution: Create `.env.local` with `POSTGRES_URL` (see Solution A above)

**"relation 'collections' does not exist"**
- Solution: Visit `/api/init-db` to create database tables

**"Connection refused" or "Connection timeout"**
- Solution: Check your database is running and connection string is correct

**"password authentication failed"**
- Solution: Verify your database credentials in `POSTGRES_URL`

## Need Help?

If none of these solutions work:
1. Share the exact error message from browser console
2. Verify `.env.local` exists and has `POSTGRES_URL`
3. Check Vercel Dashboard → Storage to see if database is connected
4. Check Vercel Dashboard → Settings → Environment Variables

## Quick Test Commands

To verify everything is set up:

```bash
# Check if .env.local exists and has POSTGRES_URL
cat .env.local | grep POSTGRES_URL

# Restart dev server
npm run dev
```

Then in browser:
1. Open http://localhost:3000
2. Visit http://localhost:3000/api/init-db
3. Open browser console (F12)
4. Try creating a collection
5. Check browser console for errors

## For Vercel Deployments

Quick checklist:
1. Go to Vercel Dashboard
2. Your Project → **Storage** tab
3. Confirm Postgres database exists and is "Connected"
4. Your Project → **Settings** → **Environment Variables**
5. Confirm `POSTGRES_URL` is listed
6. Redeploy if you just added the database
7. Visit `https://your-app.vercel.app/api/init-db` to initialize tables

