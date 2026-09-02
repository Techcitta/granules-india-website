# Free Deployment Guide

## Step 1: Deploy Backend to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) and sign up (no credit card needed)
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Settings:
   - **Name:** `granules-chatbot`
   - **Runtime:** Python
   - **Build Command:** `cd server && pip install -r requirements.txt`
   - **Start Command:** `cd server && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   ```
   GEMINI_API_KEY=AQ.Ab8RN6KMpMoQzTvDKpOT2zkCynh0ojaYjIAB8Il-rsJ_vkSJtQ
   QDRANT_URL=https://88fa2beb-257f-412a-be7e-77328cea0718.eu-west-2-0.aws.cloud.qdrant.io:6333
   QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6MDEyNjc4YWUtYTdhOC00MGEyLWI4MGQtZGRlZTY1OTI5YjZkIn0.bT4s1X0H8TxI1sus9enxKJcfZQHUDnP1pc1_TaXQkFo
   ```
7. Click **Create Web Service**
8. Wait for deployment (2-3 min)
9. Copy your backend URL (e.g., `https://granules-chatbot.onrender.com`)

## Step 2: Configure Frontend

Update `index.html` - add this line before the chatbot.js script:

```html
<script>window.GRANULES_API_URL = 'YOUR_RENDER_URL_HERE';</script>
```

Example:
```html
<script>window.GRANULES_API_URL = 'https://granules-chatbot.onrender.com';</script>
<script src="/chatbot.js"></script>
```

## Step 3: Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **Add new site** → **Import an existing project**
3. Connect your GitHub repo
4. Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**
6. Wait for deployment (1-2 min)
7. Your site is live!

## Important Notes

- Render free tier spins down after 15 min inactivity
- First request after idle takes ~30 seconds
- Subsequent requests are fast
- No credit card required for either platform
