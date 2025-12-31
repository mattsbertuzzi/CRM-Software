const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const googleRoutes = require('./routes/google.routes');
app.use('/api/google', googleRoutes);
const customerRoutes = require('./routes/customer.routes');
app.use('/api/customers', customerRoutes);
const contactRoutes = require('./routes/contact.routes');
app.use('/api/contacts', contactRoutes);
const dealRoutes = require('./routes/deal.routes');
app.use('/api/deals', dealRoutes);
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);
const activityRoutes = require('./routes/activity.routes');
app.use('/api/activities', activityRoutes);

module.exports = app;