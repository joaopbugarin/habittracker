# Habit Tracker

A simple habit tracking application built with Next.js and Firebase.

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase (Authentication, Firestore Database, Hosting)

## Getting Started

### Prerequisites:

- Node.js (LTS version)
- npm

### Installation:

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3000 in your browser

## Project Structure

```
src/
├── components/   # Reusable components
├── lib/          # Firebase and other configurations
├── pages/        # Next.js pages
├── types/        # TypeScript types
└── public/       # Static files
```

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run deploy` - Deploy to Firebase

## Environment Variables

Create a `.env.local` file with the following:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## Features

- User authentication
- Create, read, update, and delete habits
- Track daily/weekly habits
- More features to be added