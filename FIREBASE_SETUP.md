# Firebase Setup Guide for StackPack Bundler

This guide will walk you through setting up Firebase for the StackPack Bundler application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "StackPack Bundler")
4. (Optional) Enable Google Analytics
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (`</>`) to add a web app
2. Enter an app nickname (e.g., "StackPack Web")
3. **Do NOT** check "Also set up Firebase Hosting" (we're using Vite)
4. Click "Register app"
5. **Copy the Firebase configuration object** - you'll need this later
6. Click "Continue to console"

## Step 3: Enable Google Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click "Get started" if this is your first time
3. Go to the **Sign-in method** tab
4. Click on **Google** in the providers list
5. Toggle the **Enable** switch
6. Enter a project support email
7. Click **Save**

## Step 4: Set Up Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
   - **Note**: For production, you should set up proper security rules
4. Select a Firestore location (choose one closest to your users)
5. Click "Enable"

### Firestore Security Rules (Optional - for production)

Replace the default rules with these for better security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      // Users can only read/write their own projects
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Step 5: Configure Your Application

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration values:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **Where to find these values:**
   - Go to Firebase Console → Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click on your web app
   - Copy the values from the config object

## Step 6: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser (usually `http://localhost:5173`)

3. Click the "Sign In" button in the header

4. Sign in with your Google account

5. Upload some files and create a bundle

6. Check your Firestore database - you should see a new document in the `projects` collection

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add your domain to authorized domains
1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add `localhost` and any other domains you're using

### "Missing or insufficient permissions"

**Solution**: Check your Firestore security rules
1. Go to Firestore Database → Rules
2. Make sure you're in test mode or have proper rules set up
3. Publish the rules

### Environment variables not loading

**Solution**: 
1. Make sure your `.env` file is in the project root
2. Restart the development server after changing `.env`
3. Variable names must start with `VITE_` for Vite to expose them

## Production Deployment

Before deploying to production:

1. **Update Firestore Security Rules** (see Step 4)
2. **Add your production domain** to Firebase authorized domains
3. **Never commit your `.env` file** - it's already in `.gitignore`
4. **Set environment variables** in your hosting platform (Vercel, Netlify, etc.)

## Optional: Firebase Storage (Future Enhancement)

If you want to store the actual bundle files in Firebase Storage:

1. Go to **Build** → **Storage**
2. Click "Get started"
3. Choose **Start in test mode**
4. Click "Done"

Then update the code to upload bundles to Storage instead of just saving metadata to Firestore.

---

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore)
