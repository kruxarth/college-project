# Email Configuration Testing Checklist

Use this checklist to verify that all email features are working correctly.

## ✅ Pre-Testing Setup

- [ ] Project is running (`npm run dev` or `bun dev`)
- [ ] Firebase Auth is configured in `.env`
- [ ] Browser console is open for debugging
- [ ] You have access to a real email account for testing

---

## 🧪 Test 1: Email Verification on Signup

### Steps:
1. [ ] Go to `/signup` page
2. [ ] Fill in the signup form with a real email address
3. [ ] Choose role (Donor or NGO)
4. [ ] Click "Sign Up"

### Expected Results:
- [ ] Account created successfully
- [ ] Toast notification: "Account created successfully!"
- [ ] Second toast: "Please check your email to verify your account"
- [ ] Redirected to dashboard (`/donor/dashboard` or `/ngo/dashboard`)
- [ ] Yellow banner appears at top: "Verify your email to unlock all features"
- [ ] Email received in inbox (check spam if not in inbox)

### Verify Email Content:
- [ ] Email is from Firebase (noreply@[your-project].firebaseapp.com)
- [ ] Subject line is clear
- [ ] Verification link is present
- [ ] Link works when clicked

### Notes:
```
Email address used: ___________________
Time of signup: ___________________
Email received: Yes / No / Spam
Verification link worked: Yes / No
```

---

## 🧪 Test 2: Email Verification Banner

### Steps:
1. [ ] Log in with unverified account
2. [ ] Navigate to any authenticated page

### Expected Results:
- [ ] Yellow banner visible at top of page
- [ ] Banner shows message: "Verify your email to unlock all features"
- [ ] Three buttons visible:
  - [ ] "I Verified" button
  - [ ] "Resend Email" button  
  - [ ] "×" dismiss button
- [ ] Banner is sticky (stays at top when scrolling)

### Test Banner Interactions:
- [ ] Click "Resend Email"
  - [ ] Button shows "Sending..."
  - [ ] Toast: "Verification email sent! Please check your inbox"
  - [ ] New email received

- [ ] Click "I Verified" (before clicking email link)
  - [ ] Button shows "Checking..."
  - [ ] Toast: "Email not yet verified. Please check your inbox."

- [ ] Click verification link in email

- [ ] Return to app, click "I Verified" again
  - [ ] Toast: "Email verified successfully! 🎉"
  - [ ] Banner disappears

- [ ] Click "×" dismiss button
  - [ ] Banner disappears
  - [ ] Banner reappears on page refresh (if still unverified)

### Notes:
```
Banner displayed correctly: Yes / No
Resend button worked: Yes / No
Verification check worked: Yes / No
Banner disappeared after verification: Yes / No
```

---

## 🧪 Test 3: Password Reset

### Steps:
1. [ ] Go to `/login` page
2. [ ] Click "Forgot password?"
3. [ ] Enter your email address
4. [ ] Click "Send reset email"

### Expected Results:
- [ ] Toast: "Password reset email sent"
- [ ] Email received in inbox
- [ ] Email contains reset link
- [ ] Link expires in 1 hour (mentioned in email)

### Test Reset Process:
- [ ] Click reset link in email
- [ ] Taken to Firebase password reset page
- [ ] Enter new password
- [ ] Password requirements shown
- [ ] Click "Save" or "Reset Password"
- [ ] Redirected to login page
- [ ] Can log in with new password

### Notes:
```
Reset email received: Yes / No
Reset link worked: Yes / No
New password accepted: Yes / No
Login with new password: Yes / No
```

---

## 🧪 Test 4: Email Service (Console Logs)

### Steps:
1. [ ] Open browser console (F12)
2. [ ] Perform actions that trigger email notifications:
   - [ ] Create a donation
   - [ ] Claim a donation
   - [ ] Complete a donation

### Expected Results:
In console, you should see logs like:
```
📧 Email Notification (Mock): {
  to: "user@example.com",
  subject: "...",
  type: "...",
  timestamp: "..."
}
```

### Verify Console Logs for:
- [ ] Donation created notification
- [ ] Donation claimed notification
- [ ] Donation completed notification
- [ ] Each log includes correct email address
- [ ] Each log includes correct subject
- [ ] Each log includes correct type

### Notes:
```
Console logs appearing: Yes / No
Correct email triggers: Yes / No
All notification types working: Yes / No
```

---

## 🧪 Test 5: Authentication Context Integration

### Steps:
Open browser console and test the AuthContext methods:

```javascript
// In browser console:

// Get auth context (after logging in)
// Check if email is verified
window.auth = { /* your auth object */ }

// Method 1: Check verification status
console.log('Email verified:', /* check isEmailVerified state */)

// Method 2: Trigger verification email
// await sendVerificationEmail()

// Method 3: Check verification status
// await checkEmailVerification()
```

### Expected Results:
- [ ] `isEmailVerified` returns correct boolean
- [ ] Methods are accessible from context
- [ ] No console errors when calling methods

### Notes:
```
Context methods accessible: Yes / No
Verification state correct: Yes / No
```

---

## 🧪 Test 6: Email Settings Page (Optional)

If you've added the EmailSettings component to a page:

### Steps:
1. [ ] Navigate to profile or settings page
2. [ ] Import and render `<EmailSettings />` component

