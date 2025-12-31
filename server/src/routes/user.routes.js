const express = require('express');
const {verifyToken} = require('../utils/authentication');

// Import controllers
const {fetchAllUsers, fetchUserByRole, fetchUserById, createUser, updateUserById, deleteUserById, handleUserLogin} = require('../controllers/user.controllers');

const router = express.Router();

// Get all users
router.get('/', verifyToken, fetchAllUsers);

// Get users by role
router.get('/role/:role', verifyToken, fetchUserByRole);

// Get one user by ID
router.get('/:id', verifyToken, fetchUserById);

// Create new user
router.post('/', createUser);

// Update user by ID
router.put('/:id', verifyToken, updateUserById);

// Delete user by ID
router.delete('/:id', verifyToken, deleteUserById);

// Handle user login
router.post('/login', handleUserLogin);

module.exports = router;