const mongoose = require('mongoose');

// Define the schema for test cards
const testCardSchema = new mongoose.Schema({
    chiefComplaint: String,
    pd: String,
    iop_OD: String,
    iop_OS: String,
    colorVision: String,
    notes: String,
    odValue: String,
    osValue: String,
    scRE: String,
    scLE: String,
    scOU: String,
    ccRE: String,
    ccLE: String,
    ccOU: String,
    spectacles_OD_sphere: String,
    spectacles_OD_cylinder: String,
    spectacles_OD_axis: String,
    spectacles_OD_add: String,
    spectacles_OS_sphere: String,
    spectacles_OS_cylinder: String,
    spectacles_OS_axis: String,
    spectacles_OS_add: String,
    date: String
}, { _id: true });

// Define the schema for patients
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    idNumber: { type: String, required: true },
    email: { type: String, required: true },
    accountNumber: { type: Number, unique: true, required: true },
    testCards: [testCardSchema] // Array of test cards
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
