const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
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
    position: {
        type: String,
        required: false
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Add auto-increment plugin
contactSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 0, id: 'contact_id' });
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;