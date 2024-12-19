const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    practiceName: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    contactDetails: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
