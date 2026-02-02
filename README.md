# Linkium

A modern link-in-bio tool that helps you organize, manage, and share all your important links with a single, shareable URL. Built with Next.js 16 and MongoDB.

## Features

- **Custom Handles** — Claim your unique username and get a personalized link page at `/yourhandle`
- **Unlimited Links** — Add as many links as you need with custom titles
- **JWT Authentication** — Secure signup and login with JWT tokens (1-day expiry)
- **Password Security** — Passwords are hashed with bcrypt before storage
- **Email Password Reset** — Forgot password flow with 6-digit OTP sent via email (SMTP)
- **Protected API Routes** — API endpoints require valid JWT tokens for authenticated operations
- **Link Management** — Add and delete links from your dashboard
- **Responsive Design** — Works on all devices

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.0.10 |
| MongoDB | 7.0.0 |
| Tailwind CSS | 4.0 |
| jsonwebtoken | 9.0.3 |
| bcryptjs | 3.0.3 |
| nodemailer | 7.0.13 |
| AWS EC2 | - |

Database is deployed on AWS EC2.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/linkium.git
   cd linkium
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key-for-jwt-tokens
   
   # SMTP settings for password reset emails (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your.email@gmail.com
   SMTP_PASS=your-gmail-app-password
   SMTP_FROM_EMAIL="Linkium <your.email@gmail.com>"
   ```

   **Note:** For Gmail, you need to:
   - Enable 2-Step Verification on your Google account
   - Create an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Use that 16-character App Password as `SMTP_PASS` (not your regular Gmail password)

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)


## Authentication

The application uses **JWT (JSON Web Tokens)** for authentication:

- **Signup**: Passwords are hashed with bcrypt before storage
- **Login**: Returns a JWT token (stored in localStorage) with 1-day expiry
- **Protected Routes**: API endpoints verify JWT tokens from the `Authorization: Bearer <token>` header
- **Password Reset**: Two-step OTP flow:
  1. User requests a 6-digit code via email
  2. User enters code + new password to reset

**Token Storage**: JWT tokens are stored in `localStorage` as `linkium_token`. The user email is stored separately as `linkium_user` for display purposes.

## Usage

1. Sign up with your email and password
2. Log in to receive a JWT token
3. Claim a unique handle for your profile URL
4. Add links with titles (requires authentication)
5. Share your `/yourhandle` URL (public, no auth needed)
