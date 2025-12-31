const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const OAuthClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

// Redirect to authentication
const redirectUsers = (req, res) => {
    const url = OAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: process.env.GOOGLE_AUTH_SCOPES.split(','),
    });
    return res.status(302).redirect(url);
};

// Get authentication token
const getAuthToken = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await OAuthClient.getToken(code);
        return res.status(200).json({ tokens });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving access token', error: error.message });
    }
}

// Add calendar event
const addCalendarEvent = async (req, res) => {
    const { tokens, event } = req.body;
    try {
        OAuthClient.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth: OAuthClient });
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });
        return res.status(200).json({ message: 'Event created successfully', event: response.data });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating calendar event', error: error.message });
    }
}

//Send new email
const sendEmail = async (to, subject, text) => {
    try {
        const { tokens, resource } = req.body;
        OAuthClient.setCredentials(tokens)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_ADDRESS,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: tokens.refresh_token,
            }
        });

        const mailOptions = {
            from: `Matteo <${process.env.GMAIL_ADDRESS}>`,
            to: resource.to,
            subject: resource.subject,
            text: resource.text,
            html: resource.html ?? `<p>${resource.text}</p>`,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    };
}

module.exports = {
    OAuthClient,
    redirectUsers,
    getAuthToken,
    addCalendarEvent,
    sendEmail
};