# FoodShare - Food Donation Platform

A modern web application connecting food donors with NGOs to reduce food waste and fight hunger.

## 🎯 Features

### Core Features
- 👥 **User Management**: Separate roles for Donors and NGOs
- 🍲 **Donation System**: Create, browse, and claim food donations
- 📍 **Location-Based**: Find donations near you
- 📊 **Impact Tracking**: View your contribution statistics
- 🔔 **Real-time Updates**: Track donation status in real-time

### Email System ✨ NEW
- ✅ **Email Verification**: Automatic verification emails on signup
- ✅ **Password Reset**: Secure password recovery via email
- ✅ **Email Notifications**: Ready for donation updates, claims, and more
- ✅ **Professional Templates**: Beautiful HTML email designs
- ✅ **Verification Banner**: Smart UI for unverified users

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ or Bun
- Firebase account
- (Optional) SendGrid account for transactional emails

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd college-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📧 Email Configuration

The project includes a complete email system with authentication and notification capabilities.

### What's Working Now
- ✅ Email verification (automatic on signup)
- ✅ Password reset emails
- ✅ Email verification banner UI
- ✅ Real-time verification status

### Setup Transactional Emails (Optional)
For donation notifications and alerts, see:
- 📖 [Email Quick Start Guide](EMAIL_QUICK_START.md)
- 📚 [Full Email Documentation](EMAIL_CONFIGURATION_DOCS.md)
- 💻 [Backend Examples](backend-email-example.js)

**Quick Setup (5 minutes):**
1. Sign up for SendGrid (free tier)
2. Get API key
3. Create simple Express backend
4. Update one line in `emailService.ts`
5. Done! All notifications will work automatically

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── EmailVerificationBanner.tsx
│   ├── EmailSettings.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication with email verification
│   └── ...
├── services/           # Business logic
│   ├── emailService.ts        # Email sending service
│   ├── firebaseService.ts     # Firebase operations
│   └── firestore.ts           # Firestore queries
├── utils/              # Utility functions
│   ├── emailTemplates.ts      # Professional email templates
│   └── ...
├── pages/              # Page components
│   ├── donor/          # Donor-specific pages
│   ├── ngo/            # NGO-specific pages
│   └── ...
└── types/              # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Firebase Auth (with email verification)
- **Database**: Cloud Firestore
- **Email**: Firebase Auth + SendGrid (optional)
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6

## 📚 Documentation

- [Backend Integration](BACKEND_INTEGRATION_DOCS.md)
- [Profile Page Documentation](PROFILE_PAGE_DOCUMENTATION.md)
- [Email Configuration](EMAIL_CONFIGURATION_DOCS.md) ✨ NEW
- [Email Quick Start](EMAIL_QUICK_START.md) ✨ NEW

## 🎨 Key Features Explained

### For Donors
1. Create donation listings with details (food type, quantity, expiry)
2. Receive email notifications when NGOs claim donations
3. Track donation status and impact
4. View statistics and contribution history

### For NGOs
1. Browse available donations in your area
2. Claim donations that match your needs
3. Get notified about new donations
4. Track meals received and impact metrics

### Email Features
- **Automatic Verification**: Users get verification email on signup
- **Smart Banner**: Shows reminder to verify email (dismissible)
- **One-Click Verification**: Users can check verification status instantly
- **Password Recovery**: Secure password reset via email
- **Ready for Notifications**: Full system ready for donation alerts

## 🔐 Security Features

- Firebase Authentication with email verification
- Protected routes based on user roles
- Secure password reset links (1-hour expiry)
- Input validation and sanitization
- Firestore security rules

## 🧪 Testing

### Test Accounts
Use Firebase Console to create test accounts or sign up through the app.

### Email Testing
1. Sign up with a real email
2. Check inbox for verification email
3. Click verification link
4. Return to app and click "I Verified"

### Password Reset Testing
1. Go to login page
2. Click "Forgot password?"
3. Enter email
4. Check inbox for reset link

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers

## 🚧 Future Enhancements

- [ ] SMS notifications
- [ ] Push notifications (PWA)
- [ ] Advanced analytics dashboard
- [ ] Rating and review system
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 📄 License

This project is part of a college project and is available for educational purposes.

## 🤝 Contributing

This is a college project. For suggestions or issues, please contact the development team.

## 📞 Support

For help with:
- **Email Setup**: See [EMAIL_QUICK_START.md](EMAIL_QUICK_START.md)
- **Backend Integration**: See [BACKEND_INTEGRATION_DOCS.md](BACKEND_INTEGRATION_DOCS.md)
- **General Issues**: Check browser console and Firebase logs

---

**Built with ❤️ to fight food waste and hunger**
