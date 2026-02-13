import React, { useState, useEffect } from "react";
import { habitLogService, habitService } from "./services/api";
import EditHabitModal from "./components/EditHabitModal";
import ManualOverrideModal from "./components/ManualOverrideModal";
import "./HabitCard.css";

function HabitCard({ habit, onUpdate, onViewStats }) {
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [manualOverrideOpen, setManualOverrideOpen] = useState(false);
  const [habitColor, setHabitColor] = useState(null);
  const [inDanger, setInDanger] = useState(false);
  const [freezesRemaining, setFreezesRemaining] = useState(2);

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

  // Fetch habit status (color, in_danger, completion status)
  const fetchHabitStatus = async () => {
    try {
      const status = await habitService.getHabitStatus(habit.id);
      setHabitColor(status.color);
      setInDanger(status.in_danger || false);
      // If status is "completed" or "done", mark as completed today
      if (status.status === "completed" || status.status === "done") {
        setCompletedToday(true);
      }
    } catch (err) {
      console.error("Error fetching habit status:", err);
    }
  };

  // Fetch habit stats (freezes_remaining, etc)
  const fetchHabitStats = async () => {
    try {
      const stats = await habitService.getHabitStats(habit.id);
      if (stats.freezes && stats.freezes.remaining !== undefined) {
        setFreezesRemaining(stats.freezes.remaining);
      }
    } catch (err) {
      console.error("Error fetching habit stats:", err);
    }
  };

  useEffect(() => {
    fetchHabitStatus();
    fetchHabitStats();
  }, [habit.id]);

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
      await habitLogService.stopSession(
        habit.id,
        activeSession.id
      );
      setActiveSession(null);
      setElapsedSeconds(0);
      // Fetch updated status to reflect completion color
      await fetchHabitStatus();
      await fetchHabitStats();
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
      console.error("Error stopping session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (completedToday) return; // Prevent double completion

    setLoading(true);
    setError(null);
    try {
      await habitService.completeHabit(habit.id);
      setCompleted(true);
      setCompletedToday(true);
      // Immediately fetch updated status to show green color
      await fetchHabitStatus();
      await fetchHabitStats();
      // Reset visual confirmation after 2 seconds, but keep completedToday true
      setTimeout(() => setCompleted(false), 2000);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
      console.error("Error completing habit:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await habitService.deleteHabit(habit.id);
      setDeleteConfirmOpen(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting habit:", err);
    } finally {
      setDeleting(false);
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
      className={`habit-card status-${habitColor || "default"} ${activeSession ? "active" : ""} ${
        habit.current_streak > 0 ? "on-streak" : ""
      } ${completed ? "completed" : ""} ${inDanger ? "in-danger" : ""}`}
    >
      <div className="habit-header">
        <h3>{habit.name}</h3>
        <div className="habit-badges">
          {inDanger && <span className="danger-badge">⚠️ In Danger</span>}
          <span className="freeze-badge">❄️ {freezesRemaining} freezes</span>
          <span className="streak-badge">
            🔥 {habit.current_streak} day streak
          </span>
        </div>
      </div>

      <p className="habit-description">
        {habit.description || "\u00A0"}
      </p>

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

          <div className="habit-spacer"></div>

          {error && <div className="error-message">{error}</div>}

          <div className="habit-buttons">
            {!activeSession ? (
              <>
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="btn btn-start"
                >
                  {loading ? "Starting..." : "START"}
                </button>
                {habit.allow_manual_override && (
                  <button
                    onClick={() => setManualOverrideOpen(true)}
                    className="btn btn-override"
                  >
                    Manual Entry
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleStop}
                  disabled={loading}
                  className="btn btn-stop"
                >
                  {loading ? "Stopping..." : "STOP"}
                </button>
                {habit.allow_manual_override && (
                  <button
                    onClick={() => setManualOverrideOpen(true)}
                    className="btn btn-override"
                  >
                    Manual Entry
                  </button>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        // Manual completion habit
        <>
          <div className="habit-completion">
            {completedToday ? (
              <>
                <p className="completion-status">✅ Completed Today!</p>
              </>
            ) : completed ? (
              <>
                <p className="completion-status">✅ Marked Complete!</p>
              </>
            ) : (
              <>
                <p className="completion-label">Manual Tracking</p>
                <p className="completion-status">📋 Mark as complete</p>
              </>
            )}
          </div>

          <div className="habit-spacer"></div>

          {error && <div className="error-message">{error}</div>}

          <div className="habit-buttons">
            <button
              onClick={handleMarkComplete}
              disabled={loading || completedToday}
              className={`btn ${completedToday || completed ? "btn-completed" : "btn-complete"}`}
            >
              {loading ? "Marking..." : completedToday ? "✓ Done Today" : completed ? "✓ Completed" : "Mark Complete"}
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

      <div className="habit-action-buttons">
        <button
          onClick={onViewStats}
          className="btn btn-stats"
        >
          View Stats
        </button>
        <button
          onClick={() => setEditOpen(true)}
          className="btn btn-edit"
        >
          Edit
        </button>
        <button
          onClick={() => setDeleteConfirmOpen(true)}
          className="btn btn-delete"
        >
          Delete
        </button>
      </div>

      {editOpen && (
        <EditHabitModal
          habit={habit}
          onClose={() => setEditOpen(false)}
          onSuccess={() => {
            setEditOpen(false);
            if (onUpdate) onUpdate();
          }}
        />
      )}

      {manualOverrideOpen && habit.allow_manual_override && (
        <ManualOverrideModal
          habit={habit}
          onClose={() => setManualOverrideOpen(false)}
          onSuccess={async () => {
            setManualOverrideOpen(false);
            // Fetch updated status to show green color immediately
            await fetchHabitStatus();
            await fetchHabitStats();
            if (onUpdate) onUpdate();
          }}
        />
      )}

      {deleteConfirmOpen && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirmOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Habit?</h2>
              <button className="modal-close" onClick={() => setDeleteConfirmOpen(false)}>
                ✕
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p>Are you sure you want to delete <strong>{habit.name}</strong>? This action cannot be undone.</p>
              <div className="form-actions" style={{ marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  disabled={deleting}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-delete"
                  style={{
                    background: "#f44336",
                    color: "white",
                  }}
                >
                  {deleting ? "Deleting..." : "Delete Habit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitCard;
