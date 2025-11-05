# Setup Instructions for Fund Collection App

## ✅ Firebase Configuration - DONE!
Your Firebase credentials have been configured in `.env.local`

## 🔥 Firestore Database Setup

### Step 1: Create Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **photogallery-46d8e**
3. Click on **"Firestore Database"** in the left sidebar
4. Click **"Create database"** (if not already created)
5. Choose **"Start in test mode"** for development
6. Select your preferred location
7. Click **"Enable"**

### Step 2: Set Firestore Rules
1. In Firestore Database, go to the **"Rules"** tab
2. Copy and paste the rules from `firestore.rules` file
3. Click **"Publish"**

**Note:** The provided rules allow public read/write access for development. For production, implement proper security rules.

## 🚀 Running the App Locally

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and go to:
```
http://localhost:3000
```

## 📤 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect Next.js settings
5. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add each variable from `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDUrKrriXUzLR9iTUe5Aq_GzUeePv_cCo0
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=photogallery-46d8e.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=photogallery-46d8e
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=photogallery-46d8e.firebasestorage.app
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1044895007536
     NEXT_PUBLIC_FIREBASE_APP_ID=1:1044895007536:web:27b31c66f104f9b80d7ef5
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LGF43ZGD2M
     ```
6. Click **"Deploy"**

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables when asked

## 🎯 Testing the App

### Test Flow:
1. **Home Page**: View all collections
2. **Create Collection**: Click "Create New Collection"
   - Add name, description, target amount
3. **Manage Collection**: 
   - Add contributors with names and amounts
   - Update payment status
   - Add partial payments
4. **Public View**: Share the public link to show fund details

## 📱 Features to Test:

- ✅ Create new collection
- ✅ Add contributors
- ✅ Mark payment as Paid
- ✅ Add partial payments
- ✅ View public page
- ✅ Mobile responsiveness (try on phone)
- ✅ Real-time updates (open same collection in 2 tabs)

## 🔒 Security Note:

The current setup uses open Firestore rules for easy development. For production:

1. Consider adding authentication
2. Implement proper Firestore security rules
3. Add admin authentication for managing collections
4. Protect the admin routes

## 🆘 Troubleshooting

### Issue: Firebase connection error
- Check that Firestore database is created and enabled
- Verify all environment variables are set correctly
- Check browser console for specific error messages

### Issue: "Collection not found"
- Make sure you've created at least one collection
- Check Firestore console to verify data is being saved

### Issue: Vercel deployment fails
- Verify all environment variables are added in Vercel dashboard
- Check build logs for specific errors
- Ensure `package.json` has correct build command

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check Firebase Console for database issues
3. Review Vercel deployment logs

## 🎉 You're All Set!

Your fund collection app is ready to use. Start by running `npm run dev` and creating your first collection!

