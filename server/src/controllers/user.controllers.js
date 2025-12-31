const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { hashPassword, verifyPassword } = require('../utils/pwdHashing');

dotenv.config();

const secretKey = process.env.SECRET_KEY;

// Get all users
const fetchAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) {
        return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json(users);
}

// Get users by role
const fetchUserByRole = async (req, res) => {
    const role = req.params.role;
    const users = await User.find({ role: role });
    if (!users || users.length === 0) {
        return res.status(404).json({ message: `No users found with role: ${role}` });
    }
    return res.status(200).json(users);
}

// Get one user by ID
const fetchUserById = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findOne({ id: userId });
    if (!user) {
        return res.status(404).json({ message: `User not found with ID: ${userId}` });
    }
    return res.status(200).json(user);
};

// Create new user
const createUser = async (req, res) => {
    try {
        // Get required fields
        const {
            username,
            email,
            password,
            role
        } = req.body;
        if (!username || !email || !password || !role) {
            res.status(400).json({ 'message': 'New user cannot be created. Required fields are missing' });
        }
        // Get optional fields
        const {
            firstName,
            lastName
        } = req.body;

        // Create new resource in DB
        const user = await User.create({
            firstName: firstName ?? '',
            lastName: lastName ?? '',
            username: username,
            email: email,
            password: await hashPassword(password),
            role: role
        });
        // Send server response
        res.status(201).json({
            'message': 'New user created',
            'data': JSON.stringify({
                firstName: user.firstName ?? '',
                lastname: user.lastName ?? '',
                username: user.username,
                email: user.email,
                role: user.role
            })
        })

    } catch (e) {
        res.status(500).json({ 'message': 'Error creating new user' });
    }
}

// Update user by ID
const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;

    // If password is being updated, hash it
    if (updateData.password) {
        updateData.password = hashPassword(updateData.password);
    }

    const updatedUser = await User.findOneAndUpdate({ id: userId }, updateData, { new: true });
    if (!updatedUser) {
        return res.status(404).json({ message: `User not found with ID: ${userId}` });
    }
    return res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser
    });
};

// Delete user by ID
const deleteUserById = async (req, res) => {
    const userId = req.params.id;
    const deletedUser = await User.findOneAndDelete({ id: userId });
    if (!deletedUser) {
        return res.status(404).json({ message: `User not found with ID: ${userId}` });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
};

// handle login
const handleUserLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for login' });
    }

    try {
        const user = await User.find({ email: email });
        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        };
        // Validate password
        const isPasswordValid = verifyPassword(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: `Invalid password for user with email: ${email}` });
        };
        // Get user data
        const data = {
            _id: user[0]._id,
            id: user[0].id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role
        };
        // Generate token
        const token = jwt.sign({ id: user[0]._id, email: user[0].email }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', data: data, token: token });
    } catch (error) {
        return res.status(500).json({ message: 'Error during login' });
    };
};

module.exports = {
    fetchAllUsers,
    fetchUserByRole,
    fetchUserById,
    createUser,
    updateUserById,
    deleteUserById,
    handleUserLogin
};