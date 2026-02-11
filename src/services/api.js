const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// Helper to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

// Helper to make authenticated requests
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      // Don't redirect if we already know there's no token
      if (token) {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized - please log in");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Network errors or JSON parse errors
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

// ==================== AUTH ====================
export const authService = {
  login: (username, password) =>
    apiCall("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    }),

  logout: () => {
    localStorage.removeItem("access_token");
  },

  isAuthenticated: () => !!getAuthToken(),
};

// ==================== USERS ====================
export const userService = {
  createUser: (email, password) =>
    apiCall("/users/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getUser: (userId) =>
    apiCall(`/users/${userId}`, { method: "GET" }),

  updateUser: (userId, data) =>
    apiCall(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteUser: (userId) =>
    apiCall(`/users/${userId}`, { method: "DELETE" }),
};

// ==================== HABITS ====================
export const habitService = {
  getHabits: () =>
    apiCall("/habits/", { method: "GET" }),

  getHabit: (id) =>
    apiCall(`/habits/${id}`, { method: "GET" }),

  createHabit: (data) =>
    apiCall("/habits/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateHabit: (id, data) =>
    apiCall(`/habits/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteHabit: (id) =>
    apiCall(`/habits/${id}`, { method: "DELETE" }),

  completeHabit: (id) =>
    apiCall(`/habits/${id}/complete`, { method: "POST" }),

  freezeHabit: (id) =>
    apiCall(`/habits/${id}/freeze`, { method: "POST" }),

  getHabitStatus: (id) =>
    apiCall(`/habits/${id}/status`, { method: "GET" }),
};

// ==================== HABIT LOGS ====================
export const habitLogService = {
  startSession: (habitId) =>
    apiCall(`/habit_logs/${habitId}/logs/start`, { method: "POST" }),

  stopSession: (habitId, logId) =>
    apiCall(`/habit_logs/${habitId}/logs/${logId}/stop`, {
      method: "PATCH",
    }),

  getLogs: (habitId) =>
    apiCall(`/habit_logs/${habitId}/logs`, { method: "GET" }),

  getActiveSession: (habitId) =>
    apiCall(`/habit_logs/${habitId}/logs/active`, { method: "GET" }),
};

export default {
  authService,
  userService,
  habitService,
  habitLogService,
};
