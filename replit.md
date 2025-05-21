# Elothna - Voice-based Self-Reflection Application

## Overview

Elothna is a voice-based self-reflection application that allows users to speak their thoughts and receive AI-guided reflections and actionable suggestions. The application uses speech recognition to capture user input, processes it to detect emotional tone, and generates contextual responses and micro-actions to help users progress in their self-reflection journey.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks for local state, React Query for server state
- **Routing**: Wouter for lightweight client-side routing

### Backend
- **Server**: Express.js with TypeScript
- **API**: RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe schema definitions
- **Session Management**: Support for storing user reflection sessions

### Features
- Voice-based input via browser's Speech Recognition API
- Emotion detection from text
- AI-generated reflections and action suggestions
- Session history with timestamp and emotional tone tracking
- Dark/light theme support

## Key Components

### Client (Frontend)

1. **Core Components**
   - `App.tsx`: Main application component with routing setup
   - `ThemeProvider`: Manages application-wide dark/light theme
   - `SessionView`: Handles recording, processing, and displaying reflection sessions
   - `MobiusCircle`: Visual element representing the listening/processing state
   - `HistoryView`: Displays past reflection sessions
   - `OnboardingCarousel`: First-time user experience explaining the application

2. **Utility Libraries**
   - `speech-recognition.ts`: Wrapper for browser's Speech Recognition API
   - `emotion-detector.ts`: Text analysis to determine emotional tone
   - `ai-responses.ts`: Generates contextual responses based on input and emotion

3. **UI Component Library**
   - Comprehensive set of UI components from shadcn/ui (buttons, cards, toasts, etc.)
   - Custom components for specific application needs

### Server (Backend)

1. **API Routes**
   - `/api/sessions`: Endpoints for creating and retrieving reflection sessions

2. **Storage**
   - Interface for database operations
   - Current implementation using in-memory storage with hooks for database integration

3. **Schema**
   - User model with authentication support
   - Session model for storing reflection data, AI responses, and metadata

## Data Flow

1. **Session Creation**
   - User speaks into the microphone
   - Speech is converted to text via the browser's Speech Recognition API
   - Text is analyzed for emotional tone
   - AI generates contextual reflection and action suggestion
   - Complete session is saved to the database

2. **Session Retrieval**
   - Sessions are fetched from the database
   - Displayed in a chronological timeline in the history view
   - Grouped by emotional tone for analysis

## External Dependencies

### Frontend Libraries
- React and React DOM
- Tailwind CSS for styling
- shadcn/ui components (built on Radix UI primitives)
- React Query for data fetching
- Wouter for routing

### Backend Libraries
- Express for the server
- Drizzle ORM for database operations
- Zod for validation

### Database
- PostgreSQL (configured for development and production)
- Drizzle for schema management and queries

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development Mode**
   - Run with `npm run dev`
   - Serves both frontend and backend from the same process
   - Vite handles hot module replacement for the frontend

2. **Production Build**
   - Frontend: Built with Vite to static assets in `dist/public`
   - Backend: Bundled with esbuild to `dist/index.js`
   - Run with `npm run start`

3. **Database**
   - Uses PostgreSQL module in Replit
   - Schema managed via Drizzle ORM
   - Migration commands available through `npm run db:push`

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Ensure PostgreSQL module is added in your Replit
4. Set up environment variables:
   - `DATABASE_URL`: Connection string for PostgreSQL
5. Run `npm run db:push` to set up the database schema
6. Run `npm run dev` to start the development server

## Implementation Notes

- The application uses browser-based Speech Recognition API, which may have varying support across browsers. Chrome offers the best compatibility.
- Emotion detection and AI responses are currently simulated with pre-defined templates, but could be connected to real AI services.
- The application follows a responsive design that works well on both desktop and mobile devices.
- Local storage is used to track onboarding state and persist theme preferences.