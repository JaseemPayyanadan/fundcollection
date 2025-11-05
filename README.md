# Fund Collection Web App

A modern, mobile-friendly fund collection application built with Next.js and Vercel Postgres.

## Features

- 📱 **Mobile-Friendly UI** - Responsive design that works perfectly on all devices
- 💰 **Collection Management** - Create and manage multiple fund collections
- 👥 **Contributor Tracking** - Add contributors with names and amounts
- 💳 **Payment Status** - Track payment status: Pending, Partially Paid, or Paid
- 💵 **Partial Payments** - Support for partial payment tracking
- 🌐 **Public View** - Separate public page to view fund details
- 🗄️ **Vercel Postgres** - Reliable PostgreSQL database
- 🚀 **Vercel Ready** - Optimized for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres (PostgreSQL)
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Vercel account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd funcollection
```

2. Install dependencies:
```bash
npm install
```

3. Set up Vercel Postgres (see deployment section)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

### Step 3: Add Vercel Postgres

1. In your Vercel project dashboard, go to the **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a database name (e.g., "funcollection-db")
5. Select your region
6. Click **"Create"**

### Step 4: Initialize Database

After deployment, visit:
```
https://your-app.vercel.app/api/init-db
```

You should see:
```json
{
  "message": "Database initialized successfully",
  "tables": ["collections", "contributors"]
}
```

**Important**: Visit this endpoint only once to create the database tables!

## Database Schema

### Collections Table
```sql
CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contributors Table
```sql
CREATE TABLE contributors (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES collections(id) ON DELETE CASCADE,
  contributor_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paid_amount DECIMAL(10, 2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending',
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Routes

### Collections

- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create new collection
- `GET /api/collections/[id]` - Get single collection

### Contributors

- `POST /api/collections/[id]/contributors` - Add contributor
- `PUT /api/collections/[id]/contributors` - Update contributor payment

## Usage

### Creating a Collection

1. Click "Create New Collection" on the home page
2. Enter collection name, description, and target amount
3. Click "Create Collection"

### Managing Contributors

1. Open your collection in admin mode
2. Click "Add Contributor"
3. Enter contributor name and amount
4. Payment status will default to "Pending"

### Updating Payment Status

- **Mark as Paid**: Click "Mark Paid" to mark full payment
- **Add Partial Payment**: Click "Add Payment" to add a partial amount
- **Reset**: Click "Reset" to reset payment status to pending

### Public View

Share the public view URL (`/view/{collectionId}`) with anyone to view:
- Collection progress
- Total amount and collected amount
- List of all contributors with their payment status

## Project Structure

```
funcollection/
├── app/
│   ├── api/
│   │   ├── collections/
│   │   │   ├── route.ts           # List/Create collections
│   │   │   └── [id]/
│   │   │       ├── route.ts       # Get single collection
│   │   │       └── contributors/
│   │   │           └── route.ts   # Add/Update contributors
│   │   └── init-db/
│   │       └── route.ts           # Initialize database
│   ├── admin/
│   │   ├── page.tsx               # Create new collection
│   │   └── [id]/
│   │       └── page.tsx           # Manage collection
│   ├── view/
│   │   └── [id]/
│   │       └── page.tsx           # Public view
│   ├── layout.tsx
│   ├── page.tsx                   # Home page
│   └── globals.css
├── lib/
│   ├── db.ts                      # Database types
│   └── types.ts                   # TypeScript types
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Features in Detail

### Mobile-Friendly Design
- Responsive grid layouts
- Touch-friendly buttons
- Optimized for mobile screens
- Smooth transitions and animations

### Payment Tracking
- Three states: Pending, Partially Paid, Paid
- Automatic status calculation based on paid amount
- Visual indicators with color coding
- Real-time updates

### Public View
- Read-only access for transparency
- Progress bar showing collection status
- Sorted by payment status
- No authentication required

## Local Development with Vercel

To test with Vercel Postgres locally:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Link your project:
```bash
vercel link
```

3. Pull environment variables:
```bash
vercel env pull .env.local
```

4. Run dev server:
```bash
npm run dev
```

## Environment Variables

Vercel automatically sets up the following when you add Postgres:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

No manual configuration needed!

## Troubleshooting

### Issue: "relation does not exist"
- Run the database initialization: `https://your-app.vercel.app/api/init-db`

### Issue: Can't connect to database locally
- Run `vercel env pull .env.local` to get database credentials
- Make sure you've linked your project with `vercel link`

### Issue: Changes not appearing
- Check browser console for errors
- Verify API routes are working
- Check Vercel deployment logs

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues and questions, please create an issue in the repository.
