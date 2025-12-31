const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();


const sendEmail = async (to, subject, text) => {
    try {
        const oAuthClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        const accessToken = await oAuthClient.getAccessToken();
        // Connect to email service provider's SDK or API
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_ADDRESS,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            }
        });

        const mailOptions = {
            from: `Matteo <${process.env.GMAIL_ADDRESS}>`,
            to,
            subject,
            text,
            html: `<h1>CRM Email</h1><p>${text}</p>`,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    };
};

module.exports = {
    sendEmail,
};