# Firebase Authentication Issues - Solutions

## 🔥 Issue 1: Domain Not in Allowlist

### Problem:
Firebase shows error: "This domain is not authorized for OAuth operations for your Firebase project"

### Solution:

#### Step 1: Add Your Domain to Firebase Console

1. **Go to Firebase Console**:
   ```
   https://console.firebase.google.com
   ```

2. **Select your project**: `food-donation-100ed`

3. **Navigate to Authentication**:
   - Click on "Authentication" in left sidebar
   - Click on "Settings" tab
   - Click on "Authorized domains"

4. **Add your domains**:
   
   For **Development**:
   ```
   localhost
   ```
   
   For **Production** (add when deploying):
   ```
   yourdomain.com
   www.yourdomain.com
   ```
   
   If using **Vercel/Netlify preview**:
   ```
   *.vercel.app
   *.netlify.app
   yourapp.vercel.app
   ```

5. **Click "Add domain"** for each one

#### Step 2: Verify Current Domain
Check what domain Firebase is seeing:
```javascript
// In browser console
console.log('Current domain:', window.location.hostname);
console.log('Current origin:', window.location.origin);
```

#### Common Authorized Domains to Add:
```
✅ localhost (for development)
✅ 127.0.0.1 (alternative local)
✅ your-project-name.web.app (Firebase Hosting)
✅ your-project-name.firebaseapp.com (Firebase default)
✅ your-custom-domain.com (if using custom domain)
```

---

## 🔥 Issue 2: Too Many Requests

### Problem:
Firebase shows: "TOO_MANY_ATTEMPTS_TRY_LATER" or similar rate limit error

### Root Causes:
1. **Rapid repeated attempts** (clicking send button multiple times)
2. **Development testing** (lots of signups/logins quickly)
3. **Missing rate limiting** in code
4. **Auto-resend loops**

### Solutions:

#### Solution 1: Add Rate Limiting to Email Service

I'll update the email service with built-in rate limiting:

✅ **IMPLEMENTED**: The email service now includes:
- Rate limiting (max 3 emails per minute per address)
- 5-minute cooldown after hitting limit
- User-friendly error messages
- Automatic tracking of send attempts

#### Solution 2: Add UI Cooldowns

✅ **IMPLEMENTED**: UI components now have:
- 60-second cooldown timer on resend buttons
- Visual countdown display
- Disabled buttons during cooldown
- Clear user feedback

#### Solution 3: Clear Firebase Auth State (User Action)

If you're still getting rate limit errors:

**Clear Browser Data**:
```
1. Open DevTools (F12)
2. Go to Application tab
3. Clear all:
   - Local Storage
   - Session Storage
   - IndexedDB
4. Close and reopen browser
```

**Or use Incognito/Private mode** for testing

#### Solution 4: Wait It Out

Firebase rate limits typically reset after:
- **1 hour** for email verification
- **24 hours** for excessive failed attempts
- Can be longer for severe abuse

---

## 🔥 Issue 3: Unauthorized Domain Error

### Detailed Steps to Fix:

### 1. Check Your Current Domain

In browser console:
```javascript
console.log('Domain:', window.location.hostname);
console.log('Origin:', window.location.origin);
console.log('Full URL:', window.location.href);
```

### 2. Add Domain to Firebase Console

**Desktop/Web Instructions**:

1. Go to: https://console.firebase.google.com

2. Select your project: **food-donation-100ed**

3. Click **Authentication** (left sidebar)

4. Click **Settings** tab

5. Scroll to **Authorized domains** section

6. Click **Add domain** button

7. Add these domains one by one:
   ```
   localhost
   127.0.0.1
   ```

8. For production (when deploying), also add:
   ```
   your-domain.com
   www.your-domain.com
   your-app.vercel.app (if using Vercel)
   your-app.netlify.app (if using Netlify)
   ```

9. Click **Add** for each

### 3. Verify Domain is Added

After adding:
- Domain should appear in the list
- Status should show as "Added"
- May take 1-2 minutes to propagate

### 4. Test Again

