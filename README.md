# Linkium

A modern link-in-bio tool that helps you organize, manage, and share all your important links with a single, shareable URL. Built with Next.js 16 and MongoDB.

## Features

- **Custom Handles** — Claim your unique username and get a personalized link page at `/yourhandle`
- **Unlimited Links** — Add as many links as you need with custom titles
- **User Authentication** — Secure signup, login, and password reset functionality
- **Link Management** — Add and delete links from your dashboard
- **Responsive Design** — Works on all devices

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.0.3 |
| MongoDB | 7.0.0 |
| Tailwind CSS | 4.0 |
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

   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
linkium/
├── app/
│   ├── [handle]/          # Dynamic user profile pages
│   ├── about/             # About page
│   ├── api/
│   │   ├── links/         # Links CRUD API
│   │   ├── login/         # Authentication API
│   │   ├── reset-password/# Password reset API
│   │   └── users/         # User registration API
│   ├── generate/          # Link tree builder page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── ForgotPassword.js  # Password reset component
│   └── Navbar.js          # Navigation component
├── lib/
│   └── mongodb.js         # MongoDB connection helper
└── public/                # Static assets
```

## Usage

1. Sign up with your email
2. Claim a unique handle for your profile URL
3. Add links with titles
4. Share your `/yourhandle` URL

## Security Note

Password reset does not require email verification — anyone with access to an email address can reset that account's password.
