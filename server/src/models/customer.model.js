const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: false
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    deals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deal'
    }],
    customerValue: {
        type: Number,
        default: 0,
        required: true
    }
});

// Add auto-increment plugin
customerSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 0, id: 'customer_id' });
const Customer = mongoose.model('customer', customerSchema);
module.exports = Customer;