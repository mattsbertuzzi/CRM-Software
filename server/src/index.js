const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config()

// Import app
const app = require('./app');

// Start server
mongoose.connect(process.env.DB_CONN_STRING).then(()=>{
    console.log('Connection to dataset established.');
    app.listen(3000, ()=>{
        console.log('Sever is running!')
    });
})