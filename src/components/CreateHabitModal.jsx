import React, { useState } from "react";
import { habitService } from "../services/api";
import "./CreateHabitModal.css";

function CreateHabitModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_timer: true,
    allow_manual_override: true,
    is_freezable: true,
    danger_start_pct: 0.7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await habitService.createHabit(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Habit</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Habit Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., 📚 Learn Programming"
              maxLength="50"
              required
            />
            <small>{formData.name.length}/50 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this habit about?"
              rows="3"
              maxLength="120"
            />
            <small>{formData.description?.length || 0}/120 characters</small>
          </div>

          <div className="form-group checkbox">
            <input
              id="is_timer"
              type="checkbox"
              name="is_timer"
              checked={formData.is_timer}
              onChange={handleChange}
            />
            <label htmlFor="is_timer">Use Timer for Tracking</label>
          </div>

          <div className="form-group checkbox">
            <input
              id="allow_manual_override"
              type="checkbox"
              name="allow_manual_override"
              checked={formData.allow_manual_override}
              onChange={handleChange}
            />
            <label htmlFor="allow_manual_override">Allow Manual Override</label>
          </div>

          <div className="form-group checkbox">
            <input
              id="is_freezable"
              type="checkbox"
              name="is_freezable"
              checked={formData.is_freezable}
              onChange={handleChange}
            />
            <label htmlFor="is_freezable">Allow Freeze (to preserve streak)</label>
          </div>

          <div className="form-group">
            <label htmlFor="danger_start_pct">Danger Zone at % of Target</label>
            <input
              id="danger_start_pct"
              type="number"
              name="danger_start_pct"
              value={formData.danger_start_pct}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.1"
            />
            <small>When to show warning (0.7 = 70%)</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-create">
              {loading ? "Creating..." : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateHabitModal;
