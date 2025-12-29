# Volunteer Match Platform

A MERN stack web application that connects volunteers with organizations hosting social impact opportunities.

## 🚀 Features
- User authentication with email verification
- Real-time messaging and notifications
- Opportunity creation and management
- Application system with approval/rejection
- Profile management with avatar upload
- Advanced search and filtering
- Dark mode support
- Responsive design

## 🛠 Tech Stack
- **Frontend**: React + Vite, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Deployment**: Vercel

## 📦 Installation

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

## 🚀 Deployment

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

## 📱 Usage

1. **Register** as a volunteer or organization
2. **Verify** your email address
3. **Create opportunities** (organizations) or **browse and apply** (volunteers)
4. **Communicate** through real-time messaging
5. **Manage applications** and track your impact

---

**Made with ❤️ for social good**