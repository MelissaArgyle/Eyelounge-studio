
document.addEventListener('DOMContentLoaded', function() {
    const newPatientBtn = document.getElementById('newPatientBtn');
    const patientWizardBtn = document.getElementById('patientWizardBtn');
    const writeReportBtn = document.getElementById('writeReportBtn');
    const currentBtn = document.getElementById('currentBtn');
    const continueBtn = document.getElementById('continueBtn');
    const newPatientForm = document.getElementById('newPatientForm');
    const patientWizard = document.getElementById('patientWizard');
    const writeReport = document.getElementById('writeReport');
    const currentForm = document.getElementById('currentForm');
    const actionButtonsContainer = document.getElementById('actionButtonsContainer');
    const patientNameDisplay = document.getElementById('patientNameDisplay');
    const clearBtn = document.getElementById('clearBtn'); 
    const confirmMessage = document.getElementById('confirmMessage'); 
    const confirmClearBtn = document.getElementById('confirmClearBtn'); 
    const cancelClearBtn = document.getElementById('cancelClearBtn');

    
    // Initialize the New Patient button as active by default
    newPatientBtn.classList.add('active');
    newPatientForm.classList.add('active');

    // Event listener for the New Patient button
    // Shows the new patient form and hides other sections
    newPatientBtn.addEventListener('click', function() {
        newPatientForm.classList.add('active');
        patientWizard.classList.remove('active');
        writeReport.classList.remove('active');
        currentForm.classList.remove('active');
    });

   /*
    * Event listeners for saving a new patient and for saving and continuing to the next step.
    * When the save button is clicked, the patient information from the form is validated and sent to the server.
    * If the save operation is successful, a success message is displayed and the form is reset.
    * When the save and continue button is clicked, the patient information is saved and additional actions are performed:
    *  - Store patient details in localStorage.
    *  - Run the patient wizard and trigger a search.
    *  - Check for unsaved values in the test card and handle them accordingly.
    *  - Navigate to the test card form and update the UI.
    */

     // Function to save patient details to the database
     async function savePatientDetails(isContinue = false) {
        const patientForm = document.getElementById('patientForm');

        // Create a new patient object with form values
        const newPatient = {
            name: patientForm.name.value.trim(),
            surname: patientForm.surname.value.trim(),
            age: patientForm.age.value.trim(),
            gender: patientForm.gender.value.trim(),
            contact: patientForm.contact.value.trim(),
            idNumber: patientForm.idNumber.value.trim(),
            email: patientForm.email.value.trim(),
            accountNumber: new Date().getTime() // Generate a simple account number using the current timestamp
        };

        // Validate form fields to ensure no field is left empty
        if (!newPatient.name || !newPatient.surname || !newPatient.age || !newPatient.gender || !newPatient.contact || !newPatient.idNumber || !newPatient.email) {
            document.getElementById('validationMessage').style.display = 'block'; // Show validation message
            setTimeout(() => {
                document.getElementById('validationMessage').style.display = 'none';
            }, 5000);
            return; // Stop the function if validation fails
        }

        // Try to send the patient data to the server
        try {
            const response = await fetch('http://localhost:3000/savePatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPatient)
            });

            if (response.ok) {
                document.getElementById('saveMessage').style.display = 'block'; // Show success message
                setTimeout(() => {
                    document.getElementById('saveMessage').style.display = 'none';
                }, 5000);
                patientForm.reset(); // Clear form fields after successful save

                if (isContinue) {
                    // Store patient details in localStorage
                    localStorage.setItem('selectedPatientAccount', newPatient.accountNumber);
                    localStorage.setItem('testCardPatientName', newPatient.name);
                    localStorage.setItem('testCardPatientSurname', newPatient.surname);
                    localStorage.setItem('testCardPatientAccount', newPatient.accountNumber);
                    localStorage.setItem('patientId', newPatient.idNumber);
                    localStorage.setItem('patientContact', newPatient.contact);
                    localStorage.setItem('patientEmail', newPatient.email);
                    console.log('Selected patient details saved to localStorage:', newPatient.accountNumber);

                    // Run patient wizard and trigger search
                    runPatientWizard(newPatient.name, newPatient.surname, newPatient.idNumber);

                    // Check for unsaved values in test card
                    if (hasUnsavedValues()) {
                        showPopup('There are currently unsaved values in the Test Card. Do you wish to continue before saving?', function(confirm) {
                            if (confirm) {
                                clearTestCardFields();
                                navigateToTestCardForm();
                            }
                        });
                    } else {
                        clearTestCardFields();
                        navigateToTestCardForm();
                    }
                }
            } else {
                throw new Error('Error saving patient data.');
            }
        } catch (error) {
            console.error('Error saving patient:', error);
            alert('Error saving patient: ' + error.message);
        }
    }

    // Event listener for Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            await savePatientDetails(false); // Only save details, do not continue
        });
    }
          
    if (continueBtn) {
        continueBtn.addEventListener('click', async function() {
            console.log("Save and Continue button clicked");
            await savePatientDetails(true); // Save details and continue
        });
    }
       
    // Helper function to clear all test card fields
    function clearTestCardFields() {
        const fieldsToClear = [
            'chiefComplaint', 'pd', 'iop_OD', 'iop_OS', 'colorVision', 'notes', 'contrastSensitivity',
            'odValue', 'osValue', 'sc-RE', 'sc-LE', 'sc-OU', 'cc-RE', 'cc-LE', 'cc-OU',
            'spectacles_OD_sphere', 'spectacles_OD_cylinder', 'spectacles_OD_axis', 'spectacles_OD_add',
            'spectacles_OS_sphere', 'spectacles_OS_cylinder', 'spectacles_OS_axis', 'spectacles_OS_add'
        ];

        fieldsToClear.forEach(field => localStorage.removeItem(field));

        // Clear form fields
        if (document.getElementById('chiefComplaint')) document.getElementById('chiefComplaint').value = '';
        if (document.getElementById('pd')) document.getElementById('pd').value = '';
        if (document.getElementById('iop_OD')) document.getElementById('iop_OD').value = '';
        if (document.getElementById('iop_OS')) document.getElementById('iop_OS').value = '';
        if (document.getElementById('colorVision')) document.getElementById('colorVision').value = '';
        if (document.getElementById('notes')) document.getElementById('notes').value = '';
        if (document.getElementById('odValue')) document.getElementById('odValue').value = '';
        if (document.getElementById('osValue')) document.getElementById('osValue').value = '';
        if (document.getElementById('contrastSensitivity')) document.getElementById('contrastSensitivity').value = '';
        if (document.getElementById('sc-RE')) document.getElementById('sc-RE').value = '';
        if (document.getElementById('sc-LE')) document.getElementById('sc-LE').value = '';
        if (document.getElementById('sc-OU')) document.getElementById('sc-OU').value = '';
        if (document.getElementById('cc-RE')) document.getElementById('cc-RE').value = '';
        if (document.getElementById('cc-LE')) document.getElementById('cc-LE').value = '';
        if (document.getElementById('cc-OU')) document.getElementById('cc-OU').value = '';
        if (document.getElementById('spectacles_OD_sphere')) document.getElementById('spectacles_OD_sphere').value = '';
        if (document.getElementById('spectacles_OD_cylinder')) document.getElementById('spectacles_OD_cylinder').value = '';
        if (document.getElementById('spectacles_OD_axis')) document.getElementById('spectacles_OD_axis').value = '';
        if (document.getElementById('spectacles_OD_add')) document.getElementById('spectacles_OD_add').value = '';
        if (document.getElementById('spectacles_OS_sphere')) document.getElementById('spectacles_OS_sphere').value = '';
        if (document.getElementById('spectacles_OS_cylinder')) document.getElementById('spectacles_OS_cylinder').value = '';
        if (document.getElementById('spectacles_OS_axis')) document.getElementById('spectacles_OS_axis').value = '';
        if (document.getElementById('spectacles_OS_add')) document.getElementById('spectacles_OS_add').value = '';

        // Regenerate fields to clear visual acuity and spectacles values
        generateVAFields();
        generateSpectaclesFields();
    }

    // Function to check for unsaved values in test card
    function hasUnsavedValues() {
        const fieldsToCheck = [
            'chiefComplaint', 'pd', 'iop_OD', 'iop_OS', 'colorVision', 'notes', 'contrastSensitivity',
            'odValue', 'osValue', 'sc-RE', 'sc-LE', 'sc-OU', 'cc-RE', 'cc-LE', 'cc-OU',
            'spectacles_OD_sphere', 'spectacles_OD_cylinder', 'spectacles_OD_axis', 'spectacles_OD_add',
            'spectacles_OS_sphere', 'spectacles_OS_cylinder', 'spectacles_OS_axis', 'spectacles_OS_add'
        ];

        return fieldsToCheck.some(field => localStorage.getItem(field));
    }

    // Function to show a popup message
    function showPopup(message, callback) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.color = 'black';
        popup.style.padding = '20px';
        popup.style.border = '2px solid black';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'center';

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        popup.appendChild(messageDiv);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'popup-buttons';
        popup.appendChild(buttonsDiv);

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.addEventListener('click', () => {
            document.body.removeChild(popup);
            callback(true);
        });
        buttonsDiv.appendChild(yesButton);

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.addEventListener('click', () => {
            document.body.removeChild(popup);
            callback(false);
        });
        buttonsDiv.appendChild(noButton);

        document.body.appendChild(popup);
    }


    // Function to run patient wizard
    function runPatientWizard(name, surname, id) {
        const searchBar = document.getElementById('searchBar');
        searchBar.value = `${name} ${surname} ${id}`;
        localStorage.setItem('searchQuery', searchBar.value);
        console.log('Patient details written into the search bar:', searchBar.value);

        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.click(); // Trigger search button click
        }
    }

    // Function to navigate to the test card form
    function navigateToTestCardForm() {
        // Hide all form containers
        document.querySelectorAll('.form-container').forEach(function(container) {
            container.classList.remove('active');
        });

        // Show the test card form container
        const currentForm = document.getElementById('currentForm');
        if (currentForm) {
            currentForm.classList.add('active');
        }

        // Display patient details on top of the test card
        const storedPatientName = localStorage.getItem('testCardPatientName');
        const storedPatientSurname = localStorage.getItem('testCardPatientSurname');
        const storedPatientAccount = localStorage.getItem('testCardPatientAccount');
        const patientNameDisplay = document.getElementById('patientNameDisplay');
        if (patientNameDisplay && storedPatientName && storedPatientSurname) {
            patientNameDisplay.textContent = `${storedPatientName} ${storedPatientSurname} (Account ${storedPatientAccount})`;
        }
    }
    // Function to generate visual acuity fields
    function generateVAFields() {
        console.log("Generating VA fields");
        // Add your implementation here
    }

    // Function to generate spectacles fields
    function generateSpectaclesFields() {
        console.log("Generating Spectacles fields");
        // Add your implementation here
    }

    //END OF NEW PATIENT SECTION


        
    //PATIENT WIZARD SECTION

    // Event listener for the Patient Wizard button
    patientWizardBtn.addEventListener('click', function() {
        newPatientForm.classList.remove('active');
        patientWizard.classList.add('active');
        writeReport.classList.remove('active');
        currentForm.classList.remove('active');

        const editBtn = document.getElementById('Createnewtest');
        if (editBtn.style.display !== 'none') {
            actionButtonsContainer.style.display = 'flex'; // Show the action buttons container
        }

    });

    /*
    * This function searches for patients based on the provided query.
    * It sends a GET request to the server with the search query and processes the response.
    * If patients are found, they are displayed in the patient summary section.
    * Clicking on a patient element triggers the selection of that patient.
    */// Function to search for patients based on the query
    document.getElementById('searchBar').addEventListener('input', function() {
        const query = this.value.trim();
        if (query) {
            searchPatients(query);
        } else {
            document.getElementById('patientSummary').innerHTML = ''; // Clear results if search bar is empty
        }
    });
    
    async function searchPatients(query) {
        // Clear only the specific items related to search context, not the entire localStorage
        localStorage.removeItem('selectedPatientAccount');
        localStorage.removeItem('testCardPatientName');
        localStorage.removeItem('testCardPatientSurname');
        localStorage.removeItem('testCardPatientAccount');
        localStorage.removeItem('patientId');
        localStorage.removeItem('patientContact');
        localStorage.removeItem('patientEmail');
        localStorage.removeItem('testCards');
        console.log('Search-related local storage items cleared before new search');
    
        try {
            const response = await fetch(`http://localhost:3000/searchPatient?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const patients = await response.json();
            console.log('Patients found:', patients);
    
            const patientSummary = document.getElementById('patientSummary');
            patientSummary.innerHTML = ''; // Clear previous results
    
            if (patients.length > 0) {
                patients.forEach(patient => {
                    const patientElement = document.createElement('div');
                    patientElement.classList.add('patient-option');
                    patientElement.textContent = `${patient.name} ${patient.surname} - ID: ${patient.idNumber.substring(0, 3)}****`;
    
                    // Add hover effect to indicate it can be clicked
                    patientElement.style.cursor = 'pointer';
                    patientElement.style.padding = '5px';
                    patientElement.style.border = '1px solid #ccc';
                    patientElement.style.marginTop = '2px';
    
                    patientElement.onmouseover = function() {
                        this.style.backgroundColor = '#f0f0f0';
                    };
                    patientElement.onmouseout = function() {
                        this.style.backgroundColor = '#fff';
                    };
    
                    // Click event to insert full name, surname, and ID into the search bar
                    patientElement.onclick = function() {
                        const fullNameID = `${patient.name} ${patient.surname} ${patient.idNumber}`;
                        document.getElementById('searchBar').value = fullNameID;
                        localStorage.setItem('selectedPatientAccount', patient.accountNumber);
                        localStorage.setItem('testCardPatientName', patient.name);
                        localStorage.setItem('testCardPatientSurname', patient.surname);
                        localStorage.setItem('testCardPatientAccount', patient.accountNumber);
                        localStorage.setItem('patientId', patient._id.$oid || patient._id);
                        localStorage.setItem('patientContact', patient.contact);
                        localStorage.setItem('patientEmail', patient.email);
                        localStorage.setItem('testCards', JSON.stringify(patient.testCards)); // Save test cards
                        console.log('Selected patient details saved to localStorage:', patient.accountNumber);
                        console.log('Inserted into search bar:', fullNameID);
    
                        // Additionally, display selected patient details
                        selectPatient(patient._id.$oid || patient._id, patient.name, patient.surname, patient.accountNumber, patient.contact, patient.email);
                    };
    
                    patientSummary.appendChild(patientElement);
                });
            } else {
                alert('No patients found');
            }
        } catch (error) {
            console.error('Error searching for patients:', error);
            alert('Error searching for patients: ' + error.message);
        }
    }
    
    // Function to select and store patient details
    function selectPatient(patientId, patientName, patientSurname, patientAccount, patientContact, patientEmail) {
        console.log('Selecting patient:', patientId, patientName, patientSurname, patientAccount);
    
        if (!patientId) {
            console.error('Error: patientId is not defined in selectPatient.');
            return;
        }
    
        localStorage.setItem('patientId', patientId);
        localStorage.setItem('testCardPatientName', patientName);
        localStorage.setItem('testCardPatientSurname', patientSurname);
        localStorage.setItem('testCardPatientAccount', patientAccount);
        localStorage.setItem('patientContact', patientContact);
        localStorage.setItem('patientEmail', patientEmail);
    
        console.log('Stored in localStorage:', {
            patientId: localStorage.getItem('patientId'),
            patientName: localStorage.getItem('testCardPatientName'),
            patientSurname: localStorage.getItem('testCardPatientSurname'),
            patientAccount: localStorage.getItem('testCardPatientAccount'),
            patientContact: localStorage.getItem('patientContact'),
            patientEmail: localStorage.getItem('patientEmail')
        });
    
        document.getElementById('patientName').textContent = patientName;
        document.getElementById('patientSurname').textContent = patientSurname;
        document.getElementById('patientContact').textContent = patientContact;
        document.getElementById('patientEmail').textContent = patientEmail;
        document.getElementById('patientAccount').textContent = `Account ${patientAccount}`;
    
        console.log('Patient selected:', patientId, patientName, patientSurname, patientAccount);
    }
    
    // Add event listener for the search button
    document.getElementById('searchBtn').addEventListener('click', function() {
        const query = document.getElementById('searchBar').value.trim();
        if (query) {
            searchPatients(query);
        }
    });
    


    /*
    * Function to display the details of the previous test card for a patient.
    * - Retrieves the `testCardDetails` element where the test card details will be displayed.
    * - Attempts to retrieve an array of test cards from localStorage.
    * - If test cards are found, displays the details of the most recent test card.
    * - If no test cards are found, attempts to retrieve individual test card details from localStorage as a fallback.
    * - Logs relevant information for debugging.
    * - If the `previousTestCardBtn` element is found, adds an event listener to it to call this function when clicked.
    */
    function showPreviousTestCard() {
        console.log("Button clicked"); // Debug log for button click
    
        const testCardDetailsDiv = document.getElementById('testCardDetails');
        const savedRecordDetailsDiv = document.getElementById('savedRecordDetails');
    
        if (!testCardDetailsDiv) {
            console.error('Element testCardDetails not found.');
            return;
        }
    
        console.log("testCardDetailsDiv found"); // Debug log for element found
    
        // Hide other sections
        if (savedRecordDetailsDiv) {
            savedRecordDetailsDiv.classList.add('hidden');
        }
    
        // Show the test card details
        testCardDetailsDiv.classList.remove('hidden');
    
        let testCardDetailsHtml = '';
    
        const patientTestCards = JSON.parse(localStorage.getItem('testCards'));
        console.log('Retrieved patientTestCards from localStorage:', patientTestCards); // Debug log for localStorage retrieval
    
        if (patientTestCards && patientTestCards.length > 0) {
            const testCard = patientTestCards[0]; // Show the most recent test card
    
            console.log('Test Card Details:', testCard); // Debug log for test card details
    
            testCardDetailsHtml = `
                <h3>Previous Test Card Details</h3>
                <p><strong>Date of eye test:</strong> ${new Date(testCard.date).toLocaleDateString()}</p>
                <p><strong>Chief Complaint:</strong> ${testCard.chiefComplaint}</p>
                <p><strong>PD:</strong> ${testCard.pd}</p>
                <p><strong>IOP:</strong> OD ${testCard.iop_OD} OS ${testCard.iop_OS}</p>
                <p><strong>Rx:</strong></p>
                <p>OD ${testCard.scRE}, ${testCard.spectacles_OD_sphere} / ${testCard.spectacles_OD_cylinder} x ${testCard.spectacles_OD_axis}, ${testCard.ccRE}, Add ${testCard.spectacles_OD_add}</p>
                <p>OS ${testCard.scLE}, ${testCard.spectacles_OS_sphere} / ${testCard.spectacles_OS_cylinder} x ${testCard.spectacles_OS_axis}, ${testCard.ccLE}, Add ${testCard.spectacles_OS_add}</p>
                <p><strong>Color Vision:</strong> ${testCard.colorVision}</p>
                <p><strong>Contrast Sensitivity:</strong> ${testCard.contrastSensitivity}</p>
                <p><strong>Notes:</strong> ${testCard.notes}</p>
            `;
        } else {
            console.warn('No test cards found in localStorage'); // Debug log for no test cards
    
            // Fallback logic if no test cards found
            testCardDetailsHtml = '<p>No previous test card available.</p>';
        }
    
        testCardDetailsDiv.innerHTML = testCardDetailsHtml || '<p>No previous test card available.</p>';
    }
    
    
    function hideAllSections() {
        const testCardDetailsDiv = document.getElementById('testCardDetails');
        const savedRecordDetailsDiv = document.getElementById('savedRecordDetails');
        const newFormContainer = document.getElementById('newFormContainer'); // Assuming you have this div for new forms
    
        if (testCardDetailsDiv) {
            testCardDetailsDiv.classList.add('hidden');
            testCardDetailsDiv.innerHTML = ''; // Clear content
        }
        if (savedRecordDetailsDiv) {
            savedRecordDetailsDiv.classList.add('hidden');
        }
        if (newFormContainer) {
            newFormContainer.classList.add('hidden');
        }
    }
    
    // Example of another function to open a different form
    function openNewForm() {
        hideAllSections();
        // Code to display the new form goes here
        const newFormContainer = document.getElementById('newFormContainer'); // Assuming you have this div for new forms
        if (newFormContainer) {
            newFormContainer.classList.remove('hidden');
        }
    }
    
    // Adding event listeners to clear previous test card details before showing new content
    const previousTestCardBtn = document.getElementById('previousTestCardBtn');
    if (previousTestCardBtn) {
        previousTestCardBtn.addEventListener('click', showPreviousTestCard);
    } else {
        console.error('Element previousTestCardBtn not found.');
    }
    
    /*
    const otherActionBtn = document.getElementById('otherActionBtn');
    if (otherActionBtn) {
        otherActionBtn.addEventListener('click', () => {
            hideAllSections();
            document.getElementById('savedRecordDetails').classList.remove('hidden');
        });
    } else {
        console.error('Element otherActionBtn not found.');
    }
    
    const newActionBtn = document.getElementById('newActionBtn');
    if (newActionBtn) {
        newActionBtn.addEventListener('click', openNewForm);
    } else {
        console.error('Element newActionBtn not found.');
    }
    */
 
    
    /*
    * Event listener for the search button (Patient Wizard).
    * When the search button is clicked, it retrieves the search query from the input field,
    * sends a GET request to the server to search for patients, and displays the results.
    */
    document.getElementById('searchBtn').addEventListener('click', async function() {
        const query = document.getElementById('searchBar').value.trim(); // Get query from the search bar, trim whitespace

        try {
            const response = await fetch(`http://localhost:3000/searchPatient?query=${encodeURIComponent(query)}`); // Send a GET request to search for patients
            if (!response.ok) {
                if (response.status === 404) {
                    document.getElementById('notFoundMessage').style.display = 'block'; // Show "Patient does not exist" message
                    document.getElementById('deleteMessage').style.display = 'none'; // Hide delete message if shown previously
                    return; // Exit the function if no patients are found
                }
                throw new Error('Network response was not ok'); // Handle network errors
            }

            const patients = await response.json(); // Parse the JSON response
            document.getElementById('notFoundMessage').style.display = 'none'; // Hide "Patient does not exist" message if patients are found

            // Clear previous details and record forms
            const savedRecordDetails = document.getElementById('savedRecordDetails');
            const patientNameDisplay = document.getElementById('patientNameDisplay');
            if (savedRecordDetails) {
                savedRecordDetails.innerHTML = ''; // Clear saved record details
            }
            if (patientNameDisplay) {
                patientNameDisplay.textContent = ''; // Clear patient name display
            }

            const highlightQuery = (text, query) => {
                const regex = new RegExp(`(${query})`, 'gi');
                return text.replace(regex, '<strong>$1</strong>');
            };

            if (patients.length > 1) {
                // Display basic patient details if multiple patients are found
                const patientSummary = document.getElementById('patientSummary');
                if (patientSummary) {
                    patientSummary.innerHTML = ''; // Clear previous patient summary

                    // Add the "Choose from search results:" message
                    patientSummary.innerHTML += `<p><strong>Choose from search results:</strong></p>`;

                    patients.forEach(patient => {
                        const name = highlightQuery(patient.name, query);
                        const surname = highlightQuery(patient.surname, query);
                        const idNumber = highlightQuery(patient.idNumber, query);

                        patientSummary.innerHTML += `
                            <div class="patient-card" onclick="window.loadPatientDetails('${patient._id}')">
                                <p>${name} ${surname} ${idNumber}</p>
                            </div>
                        `;
                    });
                }
            } else if (patients.length === 1) {
                // If only one patient is found, load their details immediately
                window.loadPatientDetails(patients[0]._id);
            } else {
                // Handle case when no patients are found
                document.getElementById('notFoundMessage').style.display = 'block'; // Show "Patient does not exist" message
                document.getElementById('patientSummary').innerHTML = ''; // Clear previous patient summary
            }
        } catch (error) {
            console.error('Error searching for patients:', error);
            alert('Error searching for patients: ' + error.message); // Show error message
        }
    });


    /*
    * This function retrieves and displays detailed patient information when a patient card is clicked.
    * It sends a GET request to the server to fetch the patient's details based on the provided patient ID.
    * If the request is successful, it displays the patient's information and sets up event listeners
    * for editing, saving changes, and deleting the patient.
    */

    // Define the function in the global scope so it can be accessed when the patient card is clicked
    // Override the alert function to log the message instead of displaying an alert
    window.alert = function(message) {
        console.log('Alert prevented:', message);
    };

    window.loadPatientDetails = async function(patientId) {
        try {
            // Send a GET request to get detailed patient info
            const response = await fetch(`http://localhost:3000/getPatientDetails/${patientId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Handle network errors
            }

            const patient = await response.json(); // Parse the JSON response

            // Clear previous details and record forms
            const savedRecordDetails = document.getElementById('savedRecordDetails');
            const patientNameDisplay = document.getElementById('patientNameDisplay');
            if (savedRecordDetails) {
                savedRecordDetails.innerHTML = ''; // Clear saved record details
            }
            if (patientNameDisplay) {
                patientNameDisplay.textContent = ''; // Clear patient name display
            }

            // Display detailed patient information
            const patientSummary = document.getElementById('patientSummary');
            if (patientSummary) {
                patientSummary.innerHTML = `
                    <p><strong>Name:</strong> <span id="patientName">${patient.name}</span></p>
                    <p><strong>Surname:</strong> <span id="patientSurname">${patient.surname}</span></p>
                    <p><strong>Age:</strong> ${patient.age}</span></p>
                    <p><strong>Gender:</strong> ${patient.gender}</span></p>
                    <p><strong>ID Number:</strong> ${patient.idNumber}</span></p>
                    <p><strong>Email:</strong> <span id="patientEmail">${patient.email}</span></p>
                    <p><strong>Contact:</strong> <span id="patientContact">${patient.contact}</span></p>
                    <p><strong>Account Number:</strong> ${patient.accountNumber}</span></p>
                    <button id="editBtn" class="button-edit" style="display:inline;">Edit</button>
                    <button id="saveChangesBtn" class="button-24" style="display:none; background-color: green;">Save Changes</button>
                    <button id="deleteBtn" class="delete-btn" style="display:inline;">
                        <i class="fas fa-trash" style="color: red;"></i> <!-- Only icon, no text -->
                    </button>
                    <div id="confirmDelete" class="yes-no-buttons" style="display:none; color:red;">
                        <p>Are you sure you want to delete this file?</p>
                        <button id="confirmDeleteBtn">Yes</button>
                        <button id="cancelDeleteBtn">No</button>
                    </div>
                `;

                // Apply additional styles to position the delete button within its container
                const deleteBtn = document.getElementById('deleteBtn');
                if (deleteBtn) {
                    deleteBtn.style.position = 'relative';
                    deleteBtn.style.top = '3px';   // Adjust top position to move it down
                    deleteBtn.style.right = '-10px'; // Adjust right position to move it left within the container
                }

                // Store patient details in local storage
                localStorage.setItem('patientId', patient._id);
                localStorage.setItem('testCardPatientName', patient.name);
                localStorage.setItem('testCardPatientSurname', patient.surname);
                localStorage.setItem('testCardPatientAccount', patient.accountNumber);
                localStorage.setItem('patientContact', patient.contact);
                localStorage.setItem('patientEmail', patient.email);

                // Event listener for the Edit button
                document.getElementById('editBtn').addEventListener('click', function() {
                    toggleEdit(true); // Enable edit mode
                });

                // Event listener for the Save Changes button
                document.getElementById('saveChangesBtn').addEventListener('click', async function() {
                    await saveChanges(patient._id); // Save changes

                    // Show success popup message within the app
                    showPopupMessage('Changes saved successfully!');
                });

                // Event listener for the Delete button
                document.getElementById('deleteBtn').addEventListener('click', function() {
                    const confirmDelete = document.getElementById('confirmDelete');
                    if (confirmDelete) {
                        confirmDelete.style.display = 'block'; // Show delete confirmation
                    }
                });

                // Event listener for confirming deletion
                document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
                    await deletePatient(patient._id); // Delete patient
                    document.getElementById('confirmDelete').style.display = 'none'; // Hide delete confirmation
                    document.getElementById('deleteMessage').style.display = 'block'; // Show success message

                    // Hide action buttons
                    document.getElementById('actionButtonsContainer').style.display = 'none';
                    document.getElementById('Createnewtest').style.display = 'none';
                });

                // Event listener for cancelling deletion
                document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
                    const confirmDelete = document.getElementById('confirmDelete');
                    if (confirmDelete) {
                        confirmDelete.style.display = 'none'; // Hide delete confirmation
                    }
                });

                // Ensure action buttons are visible
                document.getElementById('actionButtonsContainer').style.display = 'flex'; // Show action buttons container
                document.getElementById('Createnewtest').style.display = 'inline-block'; // Show new recording card button

                // Display patient details on top of the test card
                if (patientNameDisplay && patient.name && patient.surname) {
                    patientNameDisplay.textContent = `${patient.name} ${patient.surname} (Account ${patient.accountNumber})`;
                }
            }
        } catch (error) {
            console.error('Error loading patient details:', error);
            // Handle the error within the application, without using alert
            showPopupMessage('Error loading patient details: ' + error.message); // Show error message in popup
        }
    };

    // Function to show popup message
    function showPopupMessage(message) {
        const popup = document.createElement('div');
        popup.innerText = message;
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'lightgreen';
        popup.style.padding = '20px';
        popup.style.border = '2px solid #ccc';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'center';
        document.body.appendChild(popup);

        setTimeout(() => {
            document.body.removeChild(popup);
        }, 1500); // Popup will disappear after 3 seconds
    }
    
    /*
     * This function toggles the edit mode for patient details (patient wizard)
     * It replaces span elements with input elements for editing, or vice versa, depending on the editMode flag.
     */
    function toggleEdit(editMode) {
        const fields = ['patientName', 'patientSurname', 'patientContact', 'patientEmail'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                if (editMode) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = `${field}Input`;
                    input.value = element.textContent;
                    element.replaceWith(input); // Replace span with input for editing
                } else {
                    const inputElement = document.getElementById(`${field}Input`);
                    if (inputElement) {
                        const span = document.createElement('span');
                        span.id = field;
                        span.textContent = inputElement.value;
                        inputElement.replaceWith(span); // Replace input with span after editing
                    }
                }
            }
        });
        document.getElementById('editBtn').style.display = editMode ? 'none' : 'inline'; // Toggle edit button visibility
        document.getElementById('saveChangesBtn').style.display = editMode ? 'inline' : 'none'; // Toggle save button visibility
    }
    
    /*
     * This function saves the changes made to a patient's details.
     * It retrieves the updated patient information from the form, sends a PUT request to the server with the updated data,
     * and displays a success or error message based on the server's response.
     */
    async function saveChanges(patientId) {
        toggleEdit(false); // Disable edit mode
        const updatedPatient = {
            name: document.getElementById('patientName') ? document.getElementById('patientName').textContent : '',
            surname: document.getElementById('patientSurname') ? document.getElementById('patientSurname').textContent : '',
            contact: document.getElementById('patientContact') ? document.getElementById('patientContact').textContent : '',
            email: document.getElementById('patientEmail') ? document.getElementById('patientEmail').textContent : ''
        };
    
        try {
            // Send updated patient data to the server
            const response = await fetch(`http://localhost:3000/updatePatient/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPatient)
            });
            if (response.ok) {
                alert('Changes saved successfully!'); // Show success message
            } else {
                alert('Error saving changes.'); // Show error message
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error saving changes.'); // Show error message
        }
    }
    
    // Add initial class to ensure styling for edit and save buttons
    document.getElementById('editBtn').classList.add('button-edit');
    document.getElementById('saveChangesBtn').classList.add('button-24'); // Assuming save button style remains the same
    
    // Event listeners for the edit and save buttons
    document.getElementById('editBtn').addEventListener('click', function() {
        toggleEdit(true);
    });
    
    document.getElementById('saveChangesBtn').addEventListener('click', async function() {
        const patientId = localStorage.getItem('patientId');
        await saveChanges(patientId);
    });
    
    // Dynamically add class to delete button when it is created
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'deleteBtn') {
            document.getElementById('deleteBtn').classList.add('button-delete');
        }
    });
    
    
    /*
    * This function deletes a patient based on their ID.
    * It sends a DELETE request to the server to remove the patient and updates the UI based on the server's response.
    */
    async function deletePatient(patientId) {
        console.log(`Deleting patient with ID: ${patientId}`);
        try {
            // Send a DELETE request to delete the patient
            const response = await fetch(`http://localhost:3000/deletePatient/${patientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                console.log("Patient deleted successfully");
                document.getElementById('patientSummary').innerHTML = ''; // Clear patient summary
                document.getElementById('deleteMessage').style.display = 'block'; // Show success message
                document.getElementById('actionButtonsContainer').style.display = 'none'; // Hide action buttons
                document.getElementById('Createnewtest').style.display = 'none'; // Hide new recording card button
            } else {
                console.error("Error deleting patient, response status:", response.status);
                alert('Error deleting patient.'); // Show error message
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Error deleting patient.'); // Show error message
        }
    }

    // Event listener for Createnewtest to navigate to the test card form
    const createnewtestBtn = document.getElementById('Createnewtest');
    if (createnewtestBtn) {
        createnewtestBtn.addEventListener('click', function() {
            // Hide all form containers
            document.querySelectorAll('.form-container').forEach(function(container) {
                container.classList.remove('active');
            });

            // Show the test card form container
            const currentForm = document.getElementById('currentForm');
            if (currentForm) {
                currentForm.classList.add('active');
            }

            // Display patient details on top of the test card
            const storedPatientName = localStorage.getItem('testCardPatientName');
            const storedPatientSurname = localStorage.getItem('testCardPatientSurname');
            const storedPatientAccount = localStorage.getItem('testCardPatientAccount');
            const patientNameDisplay = document.getElementById('patientNameDisplay');
            if (patientNameDisplay && storedPatientName && storedPatientSurname) {
                patientNameDisplay.textContent = `${storedPatientName} ${storedPatientSurname} (Account ${storedPatientAccount})`;
            }
        });
    }


    /*
    * Event listener for the "Clear Search" button. (Patient Wizard)
    * When clicked, this function clears the search bar, hides various messages, 
    * and clears previous patient search results from the display.
    */
    document.getElementById('clearSearchBtn').addEventListener('click', clearSearch);

    function clearSearch() {
        // Clear the search bar
        document.getElementById('searchBar').value = '';

        // Clear the patient summary section if it exists
        const patientSummary = document.getElementById('patientSummary');
        if (patientSummary) {
            patientSummary.innerHTML = '';
        }

        // Hide the "Create new test" button if it exists
        const createNewTestBtn = document.getElementById('Createnewtest');
        if (createNewTestBtn) {
            createNewTestBtn.style.display = 'none';
        }

        // Hide the action buttons container if it exists
        const actionButtonsContainer = document.getElementById('actionButtonsContainer');
        if (actionButtonsContainer) {
            actionButtonsContainer.style.display = 'none';
        }

        // Hide the delete message if it exists
        const deleteMessage = document.getElementById('deleteMessage');
        if (deleteMessage) {
            deleteMessage.style.display = 'none'; // Hide the delete message
        }

        // Hide the "Not Found" message if it exists
        const notFoundMessage = document.getElementById('notFoundMessage');
        if (notFoundMessage) {
            notFoundMessage.style.display = 'none'; // Hide the not found message
        }

        // Clear saved record details if they exist
        const savedRecordDetails = document.getElementById('savedRecordDetails');
        if (savedRecordDetails) {
            savedRecordDetails.innerHTML = ''; // Clear saved record details
        }

        // Clear the test card details if they exist
        const testCardDetails = document.getElementById('testCardDetails');
        if (testCardDetails) {
            testCardDetails.innerHTML = ''; // Clear test card details
        }
    }

    // END OF PATIENT WIZARD SECTION
    

    //START OF WRITE REPORT SECTION

    // Event listener for the Write Report button
    // Shows the write report form and hides other sections
    writeReportBtn.addEventListener('click', function() {
        newPatientForm.classList.remove('active');
        patientWizard.classList.remove('active');
        writeReport.classList.add('active');
        currentForm.classList.remove('active');
    });

    /*
    * Event listeners for report navigation buttons.
    * These listeners navigate the user to different report pages when the corresponding buttons are clicked.
    */
    document.getElementById("referralButton").addEventListener("click", function() {
        window.location.href = "../Reports/refer.html";
    });
    
    document.getElementById("rxButton").addEventListener("click", function() {
        window.location.href = "../Reports/Rx.html";
    });
    
    document.getElementById("proofOfEyeTestBtn").addEventListener("click", function() {
        window.location.href = "../Reports/proof.html";
    });
    

    //END OF WRITE REPORT SECTION

    //START OF CURRENT SECTION    
    
    /*
    * Event listener for the "Current" button click.
    * - Retrieves patient details from local storage.
    * - If patient details are found, deactivates other forms and activates the current form.
    * - Populates the current form with patient details and previously saved records.
    * - Loads saved values for chief complaint, notes, color vision, and contrast sensitivity from local storage.
    * - If no patient details are found, shows a popup message instructing the user to select a patient to create a new test card.
    */
    currentBtn.addEventListener('click', function() {
        const storedPatientName = localStorage.getItem('testCardPatientName');
        const storedPatientSurname = localStorage.getItem('testCardPatientSurname');
        const storedPatientAccount = localStorage.getItem('testCardPatientAccount');
      
        if (storedPatientName && storedPatientSurname && storedPatientAccount) {
          newPatientForm.classList.remove('active');
          patientWizard.classList.remove('active');
          writeReport.classList.remove('active');
          currentForm.classList.add('active');
          generateVAFields();
          generateSpectaclesFields();
      
          // Display the patient name, surname, and account number
          patientNameDisplay.textContent = `${storedPatientName} ${storedPatientSurname} Account ${storedPatientAccount}`;
      
          // Retrieve and display saved records
          const savedRecords = JSON.parse(localStorage.getItem('savedRecords')) || {};
          if (savedRecords[storedPatientName]) {
            displaySavedRecordDetails(storedPatientName, savedRecords[storedPatientName]);
          }
      
          // Load saved values for chief complaint and notes from local storage
          const chiefComplaintElement = document.getElementById('chiefComplaint');
          const notesElement = document.getElementById('notes');
          const colorVisionElement = document.getElementById('colorVision');
          const contrastSensitivityElement = document.getElementById('contrastSensitivity');
      
          if (chiefComplaintElement) {
            chiefComplaintElement.value = localStorage.getItem('chiefComplaint') || '';
          }
      
          if (notesElement) {
            notesElement.value = localStorage.getItem('notes') || '';
          }
      
          if (colorVisionElement) {
            colorVisionElement.value = localStorage.getItem('colorVision') || '';
          }
      
          const odValue = localStorage.getItem('odValue');
          const osValue = localStorage.getItem('osValue');
          if (contrastSensitivityElement && odValue && osValue) {
            contrastSensitivityElement.value = `OD: ${odValue} % and OS: ${osValue} %`;
          }
      
        } else {
          patientWizard.classList.add('active');
          newPatientForm.classList.remove('active');
          writeReport.classList.remove('active');
          currentForm.classList.remove('active');
      
          const message = document.createElement('div');
          message.id = 'popupMessage';
          message.textContent = 'Select patient to create a new test card.';
          document.body.appendChild(message);
          setTimeout(() => {
            document.body.removeChild(message);
          }, 5000);
        }
      });
      

    // Add event listener to clear patient name button in test card
    clearPatientNameBtn.addEventListener('click', function() {
        localStorage.removeItem('testCardPatientName');
        localStorage.removeItem('testCardPatientSurname');
        localStorage.removeItem('testCardPatientAccount');
        patientNameDisplay.textContent = '';
        alert('Patient name, surname, and account number have been cleared.');
    });
      

    /*
    * This function generates the Visual Acuity (VA) fields in the test card form.
    * It creates select elements for unaided VA options and input elements for other measurements like PD and IOP.
    * The function populates these elements with predefined values and retrieves saved values from local storage.
    * Event listeners are added to each input to save changes to local storage.
    */
    function generateVAFields() {
        console.log('Generating VA fields'); // Debug log
        const vaFields = document.getElementById('vaFields');
        vaFields.innerHTML = ''; // Clear existing elements
    
        // Define the options for Visual Acuity (VA)
        const vaOptions = ["-", "6/4.5", "6/6", "6/7.5", "6/9", "6/12", "6/15", "6/18", "6/24", "6/36", "6/60","20/200", "20/120", "20/80", "20/60", "20/50", "20/40", "20/30", "20/25", "20/20", "20/15"];
        const eyes = ["OD", "OS", "OU"];
    
        // Create table structure for VA fields
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.textContent = 'VAsc';
        headerRow.appendChild(headerCell);
    
        // Create table headers for each eye
        eyes.forEach(eye => {
            const th = document.createElement('th');
            th.textContent = eye;
            headerRow.appendChild(th);
        });
    
        // Create table headers for PD and IOP
        const pdHeader = document.createElement('th');
        pdHeader.textContent = 'PD';
        headerRow.appendChild(pdHeader);
    
        const iopHeader = document.createElement('th');
        iopHeader.textContent = 'IOP (OD)';
        headerRow.appendChild(iopHeader);
    
        const iopHeaderOS = document.createElement('th');
        iopHeaderOS.textContent = 'IOP (OS)';
        headerRow.appendChild(iopHeaderOS);
    
        table.appendChild(headerRow);
    
        // Create a row for Unaided VA
        const row = document.createElement('tr');
        const labelCell = document.createElement('td');
        labelCell.textContent = 'Unaided VA:';
        row.appendChild(labelCell);
    
        // Create and populate select elements for each eye
        eyes.forEach(eye => {
            const td = document.createElement('td');
            const select = document.createElement('select');
            const selectId = eye === 'OD' ? 'scRE' : eye === 'OS' ? 'scLE' : `unaidedVA_${eye}`;
            const selectName = eye === 'OD' ? 'scRE' : eye === 'OS' ? 'scLE' : `unaidedVA_${eye}`;
            select.id = selectId;
            select.name = selectName;
    
            // Add styles to the select elements
            select.style.height = '40px';  // Set consistent height
    
            vaOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });
    
            // Set the saved value from localStorage
            const key = eye === 'OD' ? 'sc-RE' : eye === 'OS' ? 'sc-LE' : 'sc-OU';
            const savedValue = localStorage.getItem(key);
            if (savedValue) {
                select.value = savedValue;
            }
    
            // Add event listener to save changes to local storage
            select.addEventListener('change', () => {
                localStorage.setItem(key, select.value);
            });
    
            td.appendChild(select);
            row.appendChild(td);
        });
    
        // Add input elements for PD, IOP (OD), and IOP (OS)
        const pdTd = document.createElement('td');
        const pdInput = document.createElement('input');
        pdInput.type = 'text';
        pdInput.id = 'pd';
        pdInput.name = 'pd';
        pdInput.style.width = '80px';  // Set custom width
        pdInput.style.height = '40px';  // Set consistent height
        pdTd.appendChild(pdInput);
        row.appendChild(pdTd);
    
        const iopTdOD = document.createElement('td');
        const iopInputOD = document.createElement('input');
        iopInputOD.type = 'text';
        iopInputOD.id = 'iop_OD';
        iopInputOD.name = 'iop_OD';
        iopInputOD.style.width = '80px';  // Set custom width
        iopInputOD.style.height = '40px';  // Set consistent height
        iopTdOD.appendChild(iopInputOD);
        row.appendChild(iopTdOD);
    
        const iopTdOS = document.createElement('td');
        const iopInputOS = document.createElement('input');
        iopInputOS.type = 'text';
        iopInputOS.id = 'iop_OS';
        iopInputOS.name = 'iop_OS';
        iopInputOS.style.width = '80px';  // Set custom width
        iopInputOS.style.height = '40px';  // Set consistent height
        iopTdOS.appendChild(iopInputOS);
        row.appendChild(iopTdOS);
    
        // Set saved values for PD, IOP (OD), and IOP (OS)
        pdInput.value = localStorage.getItem('pd') || '';
        iopInputOD.value = localStorage.getItem('iop_OD') || '';
        iopInputOS.value = localStorage.getItem('iop_OS') || '';
    
        // Attach event listeners to save values on change
        pdInput.addEventListener('input', () => localStorage.setItem('pd', pdInput.value));
        iopInputOD.addEventListener('input', () => localStorage.setItem('iop_OD', iopInputOD.value));
        iopInputOS.addEventListener('input', () => localStorage.setItem('iop_OS', iopInputOS.value));
    
        // Append row to table
        table.appendChild(row);
        vaFields.appendChild(table);
    }
    
    // Call the function to generate the VA fields when the page loads
    document.addEventListener('DOMContentLoaded', generateVAFields);
    
    

    /*
    * This function generates the spectacles fields in the test card form.
    * It creates select elements for sphere, cylinder, add power, and visual acuity (VA) options,
    * and populates them with predefined values. The function also retrieves and sets saved values
    * from local storage, ensuring that the user’s previous inputs are retained.
    * Event listeners are added to each input to save changes to local storage.
    */
    function generateSpectaclesFields() {
        console.log('Generating Spectacle fields'); // Debug log
        const spectaclesFields = document.getElementById('spectaclesFields');
        spectaclesFields.innerHTML = ''; // Clear existing elements
    
        // Define the options for sphere, cylinder, add power, and visual acuity
        const sphereOptions = ["DS"];
        for (let i = -20; i <= 20; i += 0.25) {
            sphereOptions.push(i.toFixed(2));
        }
    
        const cylinderOptions = ["DC"];
        for (let i = 0; i >= -10; i -= 0.25) {
            cylinderOptions.push(i.toFixed(2));
        }
    
        const addOptions = ["0", "0.25", "0.50", "0.75", "1.00", "1.25", "1.50", "1.75", "2.00", "2.25", "2.50", "2.75", "3.00", "3.25", "3.50"];
       const vaOptions = ["-", "6/4.5", "6/6", "6/7.5", "6/9", "6/12", "6/15", "6/18", "6/24", "6/36", "6/60","20/200", "20/120", "20/80", "20/60", "20/50", "20/40", "20/30", "20/25", "20/20", "20/15"];
        const eyes = ["OD", "OS"];
    
        // Create and populate fields for each eye (OD and OS)
        eyes.forEach(eye => {
            const div = document.createElement('div');
            const eyeLabel = document.createElement('label');
            eyeLabel.setAttribute('for', `spectacles_${eye}`);
            eyeLabel.textContent = `${eye}:`;
            div.appendChild(eyeLabel);
    
            // Create and populate sphere select element
            const sphereSelect = document.createElement('select');
            sphereSelect.id = `spectacles_${eye}_sphere`;
            sphereSelect.name = `spectacles_${eye}_sphere`;
    
            sphereOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                sphereSelect.appendChild(opt);
            });
    
            // Set default value to "0.00"
            sphereSelect.value = "0.00"; // You can change this to a specific value you want as default
            sphereSelect.addEventListener('change', () => {
                localStorage.setItem(`spectacles_${eye}_sphere`, sphereSelect.value);
            });
    
            div.appendChild(sphereSelect);
            div.appendChild(document.createElement('b')).innerHTML = " / ";
    
            // Create and populate cylinder select element
            const cylinderSelect = document.createElement('select');
            cylinderSelect.id = `spectacles_${eye}_cylinder`;
            cylinderSelect.name = `spectacles_${eye}_cylinder`;
    
            cylinderOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                cylinderSelect.appendChild(opt);
            });
    
            // Set saved value or default to "DC"
            cylinderSelect.value = localStorage.getItem(`spectacles_${eye}_cylinder`) || "DC";
            cylinderSelect.addEventListener('change', () => {
                localStorage.setItem(`spectacles_${eye}_cylinder`, cylinderSelect.value);
            });
    
            div.appendChild(cylinderSelect);
            div.appendChild(document.createElement('b')).innerHTML = " x ";
    
            // Create and populate axis input element
            const axisInput = document.createElement('input');
            axisInput.type = 'text';
            axisInput.id = `spectacles_${eye}_axis`;
            axisInput.name = `spectacles_${eye}_axis`;
            axisInput.maxLength = 3;
            axisInput.style.width = '50px';
    
            // Set saved value
            axisInput.value = localStorage.getItem(`spectacles_${eye}_axis`) || '';
            axisInput.addEventListener('input', () => {
                localStorage.setItem(`spectacles_${eye}_axis`, axisInput.value);
            });
    
            div.appendChild(axisInput);
            div.appendChild(document.createElement('b')).innerHTML = " Add ";
    
            // Create and populate add select element
            const addSelect = document.createElement('select');
            addSelect.id = `spectacles_${eye}_add`;
            addSelect.name = `spectacles_${eye}_add`;
    
            addOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                addSelect.appendChild(opt);
            });
    
            // Set saved value
            addSelect.value = localStorage.getItem(`spectacles_${eye}_add`) || "0";
            addSelect.addEventListener('change', () => {
                localStorage.setItem(`spectacles_${eye}_add`, addSelect.value);
            });
    
            div.appendChild(addSelect);
    
            // Create and populate VA select element
            const vaSelect = document.createElement('select');
            vaSelect.id = `aidedVA_${eye}`;
            vaSelect.name = `aidedVA_${eye}`;
    
            vaOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                vaSelect.appendChild(opt);
            });
    
            // Set the saved value from localStorage
            const key = eye === 'OD' ? 'cc-RE' : 'cc-LE';
            const savedValue = localStorage.getItem(key);
            if (savedValue) {
                vaSelect.value = savedValue;
            }
            vaSelect.addEventListener('change', () => {
                localStorage.setItem(key, vaSelect.value);
            });
    
            div.appendChild(document.createElement('b')).innerHTML = " VAcc ";
            div.appendChild(vaSelect);
    
            spectaclesFields.appendChild(div);
        });
    }
    

    // Call the function to generate the VA and spectacle fields when the page loads
    generateVAFields();
    generateSpectaclesFields();

     /*
    * This function executes when the DOM content is fully loaded.
    * - Hides all form containers initially.
    * - Checks if patient details are stored in local storage and populates the form if found.
    * - Loads saved values for visual acuity and spectacles fields.
    * - Retrieves and displays saved values for color vision and contrast sensitivity from local storage.
    * - Loads saved values for chief complaint and notes, and sets up event listeners to save new inputs to local storage.
    * - Adds event listeners to buttons to manage form visibility and navigation.
    */
    
    // Hide all form containers initially if they exist
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.remove('active');
    });

    // Check if patient details are stored in local storage
    const storedPatientName = localStorage.getItem('testCardPatientName');
    const storedPatientSurname = localStorage.getItem('testCardPatientSurname');
    const storedPatientAccount = localStorage.getItem('testCardPatientAccount');
    const storedPatientId = localStorage.getItem('patientId');

    if (storedPatientName && storedPatientSurname && storedPatientAccount) {
        const patientNameDisplay = document.getElementById('patientNameDisplay');
        if (patientNameDisplay) {
            patientNameDisplay.textContent = `${storedPatientName} ${storedPatientSurname} (Account ${storedPatientAccount})`;
        }
        document.getElementById('searchBar').value = `${storedPatientName} ${storedPatientSurname} ${storedPatientId}`;
    }

    // Load saved values for VA fields
    generateVAFields();
    generateSpectaclesFields();

    // Retrieve and display colorVision from localStorage
    const colorVisionElement = document.getElementById('colorVision');
    const colorVisionValue = localStorage.getItem('colorVision');
    if (colorVisionValue && colorVisionElement) {
        colorVisionElement.value = colorVisionValue;
    }

    // Retrieve and display contrastSensitivity from localStorage
    const contrastSensitivityElement = document.getElementById('contrastSensitivity');
    const odValue = localStorage.getItem('odValue');
    const osValue = localStorage.getItem('osValue');
    if (odValue && osValue && contrastSensitivityElement) {
        contrastSensitivityElement.value = `OD: ${odValue} % and OS: ${osValue} %`;
    }

    // Load saved values for chief complaint and notes from local storage
    const chiefComplaintElement = document.getElementById('chiefComplaint');
    const notesElement = document.getElementById('notes');

    if (chiefComplaintElement) {
        chiefComplaintElement.value = localStorage.getItem('chiefComplaint') || '';
        chiefComplaintElement.addEventListener('input', function() {
            localStorage.setItem('chiefComplaint', this.value);
        });
    }

    if (notesElement) {
        notesElement.value = localStorage.getItem('notes') || '';
        notesElement.addEventListener('input', function() {
            localStorage.setItem('notes', this.value);
        });
    }

    // Ensure patientWizardBtn exists before adding an event listener
    if (patientWizardBtn) {
        patientWizardBtn.addEventListener('click', function() {
            document.querySelectorAll('.form-container').forEach(function(container) {
                container.classList.remove('active');
            });
            const patientWizard = document.getElementById('patientWizard');
            if (patientWizard) {
                patientWizard.classList.add('active');
            }
        });
    }

    // Update for "Continue to eye test" button
    const continueToEyeTestBtn = document.getElementById('continueToEyeTestBtn');
    if (continueToEyeTestBtn) {
        continueToEyeTestBtn.addEventListener('click', function() {
            // Navigate to VA Charts page
            window.location.href = "../VA Charts/VA CHARTS.html";
        });
    }    
    
   
    /*
    * Event listeners for the clear button of the Test Card and its confirmation process.
    * When the clear button is clicked, a confirmation message is shown.
    * If the user confirms, all stored values are removed and the form fields are cleared.
    */

    clearBtn.addEventListener('click', function() {
        confirmMessage.style.display = 'block';
    });

    cancelClearBtn.addEventListener('click', function() {
        confirmMessage.style.display = 'none';
    });

    confirmClearBtn.addEventListener('click', function() {
        // Clears Test Card 
        localStorage.removeItem('odValue');
        localStorage.removeItem('osValue');
        localStorage.removeItem('colorVision');
        localStorage.removeItem('sc-RE');
        localStorage.removeItem('sc-LE');
        localStorage.removeItem('sc-OU');
        localStorage.removeItem('cc-RE');
        localStorage.removeItem('cc-LE');
        localStorage.removeItem('cc-OU');
        localStorage.removeItem('pd');
        localStorage.removeItem('iop_OD');
        localStorage.removeItem('iop_OS');
        localStorage.removeItem('spectacles_OD_sphere');
        localStorage.removeItem('spectacles_OD_cylinder');
        localStorage.removeItem('spectacles_OD_axis');
        localStorage.removeItem('spectacles_OD_add');
        localStorage.removeItem('spectacles_OS_sphere');
        localStorage.removeItem('spectacles_OS_cylinder');
        localStorage.removeItem('spectacles_OS_axis');
        localStorage.removeItem('spectacles_OS_add');
        localStorage.removeItem('chiefComplaint'); 
        localStorage.removeItem('notes'); 
        document.getElementById('colorVision').value = '';
        document.getElementById('chiefComplaint').value = '';
        document.getElementById('notes').value = ''; 
        
        // Clear other fields if needed
        generateVAFields();
        generateSpectaclesFields();

        // Hide the confirmation message
        confirmMessage.style.display = 'none';
    });

    });

    // Event listener for the Save record card button
    const saveRecordCardBtn = document.getElementById('saveRecordCardBtn');
    saveRecordCardBtn.addEventListener('click', async function() {
        await saveTestCard();
    });

    /*Function to clear patient name, surname and account number from Test Card*/
    function clearPatientInfoFromLocalStorage() {
        const patientInfoItems = [
            'testCardPatientName',
            'testCardPatientSurname',
            'testCardPatientAccount'
        ];
    
        patientInfoItems.forEach(item => localStorage.removeItem(item));
        console.log('Patient information localStorage items cleared.');
    }
    


    /*
    * Function to save the test card.
    * - Retrieves the patient account from local storage and ensures it is correctly formatted.
    * - Collects various test card details from local storage.
    * - Sends the test card details to the server via a POST request.
    * - If the save operation is successful, displays a success message, clears the local storage, and runs the patient wizard function.
    * - If the save operation fails, displays an error message.
    */
    async function saveTestCard() {
        let patientAccount = localStorage.getItem('testCardPatientAccount');
        console.log('patientAccount from localStorage:', patientAccount); // Debug log to verify patientAccount
    
        // Ensure the account number is correctly formatted
        if (!patientAccount) {
            console.error('Error: patientAccount is not defined.');
            showPopupMessage('Error: Patient account number is not defined.');
            return;
        }
    
        const testCardDetails = {
            chiefComplaint: localStorage.getItem('chiefComplaint') || '',
            pd: localStorage.getItem('pd') || '',
            iop_OD: localStorage.getItem('iop_OD') || '',
            iop_OS: localStorage.getItem('iop_OS') || '',
            notes: localStorage.getItem('notes') || '',
            odValue: localStorage.getItem('odValue') || '',
            osValue: localStorage.getItem('osValue') || '',
            scRE: localStorage.getItem('sc-RE') || '',
            scLE: localStorage.getItem('sc-LE') || '',
            scOU: localStorage.getItem('sc-OU') || '',
            ccRE: localStorage.getItem('cc-RE') || '',
            ccLE: localStorage.getItem('cc-LE') || '',
            ccOU: localStorage.getItem('cc-OU') || '',
            spectacles_OD_sphere: localStorage.getItem('spectacles_OD_sphere') || '',
            spectacles_OD_cylinder: localStorage.getItem('spectacles_OD_cylinder') || '',
            spectacles_OD_axis: localStorage.getItem('spectacles_OD_axis') || '',
            spectacles_OD_add: localStorage.getItem('spectacles_OD_add') || '',
            spectacles_OS_sphere: localStorage.getItem('spectacles_OS_sphere') || '',
            spectacles_OS_cylinder: localStorage.getItem('spectacles_OS_cylinder') || '',
            spectacles_OS_axis: localStorage.getItem('spectacles_OS_axis') || '',
            spectacles_OS_add: localStorage.getItem('spectacles_OS_add') || '',
            colorVision: localStorage.getItem('colorVision') || '',
            contrastSensitivity: `OD: ${localStorage.getItem('odValue') || ''} % and OS: ${localStorage.getItem('osValue') || ''} %`,
            date: new Date().toISOString() // Storing the current date
        };
    
        console.log('testCardDetails:', testCardDetails); // Debug log to verify testCardDetails
    
        try {
            const response = await fetch(`http://localhost:3000/saveTestCardByAccount/${patientAccount}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testCardDetails)
            });
    
            if (response.ok) {
                showPopupMessage('Test Card successfully saved!');
                // Clear localStorage related to the test card
                clearTestCardLocalStorage();
                // Clear patient info from localStorage
                clearPatientInfoFromLocalStorage();
                // Show success message and then run the patient wizard function
                showSuccessMessage();
            } else {
                showPopupMessage('Error saving test card details.');
            }
        } catch (error) {
            console.error('Error saving test card details:', error);
            showPopupMessage('Error saving test card details.');
        }
    }    
    
    function clearTestCardLocalStorage() {
        const testCardItems = [
            'chiefComplaint',
            'pd',
            'iop_OD',
            'iop_OS',
            'notes',
            'odValue',
            'osValue',
            'sc-RE',
            'sc-LE',
            'sc-OU',
            'cc-RE',
            'cc-LE',
            'cc-OU',
            'spectacles_OD_sphere',
            'spectacles_OD_cylinder',
            'spectacles_OD_axis',
            'spectacles_OD_add',
            'spectacles_OS_sphere',
            'spectacles_OS_cylinder',
            'spectacles_OS_axis',
            'spectacles_OS_add',
            'colorVision',
            'contrastSensitivity'
        ];
    
        testCardItems.forEach(item => localStorage.removeItem(item));
        console.log('Test card localStorage items cleared.');
    
        // Call function to reset form fields
        resetFormFields();
    }
    
    function resetFormFields() {
        const formFields = [
            'chiefComplaint',
            'pd',
            'iop_OD',
            'iop_OS',
            'notes',
            'colorVision',
            'contrastSensitivity',
            'scRE',
            'scLE',
            'scOU',
            'ccRE',
            'ccLE',
            'ccOU',
            'spectacles_OD_sphere',
            'spectacles_OD_cylinder',
            'spectacles_OD_axis',
            'spectacles_OD_add',
            'spectacles_OS_sphere',
            'spectacles_OS_cylinder',
            'spectacles_OS_axis',
            'spectacles_OS_add'
        ];
    
        formFields.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.value = '';
            }
        });
    
        console.log('Form fields have been reset.');
    }
    
    function clearPatientInfoFromLocalStorage() {
        const patientInfoItems = [
            'testCardPatientName',
            'testCardPatientSurname',
            'testCardPatientAccount'
        ];
    
        patientInfoItems.forEach(item => localStorage.removeItem(item));
        console.log('Patient information localStorage items cleared.');
    }
    
    
    function runPatientWizardFunction() {
        document.querySelectorAll('.form-container').forEach(function(container) {
            container.classList.remove('active');
        });
        const patientWizard = document.getElementById('patientWizard');
        if (patientWizard) {
            patientWizard.classList.add('active');
        }
    }

    function showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block'; // Show the message
    
        // Hide the message after 3 seconds and then run the patient wizard function
        setTimeout(() => {
            successMessage.style.display = 'none';
            runPatientWizardFunction(); // Run patient wizard after message
        }, 3000); // Display the message for 3 seconds
    }


    /*
    * Function to run the patient wizard functionality.
    * - Hides all form containers by removing the 'active' class from each one.
    * - Retrieves the patient wizard element by its ID.
    * - Activates the patient wizard by adding the 'active' class to it if the element exists.
    */
    function runPatientWizardFunction() {
        document.querySelectorAll('.form-container').forEach(function(container) {
            container.classList.remove('active');
        });
        const patientWizard = document.getElementById('patientWizard');
        if (patientWizard) {
            patientWizard.classList.add('active');
        }
    }

    /*
    * Function to show popup messages.
    * - Creates a popup message with the specified text.
    * - Styles the popup message for visibility and center positioning.
    * - Appends the popup message to the document body.
    * - Automatically removes the popup message after 3 seconds.
    */
    function showPopupMessage(message) {
        const popupMessage = document.createElement('div');
        popupMessage.style.position = 'fixed';
        popupMessage.style.top = '50%';
        popupMessage.style.left = '50%';
        popupMessage.style.transform = 'translate(-50%, -50%)';
        popupMessage.style.backgroundColor = 'white';
        popupMessage.style.color = 'black';
        popupMessage.style.padding = '20px';
        popupMessage.style.border = '2px solid black';
        popupMessage.style.zIndex = '1000';
        popupMessage.style.textAlign = 'center';
        popupMessage.textContent = message;

        document.body.appendChild(popupMessage);

        setTimeout(() => {
            document.body.removeChild(popupMessage);
        }, 3000);
    }

    // Check if the flag is set to run the patient wizard functionality after reload
    if (localStorage.getItem('reloadAndRunCurrent')) {
        localStorage.removeItem('reloadAndRunCurrent'); // Clear the flag
        runPatientWizardFunction(); // Run the patient wizard functionality
    }


    /*
    * This function displays a pop-up message to the user.
    * It takes a message string as a parameter, sets the text content of the pop-up element,
    * and briefly shows the pop-up before hiding it again.
    */
    // Function to show pop-up message
    function showPopupMessage(message) {
        const popup = document.getElementById('popupMessage');
        popup.textContent = message;
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }

    //END OF CURRENT SECTION


    //BACK TO CHART
    /*
    * Event listener for the "Back to Chart" button click.
    * - Redirects the user to the VA Charts page.
    */
    document.getElementById("backToChartBtn").addEventListener("click", function() {
        window.location.href = "../VA Charts/VA CHARTS.html";
    });

    //OTHER

    
// Check localStorage for the flag and simulate button click if needed
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('clickPatientWizard') === 'true') {
        // Remove the flag from localStorage
        localStorage.removeItem('clickPatientWizard');
        
        // Simulate the button click
        const patientWizardBtn = document.getElementById('patientWizardBtn');
        if (patientWizardBtn) {
            patientWizardBtn.click();
        } else {
            console.error('Patient Wizard button not found.');
        }
    }
});


     
    


    
