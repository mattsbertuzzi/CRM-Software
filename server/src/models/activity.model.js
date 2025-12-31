const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['call', 'meeting', 'email', 'task'],
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true,
    },
    relatedTo: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedModel',
        required: false
    },
    relatedModel: {
        type: String,
        enum: ['Deal', 'Customer', 'Contact'],
        required: false
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Add auto-increment plugin
activitySchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 0, id: 'activity_id' });
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;