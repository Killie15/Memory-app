# Deployment Guide

## Quick Start

### 1. Deploy to Vercel (2 minutes)

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"  
3. Drag and drop your `Memory app` folder directly into the browser
4. Vercel will auto-detect settings and deploy!
5. Copy your URL (e.g., `memory-app-xyz.vercel.app`)

**Option B: Via GitHub**
1. Push your code to a GitHub repository
2. Connect the repo to Vercel
3. Vercel auto-deploys on every push

---

### 2. Set Up Supabase Database (5 minutes)

1. Go to [supabase.com](https://supabase.com) → Your project dashboard
2. Click **SQL Editor** in the left sidebar
3. Copy the contents of `database/schema.sql` and paste it
4. Click **Run** to create the tables

![Run SQL](file:///c:/Users/caram/OneDrive/Desktop/Memory%20app/database/schema.sql)

---

### 3. Enable Anonymous Login

1. In Supabase, go to **Authentication** → **Providers**
2. Scroll to **Anonymous** sign-in
3. Toggle it **ON** and save

This lets users use the app without creating an account.

---

### 4. Update Google OAuth (Optional)

If you want Calendar/Email features to work on the live site:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit your OAuth Client
4. Add your Vercel URL to **Authorized JavaScript origins**
   - Example: `https://your-app.vercel.app`

---

## You're Live! 🚀

Your app is now accessible from any device at your Vercel URL.

Features working with database:
- ✅ AI Assistant remembers facts you tell it
- ✅ Tasks are stored persistently  
- ✅ Journal entries sync across devices
- ✅ Chat history persists
