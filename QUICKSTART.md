# 🚀 Quick Start Guide

## ⚡ Fix "missing_connection_string" Error in 3 Steps

If you're seeing this error:
```
Failed to create collection: VercelPostgresError - 'missing_connection_string'
```

Follow these steps:

---

## For Local Development

### Step 1: Create `.env.local` file

In your project root (where `package.json` is), create a file named `.env.local`:

```bash
touch .env.local
```

### Step 2: Add Database Connection

Open `.env.local` and add your Postgres connection string:

**Option A - Use Vercel Postgres (Recommended):**

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Create/select a project
3. Go to **Storage** tab → **Create Database** → **Postgres**
4. Name it (e.g., `fundcollection-db`) and create
5. Click on your database → **".env.local"** tab
6. Copy ALL environment variables shown
7. Paste into your local `.env.local` file

It should look like:
```
POSTGRES_URL="postgres://default:..."
POSTGRES_PRISMA_URL="postgres://default:..."
POSTGRES_URL_NON_POOLING="postgres://default:..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```

**Option B - Use Local Postgres:**

If you have PostgreSQL installed locally:
```
POSTGRES_URL="postgresql://your_username:your_password@localhost:5432/fundcollection"
```

Replace `your_username` and `your_password` with your actual credentials.

### Step 3: Restart and Initialize

```bash
# Stop your dev server (Ctrl+C if running), then:
npm run dev

# In another terminal or browser, initialize the database:
curl http://localhost:3000/api/init-db

# Or visit in browser: http://localhost:3000/api/init-db
```

You should see:
```json
{
  "message": "Database initialized successfully",
  "tables": ["collections", "contributors"]
}
```

### Step 4: Test!

Open [http://localhost:3000](http://localhost:3000) and try creating a collection. It should work now! ✅

---

## For Vercel Deployment

### Step 1: Create Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your deployed project
3. Click **Storage** tab (top navigation)
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Name it: `fundcollection-db`
7. Choose region closest to your users
8. Click **"Create"**
9. **IMPORTANT**: Click **"Connect"** to link it to your project

### Step 2: Verify Environment Variables

1. Go to **Settings** → **Environment Variables**
2. You should see `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc.
3. If not, go back to **Storage** and click **"Connect"** again

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 4: Initialize Database

Visit your app's initialization endpoint:
```
https://your-app-name.vercel.app/api/init-db
```

You should see:
```json
{
  "message": "Database initialized successfully",
  "tables": ["collections", "contributors"]
}
```

### Step 5: Test!

Visit your app and try creating a collection. It should work now! ✅

---

## Common Issues

### "POSTGRES_URL not found" still showing
- **Local**: Make sure `.env.local` is in the project root (same folder as `package.json`)
- **Local**: Restart your dev server after creating `.env.local`
- **Vercel**: Make sure you clicked **"Connect"** after creating the database
- **Vercel**: Redeploy your app after connecting the database

### "relation 'collections' does not exist"
- Visit `/api/init-db` to create the database tables
- You only need to do this once

### Dev server crashes
- Check that your `POSTGRES_URL` is correct
- If using local Postgres, make sure it's running: `brew services list` (Mac) or `sudo service postgresql status` (Linux)

---

## Need More Help?

- 📖 See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed debugging
- 🚀 See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full deployment guide
- 📧 Check browser console (F12) for detailed error messages

---

## What's Next?

Once everything is working:

1. ✅ Create your first collection
2. ✅ Add contributors
3. ✅ Track payments
4. ✅ Share public view link with contributors
5. ✅ Deploy to Vercel (if running locally)

That's it! Your fund collection app is ready to use! 🎉

