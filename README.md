# Habit Tracker UI

A beautifully designed React frontend for the Habit Tracker application. Track your daily habits with timer-based or manual completion tracking, maintain streaks, and monitor your progress.

Built with React 19, connects to the [Habit Tracker FastAPI Backend](https://github.com/your-username/habit-tracker).

## Features

✅ **Complete Authentication**
- User registration and login
- OAuth2 Bearer token authentication
- Secure session management

✅ **Habit Management**
- Create habits with customizable settings
- View all habits in a responsive dashboard
- Support for both timer-based and manual tracking

✅ **Timer & Tracking**
- Real-time session timer for timer-based habits
- One-click completion for manual habits
- Automatic session logging to backend
- Live elapsed time display

✅ **Beautiful UI**
- Modern gradient design with purple/violet theme
- Responsive grid layout
- Real-time feedback and error handling
- Smooth animations and transitions

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
