/**
 * Example Backend API for Email Notifications
 * 
 * This is a reference implementation showing how to integrate email sending
 * with your backend. Choose one of the options below based on your stack.
 */

// ============================================================================
// OPTION 1: Node.js + Express + SendGrid
// ============================================================================

/*
Installation:
npm install express @sendgrid/mail cors dotenv

Environment variables (.env):
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@foodshare.com
PORT=3001
*/

// backend/server.js
import express from 'express';
import sgMail from '@sendgrid/mail';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text, type } = req.body;

    // Validate request
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, and html or text',
      });
    }

    // Prepare email
    const msg = {
      to,
      from: {
        email: process.env.EMAIL_FROM,
        name: 'FoodShare',
      },
      replyTo: 'support@foodshare.com',
      subject,
      text: text || 'Please enable HTML to view this email.',
      html: html || `<p>${text}</p>`,
      categories: [type || 'notification'], // For analytics
    };

    // Send email
    await sgMail.send(msg);

    console.log(`✅ Email sent to ${to}: ${subject}`);

    res.json({
      success: true,
      message: 'Email sent successfully',
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
    });
  }
});

// Batch email endpoint (for sending to multiple recipients)
app.post('/api/send-batch-emails', async (req, res) => {
  try {
    const { emails } = req.body; // Array of email objects

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'emails must be a non-empty array',
      });
    }

    const messages = emails.map(email => ({
      to: email.to,
      from: process.env.EMAIL_FROM,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }));

    await sgMail.send(messages);

    res.json({
      success: true,
      count: messages.length,
    });

  } catch (error) {
    console.error('❌ Batch email error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'email-api' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📧 Email API running on http://localhost:${PORT}`);
});

// ============================================================================
// OPTION 2: Serverless Function (Vercel/Netlify)
// ============================================================================

// api/send-email.js (Vercel)
// or netlify/functions/send-email.js (Netlify)
/*
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, text } = req.body;

    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
*/

// ============================================================================
// OPTION 3: Firebase Cloud Functions
// ============================================================================

/*
Installation:
firebase init functions
cd functions
npm install @sendgrid/mail

functions/index.js:
*/

import * as functions from 'firebase-functions';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(functions.config().sendgrid.key);

export const sendEmail = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be logged in to send emails'
    );
  }

  const { to, subject, html, text } = data;

  try {
    await sgMail.send({
      to,
      from: 'noreply@foodshare.com',
      subject,
      text,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Firestore trigger for automatic emails
export const onDonationCreated = functions.firestore
  .document('donations/{donationId}')
  .onCreate(async (snap, context) => {
    const donation = snap.data();
    const donor = await admin.firestore()
      .collection('users')
      .doc(donation.donorId)
      .get();

    if (!donor.exists) return;

    const donorData = donor.data();

    await sgMail.send({
      to: donorData.email,
      from: 'noreply@foodshare.com',
      subject: 'Your Donation Has Been Listed',
      html: `<p>Hi ${donorData.fullName},</p>
             <p>Your donation "${donation.title}" is now live!</p>`,
    });
  });

// ============================================================================
// OPTION 4: AWS SES (Lambda Function)
// ============================================================================

/*
Installation:
npm install @aws-sdk/client-ses

lambda/sendEmail.js:
*/

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  const { to, subject, html, text } = JSON.parse(event.body);

  const params = {
    Source: 'noreply@foodshare.com',
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
        Text: { Data: text },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

// ============================================================================
// FRONTEND INTEGRATION
// ============================================================================

// Update src/services/emailService.ts
/*
async sendNotificationEmail(data: EmailNotificationData) {
  try {
    // Choose your backend endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
      },
      body: JSON.stringify({
        to: data.to,
        subject: data.subject,
        html: data.body,
        text: data.body.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        type: data.type,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email notification error:', error);
    return { success: false, error: error.message };
  }
}
*/

// ============================================================================
// DEPLOYMENT NOTES
// ============================================================================

/*
1. SendGrid Setup:
   - Sign up at https://sendgrid.com
   - Create API key with "Mail Send" permission
   - Verify sender email/domain
   - Add API key to environment variables

2. Security:
   - Always validate requests on backend
   - Use authentication tokens
   - Rate limit email sending
   - Validate email addresses
   - Log all email attempts

3. Testing:
   - Use Mailtrap.io for development
   - Test with real emails in staging
   - Monitor delivery rates
   - Set up webhook for bounce/spam reports

4. Production Checklist:
   - [ ] Email provider account created
   - [ ] Sender domain verified
   - [ ] API keys secured in environment
   - [ ] Rate limiting implemented
   - [ ] Error monitoring setup
   - [ ] Bounce handling configured
   - [ ] Unsubscribe links added
   - [ ] SPF/DKIM/DMARC configured
*/

export {};
