require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Use the environment variable for the API key

app.use(cors()); // Use cors middleware to enable CORS
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { email, subject, text } = req.body;
    const name = email.split('@')[0]; // Extract name from email (basic assumption)

    console.log('Email request received:', { email, subject, text });

    const msg = {
        to: email,
        from: 'argylemelis@gmail.com', // Use your verified sender email
        subject: subject,
        text: text,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Eyelounge Studio</h2>
            <p>Dear ${name.charAt(0).toUpperCase() + name.slice(1)},</p>
            <p>We have received a request to reset your password. Below is your current password:</p>
            <p style="font-weight: bold;">${text}</p>
            <p>For security reasons, we recommend changing your password immediately after logging in.</p>
            <p>Best regards,<br>Eyelounge Studio</p>
            <div style="font-size: 0.9em; color: #888;">
                <p>If you did not request a password reset, please ignore this email or contact us immediately.</p>
                <p>© 2024 Eyelounge Studio. All rights reserved.</p>
            </div>
        </div>`
    };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent successfully to:', email);
            res.status(200).send('Email sent successfully');
        })
        .catch((error) => {
            console.error('Error sending email:', error.response.body.errors); // Log detailed error message
            res.status(500).send('Error sending email');
        });
});

app.listen(3002, () => {
    console.log('Email server running on port 3002');
});
