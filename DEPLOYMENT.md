# 🚀 NovaMind AI Deployment Guide

This guide will walk you through deploying your **Backend to Railway** and your **Frontend to Vercel**.

---

## Step 1: Push Your Code to GitHub
Before deploying, make sure your code is pushed to a GitHub repository. 
If you haven't done this yet, run the following commands in the root of your project:
```bash
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```
*(Make sure to replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details).*

---

## Step 2: Deploy Backend to Railway 🚂

We deploy the backend first so we can get its public URL, which the frontend needs.

1. Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your repository.
4. Railway will analyze your repo. It might try to deploy the whole repo or just the root. We need to tell it to only build the `server` folder.
5. In your Railway project dashboard, click on your newly deployed service, go to **Settings** → **Build**.
6. Find **Root Directory** and set it to `/server`.
7. Go to the **Variables** tab. You need to add all your backend environment variables here. Copy the following keys and values from your local `server/.env` file:
   - `DATABASE_URL`
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `GROQ_API_KEY`
   - `CLICKDROP_API_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
8. In the **Settings** tab under **Environment**, click **Generate Domain** under "Public Networking". 
9. **Copy this newly generated URL.** You will need it for Vercel. *(e.g., `https://novamind-backend-production.up.railway.app`)*

---

## Step 3: Deploy Frontend to Vercel ▲

Now that the backend is live, let's deploy the frontend.

1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the "Configure Project" section:
   - **Framework Preset**: Select **Vite**
   - **Root Directory**: Click "Edit" and change it to `client`
5. Open the **Environment Variables** section and add the following:
   - **Name**: `VITE_CLERK_PUBLISHABLE_KEY` 
     **Value**: `pk_test_Z3VpZGluZy1sYXJrLTE2LmNsZXJrLmFjY291bnRzLmRldiQ`
   - **Name**: `VITE_BASE_URL` 
     **Value**: Paste the **Railway URL you copied in Step 2** *(Do not include a trailing slash `/`)*
6. Click **Deploy**. Vercel will build and deploy your frontend.
7. Once finished, click **Continue to Dashboard** and click on your **Domains** link to see your live site!

---

🎉 **Congratulations! Your application is now live on the internet.** 

### Final Verification
- Log in to your live frontend URL.
- Try generating an article or a blog title to ensure the Vercel frontend is successfully talking to the Railway backend.
