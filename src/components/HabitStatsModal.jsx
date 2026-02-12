import React, { useEffect, useState } from "react";
import { habitService } from "../services/api";
import "./HabitStatsModal.css";

function HabitStatsModal({ habit, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await habitService.getHabitStats(habit.id);
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [habit.id]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitService.getHabitStats(habit.id);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const formatMinutes = (minutes) => {
    if (minutes == null) return "-";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPercent = (value) => {
    if (value == null || Number.isNaN(value)) return "-";
    return `${Number(value).toFixed(1)}%`;
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="stats-modal-header">
          <div>
            <p className="stats-modal-subtitle">Habit Stats</p>
            <div className="stats-modal-title-row">
              <h2>{habit.name}</h2>
              <div className="stats-modal-actions">
                <button
                  className="stats-modal-refresh"
                  onClick={handleRefresh}
                  disabled={loading}
                  aria-label="Refresh stats"
                  title="Refresh stats"
                >
                  Refresh Stats
                </button>
                <button
                  className="stats-modal-close"
                  onClick={onClose}
                  aria-label="Close stats"
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && <div className="stats-modal-loading">Loading stats...</div>}
        {error && <div className="stats-modal-error">{error}</div>}

        {!loading && !error && stats && (
          <div className="stats-modal-body">
            <div className="stats-section">
              <p className="stats-title">Overview</p>
              <div className="stats-row">
                <span>Type</span>
                <span>{stats.habit_type}</span>
              </div>
              <div className="stats-row">
                <span>Days since created</span>
                <span>{stats.days_since_created}</span>
              </div>
              <div className="stats-row">
                <span>Streak start</span>
                <span>{formatDateTime(stats.streak_start_date)}</span>
              </div>
            </div>

            <div className="stats-section">
              <p className="stats-title">Streaks</p>
              <div className="stats-row">
                <span>Current</span>
                <span>{stats.streaks?.current ?? 0}</span>
              </div>
              <div className="stats-row">
                <span>Best</span>
                <span>{stats.streaks?.best ?? 0}</span>
              </div>
            </div>

            <div className="stats-section">
              <p className="stats-title">Freezes</p>
              <div className="stats-row">
                <span>Used</span>
                <span>{stats.freezes?.used ?? 0}</span>
              </div>
              <div className="stats-row">
                <span>Remaining</span>
                <span>{stats.freezes?.remaining ?? 0}</span>
              </div>
            </div>

            {habit.is_timer ? (
              <div className="stats-section">
                <p className="stats-title">Timer Metrics</p>
                <div className="stats-row">
                  <span>Total time</span>
                  <span>{formatMinutes(stats.stats?.total_time_minutes)}</span>
                </div>
                <div className="stats-row">
                  <span>Avg session</span>
                  <span>
                    {formatMinutes(Math.round(stats.stats?.avg_session_minutes || 0))}
                  </span>
                </div>
                <div className="stats-row">
                  <span>Median session</span>
                  <span>
                    {formatMinutes(Math.round(stats.stats?.median_session_minutes || 0))}
                  </span>
                </div>
                <div className="stats-row">
                  <span>Sessions</span>
                  <span>{stats.stats?.sessions_count ?? 0}</span>
                </div>
                <div className="stats-row">
                  <span>Best day</span>
                  <span>{formatMinutes(stats.stats?.best_day_minutes)}</span>
                </div>
                <div className="stats-row">
                  <span>This week</span>
                  <span>{formatMinutes(stats.stats?.this_week_minutes)}</span>
                </div>
                <div className="stats-row">
                  <span>This month</span>
                  <span>{formatMinutes(stats.stats?.this_month_minutes)}</span>
                </div>
              </div>
            ) : (
              <div className="stats-section">
                <p className="stats-title">Manual Metrics</p>
                <div className="stats-row">
                  <span>Total completions</span>
                  <span>{stats.stats?.total_completions ?? 0}</span>
                </div>
                <div className="stats-row">
                  <span>Completion rate</span>
                  <span>{formatPercent(stats.stats?.completion_rate_percent)}</span>
                </div>
                <div className="stats-row">
                  <span>Best streak</span>
                  <span>{stats.stats?.best_streak ?? 0}</span>
                </div>
                {stats.stats?.last_completed_date && (
                  <div className="stats-row">
                    <span>Last completed</span>
                    <span>{formatDateTime(stats.stats?.last_completed_date)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitStatsModal;
