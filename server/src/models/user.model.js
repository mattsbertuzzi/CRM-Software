const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['viewer', 'customer_support', 'manager', 'admin'],
        default: 'viewer',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Add auto-increment plugin
userSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 0, id: 'user_id' });
const User = mongoose.model('User', userSchema);
module.exports = User;