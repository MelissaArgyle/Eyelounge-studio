document.addEventListener('DOMContentLoaded', function() {
    // Get references to radio buttons and cursor selection dropdown
    const metricRadio = document.getElementById('metric');
    const uscRadio = document.getElementById('usc');
    const cursorSelect = document.getElementById('cursor');

    // Add event listeners for notation preference changes
    metricRadio.addEventListener('change', saveNotationPreference);
    uscRadio.addEventListener('change', saveNotationPreference);

    // Apply existing calibration and cursor preferences
    applyCalibration();
    applyCursorPreference();

    // Add event listener to update cursor selection
    cursorSelect.addEventListener('change', () => {
        const cursor = cursorSelect.value;
        changeCursor(cursor);
    });

    // Adding mouse movement detection to hide the cursor after inactivity
    let cursorTimeout;
    document.body.addEventListener('mousemove', resetCursorTimer);

    // Function to reset the cursor hiding timer
    function resetCursorTimer() {
        clearTimeout(cursorTimeout);
        // Update cursor style based on the selected value
        document.body.style.cursor = 'url(' + cursorSelect.value + '), auto'; // or default cursor if no selection

        // Hide cursor after 4 seconds of inactivity
        cursorTimeout = setTimeout(() => {
            document.body.style.cursor = 'none';
        }, 4000); // 4 seconds
    }

    // Initialize the cursor timer
    resetCursorTimer();
});

// Function to save the selected cursor in localStorage and apply it
function saveCursorSelection() {
    const cursor = document.getElementById('cursor').value;
    localStorage.setItem('cursorPreference', cursor);
    changeCursor(cursor);
}

// Function to change the cursor style
function changeCursor(cursor) {
    document.body.style.cursor = `url(${cursor}), auto`;
}

// Function to navigate back to the previous page (e.g., eye chart)
function returnToEyeChart() {
    history.back();
}

// Function to fade out an element
function fadeOut(element) {
    element.style.opacity = 0;
    setTimeout(() => {
        element.style.display = 'none';
    }, 500);
}

// Function to fade in an element
function fadeIn(element) {
    element.style.display = 'flex'; // Use 'flex' for proper alignment
    setTimeout(() => {
        element.style.opacity = 1;
    }, 10);
}

// Function to show the calibration screen
function showCalibration() {
    hideAllBoxes();
    setTimeout(() => {
        fadeIn(document.getElementById('calibration-box'));
    }, 500);
}

// Function to show the viewing distance screen
function showViewingDistance() {
    hideAllBoxes();
    setTimeout(() => {
        const box = document.getElementById('viewing-distance-box');
        fadeIn(box);
        const savedLength = localStorage.getItem('calibrationLength');
        if (savedLength) {
            document.getElementById('saved-length').innerText = savedLength;
        }
    }, 500);
}

// Function to show the size notation screen
function showSizeNotation() {
    hideAllBoxes();
    setTimeout(() => {
        fadeIn(document.getElementById('size-notation-box'));
    }, 500);
}

// Function to show the cursor selection screen
function showCursorSelection() {
    hideAllBoxes();
    setTimeout(() => {
        fadeIn(document.getElementById('cursor-selection-box'));
    }, 500);
}

// Function to show the video tutorial screen
function showVideoTutorial() {
    hideAllBoxes();
    setTimeout(() => {
        fadeIn(document.getElementById('video-tutorial-box'));
    }, 500);
}

// Function to return to main content (e.g., calibration box)
function returnToContent() {
    hideAllBoxes();
    setTimeout(() => {
        fadeIn(document.getElementById('calibration-box'));
    }, 500);
}

// Function to hide all content boxes
function hideAllBoxes() {
    const boxes = document.querySelectorAll('.content > div');
    boxes.forEach(box => {
        box.style.display = 'none';
        box.style.opacity = 0;
    });
}

// Function to handle calibration process
function calibrate() {
    const length = document.getElementById('length').value;
    console.log('Length entered: ' + length + ' mm');
}

// Function to update the displayed distance value
function updateDistanceValue(value) {
    document.getElementById('distance-value').innerText = value + 'm';
}

// Function to save viewing distance and proceed to the next step
function saveAndNext() {
    console.log('Viewing distance saved!');
    showSizeNotation();
}

// Function to save calibration length and proceed to the next step
function saveAndNextFromCalibration() {
    const length = document.getElementById('length').value;
    localStorage.setItem('calibrationLength', length);
    console.log('Length saved! Now set the viewing distance.');
    showViewingDistance();
}

// Function to save calibration and proceed to the next step
function saveCalibrationAndNext() {
    const distance = document.getElementById('distance-range').value;
    localStorage.setItem('viewingDistance', distance);
    console.log('Calibration saved!');
    showSizeNotation();
}

// Function to save size notation preference and proceed to the next step
function saveAndNextFromNotation() {
    console.log('Size notation saved!');
    showCursorSelection();
}

// Function to save size notation preference in localStorage
function saveNotationPreference() {
    const notation = document.querySelector('input[name="notation"]:checked').value;
    localStorage.setItem('notationPreference', notation);
}

// Function to apply calibration settings (placeholder)
function applyCalibration() {
    // Placeholder function for calibration settings
}

// Function to apply saved cursor preference
function applyCursorPreference() {
    const savedCursor = localStorage.getItem('cursorPreference');
    if (savedCursor) {
        changeCursor(savedCursor);
    }
}