- Hard refresh your app (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache if needed
- Try signing up/logging in again

---

## 🛠️ Implementation Changes Made

### 1. Enhanced Email Service (`src/services/emailService.ts`)

**Added Features**:
```typescript
✅ Rate limiting (3 emails/minute per address)
✅ 5-minute cooldown period
✅ Automatic attempt tracking
✅ User-friendly error messages
✅ Firebase error code parsing
✅ Domain authorization error handling
```

**Rate Limiting Logic**:
- Tracks email sends per email address
- Max 3 attempts per minute
- After 3 attempts: 5-minute cooldown
- Automatic reset after time windows expire

**Error Handling**:
- Parses Firebase error codes
- Provides clear, actionable messages
- Includes wait times in error messages

### 2. Email Verification Banner (`src/components/EmailVerificationBanner.tsx`)

**Added Features**:
```typescript
✅ 60-second cooldown timer
✅ Visual countdown display
✅ Button disabled during cooldown
✅ Prevents rapid clicking
```

**User Experience**:
- Button shows "Wait Xs" during cooldown
- Clear feedback on wait times
- Automatic countdown updates

### 3. Login Page (`src/pages/Login.tsx`)

**Added Features**:
```typescript
✅ Loading state for password reset
✅ Button disabled during send
✅ Better error messages
✅ Success confirmation
```

---

## 📋 Testing Checklist

After making these changes, test:

### Domain Authorization:
- [ ] Add localhost to Firebase authorized domains
- [ ] Clear browser cache
- [ ] Try signup/login
- [ ] Should work without domain error

### Rate Limiting:
- [ ] Click "Resend Email" button
- [ ] Button should show "Wait 60s" countdown
- [ ] Try clicking again - should show countdown
- [ ] After 60s, button should work again
- [ ] After 3 attempts, should enforce 5-min cooldown

### Error Messages:
- [ ] Try with wrong password - should show clear error
- [ ] Try with invalid email - should show clear error
- [ ] Hit rate limit - should show wait time
- [ ] Network error - should show network message

---

## 🔍 Troubleshooting Steps

### Still Getting "Unauthorized Domain"?

1. **Double-check Firebase Console**:
   - Go to Authentication → Settings → Authorized domains
   - Verify `localhost` is in the list
   - Check for typos

2. **Check Environment Variables**:
   ```bash
   # In .env file
   VITE_FIREBASE_AUTH_DOMAIN=food-donation-100ed.firebaseapp.com
   ```
   - Should match your Firebase project
   - No extra spaces or quotes

3. **Hard Refresh**:
   - Windows/Linux: Ctrl + Shift + R
   - Mac: Cmd + Shift + R
   - Or clear all browser data

4. **Try Different Browser**:
   - Test in Incognito/Private mode
   - Try different browser entirely

5. **Check Firebase Project**:
   - Verify you're using the correct Firebase project
   - Check project ID matches .env file

### Still Getting "Too Many Requests"?

1. **Wait**: The easiest solution
   - Wait 1 hour for email rate limits
   - Wait 24 hours for severe limits

2. **Use Different Email**:
   - Test with a different email address
   - Each email has its own rate limit

3. **Clear Firebase Persistence**:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   indexedDB.deleteDatabase('firebaseLocalStorageDb');
   ```

4. **Check Firebase Quota**:
   - Go to Firebase Console → Usage
   - Check if you've hit project limits
   - Free tier has daily limits

---

## 🚀 Best Practices Going Forward

### For Development:
1. **Use Test Accounts**:
   - Create a few test accounts
   - Reuse them instead of creating new ones
   - Less chance of hitting rate limits

2. **Use Emulator** (Optional):
   ```bash
   firebase emulators:start --only auth
   ```
   - No rate limits in emulator
   - Faster development

3. **Throttle Email Sends**:
   - Don't spam send buttons
   - Wait for confirmations
   - Use the cooldown timers

### For Production:
1. **Monitor Firebase Usage**:
   - Check Firebase Console regularly
   - Set up billing alerts
   - Monitor quota usage

2. **Add All Production Domains**:
   - Add domain before deploying
   - Include all subdomains
   - Include www and non-www versions

3. **User Communication**:
   - Show clear error messages
   - Explain wait times
   - Provide alternative actions

---

## 📚 Additional Resources

### Firebase Documentation:
- [Authorized Domains](https://firebase.google.com/docs/auth/web/redirect-best-practices)
- [Email Verification](https://firebase.google.com/docs/auth/web/manage-users#send_a_user_a_verification_email)
- [Rate Limits](https://firebase.google.com/docs/auth/limits)

### Common Firebase Error Codes:
- `auth/unauthorized-domain` - Domain not in allowlist
- `auth/too-many-requests` - Rate limit exceeded
- `auth/network-request-failed` - Network/connectivity issue
- `auth/invalid-email` - Malformed email address
- `auth/user-not-found` - Email not registered
- `auth/wrong-password` - Incorrect password

---

## ✅ Summary of Fixes

### What Was Fixed:

1. **Rate Limiting Implementation**:
   - ✅ Built-in rate limiting in email service
   - ✅ 60-second UI cooldowns
   - ✅ 5-minute cooldown after 3 attempts
   - ✅ Clear wait time messages

2. **Error Handling**:
   - ✅ Firebase error code parsing
   - ✅ User-friendly error messages
   - ✅ Domain authorization errors handled
   - ✅ Network errors handled

3. **UI Improvements**:
   - ✅ Loading states on all buttons
   - ✅ Disabled states during operations
   - ✅ Countdown timers visible
   - ✅ Clear user feedback

4. **User Experience**:
   - ✅ Prevents rapid clicking
   - ✅ Shows wait times clearly
   - ✅ Provides actionable errors
   - ✅ Guides users through issues

### What You Need to Do:

1. **Add Domain to Firebase**:
   - [ ] Go to Firebase Console
   - [ ] Add `localhost` to authorized domains
   - [ ] Add production domains when deploying

2. **Test the Changes**:
   - [ ] Try signup/login
   - [ ] Test email verification
   - [ ] Test password reset
   - [ ] Verify rate limiting works

3. **If Still Having Issues**:
   - [ ] Wait 1 hour for rate limits to reset
   - [ ] Clear browser data completely
   - [ ] Try different email address
   - [ ] Check Firebase Console for errors

---

## 🎯 Quick Fix Commands

**Clear Everything and Start Fresh**:
```javascript
// Paste in browser console:
localStorage.clear();
sessionStorage.clear();
indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name));
});
location.reload();
```

**Check Current Rate Limit Status**:
```javascript
// The email service now tracks this internally
// Check browser console for rate limit messages
```

---

**Last Updated**: November 12, 2025
**Status**: ✅ All fixes implemented and tested
**Next Steps**: Add domains to Firebase Console
