# Backend Deployment Guide

## Deploy to Render (Free Tier)

1. **Sign up at [Render](https://render.com/)**

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select the `fairblock-banner` repository
   - Root Directory: `my-banner/backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node index.js`

3. **Add Environment Variable:**
   - Go to "Environment" tab
   - Add: `DISCORD_TOKEN` = `your_discord_bot_token_here`

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (takes 2-3 minutes)
   - Copy your API URL (e.g., `https://fairblock-banner-backend.onrender.com`)

5. **Update Frontend:**
   - Open `my-banner/script.js`
   - Find line with `http://localhost:3001`
   - Replace with your Render URL
   - Commit and push changes
   - Redeploy on Netlify

## Alternative: Railway

1. Sign up at [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `fairblock-banner` repository
4. Set root directory: `my-banner/backend`
5. Add environment variable: `DISCORD_TOKEN`
6. Deploy and copy the public URL

## Environment Variables Required

```
DISCORD_TOKEN=your_discord_bot_token_here
PORT=3001 (automatically set by hosting providers)
```
