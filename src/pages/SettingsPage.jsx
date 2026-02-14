import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { userService } from "../services/api";
import "./SettingsPage.css";

function SettingsPage() {
  const { logout } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [userId, setUserId] = useState(null);

  // Fetch current user email on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Decode JWT to get user ID
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const uid = payload.sub;
        setUserId(uid);

        // Fetch user details to get email
        const fetchUserEmail = async () => {
          try {
            const userData = await userService.getUser(uid);
            setEmail(userData.email || uid);
          } catch (err) {
            console.error("Error fetching user email:", err);
            setEmail(uid); // Fallback to user ID
          }
        };
        fetchUserEmail();
      } catch (err) {
        console.error("Error decoding token:", err);
        setEmail("Unable to load");
      }
    }
  }, []);

  // Calculate password strength (0-4)
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      // Call backend endpoint to change password
      await userService.updateUser(userId, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setError(null);
    setDeleting(true);
    try {
      await userService.deleteUser(userId);
      // Account deleted, logout
      logout();
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return labels[passwordStrength] || "";
  };

  const getPasswordStrengthColor = () => {
    const colors = ["", "#f44336", "#ff9800", "#fbc02d", "#4caf50"];
    return colors[passwordStrength] || "#ccc";
  };

  return (
    <div className="settings-container">
      <div className="settings-box">
        <h1>⚙️ Settings</h1>

        {/* User Info Section */}
        <div className="settings-section">
          <h2>Account Information</h2>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="input-disabled"
            />
            <small>Your email address cannot be changed.</small>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="settings-section">
          <h2>Change Password</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 8 chars)"
                required
              />
              {newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <small style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthLabel()}
                  </small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <h2>⚠️ Danger Zone</h2>
          <p>Deleting your account is permanent and cannot be undone.</p>

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="btn btn-delete"
          >
            Delete Account
          </button>
        </div>

        {/* Logout */}
        <div className="settings-section">
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div
          className="modal-overlay"
          onClick={() => !deleting && setDeleteConfirmOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Delete Account?</h2>
              <button
                className="modal-close"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p>
                This action <strong>cannot be undone</strong>. All your habits,
                logs, and data will be permanently deleted.
              </p>
              <p>
                To confirm, please type <strong>DELETE</strong> below:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder='Type "DELETE" to confirm'
                className="confirmation-input"
              />
              {error && <div className="error-message">{error}</div>}
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
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== "DELETE"}
                  className="btn-delete"
                  style={{
                    background: "#f44336",
                    color: "white",
                  }}
                >
                  {deleting ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
