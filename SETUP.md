# Volunteer Match Platform - Setup Guide

## Quick Start (Windows)

1. **Double-click `start.bat`** - This will automatically:
   - Install all dependencies
   - Start backend on http://localhost:8000
   - Start frontend on http://localhost:5173

## Manual Setup

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://yash17237:yavi17723@cluster0.cufbpyz.mongodb.net/?appName=Cluster0
JWT_SECRET=volunteer_match_secret_123
PORT=8000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

## Vercel Deployment

### Backend Deployment
1. Deploy backend folder to Vercel
2. Set environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: volunteer_match_secret_123
   - `NODE_ENV`: production

### Frontend Deployment
1. Deploy frontend folder to Vercel
2. Set environment variables:
   - `VITE_API_URL`: https://your-backend-url.vercel.app/api
   - `VITE_SOCKET_URL`: https://your-backend-url.vercel.app

## Troubleshooting

### Common Issues:
1. **Port 8000 in use**: Change PORT in backend/.env
2. **MongoDB connection failed**: Check MONGO_URI
3. **CORS errors**: Ensure FRONTEND_URL matches your frontend URL

### Reset Everything:
```bash
# Delete node_modules and reinstall
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```