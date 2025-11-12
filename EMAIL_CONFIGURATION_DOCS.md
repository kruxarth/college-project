# Email Configuration Documentation

## 📧 Overview

This document describes the email notification system implemented in the FoodShare platform. The system handles authentication emails (via Firebase) and transactional notifications for donations, claims, and user actions.

---

## 🎯 Features Implemented

### 1. **Authentication Emails (Fully Functional)**
- ✅ **Email Verification**: Sent automatically on signup
- ✅ **Password Reset**: Sent when user requests password reset
- ✅ **Email Verification Status**: Real-time tracking and re-verification

### 2. **Transactional Notifications (Structured, Requires Backend)**
- 📋 **Donation Created**: Notify donor when donation is listed
- 📋 **Donation Claimed**: Notify donor when NGO claims their donation
- 📋 **New Donation Available**: Notify NGOs about nearby donations
- 📋 **Donation Completed**: Notify both parties on completion
- 📋 **Donation Cancelled**: Notify relevant parties
- 📋 **NGO Verification**: Notify NGO when account is verified
- 📋 **Welcome Email**: Sent to new users after signup

---

## 🏗️ Architecture

### File Structure
```
src/
├── services/
│   └── emailService.ts          # Core email service with all methods
├── utils/
│   └── emailTemplates.ts        # HTML/text email templates
├── contexts/
│   └── AuthContext.tsx          # Integrated email verification
└── components/
    ├── EmailVerificationBanner.tsx   # Banner for unverified users
    └── AuthenticatedLayout.tsx       # Layout wrapper with banner
```

---

## 🔧 Current Implementation

### EmailService Class (`src/services/emailService.ts`)

#### Working Methods (Firebase Auth):

1. **sendPasswordReset(email: string)**
   ```typescript
   const result = await emailService.sendPasswordReset('user@example.com');
   if (result.success) {
     // Email sent successfully
   }
   ```

2. **sendVerificationEmail()**
   ```typescript
   const result = await emailService.sendVerificationEmail();
   // Sends to currently authenticated user
   ```

3. **isEmailVerified()**
   ```typescript
   const verified = emailService.isEmailVerified();
   ```

4. **refreshEmailVerificationStatus()**
   ```typescript
   const verified = await emailService.refreshEmailVerificationStatus();
   ```

#### Notification Methods (Ready for Backend Integration):

These methods are structured and ready to use, but currently log to console in development:

```typescript
// Donation notifications
await emailService.notifyDonationCreated(email, name, title);
await emailService.notifyDonationClaimed(email, name, title, ngoName, pickupTime);
await emailService.notifyNewDonationAvailable(email, name, title, category, distance);
await emailService.notifyDonationCompleted(email, name, title, isNGO);
await emailService.notifyDonationCancelled(email, name, title, reason);

// Account notifications
await emailService.notifyNGOVerified(email, name);
await emailService.sendCustomEmail(email, subject, body);
```

---

## 📝 Email Templates

Professional HTML/text email templates are available in `src/utils/emailTemplates.ts`:

- `welcome()` - Welcome new users
- `verifyEmail()` - Email verification request
- `donationCreated()` - Donation listing confirmation
- `donationClaimed()` - Notify donor of claim
- `newDonationAvailable()` - Notify NGOs of new donations
- `donationCompleted()` - Success notification
- `passwordReset()` - Password reset link
- `ngoVerified()` - NGO verification approval

Each template includes:
- Branded HTML with responsive design
- Plain text fallback
- Professional styling with inline CSS
- Action buttons and highlights
- Footer with legal information

---

## 🚀 How to Enable Full Email Notifications

### Option 1: Firebase Extensions (Recommended for Quick Setup)

1. **Install Trigger Email Extension**:
   ```bash
   firebase ext:install firebase/firestore-send-email
   ```

2. **Configure the extension**:
   - Set up SendGrid, Mailgun, or custom SMTP
   - Configure from/reply-to addresses
   - Set up email templates

3. **Update `emailService.ts`**:
   ```typescript
   async sendNotificationEmail(data: EmailNotificationData) {
     // Write to Firestore collection that triggers the extension
     await addDoc(collection(db, 'mail'), {
       to: data.to,
       message: {
         subject: data.subject,
         html: data.body,
       },
     });
     return { success: true };
   }
   ```

### Option 2: Backend API with SendGrid

1. **Install SendGrid**:
   ```bash
   npm install @sendgrid/mail
   ```

2. **Create Backend API Endpoint** (Node.js/Express example):
   ```typescript
   // backend/api/send-email.ts
   import sgMail from '@sendgrid/mail';
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   export default async function handler(req, res) {
     const { to, subject, html, text } = req.body;
     
     try {
       await sgMail.send({
         to,
         from: 'noreply@foodshare.com', // Your verified sender
         subject,
         text,
         html,
       });
       
       res.status(200).json({ success: true });
     } catch (error) {
       res.status(500).json({ success: false, error: error.message });
     }
   }
   ```

3. **Update Frontend `emailService.ts`**:
   ```typescript
   async sendNotificationEmail(data: EmailNotificationData) {
     const response = await fetch('/api/send-email', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         to: data.to,
         subject: data.subject,
         html: emailTemplates[data.type](...args).html,
         text: emailTemplates[data.type](...args).text,
       }),
     });
     
     return await response.json();
   }
   ```

### Option 3: AWS SES (Cost-Effective)

1. **Install AWS SDK**:
   ```bash
   npm install @aws-sdk/client-ses
   ```

