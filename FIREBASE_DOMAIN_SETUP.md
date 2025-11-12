# 🔥 Firebase Domain Setup - Visual Guide

## Step-by-Step Instructions with Screenshots

### 🎯 Problem You're Facing:
```
Error: This domain is not authorized for OAuth operations 
for your Firebase project.
```

---

## 📝 Solution Steps

### Step 1: Open Firebase Console

1. Go to: **https://console.firebase.google.com**
2. Log in with your Google account
3. You should see your project list

---

### Step 2: Select Your Project

1. Click on your project: **food-donation-100ed**
2. Wait for the project dashboard to load

**What you'll see**:
```
┌─────────────────────────────────────────────────┐
│  food-donation-100ed                             │
│  Project Overview                                │
│                                                   │
│  [Build]  [Release & Monitor]  [Analytics]      │
│                                                   │
│  Left Sidebar:                                   │
│  • Authentication  ← Click here                  │
│  • Firestore Database                           │
│  • Storage                                      │
│  • Hosting                                      │
└─────────────────────────────────────────────────┘
```

---

### Step 3: Navigate to Authentication

1. Look at the **left sidebar**
2. Find and click **"Authentication"** (🔐 icon)
3. If it's collapsed, click to expand it first

**Menu looks like**:
```
├─ 🏠 Project Overview
├─ 🔐 Authentication          ← Click this
│   ├─ Users
│   ├─ Sign-in method
│   └─ Settings               ← Then click this
├─ 🗄️ Firestore Database
└─ ...
```

---

### Step 4: Go to Settings Tab

1. After clicking "Authentication", you'll see tabs at the top
2. Click on the **"Settings"** tab

**Tabs you'll see**:
```
┌────────────────────────────────────────────────┐
│  Users  |  Sign-in method  |  Templates  |  Settings  │
│                                            ↑           │
│                                  Click this tab       │
└────────────────────────────────────────────────┘
```

---

### Step 5: Find Authorized Domains Section

1. Scroll down on the Settings page
2. Look for **"Authorized domains"** section
3. You'll see a list of already authorized domains

**What you'll see**:
```
┌─────────────────────────────────────────────────┐
│  Authorized domains                              │
│  ──────────────────────────────────────────────│
│  Domains that can use Firebase Authentication:  │
│                                                   │
│  • food-donation-100ed.firebaseapp.com          │
│  • food-donation-100ed.web.app                  │
│                                                   │
│  [+ Add domain] ← Click this button             │
└─────────────────────────────────────────────────┘
```

---

### Step 6: Add localhost

1. Click the **"Add domain"** button
2. A popup/input field will appear
3. Type: **localhost**
4. Press Enter or click **"Add"**

**Input dialog**:
```
┌─────────────────────────────────────────────────┐
│  Add domain                                      │
│  ──────────────────────────────────────────────│
│  Domain name:                                    │
│  ┌─────────────────────────────────────────┐   │
│  │ localhost                                 │   │
│  └─────────────────────────────────────────┘   │
│                                                   │
│  [Cancel]  [Add] ← Click Add                    │
└─────────────────────────────────────────────────┘
```

---

### Step 7: Add 127.0.0.1 (Optional but Recommended)

1. Click **"Add domain"** button again
2. Type: **127.0.0.1**
3. Click **"Add"**

This helps if your app runs on 127.0.0.1 instead of localhost

---

### Step 8: Verify Domains Are Added

After adding, you should see:

```
┌─────────────────────────────────────────────────┐
│  Authorized domains                              │
│  ──────────────────────────────────────────────│
│  ✅ localhost                                    │
│  ✅ 127.0.0.1                                    │
│  ✅ food-donation-100ed.firebaseapp.com          │
│  ✅ food-donation-100ed.web.app                  │
│                                                   │
│  [+ Add domain]                                  │
└─────────────────────────────────────────────────┘
```

---

### Step 9: Wait for Propagation

- Changes take **1-2 minutes** to take effect
- No need to restart your app
- Just wait a moment

---

### Step 10: Test Your App

1. Go back to your app: **http://localhost:5173**
2. Hard refresh the page: 
   - **Windows/Linux**: Ctrl + Shift + R
   - **Mac**: Cmd + Shift + R
3. Try signing up or logging in
4. Should work now! ✅

