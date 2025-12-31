import React, { useState, useContext, useEffect } from "react";
import Button from "../components/Button";
import "../styles/profile.css";
import { UserContext } from "../context/userContext";

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState({
    id: null,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  // Sync context user → local form state
  useEffect(() => {
    if (!user) return;

    setUserInfo({
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      role: user.role || "",
      password: "",
      confirmPassword: ""
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validate password if provided
    if (userInfo.password || userInfo.confirmPassword) {
      if (userInfo.password !== userInfo.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    const payload = {
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      username: userInfo.username,
      email: userInfo.email,
      role: userInfo.role
    };

    // Only include password if it's set and confirmed
    if (userInfo.password) {
      payload.password = userInfo.password;
    }

    updateUser(payload);
    alert("Profile saved successfully!");

    // Clear password fields after saving
    setUserInfo((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-card">
        <div className="profile-field">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={userInfo.username}
            disabled
          />
          <small className="disabled-info">Not possible to change</small>
        </div>

        <div className="profile-field">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userInfo.firstName}
            onChange={handleChange}
          />
        </div>

        <div className="profile-field">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userInfo.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            disabled
          />
          <small className="disabled-info">Not possible to change</small>
        </div>

        <div className="profile-field">
          <label>Role</label>
          <select name="role" value={userInfo.role} disabled>
            <option value="" disabled>
              Select role
            </option>
            <option value="viewer">Viewer</option>
            <option value="customer_support">Customer Support</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <small className="disabled-info">Not possible to change</small>
        </div>

        <div className="profile-field">
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={userInfo.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        <div className="profile-field">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userInfo.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>

        <div className="profile-actions">
          <Button variant="primary" size="large" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