2. **Create Backend Handler**:
   ```typescript
   import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
   
   const client = new SESClient({ region: 'us-east-1' });
   
   export async function sendEmail(to, subject, html, text) {
     const command = new SendEmailCommand({
       Source: 'noreply@foodshare.com',
       Destination: { ToAddresses: [to] },
       Message: {
         Subject: { Data: subject },
         Body: {
           Html: { Data: html },
           Text: { Data: text },
         },
       },
     });
     
     return await client.send(command);
   }
   ```

---

## 🔐 Environment Variables

Add these to your `.env` file:

```env
# Firebase Auth (Already configured)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...

# Email Service (Choose one)
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# OR AWS SES
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1

# OR Mailgun
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=mg.yourdomain.com

# Email Configuration
EMAIL_FROM=noreply@foodshare.com
EMAIL_REPLY_TO=support@foodshare.com
```

---

## 📊 Email Tracking & Analytics

To add email tracking:

1. **Open Tracking**:
   ```typescript
   // Add tracking pixel to HTML templates
   const trackingPixel = `<img src="${API_URL}/track/open/${emailId}" width="1" height="1" />`;
   ```

2. **Click Tracking**:
   ```typescript
   // Wrap links with tracking redirects
   const trackedLink = `${API_URL}/track/click/${emailId}?url=${encodeURIComponent(originalUrl)}`;
   ```

3. **Store Analytics**:
   ```typescript
   // In Firestore
   await addDoc(collection(db, 'email_analytics'), {
     emailId,
     type: 'open' | 'click',
     timestamp: serverTimestamp(),
     userId,
   });
   ```

---

## 🎨 UI Components

### EmailVerificationBanner
Shows at the top of authenticated pages when email is not verified:
- **Resend Email** button
- **I Verified** button to check status
- **Dismiss** option
- Auto-hides when verified

### Usage in AuthContext
```typescript
const { 
  isEmailVerified,           // Boolean status
  sendVerificationEmail,     // Resend verification
  checkEmailVerification,    // Refresh status
} = useAuth();
```

---

## 🧪 Testing Email Configuration

### Development Mode
Emails are logged to console:
```typescript
console.log('📧 Email Notification (Mock):', {
  to: 'user@example.com',
  subject: 'Test Email',
  type: 'donation_created',
});
```

### Testing with Real Emails

1. **Use Email Testing Service** (Recommended):
   - [Mailtrap.io](https://mailtrap.io) - Free inbox for testing
   - [Ethereal Email](https://ethereal.email) - Free test SMTP

2. **Test Each Email Type**:
   ```typescript
   // In browser console or test file
   await emailService.notifyDonationCreated(
     'test@example.com',
     'Test User',
     'Test Donation'
   );
   ```

3. **Verify Email Templates**:
   - Check HTML rendering
   - Test responsive design
   - Verify links work
   - Test plain text version

---

## 🔄 Integration Points

### When to Send Emails

1. **User Registration** (`SignUp.tsx`):
   ```typescript
   // Already integrated
   await emailService.sendVerificationEmail();
   ```

2. **Donation Created** (`CreateDonation.tsx`):
   ```typescript
   await emailService.notifyDonationCreated(
     donor.email,
     donor.fullName,
     donation.title
   );
   ```

3. **Donation Claimed** (`firebaseService.ts` - claimDonation):
   ```typescript
   await emailService.notifyDonationClaimed(
     donor.email,
     donor.fullName,
     donation.title,
     ngo.organizationName,
     pickupTime,
   );
   
   await emailService.notifyNewDonationAvailable(
     ngo.email,
     ngo.organizationName,
     donation.title,
     donation.category,
     distance,
   );
   ```

4. **Donation Completed** (`firebaseService.ts` - updateDonationStatus):
   ```typescript
   if (newStatus === 'completed') {
     await emailService.notifyDonationCompleted(
       user.email,
       user.fullName,
       donation.title,
       isNGO,
     );
   }
   ```

---

## 📈 Future Enhancements

### Planned Features
- [ ] Email preferences/settings page
- [ ] Digest emails (daily/weekly summaries)
- [ ] Email unsubscribe functionality
- [ ] Rich notifications with images
- [ ] Calendar invites for pickups
- [ ] SMS notifications integration
- [ ] Push notifications (PWA)
- [ ] Multi-language email templates

### Advanced Features
- [ ] A/B testing email templates
- [ ] Personalized recommendations
- [ ] Email campaigns for NGOs
- [ ] Automated reminders
- [ ] Review/rating request emails

---

## 🐛 Troubleshooting

### Email Verification Not Working
1. Check Firebase Auth settings
2. Verify email/password sign-in is enabled
3. Check spam/junk folders
4. Ensure domain is verified (production)

### Transactional Emails Not Sending
1. Verify backend API is running
2. Check API keys are valid
3. Review email service logs
4. Verify sender email is verified
5. Check rate limits

### Template Rendering Issues
1. Test HTML in email client preview tools
2. Use inline CSS (external styles don't work in emails)
3. Test in multiple email clients
4. Validate HTML markup

---

## 📞 Support

For issues or questions:
1. Check Firebase Auth console
2. Review browser console logs
3. Check email service provider dashboard
4. Review this documentation

---

## ✅ Quick Start Checklist

- [x] Email service created with all methods
- [x] Email templates designed and styled
- [x] Firebase Auth emails working (verification & reset)
- [x] Email verification banner added
- [x] AuthContext integrated with email service
- [x] UI components created
- [ ] Backend API endpoint setup (choose provider)
- [ ] Environment variables configured
- [ ] Sender email verified with provider
- [ ] Production testing completed

---

**Note**: The current implementation has Firebase Auth emails fully functional. Transactional notifications are structured and ready but require backend setup with your chosen email provider (SendGrid, AWS SES, Mailgun, etc.).
