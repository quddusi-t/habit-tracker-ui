# Habit Tracker UI

A beautifully designed React frontend for the Habit Tracker application. Track your daily habits with timer-based or manual completion tracking, maintain streaks, and monitor your progress.

Built with React 19, connects to the [Habit Tracker FastAPI Backend](https://github.com/your-username/habit-tracker).

## Features

✅ **Complete Authentication**
- User registration and login
- OAuth2 Bearer token authentication
- Secure session management

✅ **Habit Management**
- Create, edit, delete habits with customizable settings
- View all habits in a responsive dashboard
- Support for both timer-based and manual tracking
- Manual time override for timer habits (hours:minutes picker)

✅ **Timer & Tracking**
- Real-time session timer for timer-based habits
- One-click completion for manual habits
- Automatic session logging to backend
- Live elapsed time display
- Manual time entry with notes (for timer habits)

✅ **Streak & Freeze System**
- Automatic streak tracking (increments daily on completion)
- Per-habit freeze system: 2 freezes per habit
- Auto-freeze consumption when skipping days (max 2 day skip)
- Freeze earning: +1 at 7-day streak, +1 at 14-day streak (max 2)
- Visual freeze counter on each card

✅ **Smart Status & Colors**
- Dynamic 4-color coded cards (green/yellow/orange/red)
- Color progression shows time urgency during the day
- Completed habits show green regardless of time
- Separate freeze counter badge (❄️ X freezes) shows actionable danger signal
- Real-time status updates after every action

✅ **Account Management**
- Account Settings page with email display
- Change password with strength indicator
- Delete account with double-confirmation
- Settings navigation in app header

## Quick Start

### Prerequisites
- Node.js 16+ and npm  
- Backend running on http://127.0.0.1:8000

### Installation

```bash
npm install
npm start
```

The app opens at http://localhost:3000

## Usage

### 1. Sign Up
- Click "Sign up" on the login page
- Enter email and password

### 2. Create a Habit
- Click "+ New Habit" button
- Choose tracking type: Timer or Manual completion
- Click "Create Habit"

### 3. Track Your Habits
- Click START/STOP for timers, or Mark Complete for manual habits
- Watch your streak grow! 🔥

## Project Structure

See [QUICK_START.md](./QUICK_START.md) for detailed project structure and [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for API documentation.

## Available Scripts

```bash
npm start      # Start development server (port 3000)
npm build      # Build for production
npm test       # Run tests
```

## Configuration

Create a `.env` file (optional):

```
REACT_APP_API_URL=http://127.0.0.1:8000
```

## Built With

- React 19
- Create React App
- Fetch API
- Context API for state management

## Related Projects

- [Habit Tracker Backend](https://github.com/your-username/habit-tracker) - FastAPI backend

## License

MIT
