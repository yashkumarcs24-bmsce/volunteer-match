# Vercel Deployment Instructions

## Step 1: Deploy Backend
1. Push code to GitHub
2. Go to vercel.com → New Project
3. Import GitHub repository
4. Set Root Directory: `backend`
5. Add Environment Variables:
   - MONGO_URI: mongodb+srv://yash17237:yavi17723@cluster0.cufbpyz.mongodb.net/?appName=Cluster0
   - JWT_SECRET: volunteer_match_secret_123
   - NODE_ENV: production
6. Deploy

## Step 2: Update Frontend URLs
After backend deployment, replace in these files:
- frontend/.env.production
- backend/server.js (CORS origins)

Replace "your-backend-url.vercel.app" with actual backend URL
Replace "your-frontend-url.vercel.app" with actual frontend URL

## Step 3: Deploy Frontend
1. Update .env.production with backend URL
2. In Vercel: New Project → Import repository
3. Set Root Directory: `frontend`
4. Deploy

## Step 4: Final Update
Update backend CORS with actual frontend URL and redeploy backend

## ✅ Ready to Deploy!
All configurations are in place. The project will work on both localhost and Vercel.