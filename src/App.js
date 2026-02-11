import React, { useEffect, useState, useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { habitService } from "./services/api";
import HabitCard from "./HabitCard";
import LoginPage from "./pages/LoginPage";
import CreateHabitModal from "./components/CreateHabitModal";
import "./App.css";

function AppContent() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchHabits = async () => {
      try {
        setLoading(true);
        const data = await habitService.getHabits();
        setHabits(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching habits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [isAuthenticated]);

  const handleCreateHabitSuccess = () => {
    // Refresh habits list
    const fetchHabits = async () => {
      try {
        setLoading(true);
        const data = await habitService.getHabits();
        setHabits(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching habits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>📊 Habit Tracker</h1>
        <div className="header-actions">
          {habits.length > 0 && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-create-header"
            >
              + New Habit
            </button>
          )}
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading">Loading habits...</div>}

      <div className="habits-grid">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} onUpdate={() => {}} />
        ))}
      </div>

      {!loading && habits.length === 0 && (
        <div className="empty-state">
          <p>No habits yet. Create one to get started!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-create-habit"
          >
            + Create Your First Habit
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateHabitSuccess}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
