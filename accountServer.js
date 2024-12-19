const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS middleware
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://argylemelis:eksukkelmetmongodb@eyelounge.6edou.mongodb.net/mydatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    practiceName: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    contactDetails: { type: String, required: true },
    country: { type: String, required: true }
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

app.post('/create-account', async (req, res) => {
    const { email, password, name, surname, contactDetails, practiceName, country } = req.body;
    console.log('Received data:', { email, password, name, surname, contactDetails, practiceName, country });

    if (!email || !password || !name || !surname || !contactDetails || !practiceName || !country) {
        console.error('Validation Error: All fields are required');
        return res.status(400).send('All fields are required');
    }

    const newUser = new User({ email, password, name, surname, contactDetails, practiceName, country });

    try {
        const savedUser = await newUser.save();
        console.log('Saved user:', savedUser);
        res.status(201).send('Account created successfully');
    } catch (error) {
        if (error.code === 11000) {
            console.error('Error: Email already exists');
            res.status(400).send('Email already exists');
        } else {
            console.error('Error creating account:', error.message);
            res.status(500).send('Error creating account: ' + error.message);
        }
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).send('Invalid email or password');  // This line returns the status for incorrect credentials
        }
        // Sending user details to the client
        res.status(200).json({
            name: user.name,
            surname: user.surname,
            email: user.email,
            contactDetails: user.contactDetails,
            practiceName: user.practiceName
        });
    } catch (error) {
        res.status(500).send('Error logging in: ' + error.message);
    }
});

app.get('/VA Charts/VA CHARTS.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'VA Charts', 'VA CHARTS.html'));
});

app.get('/VA Charts/VA CHARTS.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'VA Charts', 'VA CHARTS.css'));
});

app.get('/VA Charts/VA CHARTS.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'VA Charts', 'VA CHARTS.js'));
});

app.get('/Icons/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Icons', req.params.filename));
});

app.get('/Cursor/cursor.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Cursor', 'cursor.js'));
});

app.get('/forgotpassword.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Intro', 'forgotpassword.html'));
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log('Password reset request received for email:', email);

    if (!email) {
        console.log('Error: Email is required');
        return res.status(400).send('Email is required');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Error: User not found');
            return res.status(404).send('User not found');
        }

        const subject = 'Password Reset';
        const text = `Your password is: ${user.password}`; // In a real-world scenario, use a more secure method

        // Send request to email server
        await axios.post('http://localhost:3002/send-email', {
            email: email,
            subject: subject,
            text: text
        }).then(() => {
            console.log('Password reset email sent successfully to:', email);
            res.status(200).send('Password sent to your email');
        }).catch((error) => {
            console.error('Error sending email:', error.response ? error.response.data : error.message); // Log detailed error message
            res.status(500).send('Error sending email');
        });

    } catch (error) {
        console.error('Error during password reset:', error.message);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
