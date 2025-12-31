import React, { createContext, useState, useEffect } from "react";

// Create Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(true);

  // User registration function
  const handleSignup = async (userData) => {
    const url = "http://localhost:3000/api/users/";
    if (!userData.username || !userData.email || !userData.password || !userData.role) {
      console.error("Error registering new user: Required fields are missing");
      return;
    };
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("User registration was successful:", data);
      return data;
    } catch (error) {
      console.error("Error registering new user:", error);
    }
  };

  // Login function
  const handleLogin = async (userData) => {
    const url = "http://localhost:3000/api/users/login";
    if (!userData.email || !userData.password) {
      console.error("Error logging in: Email and password are required");
      return;
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Login successful:", data.data);
      const userInfo = data.data;
      setUser(userInfo);
      const token = data.token;
      if (!token) {
        console.error("Error logging in: No token received");
        return;
      };
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("token", JSON.stringify(token));
      return userInfo;
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Get user function
  const fetchUser = async (id) => {
    const url = `http://localhost:3000/api/users/${id}`;
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error fetching user: No token found, user not authenticated");
      return;
    const options = {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(token)}`,
      }
    };
    };
    try {
      const response = await fetch(url, token);
      const data = await response.json();
      console.log("User fetch successful:", data);
      return data;

    } catch (error) {
      console.error("Error fetching user:", error);
    };
  };

  // Get all users function
  const fetchAllUsers = async () => {
    const url = `http://localhost:3000/api/users/`;
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error fetching users: No token found, user not authenticated");
      return;
    };
    const options = {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(token)}`,
      }
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("All users fetch successful:", data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
    };
  };

  // Update user function
  const updateUser = async (updatedData) => {
    const userId = updatedData.id;
    console.log(userId)
    const url = `http://localhost:3000/api/users/${userId}`;
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error updating user: No token found, user not authenticated");
      return;
    };
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email
      }),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("User update successful:", data);
      const newUserData = data.data;
      setUser(newUserData);
      localStorage.setItem("user", JSON.stringify(newUserData));
    } catch (error) {
      console.error("Error updating user:", error);
    };
  };

  // Delete user function
  const deleteUser = async (id) => {
    const url = `http://localhost:3000/api/users/${id}`;
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error deleting user: No token found, user not authenticated");
      return;
    };
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(token)}`,
        }
      };
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(`User ${id} successfully deleted.`);
      handleLogout();
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
    }
  };

  // Simulate fetching user from API / localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    };
    setLoading(false);
  }, []);


  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        handleSignup,
        handleLogin,
        handleLogout,
        fetchUser,
        fetchAllUsers,
        updateUser,
        deleteUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