---

## 🎯 For Production Deployment

When you deploy your app to production, add these domains too:

### For Vercel:
```
your-app.vercel.app
your-app-git-main.vercel.app
*.vercel.app (for all preview deployments)
```

### For Netlify:
```
your-app.netlify.app
*.netlify.app (for all preview deployments)
```

### For Custom Domain:
```
yourdomain.com
www.yourdomain.com
```

---

## 🔍 Troubleshooting

### Can't Find Authentication Menu?

**Solution**: Enable Authentication first
1. Click "Authentication" in sidebar
2. If you see "Get Started" button, click it
3. Enable Email/Password sign-in method
4. Then go to Settings tab

### Don't See "Add Domain" Button?

**Solution**: Check your permissions
- Make sure you're an **Owner** or **Editor** of the project
- Viewers cannot modify settings

### Domain Still Not Working?

**Try these**:
1. ✅ Clear browser cache completely
2. ✅ Use Incognito/Private mode
3. ✅ Wait 5 minutes for changes to propagate
4. ✅ Check spelling of domain (no spaces!)
5. ✅ Verify you're on the correct Firebase project

---

## 📸 Screenshot Checklist

When following this guide, you should see:

- [ ] Firebase Console homepage
- [ ] Project list with your project
- [ ] Left sidebar with Authentication option
- [ ] Authentication → Settings tab
- [ ] Authorized domains section
- [ ] Add domain button
- [ ] localhost in the domain list
- [ ] No error messages in app after adding

---

## ⚡ Quick Copy-Paste Domains

Add these domains for different environments:

**Development**:
```
localhost
127.0.0.1
```

**Vite Dev Server** (if using different port):
```
localhost:5173
localhost:3000
```

**Firebase Hosting** (auto-added usually):
```
your-project.web.app
your-project.firebaseapp.com
```

**Production** (add when deploying):
```
yourdomain.com
www.yourdomain.com
```

---

## 🎉 Success Confirmation

You'll know it worked when:

✅ No "unauthorized domain" error appears
✅ Signup/login works smoothly
✅ Email verification emails are sent
✅ Password reset emails are sent
✅ No errors in browser console

---

## 📞 Still Having Issues?

### Check These:

1. **Correct Firebase Project?**
   ```
   Current project: food-donation-100ed
   Check .env file matches
   ```

2. **Correct Domain Added?**
   ```
   localhost (no http://)
   Not localhost:5173 (port not needed)
   ```

3. **Firebase Auth Enabled?**
   ```
   Authentication → Sign-in method
   Email/Password should be "Enabled"
   ```

4. **Environment Variables Set?**
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=food-donation-100ed.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=food-donation-100ed
   ```

---

## 💡 Pro Tips

1. **Add Domains Before Development**:
   - Set up domains when you first create the project
   - Saves time and frustration

2. **Use Wildcards for Preview Deployments**:
   - `*.vercel.app` covers all preview branches
   - `*.netlify.app` covers all preview builds

3. **Don't Add Ports**:
   - ✅ `localhost` (correct)
   - ❌ `localhost:5173` (wrong)
   - Firebase Auth ignores ports

4. **Keep Domain List Clean**:
   - Remove old/unused domains
   - Only keep active domains
   - Helps with security

---

## 🔗 Quick Links

- Firebase Console: https://console.firebase.google.com
- Firebase Auth Docs: https://firebase.google.com/docs/auth
- Authorized Domains Guide: https://firebase.google.com/docs/auth/web/redirect-best-practices

---

**Last Updated**: November 12, 2025
**Estimated Time**: 2-3 minutes
**Difficulty**: Easy 🟢

---

## ✅ Final Checklist

Before closing this guide:

- [ ] Opened Firebase Console
- [ ] Selected correct project (food-donation-100ed)
- [ ] Navigated to Authentication → Settings
- [ ] Found Authorized domains section
- [ ] Added "localhost"
- [ ] Added "127.0.0.1" (optional)
- [ ] Waited 2 minutes
- [ ] Hard refreshed app
- [ ] Tested signup/login
- [ ] No more domain errors! 🎉

---

**Need Help?** 
- Check FIREBASE_AUTH_ISSUES.md for more troubleshooting
- Review browser console for specific error messages
- Verify environment variables in .env file
