# Deployment Guide - Localhost & Vercel

## ✅ Code is now configured to run on both localhost and Vercel!

### 🏠 Running Locally

#### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 🚀 Deploying to Vercel

#### Step 1: Deploy Backend
1. Push code to GitHub
2. Go to Vercel dashboard
3. Import your GitHub repository
4. Set Root Directory to `backend`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production
6. Deploy

#### Step 2: Deploy Frontend
1. Update `frontend/.env.production` with your actual backend URL:
   ```
   VITE_API_URL=https://your-actual-backend-url.vercel.app/api
   VITE_SOCKET_URL=https://your-actual-backend-url.vercel.app
   ```
2. In Vercel, import repository again
3. Set Root Directory to `frontend`
4. Deploy

#### Step 3: Update CORS
Update `backend/server.js` with your actual frontend URL:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ["https://your-actual-frontend-url.vercel.app"]
  : ["http://localhost:5173"]
```

### 🔧 Environment Variables

#### Frontend (.env for localhost)
```
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

#### Frontend (.env.production for Vercel)
```
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_SOCKET_URL=https://your-backend-url.vercel.app
```

#### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

### ✨ Features Working on Both Environments:
- ✅ User authentication
- ✅ Real-time messaging
- ✅ Real-time notifications
- ✅ File uploads
- ✅ Email verification
- ✅ All CRUD operations

The code automatically detects the environment and uses the appropriate URLs!