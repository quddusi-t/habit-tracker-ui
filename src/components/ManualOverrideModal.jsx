import React, { useState } from "react";
import { habitLogService } from "../services/api";
import "./CreateHabitModal.css";

function ManualOverrideModal({ habit, onClose, onSuccess }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalMinutes = hours * 60 + minutes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (totalMinutes === 0) {
      setError("Please enter a time greater than 0 minutes");
      setLoading(false);
      return;
    }

    try {
      await habitLogService.createManualLog(habit.id, totalMinutes, notes);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Manual log creation error:", err);
      // Extract error message from various possible error formats
      let errorMsg = "An error occurred";
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === "string") {
        errorMsg = err;
      } else if (err?.detail) {
        errorMsg = err.detail;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleHoursChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 23);
    setHours(value);
  };

  const handleMinutesChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 59);
    setMinutes(value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manual Time Entry</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <p style={{ color: "#666", marginBottom: "1.5rem", textAlign: "center" }}>
            Enter time spent on <strong>{habit.name}</strong>
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
            <div className="form-group" style={{ flex: "1", maxWidth: "150px" }}>
              <label htmlFor="hours">Hours</label>
              <input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={handleHoursChange}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>:</span>
            </div>
            <div className="form-group" style={{ flex: "1", maxWidth: "150px" }}>
              <label htmlFor="minutes">Minutes</label>
              <input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={String(minutes).padStart(2, "0")}
                onChange={handleMinutesChange}
              />
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1a237e", margin: 0 }}>
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
            </p>
            <small style={{ color: "#999" }}>
              ({totalMinutes} minutes total)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you work on?"
              rows="2"
              maxLength="100"
            />
            <small>{notes.length}/100 characters</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-create">
              {loading ? "Logging..." : "Log Time"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManualOverrideModal;
