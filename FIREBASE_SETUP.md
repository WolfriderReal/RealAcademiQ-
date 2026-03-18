# Firebase Setup & Admin Dashboard Guide

## What Was Implemented

✅ **Firebase Cloud Firestore** - All customer orders now persist permanently  
✅ **Admin Dashboard** - Accessible at `/admin` to view all orders & customer details  
✅ **Order Management** - Track order status, payment, and progress  
✅ **Automatic Sync** - All new orders save to Firebase instantly

---

## Step 1: Create Firebase Project (5 minutes)

1. Go to **https://console.firebase.google.com**
2. Click "Create project" or "Add project"
3. Name it: **RealAcademiQ**
4. Click "Create project"
5. Wait for creation to complete

---

## Step 2: Get Your Firebase Credentials

### Get Web API Credentials:
1. In Firebase Console, go to **Project Settings** (gear icon, top-left)
2. Click the **General** tab
3. Scroll down to "Your apps" section
4. Click **Web** icon (if not already added)
5. Copy the config object that looks like:
```javascript
{
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxx",
  authDomain: "realacademiq-xxxxx.firebaseapp.com",
  projectId: "realacademiq-xxxxx",
  storageBucket: "realacademiq-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxx"
}
```

### Get Admin Credentials (for server):
1. Still in **Project Settings**
2. Click **Service Accounts** tab
3. Make sure "Firebase Admin SDK" is selected
4. Click **Generate New Private Key**
5. A JSON file will download - **KEEP THIS SAFE!**
6. Open it and find these values:
   - `project_id`
   - `client_email`
   - `private_key` (the long string)

---

## Step 3: Enable Firestore Database

1. In Firebase Console, click **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose location: **(us-central1 or closest to you)**
4. Choose security rules: **Start in production mode**
5. Click **Create**
6. Go to **Rules** tab and replace with:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
7. Click **Publish**

---

## Step 4: Update Your Environment Variables

### In `.env.local` file:

Replace these with your actual Firebase credentials:

```env
# Web API Credentials (public - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Admin Credentials (SECRET - keep in .env.local only, never commit)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...(paste entire key here)...JLi6QvANDADAA==\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANT:**
- The `FIREBASE_PRIVATE_KEY` must have `\n` for line breaks
- For example: `"-----BEGIN PRIVATE KEY-----\nABC\nDEF\n-----END PRIVATE KEY-----\n"`
- Use a special JSON formatter if needed to properly escape the key

---

## Step 5: Deploy to Vercel

1. Commit your changes: `git add -A && git commit -m "Add Firebase credentials"`
2. Push to GitHub: `git push origin main`
3. Go to **Vercel Dashboard** → Your project
4. Go to **Settings** → **Environment Variables**
5. Add all 9 Firebase variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
6. Click **Save**
7. Click **Redeploy** on the Deployments page

---

## Step 6: Verify Setup

Once deployed:

1. Go to **https://real-academi-q.vercel.app**
2. Create a test order on `/order`
3. Go to **https://real-academi-q.vercel.app/admin**
4. You should see your test order listed!

---

## Admin Dashboard Features

At **`/admin`**, you can:

✅ **View all customer orders** in a table  
✅ **See order ID, customer name, email, phone**  
✅ **Track service type** (assignment, thesis, project, proposal)  
✅ **Monitor order status** (pending, in progress, completed)  
✅ **Check payment status** (pending, partial, completed)  
✅ **View order pricing** and amount paid  
✅ **See deadlines** and progress phases  
✅ **Click "View Details"** for full order information

---

## Troubleshooting

### "Firebase admin not initialized"
- Check all 3 `FIREBASE_*` env vars are set in `.env.local`
- Make sure `FIREBASE_PRIVATE_KEY` includes `\n` for line breaks
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Orders not appearing in admin dashboard"
- Make sure Firestore database exists in Firebase Console
- Verify Firestore Rules allow read/write
- Check browser console for errors (F12)
- In Firestore, you should see an "orders" collection

### "400 error when creating order"
- Check that Firebase credentials are valid
- Make sure Firestore database is in "production mode"
- Verify the `FIREBASE_PROJECT_ID` matches your Firebase project

---

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Add credentials to `.env.local`
3. ✅ Deploy to Vercel with env vars
4. ✅ Test order creation
5. ✅ Access admin dashboard at `/admin`
6. 🔜 Optional: Add authentication to admin dashboard (currently public!)

---

## Securing the Admin Dashboard

⚠️ **SECURITY NOTE:** The `/admin` page is currently accessible to anyone!

To add password protection:
1. Let me know and I can add Basic Auth or social login
2. Or restrict to specific IP addresses in Vercel
3. Or move to separate authenticated subdomain

---

## Questions?

If you get stuck:
1. Check Firebase Console → Firestore → Data tab (should see "orders" collection)
2. Check Vercel Deployments → Environment Variables (all 9 vars present?)
3. View browser console errors (F12 → Console tab)
4. Check `.env.local` file has correct formatting
