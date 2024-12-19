# Eyelounge Studio

Welcome to Eyelounge Studio! This project is designed to provide advanced tools for eye care professionals, including various charts for eye tests, such as a Visual Acuity (VA) chart, astigmatism chart, duochrome chart, contrast sensitivity, colour vision, binocular tests, educational resources, and patient management features to enhance patient care.

## Features
- **Intuitive Login System**: Provides a sleek and user-friendly login interface with email and password authentication.
- **Create Account**: Allows new users to create an account with their practice and personal information directly from the login page.
- **Forgot Password**: Enables users to recover their password via email if they forget it.
- **Visual Acuity Chart**: An interactive VA chart (including Snellen, number, tumbling E, and Landolt C charts) for eye care professionals to assess visual acuity.
- **Astigmatism Charts**: Specialized charts to evaluate astigmatism.
- **Binocular Vision Charts**: Tools to assess binocular vision, including tests for duochrome and color vision.
- **Contrast Sensitivity**: Charts to measure the contrast sensitivity of patients.
- **Educational Resources**: A dedicated section where optometrists can educate patients about common eye diseases and lens types using visual aids.
- **Patient Management**: Features for managing patient records, including a New Patient form, Patient Wizard for searching and managing patients, and options to write various reports (e.g., eye test reports, referral letters).
- **Test Card Management**: Ability to create and manage test cards, record visual acuity, color vision, contrast sensitivity, and other notes.
- **Settings and Calibration**: A settings page for calibration, including features for setting viewing distance, size notation (Metric or USC), and cursor selection.
- **Account Management**: A dedicated account management page where users can view their account information, and log out.
- **Tutorial Overlay**: Includes an optional tutorial video overlay to guide users through the initial setup and usage.

## Installation

To set up the project, follow these steps:

1. **Download the repository**:
    - Go to the GitHub repository page.
    - Click on the "Code" button and select "Download ZIP".
    - Extract the downloaded zip file to your preferred location.

2. **Navigate to the project directory**:
    ```bash
    cd [extracted-folder-name]
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Install MongoDB**:
    - Download and install MongoDB from the [MongoDB download page](https://www.mongodb.com/try/download/community).

5. **Start MongoDB**:
    - Open a terminal and start the MongoDB server:
      ```bash
      mongod
      ```

6. **Verify MongoDB Installation**:
    - Open another terminal and run:
      ```bash
      mongo
      ```

7. **Configure Environment Variables**:
    - Go to the `.env` file in the project directory and add the API key:
      ```plaintext
      SENDGRID_API_KEY=your-sendgrid-api-key
      ```

8. **Start the application**:
    - Use the following command to start all servers:
    ```bash
    npm run start-all
    ```
9. **Open index.html**

## Usage

Here are some examples of how to use the project:

- **Running the Application**:
    1. Launch the application.
    2. Wait for the introductory video to finish.
    3. Log in using your email and password.
    4. Watch or skip the tutorial video overlay.

- **Creating an Account**:
    1. Click the "Create Account" button on the login page.
    2. Fill in your practice and personal details to set up your account.
    3. Submit the form to create your account and return to the login page.

- **Password Recovery**:
    1. Click the "Forgot Password?" link on the login page.
    2. Enter your email address, and your password will be sent to you via email.

- **Using the Visual Acuity Chart**:
    1. Navigate to the VA chart after logging in.
    2. Follow the instructions to use the VA chart for testing patients' visual acuity.
    3. Utilize the various toolbar options for different chart configurations and settings.

- **Educational Resources**:
    1. Click the "Education" button to access the educational section.
    2. Use the provided buttons to display information on common eye diseases and lens types.
    3. Show patients visual aids to help explain their eye conditions.

- **Patient Management**:
    1. Use the "New Patient" button to add a new patient.
    2. Use the "Patient Wizard" to search and manage existing patients.
    3. Write reports such as eye test reports and referral letters.

- **Test Card Management**:
    1. Create and manage test cards to record visual acuity, color vision, contrast sensitivity, and notes.
    2. Save and manage patient test cards for future reference.

- **Calibration Settings**:
    1. Access the settings page to calibrate the display screen.
    2. Set the viewing distance and size notation.
    3. Select the cursor style as needed.

- **Account Management**:
    1. View your account details and sign out through the account management page.
    2. Edit your account details as needed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
