# Backend Integration Guide

## Overview
The frontend is now fully integrated with the habit-tracker backend API. This document explains the setup and how to use it.

## API Integration Setup

### Files Created/Modified

#### 1. **`src/services/api.js`** - API Service Layer
- Centralized API calls for all backend endpoints
- Automatically handles authentication tokens (OAuth2)
- Exports services:
  - `authService` - Login, logout, authentication status
  - `userService` - User CRUD operations
  - `habitService` - Habit management (CRUD, complete, freeze, status)
  - `habitLogService` - Session logging (start, stop, get logs)

#### 2. **`src/context/AuthContext.jsx`** - Authentication Context
- Manages user authentication state
- Handles token storage in localStorage
- Provides login/logout and signup functions
- Reactive `isAuthenticated` state for route protection
- Automatic redirects on 401 errors

#### 2b. **`src/pages/LoginPage.jsx`** - Authentication Page
- User login and signup forms
- Toggle between login/signup modes
- Form validation and error display
- Automatic account creation on signup
- Beautiful gradient design matching the app theme

#### 3. **`src/App.js`** - Main App Component
- Wrapped with `AuthProvider` for authentication
- Shows LoginPage when not authenticated
- Fetches habits on component mount
- Displays habits in responsive grid layout
- Header with logout button and "+ New Habit" button
- Handles loading and error states

#### 4. **`src/HabitCard.jsx`** - Habit Card Component
- Accepts a `habit` object from the backend
- Supports two tracking modes based on `habit.is_timer`:
  - **Timer Mode** (is_timer: true):
    - START/STOP buttons for session tracking
    - Real-time elapsed time display
    - Session logging via POST /habit_logs/{id}/logs/start and PATCH /habit_logs/{id}/logs/{id}/stop
  - **Manual Mode** (is_timer: false):
    - "Mark Complete" button for daily completion
    - Completion via POST /habits/{id}/complete
    - Confirmation feedback
- Displays:
  - Habit name and description
  - Current streak count with fire badge
  - Creation date
  - Error messages for API failures
  - Loading states during API calls

#### 5. **`src/components/CreateHabitModal.jsx`** - Create Habit Modal
- Beautiful form modal for creating new habits
- Input fields:
  - Habit name (required)
  - Description (optional)
  - is_timer checkbox (track with timer)
  - allow_manual_override checkbox
  - is_freezable checkbox (allow streak freeze)
  - danger_start_pct slider (when to show warning)
- Triggers POST /habits/ on submit
- Form validation and error handling
- Auto-closes on successful creation
- Refreshes habit list after creation

#### 6. **CSS Files**
- `src/App.css` - Main app styling with gradient background, responsive grid
- `src/HabitCard.css` - Beautiful habit card styling with states (active, on-streak, completed)
- `src/pages/LoginPage.css` - Login page styling
- `src/components/CreateHabitModal.css` - Modal styling and form controls

#### 6. **Environment Configuration**
- `.env` - Frontend API configuration
- `.env.example` - Template for environment variables

## Backend API Reference

### Authentication Endpoints
- `POST /auth/login` - Login with credentials (returns access_token)
- `POST /users/` - Create new user

### Habit Endpoints
- `GET /habits/` - Get all habits
- `POST /habits/` - Create new habit
- `GET /habits/{id}` - Get specific habit
- `PATCH /habits/{id}` - Update habit
- `DELETE /habits/{id}` - Delete habit
- `POST /habits/{id}/complete` - Mark as completed for today
- `POST /habits/{id}/freeze` - Apply streak freeze
- `GET /habits/{id}/status` - Get daily status

### Logging Endpoints (Timer Sessions)
- `POST /habit_logs/{habit_id}/logs/start` - Start a logging session
- `PATCH /habit_logs/{habit_id}/logs/{log_id}/stop` - Stop a logging session
- `GET /habit_logs/{habit_id}/logs` - Get all logs for a habit
- `GET /habit_logs/{habit_id}/logs/active` - Get active session

## Setup Instructions

### Prerequisites
- Backend running on `http://127.0.0.1:8000`
- Node.js and npm installed

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment (Optional)
Edit `.env` file if your backend runs on a different URL:
```
REACT_APP_API_URL=http://127.0.0.1:8000
```

### Step 3: Start the App
```bash
npm start
```

The app will open at `http://localhost:3000`

## User Flow

### 1. Authentication ✅ IMPLEMENTED
- User arrives at LoginPage
- Can sign up with email/password → creates user via POST /users/
- Or login with existing credentials via POST /auth/login
- Token stored in localStorage automatically
- AuthContext tracks authentication state
- Logged-in users see habit dashboard
- 401 errors trigger automatic redirect to login

### 2. Creating Habits ✅ IMPLEMENTED
- Click "+ New Habit" button
- Fill in CreateHabitModal form
- Select tracking type (timer or manual)
- Submit via POST /habits/ endpoint
- List refreshes automatically

### 3. Tracking Habits ✅ IMPLEMENTED
- **Timer-based habits**:
  - Click START → creates session via POST /habit_logs/{id}/logs/start
  - Real-time timer shows elapsed time
  - Click STOP → ends session via PATCH /habit_logs/{id}/logs/{id}/stop
  - Session saved to backend automatically
- **Manual-completion habits**:
  - Click "Mark Complete" → completes via POST /habits/{id}/complete
  - Shows confirmation for 2 seconds
  - Can be marked daily

### 4. Viewing Session History
- Future: Create logs view using habitLogService.getLogs(habitId)

## Error Handling

The app handles errors gracefully:
- 401 Unauthorized → Redirects to login
- API errors → Displayed as error messages in the UI
- Network errors → Caught and logged to console
- Form validation → Prevents invalid submissions

## Next Steps

1. **Add User Profile Page**
   - Display user email
   - Show freeze balance
   - Show user statistics
   - Edit password option

2. **Add Session History View**
   - Show past logs for each habit
   - Display statistics (total time, best day, weekly summary)
   - Chart visualization of progress

3. **Habit Management Features**
   - Edit habit settings
   - Delete habits with confirmation
   - Archive habits

4. **Enhanced Features**
   - Habit reminders/notifications
   - Habit categories and tags
   - Habit search and filtering
   - Weekly/monthly summaries

5. **UI Improvements**
   - Dark mode support
   - Mobile-first responsive design
   - Animation enhancements
   - Accessibility improvements

6. **Advanced Analytics**
   - Streak history charts
   - Goal tracking
   - Habit insights and recommendations

## Troubleshooting

### "Cannot reach backend"
- Ensure backend is running on the configured URL
- Check CORS settings on backend
- Verify `REACT_APP_API_URL` in `.env`

### "401 Unauthorized"
- Implement login page and obtain token
- Or create test user in backend first

### Timer not updating
- Check browser console for errors
- Verify session was created successfully
- Check if active session is being fetched properly

## Code Example: Making an API Call

```javascript
import { habitService } from './services/api';

// In your component:
const fetchHabits = async () => {
  try {
    const habits = await habitService.getHabits();
    setHabits(habits);
  } catch (error) {
    console.error('Error:', error);
    // Show error to user
  }
};
```

## Testing with CURL

```bash
# Login and get token
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password"

# Get habits (with token)
curl http://127.0.0.1:8000/habits/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
