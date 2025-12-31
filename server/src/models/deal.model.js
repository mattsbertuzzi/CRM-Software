const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    stage: {
        type: String,
        enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
        default: 'lead',
        required: true
    },
    expectedCloseDate: {
        type: Date,
        required: false
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
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
dealSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 0, id: 'deal_id' });
const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;