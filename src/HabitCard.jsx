import React, { useState, useEffect } from "react";
import { habitLogService, habitService } from "./services/api";
import "./HabitCard.css";

function HabitCard({ habit, onUpdate }) {
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  // Fetch active session on mount (only for timer habits)
  useEffect(() => {
    if (!habit.is_timer) return;

    const fetchActiveSession = async () => {
      try {
        const session = await habitLogService.getActiveSession(habit.id);
        if (session) {
          setActiveSession(session);
          // Calculate elapsed time
          const startTime = new Date(session.start_time);
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setElapsedSeconds(elapsed);
        }
      } catch (err) {
        console.error("Error fetching active session:", err);
      }
    };

    fetchActiveSession();
  }, [habit.id, habit.is_timer]);

  // Timer interval (only for timer habits)
  useEffect(() => {
    if (!activeSession || !habit.is_timer) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, habit.is_timer]);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await habitLogService.startSession(habit.id);
      setActiveSession(session);
      setElapsedSeconds(0);
    } catch (err) {
      setError(err.message);
      console.error("Error starting session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!activeSession) return;

    setLoading(true);
    setError(null);
    try {
      const session = await habitLogService.stopSession(
        habit.id,
        activeSession.id
      );
      setActiveSession(null);
      setElapsedSeconds(0);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
      console.error("Error stopping session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      await habitService.completeHabit(habit.id);
      setCompleted(true);
      // Reset after 2 seconds
      setTimeout(() => setCompleted(false), 2000);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
      console.error("Error completing habit:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(
        secs
      ).padStart(2, "0")}s`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div
      className={`habit-card ${activeSession ? "active" : ""} ${
        habit.current_streak > 0 ? "on-streak" : ""
      } ${completed ? "completed" : ""}`}
    >
      <div className="habit-header">
        <h3>{habit.name}</h3>
        <span className="streak-badge">
          🔥 {habit.current_streak} day streak
        </span>
      </div>

      {habit.description && (
        <p className="habit-description">{habit.description}</p>
      )}

      {habit.is_timer ? (
        // Timer-based habit
        <>
          <div className="habit-timer">
            {activeSession ? (
              <>
                <p className="timer-label">Session Time</p>
                <p className="timer-display">{formatTime(elapsedSeconds)}</p>
                <p className="status">⏱️ Recording...</p>
              </>
            ) : (
              <>
                <p className="timer-label">Ready</p>
                <p className="timer-display">00:00</p>
                <p className="status">⏸️ Idle</p>
              </>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="habit-buttons">
            {!activeSession ? (
              <button
                onClick={handleStart}
                disabled={loading}
                className="btn btn-start"
              >
                {loading ? "Starting..." : "START"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleStop}
                  disabled={loading}
                  className="btn btn-stop"
                >
                  {loading ? "Stopping..." : "STOP"}
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        // Manual completion habit
        <>
          <div className="habit-completion">
            {completed ? (
              <>
                <p className="completion-status">✅ Completed Today!</p>
              </>
            ) : (
              <>
                <p className="completion-label">Manual Tracking</p>
                <p className="completion-status">📋 Mark as complete</p>
              </>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="habit-buttons">
            <button
              onClick={handleMarkComplete}
              disabled={loading || completed}
              className={`btn ${completed ? "btn-completed" : "btn-complete"}`}
            >
              {loading ? "Marking..." : completed ? "✓ Completed" : "Mark Complete"}
            </button>
          </div>
        </>
      )}

      <div className="habit-meta">
        <small>
          Created:{" "}
          {new Date(habit.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </small>
      </div>
    </div>
  );
}

export default HabitCard;
