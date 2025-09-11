# Firebase Setup Guide for EcoLearn

## Quick Fix for Development

If you want to get the app running quickly without Firebase authentication, you can temporarily disable Firebase auth by modifying the components. However, for full functionality, follow the steps below to set up Firebase.

## Setting Up Firebase

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ecolearn` (or any name you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Step 3: Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon) in the left sidebar
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname (e.g., "EcoLearn Web")
5. Copy the Firebase configuration object

### Step 5: Update Configuration

Replace the configuration in `frontend/src/firebase/config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 6: Set Up Firestore Security Rules

In the Firestore Database section, go to "Rules" tab and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for leaderboards
    match /leaderboards/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read access for quizzes
    match /quizzes/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read access for challenges
    match /challenges/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read access for community posts
    match /community/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Alternative: Demo Mode (No Firebase Required)

If you want to test the app without setting up Firebase, you can create a demo version that works without authentication. Let me know if you'd like me to create this version.

## Testing Your Setup

1. Start the backend: `cd backend && node server.js`
2. Start the frontend: `cd frontend && npm start`
3. Open http://localhost:3000
4. Try to sign up with a test email
5. Check the Firebase Console to see if the user was created

## Troubleshooting

- **API Key Error**: Make sure you copied the correct API key from Firebase Console
- **Auth Domain Error**: Ensure the authDomain matches your project
- **Project ID Error**: Verify the projectId is correct
- **CORS Error**: Make sure your domain is added to Firebase authorized domains

## Next Steps

Once Firebase is set up:
1. The app will have full authentication functionality
2. User data will be stored in Firestore
3. You can add real quizzes and challenges
4. Leaderboards will work with real data

Would you like me to help you with any specific part of this setup?


