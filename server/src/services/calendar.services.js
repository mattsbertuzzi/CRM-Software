const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const OAuthClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);