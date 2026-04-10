# Talent-IQ Deployment Guide

## 🚀 Free Hosting Setup

### Prerequisites
1. GitHub account
2. Free accounts on:
   - [Vercel](https://vercel.com) (Frontend)
   - [Render](https://render.com) (Backend)
   - [MongoDB Atlas](https://mongodb.com/atlas) (Database - optional)

### Step 1: Prepare Your Code

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Install dependencies:**
   ```bash
   npm run install-all
   ```

### Step 2: Deploy Backend (Render)

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `talent-iq-backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://your-frontend-url.vercel.app
   STREAM_API_KEY=your_stream_key
   STREAM_API_SECRET=your_stream_secret
   CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   DB_URL=your_mongodb_url (optional)
   ```
6. Click "Create Web Service"
7. Note the backend URL (e.g., `https://talent-iq-backend.onrender.com`)

### Step 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_STREAM_API_KEY=your_stream_key
   ```
6. Click "Deploy"
7. Note the frontend URL (e.g., `https://talent-iq.vercel.app`)

### Step 4: Update URLs

1. **Update backend CLIENT_URL:**
   - Go to Render dashboard
   - Update `CLIENT_URL` to your Vercel frontend URL

2. **Update frontend API URL:**
   - Go to Vercel dashboard
   - Update `VITE_API_URL` to your Render backend URL

### Step 5: Set up Database (Optional)

If you want persistent data instead of JSON files:

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to backend environment variables:
   ```
   DB_URL=mongodb+srv://username:password@cluster.mongodb.net/talent-iq
   ```

### Step 6: Configure Stream (Video Calls)

Stream API requires payment for production use:
- Free tier: Limited to 100 users/month
- Paid plans start at $99/month

For development/testing, you can use the dummy video UI.

## 🔧 Troubleshooting

### Backend Issues
- Check Render logs for errors
- Ensure all environment variables are set
- Verify CORS settings

### Frontend Issues
- Check Vercel build logs
- Ensure API URLs are correct
- Clear browser cache

### Video Call Issues
- Stream API requires valid credentials
- Check network/firewall settings
- Use dummy UI for testing without Stream

## 📝 Notes

- **Free tiers have limitations:**
  - Render: 750 hours/month, sleeps after 15min inactivity
  - Vercel: Unlimited bandwidth, generous limits
  - Stream: 100 users/month free

- **For production:**
  - Consider paid plans for reliability
  - Set up proper monitoring
  - Configure domain names

- **Security:**
  - Never commit `.env` files
  - Use environment variables for secrets
  - Configure CORS properly