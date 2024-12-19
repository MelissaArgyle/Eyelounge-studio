const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Patient = require('./public/models/patient');
const Counter = require('./public/models/counter');

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://argylemelis:eksukkelmetmongodb@eyelounge.6edou.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

// Define the savePatient route
app.post('/savePatient', async (req, res) => {
    try {
        // Increment the patient account number
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'patientAccountNumber' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );

        // Create a new patient document with the incremented account number
        const newPatient = new Patient({
            ...req.body,
            accountNumber: counter.sequence_value
        });

        // Save the new patient document to the database
        await newPatient.save();
        res.status(200).send('Patient data saved successfully');
    } catch (err) {
        console.error('Error saving patient data:', err);
        res.status(400).send('Error saving patient data: ' + err.message);
    }
});

// Define the searchPatient route
app.get('/searchPatient', async (req, res) => {
    try {
        const query = req.query.query;
        const searchTerms = query.split(' ').map(term => term.trim()).filter(term => term.length > 0);

        let queryObject;

        if (searchTerms.length > 1) {
            // Separate possible ID number from name terms
            const nameTerms = searchTerms.filter(term => isNaN(term));
            const idTerms = searchTerms.filter(term => !isNaN(term));

            queryObject = {
                $and: [
                    { $or: nameTerms.map(term => ({ name: { $regex: new RegExp(term, 'i') } })) },
                    { $or: nameTerms.map(term => ({ surname: { $regex: new RegExp(term, 'i') } })) },
                    { idNumber: { $regex: new RegExp(idTerms.join(' '), 'i') } }
                ]
            };
        } else {
            // Single term search: match against name, surname, or ID
            queryObject = {
                $or: [
                    { name: { $regex: new RegExp(query, 'i') } },
                    { surname: { $regex: new RegExp(query, 'i') } },
                    { idNumber: { $regex: new RegExp(query, 'i') } }
                ]
            };
        }

        console.log('Query Object:', JSON.stringify(queryObject)); // Log the query object for debugging

        // Search for patients based on the query object
        const patients = await Patient.find(queryObject);
        console.log('Patients:', patients); // Log the patients found for debugging

        if (patients.length > 0) {
            res.json(patients); // Return the list of matching patients
        } else {
            res.status(404).json({ message: 'Patient not found' }); // Return 404 if no patients are found
        }
    } catch (err) {
        console.error('Error searching for patients:', err);
        res.status(500).json({ message: 'Error searching for patients: ' + err.message });
    }
});

// Define the updatePatient route
app.put('/updatePatient/:id', async (req, res) => {
    try {
        const patientId = req.params.id;
        const updatedData = req.body;

        // Update the patient document with the new data
        const updatedPatient = await Patient.findByIdAndUpdate(patientId, updatedData, { new: true });

        if (updatedPatient) {
            res.status(200).json(updatedPatient);
        } else {
            res.status(404).send('Patient not found');
        }
    } catch (err) {
        console.error('Error updating patient data:', err);
        res.status(500).send('Error updating patient data: ' + err.message);
    }
});

// Define the getPatientDetails route
app.get('/getPatientDetails/:id', async (req, res) => {
    try {
        const patientId = req.params.id;
        const patient = await Patient.findById(patientId);

        if (patient) {
            res.json(patient); // Return patient details
        } else {
            res.status(404).json({ message: 'Patient not found' }); // Return 404 if patient is not found
        }
    } catch (err) {
        console.error('Error getting patient details:', err);
        res.status(500).json({ message: 'Error getting patient details: ' + err.message });
    }
});

// Define the saveTestCard route by patient account number
app.post('/saveTestCardByAccount/:accountNumber', async (req, res) => {
    try {
        const accountNumber = req.params.accountNumber;
        const testCardDetails = req.body;

        // Find the patient by account number
        const patient = await Patient.findOne({ accountNumber });
        if (!patient) {
            return res.status(404).send('Patient not found');
        }

        // Ensure the testCards array exists and add the new test card details
        if (!patient.testCards) {
            patient.testCards = [];
        }
        patient.testCards.push(testCardDetails);

        // Save the updated patient document
        await patient.save();

        res.status(200).send('Test card details saved successfully');
    } catch (err) {
        console.error('Error saving test card details:', err);
        res.status(500).send('Error saving test card details: ' + err.message);
    }
});

// Define the getTestCards route
app.get('/getTestCards/:patientId', async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' }); // JSON error response
        }

        res.json(patient.testCards || []);
    } catch (err) {
        console.error('Error retrieving test cards:', err);
        res.status(500).json({ error: 'Error retrieving test cards: ' + err.message }); // JSON error response
    }
});

// Define the deleteTestCard route
app.delete('/deleteTestCard/:patientId/:testCardId', async (req, res) => {
    try {
        const { patientId, testCardId } = req.params;
        // Find the patient by ID
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).send('Patient not found');
        }

        // Filter out the test card to be deleted
        patient.testCards = patient.testCards.filter(card => card._id.toString() !== testCardId);

        // Save the updated patient document
        await patient.save();

        res.status(200).send('Test card deleted successfully');
    } catch (err) {
        console.error('Error deleting test card:', err);
        res.status(500).send('Error deleting test card: ' + err.message);
    }
});

// Define the deletePatient route
app.delete('/deletePatient/:id', async (req, res) => {
    try {
        const patientId = req.params.id;
        console.log(`Received request to delete patient with ID: ${patientId}`);
        // Delete the patient document by ID
        const result = await Patient.findByIdAndDelete(patientId);

        if (result) {
            console.log('Patient deleted successfully:', result);
            res.status(200).send('Patient deleted successfully');
        } else {
            console.error('Patient not found');
            res.status(404).send('Patient not found');
        }
    } catch (err) {
        console.error('Error deleting patient:', err);
        res.status(500).send('Error deleting patient: ' + err.message);
    }
});

// Serve static files from the Patient directory
app.use(express.static(path.join(__dirname, 'Patient')));

// Fallback route to serve HTML page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Patient', 'patient.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
