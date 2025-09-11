# 🌱 EcoLearn - Environmental Education Platform

A gamified environmental education platform designed for schools and colleges to make learning about sustainability fun and engaging.

## 🚀 Features

- **Interactive Quizzes** - Test environmental knowledge with engaging quizzes
- **Daily/Weekly Challenges** - Complete eco-friendly challenges and earn points
- **Leaderboards** - Compete with classmates and track progress
- **Community Sharing** - Share achievements and learn from peers
- **Admin Dashboard** - Teachers can manage quizzes and track student progress
- **Weather Integration** - Get weather-based eco tips and information
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Firebase Auth** - Authentication
- **Firebase Firestore** - Database
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Server-side Firebase integration
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📁 Project Structure

```
ecolearn/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── firebase/        # Firebase configuration
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Express backend API
│   ├── routes/              # API route handlers
│   ├── server.js            # Express server
│   ├── package.json
│   └── env.example          # Environment variables template
├── package.json             # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecolearn
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Get your Firebase configuration

### 4. Configure Environment Variables

#### Frontend Configuration
Update `frontend/src/firebase/config.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### Backend Configuration
Copy `backend/env.example` to `backend/.env` and update:

```bash
cd backend
cp env.example .env
```

Update the `.env` file with your Firebase service account credentials.

### 5. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run client  # Frontend only
npm run server  # Backend only
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Pages & Features

### 🏠 Home Page
- Welcome screen with sign up/log in
- Feature highlights
- Responsive design

### 📊 Dashboard
- User statistics and progress
- Eco-points and level system
- Global leaderboard
- Weather information
- Quick actions

### 📚 Quizzes
- Interactive quiz interface
- Timer functionality
- Score calculation
- Progress tracking
- Multiple difficulty levels

### 🎯 Challenges
- Daily and weekly challenges
- Category filtering
- Point rewards
- Streak tracking
- Environmental impact metrics

### 👥 Community
- Share achievements
- Like and comment on posts
- Filter by post type
- Search functionality
- Community statistics

### ⚙️ Admin Dashboard
- User management
- Quiz creation and management
- Analytics and reporting
- System health monitoring
- Data export functionality

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile/:uid` - Get user profile
- `PUT /api/auth/profile/:uid` - Update user profile

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/stats/:uid` - Get user statistics
- `POST /api/users/points/:uid` - Update user points
- `GET /api/users/badges/:uid` - Get user badges

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get specific quiz
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt
- `GET /api/quizzes/user/:userId/attempts` - Get user attempts

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get specific challenge
- `POST /api/challenges/:id/complete` - Complete challenge
- `GET /api/challenges/categories` - Get challenge categories

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/:id/like` - Like/unlike post
- `POST /api/community/posts/:id/comments` - Add comment

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/eco-tips` - Get weather-based eco tips

## 🎨 Customization

### Styling
The app uses TailwindCSS for styling. You can customize the theme in `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary color palette
      },
      secondary: {
        // Your secondary color palette
      }
    }
  }
}
```

### Adding New Features
1. Create new components in `frontend/src/components/`
2. Add new pages in `frontend/src/pages/`
3. Create API routes in `backend/routes/`
4. Update navigation in `frontend/src/components/Navbar.js`

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/build`
5. Add environment variables in Vercel dashboard

### Backend (Render)
1. Connect GitHub repository to Render
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables in Render dashboard

### Environment Variables for Production
- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `OPENWEATHER_API_KEY`
- `FRONTEND_URL` (production URL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/ecolearn/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🙏 Acknowledgments

- Firebase for authentication and database services
- TailwindCSS for the beautiful UI framework
- Lucide for the amazing icon set
- OpenWeather API for weather data
- The environmental education community for inspiration

---

**Made with ❤️ for a sustainable future** 🌍
