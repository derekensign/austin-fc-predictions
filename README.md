# Austin FC Predictions App

An interactive web app for Austin FC fans to submit predictions on over/under questions and view live results.

## Features

- **User Predictions**: Submit name, email, and answers to over/under questions
- **Live Results**: Real-time polling (3-second intervals) showing percentage splits
- **Admin Dashboard**: View all submissions, calculate scores, identify winners
- **CSV Export**: Download all results for sharing
- **Austin FC Branding**: Verde green (#00b140), black, and white color scheme

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL
- **Authentication**: bcrypt password hashing
- **Animation**: Framer Motion

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a free Neon PostgreSQL database at https://neon.tech and run `sql/schema.sql`

### 3. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and ADMIN_PASSWORD_HASH
```

### 4. Import Questions

POST your questions JSON to `/api/seed` (see format in README)

### 5. Run Development Server

```bash
nvm use 20.20.0  # If using nvm
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local` with:

```bash
DATABASE_URL=postgresql://user:password@host/database
ADMIN_PASSWORD_HASH=<bcrypt hash>
NODE_ENV=development
```

Generate admin password hash:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password', 10).then(console.log);"
```

## Usage

- **Users**: Submit predictions at `/`
- **Results**: View live results at `/results`
- **Admin**: Login at `/admin/login`

## Deployment

1. Push to GitHub
2. Import in Vercel
3. Add Neon PostgreSQL integration
4. Set environment variables
5. Deploy

Built with ❤️ for Austin FC fans
