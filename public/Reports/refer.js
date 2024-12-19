document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('referralButton').addEventListener('click', () => {
        // Create a new window for the referral letter
        const referralWindow = window.open('', '_blank');
        referralWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Referral Letter</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 800px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        background-color: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .form-group {
                        margin-bottom: 15px;
                    }
                    .form-group label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }
                    .form-group input, .form-group textarea, .form-group select {
                        width: 100%;
                        padding: 8px;
                        box-sizing: border-box;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
                    table {
                        width: 100%; /* Make the table wider */
                        border-collapse: collapse;
                        margin-bottom: 15px;
                    }
                    table, th, td {
                        border: 1px solid #ccc;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left; /* Align text to the left */
                    }
                    th {
                        background-color: #4CAF50; /* Green theme */
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2; /* Light gray for even rows */
                    }
                    .small-input {
                        width: 50px; /* Fixed width */
                        display: inline-block;
                        margin-left: 10px; /* Optional: Adjust spacing */
                        text-align: left; /* Align text to the left */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Referral Letter to Ophthalmologist</h1>
                    <form id="referralForm">
                        <div class="form-group">
                            <label for="eyeTestDate">Date of Eye Test:</label>
                            <input type="date" id="eyeTestDate" name="eyeTestDate" value="${document.getElementById('eyeTestDate').value}" class="small-input">
                        </div>
                        <div class="form-group">
                            <label for="recipientName">Dear:</label>
                            <input type="text" id="recipientName" name="recipientName" value="${document.getElementById('recipientName').value}">
                        </div>
                        <div class="form-group">
                            <label for="patientName">Patient Name:</label>
                            <input type="text" id="patientName" name="patientName" value="${document.getElementById('patientName').value}">
                        </div>
                        <div class="form-group">
                            <label for="spectaclePrescription">Spectacle Prescription:</label>
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>VA</th>
                                        <th>Sphere</th>
                                        <th>/</th>
                                        <th>Cylinder</th>
                                        <th>x</th>
                                        <th>Axis</th>
                                        <th>Aided VA</th>
                                        <th>IOP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>OD</td>
                                        <td><input type="text" id="vaOD" name="vaOD" value="${document.getElementById('vaOD').value}"></td>
                                        <td><input type="text" id="sphereOD" name="sphereOD" value="${document.getElementById('sphereOD').value}"></td>
                                        <td>/</td>
                                        <td><input type="text" id="cylinderOD" name="cylinderOD" value="${document.getElementById('cylinderOD').value}"></td>
                                        <td>x</td>
                                        <td><input type="text" id="axisOD" name="axisOD" value="${document.getElementById('axisOD').value}"></td>
                                        <td><input type="text" id="aidedVaOD" name="aidedVaOD" value="${document.getElementById('aidedVaOD').value}"></td>
                                        <td><input type="text" id="iopOD" name="iopOD" value="${document.getElementById('iopOD').value}"></td>
                                    </tr>
                                    <tr>
                                        <td>OS</td>
                                        <td><input type="text" id="vaOS" name="vaOS" value="${document.getElementById('vaOS').value}"></td>
                                        <td><input type="text" id="sphereOS" name="sphereOS" value="${document.getElementById('sphereOS').value}"></td>
                                        <td>/</td>
                                        <td><input type="text" id="cylinderOS" name="cylinderOS" value="${document.getElementById('cylinderOS').value}"></td>
                                        <td>x</td>
                                        <td><input type="text" id="axisOS" name="axisOS" value="${document.getElementById('axisOS').value}"></td>
                                        <td><input type="text" id="aidedVaOS" name="aidedVaOS" value="${document.getElementById('aidedVaOS').value}"></td>
                                        <td><input type="text" id="iopOS" name="iopOS" value="${document.getElementById('iopOS').value}"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="form-group">
                            <label for="referralReason">Reason for Referral:</label>
                            <textarea id="referralReason" name="referralReason" rows="4">${document.getElementById('referralReason').value}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="additionalNotes">Additional Notes:</label>
                            <textarea id="additionalNotes" name="additionalNotes" rows="4">${document.getElementById('additionalNotes').value}</textarea>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </body>
            </html>
        `);
    });

    document.getElementById('emailButton').addEventListener('click', () => {
        // Logic to email the referral letter
        alert('Email functionality is not implemented yet.');
    });

    document.getElementById('printButton').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        // Navigate to the patient.html file and focus on the "Write Report" section
        window.location.href = '/Patient/patient.html#writeReport';
    });

    document.getElementById("backButton").addEventListener("click", function() {
        window.history.back();
    });
});