### Expected Results:
- [ ] Verification status card displays
- [ ] Shows current email address
- [ ] Verification status is accurate (verified/unverified)
- [ ] Preference toggles work
- [ ] Toast notifications show on toggle changes
- [ ] UI is responsive

### Notes:
```
Settings page renders: Yes / No
All controls functional: Yes / No
```

---

## 🧪 Test 7: Different Scenarios

### Scenario A: New User Journey
1. [ ] Sign up with new email
2. [ ] Don't verify email
3. [ ] Log out
4. [ ] Log back in
5. [ ] Banner should still show

### Scenario B: Verified User
1. [ ] Sign up and verify email immediately
2. [ ] Log out and log back in
3. [ ] Banner should NOT show

### Scenario C: Multiple Devices
1. [ ] Sign up on Device A
2. [ ] Verify email using link on Device B
3. [ ] Return to Device A
4. [ ] Click "I Verified"
5. [ ] Banner should disappear

### Scenario D: Expired Links
1. [ ] Request password reset
2. [ ] Wait 1+ hour (or test with old email)
3. [ ] Try to use expired link
4. [ ] Should show error message

### Notes:
```
Scenario A passed: Yes / No
Scenario B passed: Yes / No
Scenario C passed: Yes / No
Scenario D passed: Yes / No
```

---

## 🧪 Test 8: Error Handling

### Test Error Cases:
1. [ ] Try to send verification email while not logged in
   - Should show error message

2. [ ] Try to reset password with invalid email
   - Should show "Invalid email format" or similar

3. [ ] Try to reset password with non-existent email
   - Should show success (for security, don't reveal non-existent accounts)

4. [ ] Disconnect internet and try to send email
   - Should show network error

### Expected Results:
- [ ] All errors handled gracefully
- [ ] Clear error messages displayed
- [ ] No app crashes
- [ ] User can recover from errors

### Notes:
```
Error messages clear: Yes / No
No crashes occurred: Yes / No
User can retry: Yes / No
```

---

## 🧪 Test 9: UI/UX Testing

### Visual Tests:
- [ ] Banner looks good on desktop
- [ ] Banner looks good on mobile
- [ ] Banner looks good on tablet
- [ ] All buttons are clickable
- [ ] Text is readable
- [ ] Colors match app theme
- [ ] Animations are smooth

### Accessibility Tests:
- [ ] Can navigate with keyboard only
- [ ] Focus indicators visible
- [ ] Screen reader compatible (if tested)
- [ ] Color contrast is sufficient

### Notes:
```
Desktop appearance: Good / Needs work
Mobile appearance: Good / Needs work
Accessibility: Good / Needs work
```

---

## 🧪 Test 10: Performance

### Check Performance:
1. [ ] Open DevTools → Network tab
2. [ ] Perform email operations
3. [ ] Check:
   - [ ] No unnecessary API calls
   - [ ] Quick response times
   - [ ] No memory leaks
   - [ ] Smooth animations

### Notes:
```
API calls efficient: Yes / No
Performance acceptable: Yes / No
```

---

## 📊 Test Results Summary

### Overall Results:
- Tests Passed: ____ / 10
- Critical Issues: ____
- Minor Issues: ____
- Suggestions: ____

### Critical Issues Found:
```
1. 
2. 
3. 
```

### Minor Issues Found:
```
1. 
2. 
3. 
```

### Suggestions for Improvement:
```
1. 
2. 
3. 
```

---

## 🎯 Sign-Off

### Tested By:
- Name: ___________________
- Date: ___________________
- Environment: Production / Staging / Development

### Approval:
- [ ] All critical tests passed
- [ ] All features working as expected
- [ ] Ready for production use
- [ ] Documentation is accurate

### Notes:
```
Additional comments:



```

---

## 🚀 Next Steps After Testing

### If Tests Pass:
1. [ ] Update README with test results
2. [ ] Document any workarounds needed
3. [ ] Set up backend for transactional emails (optional)
4. [ ] Deploy to production
5. [ ] Monitor email delivery rates

### If Tests Fail:
1. [ ] Document all failures
2. [ ] Check Firebase console for errors
3. [ ] Review browser console logs
4. [ ] Check environment variables
5. [ ] Verify internet connection
6. [ ] Re-test after fixes

---

## 📞 Troubleshooting

### Common Issues:

**Issue**: Verification email not received
- Check spam/junk folder
- Verify email address is correct
- Check Firebase console for errors
- Try with different email provider

**Issue**: Banner not showing
- Check if user is logged in
- Verify email is actually unverified
- Check browser console for errors
- Hard refresh (Ctrl+F5)

**Issue**: "I Verified" button not working
- Make sure you clicked link in email first
- Try logging out and back in
- Check internet connection
- Verify Firebase Auth is working

**Issue**: Password reset not working
- Check email address is registered
- Look in spam folder
- Try different browser
- Check Firebase console

---

## ✅ Quick Checklist

For a quick verification, check these essential items:

- [ ] Can sign up successfully
- [ ] Verification email is received
- [ ] Banner shows for unverified users
- [ ] Banner disappears after verification
- [ ] Password reset works
- [ ] No console errors
- [ ] UI looks professional
- [ ] Mobile responsive

**If all checked, email system is working!** ✨

---

*Use this checklist each time you update the email system*
*Keep this file updated with any new test cases*
