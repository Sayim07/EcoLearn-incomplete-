# 🚀 EcoLearn Setup Guide

This guide will walk you through setting up EcoLearn from scratch.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- A **Firebase account** - [Sign up here](https://firebase.google.com/)

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ecolearn` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 3: Enable Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 4: Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### Step 5: Create Service Account (for Backend)

1. Go to "Project settings" > "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Keep this file secure - you'll need it for the backend

## 🛠️ Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ecolearn

# Install all dependencies
npm run install-all
```

### Step 2: Configure Frontend

1. Open `frontend/src/firebase/config.js`
2. Replace the placeholder config with your Firebase config:

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

### Step 3: Configure Backend

1. Copy the environment template:
```bash
cd backend
cp env.example .env
```

2. Open `backend/.env` and update with your Firebase service account details:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase Configuration (from your service account JSON)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com

# Optional: OpenWeather API (for weather features)
OPENWEATHER_API_KEY=your-openweather-api-key
```

### Step 4: Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately in different terminals:
# Terminal 1 (Backend)
npm run server

# Terminal 2 (Frontend)
npm run client
```

### Step 5: Verify Setup

1. Open http://localhost:3000 in your browser
2. You should see the EcoLearn home page
3. Try creating a new account
4. Check that you can log in and access the dashboard

## 🌐 Optional: OpenWeather API Setup

For weather features, you can set up the OpenWeather API:

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key
4. Add it to your `backend/.env` file:

```env
OPENWEATHER_API_KEY=your-openweather-api-key
```

## 🚀 Production Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Set the following in Vercel:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variables:
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

### Backend Deployment (Render)

1. Go to [Render](https://render.com/)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add all environment variables from your `.env` file

### Database Security Rules

Before going to production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quizzes are readable by all authenticated users
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Community posts are readable by all, writable by authenticated users
    match /community_posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**1. Firebase connection errors**
- Check your Firebase configuration
- Ensure your project ID is correct
- Verify that Authentication and Firestore are enabled

**2. CORS errors**
- Make sure your backend is running on port 5000
- Check that `FRONTEND_URL` in backend `.env` matches your frontend URL

**3. Build errors**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be v16+)

**4. Authentication not working**
- Check Firebase Authentication is enabled
- Verify the Firebase config in frontend
- Check browser console for errors

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check the terminal/console for backend errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Check Firebase project settings

## 📚 Next Steps

Once your setup is complete:

1. **Customize the app** - Modify colors, add your school branding
2. **Add content** - Create quizzes and challenges for your students
3. **Set up admin accounts** - Create teacher/admin accounts
4. **Test thoroughly** - Try all features with different user accounts
5. **Deploy to production** - Follow the deployment guide above

## 🎉 Congratulations!

You now have a fully functional environmental education platform! Your students can:

- Take interactive quizzes about the environment
- Complete daily and weekly eco-challenges
- Compete on leaderboards
- Share their achievements with the community
- Learn about weather and environmental conditions

Happy teaching! 🌱
