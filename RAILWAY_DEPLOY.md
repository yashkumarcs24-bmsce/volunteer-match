# Railway Deployment Guide

## Step 1: Setup Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

## Step 2: Deploy Backend

### 2.1 Create Backend Service
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your repository
3. Choose "backend" folder as root directory
4. Railway will auto-detect Node.js and deploy

### 2.2 Set Environment Variables
In Railway dashboard → Backend service → Variables:
```
MONGO_URI=mongodb+srv://yash17237:yavi17723@cluster0.cufbpyz.mongodb.net/?appName=Cluster0
JWT_SECRET=volunteer_match_secret_123
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

### 2.3 Get Backend URL
- Copy the generated URL (e.g., `https://backend-production-xxxx.up.railway.app`)

## Step 3: Deploy Frontend

### 3.1 Create Frontend Service
1. In same project, click "New Service"
2. Select "Deploy from GitHub repo"
3. Choose "frontend" folder as root directory

### 3.2 Set Environment Variables
In Railway dashboard → Frontend service → Variables:
```
VITE_API_URL=https://your-backend-url.up.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.up.railway.app
```

### 3.3 Update Backend CORS
1. Go back to backend service → Variables
2. Update `FRONTEND_URL` with your frontend Railway URL

## Step 4: Test Deployment
1. Visit your frontend URL
2. Test registration and login
3. Check browser console for errors

## Troubleshooting

### Common Issues:
- **Build fails**: Check Node.js version in package.json
- **CORS errors**: Verify FRONTEND_URL in backend
- **API not found**: Check VITE_API_URL in frontend
- **Database connection**: Verify MONGO_URI

### Logs:
- Railway dashboard → Service → Deployments → View logs

## Cost:
- Free tier: $5 credit/month
- Enough for small to medium applications
- Scales automatically with usage