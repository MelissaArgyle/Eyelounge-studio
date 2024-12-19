let chart; // Declare chart globally
let fontSizes = ['4.0em', '3.6em', '3.2em', '2.8em', '2.4em', '2.0em', '1.6em', '1.2em', '0.9em', '0.55em']; // Declare fontSizes globally

const metricNotations = ['6/60', '6/36', '6/24', '6/18', '6/15', '6/12', '6/9', '6/7.5', '6/6', '6/4.5'];
const uscNotations = ['20/200', '20/120', '20/80', '20/60', '20/50', '20/40', '20/30', '20/25', '20/20', '20/15'];
let selectedNotations = metricNotations;

document.addEventListener('DOMContentLoaded', function() {
    applyCalibration(); // Call applyCalibration at the beginning

    chart = document.getElementById('chart'); // Initialize globally declared chart
    console.log(chart); // Debugging statement

    if (!chart) {
        console.error('Chart element not found');
        return; // Exit if chart element is not found
    }

    const notationPreference = localStorage.getItem('notationPreference');
    if (notationPreference === 'usc') {
        selectedNotations = uscNotations;
    } else {
        selectedNotations = metricNotations;
    }

    // Your existing code...

    const rows = document.querySelectorAll('.row');
    rows.forEach((row, index) => {
        const metric = row.querySelector('.metric');
        if (metric) {
            metric.textContent = selectedNotations[index];
        }
    });

    const fullButton = document.getElementById('full');
    const horizontalButton = document.getElementById('horizontal');
    const verticalButton = document.getElementById('vertical');
    const singleButton = document.getElementById('single');
    const snellenButton = document.getElementById('snellen');
    const numbersButton = document.getElementById('numbers');
    const tumblingEButton = document.getElementById('tumblingE');
    const landoltCButton = document.getElementById('landoltC');

    console.log(fullButton);

    // Add the event listener to the chart element
    chart.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        const row = event.target.closest('.row');
        if (row) {
            toolbar.style.display = 'block';
            toolbar.style.left = `${event.pageX}px`;
            toolbar.style.top = `${event.pageY}px`;
            toolbar.dataset.metric = row.querySelector('.metric').textContent;
            toolbar.dataset.targetId = row.id; // Store the ID of the target row
        }
    });

    console.log(fullButton);

    const decimalNotations = ['0.1', '0.17', '0.25', '0.33', '0.4', '0.5', '0.67', '0.8', '1.0', '1.33'];

    let useNumbers = false;
    let useTumblingE = false;
    let useLandoltC = false;
    let useHorizontal = false;
    let useVertical = false;
    let useSingle = false;
    let currentRowIndex = 0;

    function applyCalibration() {
        const length = localStorage.getItem('calibrationLength');
        const distance = localStorage.getItem('viewingDistance');
        if (length && distance) {
            const scalingFactor = length / 100; // Assuming the standard length is 100 mm
            fontSizes = fontSizes.map(size => {
                const numericSize = parseFloat(size);
                return (numericSize * scalingFactor * distance).toFixed(2) + 'em';
            });
        }
    }

    function generateRandomLetters() {
        const letters = 'CDHKNORSVZ';
        let result = '';
        let availableLetters = letters.split('');
        for (let i = 0; i < 5; i++) {
            let randomIndex = Math.floor(Math.random() * availableLetters.length);
            result += `<span class="letter-spacing">${availableLetters[randomIndex]}</span>`;
            availableLetters.splice(randomIndex, 1); // Remove the used letter
        }
        return result;
    }

    function generateRandomNumbers() {
        let result = '';
        let availableNumbers = Array.from({ length: 10 }, (_, i) => i.toString());
        for (let i = 0; i < 5; i++) {
            let randomIndex = Math.floor(Math.random() * availableNumbers.length);
            result += `<span class="letter-spacing">${availableNumbers[randomIndex]}</span>`;
            availableNumbers.splice(randomIndex, 1); // Remove the used number
        }
        return result;
    }

    function generateRandomTumblingE() {
        const glyphs = ['E'];
        let result = '';

        function getRandomRotation() {
            const rotations = ['', 'rotate-90', 'rotate-180', 'rotate-270'];
            return rotations[Math.floor(Math.random() * rotations.length)];
        }

        for (let j = 0; j < 5; j++) {
            const char = document.createElement('span');
            char.textContent = glyphs[j % glyphs.length];
            char.className = `letter-spacing ${getRandomRotation()}`; // Apply the rotation class to the E glyph
            result += char.outerHTML;
        }
        return result;
    }

    function generateLandoltC() {
        const glyphs = ['C'];
        let result = '';

        function getRandomRotation() {
            const rotations = ['', 'rotate-90', 'rotate-180', 'rotate-270'];
            return rotations[Math.floor(Math.random() * rotations.length)];
        }

        for (let j = 0; j < 5; j++) {
            const char = document.createElement('span');
            char.textContent = glyphs[j % glyphs.length];
            char.className = `letter-spacing ${getRandomRotation()}`; // Apply the rotation class to the C glyph
            result += char.outerHTML;
        }
        return result;
    }
    function generateChart() {
        const chart = document.getElementById('chart');
        chart.innerHTML = '';
        const initialMargin = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--initial-margin'));
        const decrement = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--decrement'));
    
        for (let i = 0; i < 10; i++) {
            const row = document.createElement('div');
            row.className = 'row chart-row';
            row.id = `row-${i + 1}`; // Assign a unique ID to each row
            row.style.fontSize = fontSizes[i]; // Set font size based on the row index
    
            // Adjust margin for each row
            const newMargin = initialMargin - (i * decrement);
            row.style.margin = `${newMargin}px 0`;
    
            // Add the third-to-last and second-to-last classes to the respective rows
            if (i === 7) {
                row.classList.add('third-to-last');
            } else if (i === 8) {
                row.classList.add('second-to-last');
            }
    
            const decimal = document.createElement('span');
            decimal.className = 'decimal';
            decimal.textContent = decimalNotations[i];
    
            const letters = document.createElement('div');
            letters.className = 'letters';
            let letterContent;
            if (useNumbers) {
                letterContent = generateRandomNumbers();
            } else if (useTumblingE) {
                letterContent = generateRandomTumblingE(); // Assign the HTML string to letterContent
            } else if (useLandoltC) {
                letterContent = generateLandoltC(); // Assign the HTML string to letterContent
            } else {
                letterContent = generateRandomLetters();
            }
    
            letters.innerHTML = letterContent; // Assign the HTML string to the letters div
    
            const metric = document.createElement('span');
            metric.className = 'metric';
            metric.textContent = selectedNotations[i]; // Use the selected notations here
    
            row.appendChild(decimal);
            row.appendChild(letters); // Append the letters div to the row
            row.appendChild(metric);
    
            chart.appendChild(row);
    
            // Apply the transition effect
            setTimeout(() => {
                row.classList.add('show');
            }, 0);
    
        }
    }
    
    function generateHorizontal() {
        const chart = document.getElementById('chart');
        chart.innerHTML = '';
        chart.className = 'horizontal-chart';
    
        const header = document.createElement('div');
        header.className = 'horizontal-header';
    
        const decimal = document.createElement('span');
        decimal.className = 'decimal';
        decimal.textContent = decimalNotations[currentRowIndex];
    
        const metric = document.createElement('span');
        metric.className = 'metric';
        metric.textContent = selectedNotations[currentRowIndex];
    
        header.appendChild(decimal);
        header.appendChild(metric);
        chart.appendChild(header);
    
        const row = document.createElement('div');
        row.className = 'row chart-row horizontal-row';
        row.style.position = 'absolute';
        row.style.top = '50%';
        row.style.left = '50%';
        row.style.transform = 'translate(-50%, -50%)';
    
        const letters = document.createElement('div');
        letters.className = 'letters';
        let letterContent;
        if (useNumbers) {
            letterContent = generateRandomNumbers();
        } else if (useTumblingE) {
            letterContent = generateRandomTumblingE();
        } else if (useLandoltC) {
            letterContent = generateLandoltC();
        } else {
            letterContent = generateRandomLetters();
        }
    
        letters.innerHTML = letterContent;
        row.appendChild(letters);
        chart.appendChild(row);
    
        // Apply the transition effect
        setTimeout(() => {
            row.classList.add('show');
        }, 0);
    
        const fontSize = fontSizes[currentRowIndex];
        const letterSpacing = 10 - currentRowIndex;
        row.style.fontSize = fontSize;
        row.style.letterSpacing = `${letterSpacing}px`;
    }
    
    function generateVertical() {
        const chart = document.getElementById('chart');
        chart.innerHTML = '';
        chart.className = 'vertical-chart';
    
        const header = document.createElement('div');
        header.className = 'vertical-header';
        header.style.position = 'relative';
        header.style.marginBottom = '20px';
    
        const decimal = document.createElement('span');
        decimal.className = 'decimal';
        decimal.textContent = decimalNotations[currentRowIndex];
    
        const metric = document.createElement('span');
        metric.className = 'metric';
        metric.textContent = selectedNotations[currentRowIndex];
    
        header.appendChild(decimal);
        header.appendChild(metric);
        chart.appendChild(header);
    
        const row = document.createElement('div');
        row.className = 'row chart-row vertical-row';
        row.style.position = 'absolute';
        row.style.top = '50%';
        row.style.left = '50%';
        row.style.transform = 'translate(-50%, -50%)';
    
        const letters = document.createElement('div');
        letters.className = 'letters';
        letters.style.display = 'flex';
        letters.style.flexDirection = 'column';
        letters.style.alignItems = 'center';
    
        let letterContent;
        if (useNumbers) {
            letterContent = generateRandomNumbers();
        } else if (useTumblingE) {
            letterContent = generateRandomTumblingE();
        } else if (useLandoltC) {
            letterContent = generateLandoltC();
        } else {
            letterContent = generateRandomLetters();
        }
    
        letters.innerHTML = letterContent;
        row.appendChild(letters);
        chart.appendChild(row);
    
        // Apply the transition effect
        setTimeout(() => {
            row.classList.add('show');
        }, 0);
    
        const fontSize = fontSizes[currentRowIndex];
        const letterSpacing = 10 - currentRowIndex;
        row.style.fontSize = fontSize;
        row.style.letterSpacing = `${letterSpacing}px`;
    }
    
    function generateSingle() {
        const chart = document.getElementById('chart');
        chart.innerHTML = '';
        chart.className = 'horizontal-chart';
    
        const header = document.createElement('div');
        header.className = 'horizontal-header';
        header.style.position = 'relative';
        header.style.marginBottom = '20px';
    
        const decimal = document.createElement('span');
        decimal.className = 'decimal';
        decimal.textContent = decimalNotations[currentRowIndex];
    
        const metric = document.createElement('span');
        metric.className = 'metric';
        metric.textContent = selectedNotations[currentRowIndex];
    
        header.appendChild(decimal);
        header.appendChild(metric);
        chart.appendChild(header);
    
        const row = document.createElement('div');
        row.className = 'row chart-row horizontal-row';
        row.style.position = 'absolute';
        row.style.top = '50%';
        row.style.left = '50%';
        row.style.transform = 'translate(-50%, -50%)';
    
        const letters = document.createElement('div');
        letters.className = 'letters';
        let letterContent;
    
        if (useNumbers) {
            const numbers = '0123456789';
            letterContent = numbers.charAt(Math.floor(Math.random() * numbers.length));
        } else if (useTumblingE) {
            const rotations = [0, 90, 180, 270];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            letterContent = `<span style="display: inline-block; transform: rotate(${randomRotation}deg);">E</span>`;
        } else if (useLandoltC) {
            const rotations = [0, 90, 180, 270];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            letterContent = `<span style="display: inline-block; transform: rotate(${randomRotation}deg);">C</span>`;
        } else {
            const lettersArray = 'CDHKNORSVZ';
            letterContent = lettersArray.charAt(Math.floor(Math.random() * lettersArray.length));
        }
    
        letters.innerHTML = `<span class="letter-spacing">${letterContent}</span>`;
        row.appendChild(letters);
        chart.appendChild(row);
    
        // Apply the transition effect
        setTimeout(() => {
            row.classList.add('show');
        }, 0);
    
        const fontSize = fontSizes[currentRowIndex];
        const letterSpacing = 10 - currentRowIndex;
        row.style.fontSize = fontSize;
        row.style.letterSpacing = `${letterSpacing}px`;
    }
    
    function updateChart() {
        document.querySelector('#chart').classList.remove('horizontal-chart-container', 'vertical-chart-container', 'single-chart-container');
    
        if (useSingle) {
            document.querySelector('#chart').classList.add('single-chart-container');
            generateSingle();
        } else if (useHorizontal) {
            document.querySelector('#chart').classList.add('horizontal-chart-container');
            generateHorizontal();
        } else if (useVertical) {
            document.querySelector('#chart').classList.add('vertical-chart-container');
            generateVertical();
        } else {
            generateChart();
        }
    }
        

    document.addEventListener('wheel', function(event) {
        if (useSingle) {
            if (event.deltaY < 0) {
                currentRowIndex = (currentRowIndex > 0) ? currentRowIndex - 1 : 0;
            } else {
                currentRowIndex = (currentRowIndex < decimalNotations.length - 1) ? currentRowIndex + 1 : decimalNotations.length - 1;
            }
            generateSingle();
        } else if (useHorizontal) {
            if (event.deltaY < 0) {
                currentRowIndex = (currentRowIndex > 0) ? currentRowIndex - 1 : 0;
            } else {
                currentRowIndex = (currentRowIndex < decimalNotations.length - 1) ? currentRowIndex + 1 : decimalNotations.length - 1;
            }
            generateHorizontal();
        } else if (useVertical) {
            if (event.deltaY < 0) {
                currentRowIndex = (currentRowIndex > 0) ? currentRowIndex - 1 : 0;
            } else {
                currentRowIndex = (currentRowIndex < decimalNotations.length - 1) ? currentRowIndex + 1 : decimalNotations.length - 1;
            }
            generateVertical();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp') {
            if (currentRowIndex > 0) {
                currentRowIndex -= 1;
            }
        } else if (event.key === 'ArrowDown') {
            if (currentRowIndex < decimalNotations.length - 1) {
                currentRowIndex += 1;
            }
        }
    
        if (useSingle) {
            generateSingle();
        } else if (useHorizontal) {
            generateHorizontal();
        } else if (useVertical) {
            generateVertical();
        }
    });
    
    fullButton.addEventListener('click', function() {
        useHorizontal = false;
        useVertical = false;
        useSingle = false;
        localStorage.setItem('viewType', 'full');
        updateChart();
    });
    
    horizontalButton.addEventListener('click', function() {
        useHorizontal = true;
        useVertical = false;
        useSingle = false;
        localStorage.setItem('viewType', 'horizontal');
        updateChart();
    });
    
    verticalButton.addEventListener('click', function() {
        useHorizontal = false;
        useVertical = true;
        useSingle = false;
        localStorage.setItem('viewType', 'vertical');
        updateChart();
    });
    
    singleButton.addEventListener('click', function() {
        useHorizontal = false;
        useVertical = false;
        useSingle = true;
        localStorage.setItem('viewType', 'single');
        updateChart();
    });
    
    snellenButton.addEventListener('click', function() {
        useNumbers = false;
        useTumblingE = false;
        useLandoltC = false;
        localStorage.setItem('chartType', 'snellen');
        updateChart();
    });
    
    numbersButton.addEventListener('click', function() {
        useNumbers = true;
        useTumblingE = false;
        useLandoltC = false;
        localStorage.setItem('chartType', 'numbers');
        updateChart();
    });
    
    tumblingEButton.addEventListener('click', function() {
        useNumbers = false;
        useTumblingE = true;
        useLandoltC = false;
        localStorage.setItem('chartType', 'tumblingE');
        updateChart();
    });
    
    landoltCButton.addEventListener('click', function() {
        useNumbers = false;
        useTumblingE = false;
        useLandoltC = true;
        localStorage.setItem('chartType', 'landoltC');
        updateChart();
    });
    
    document.addEventListener('mousedown', function(event) {
        if (event.button === 1) { // Middle mouse button
            updateChart();
        }
    });
    
    // Load the previously selected chart state
    window.addEventListener('load', function() {
        const viewType = localStorage.getItem('viewType');
        switch(viewType) {
            case 'horizontal':
                useHorizontal = true;
                useVertical = false;
                useSingle = false;
                break;
            case 'vertical':
                useHorizontal = false;
                useVertical = true;
                useSingle = false;
                break;
            case 'single':
                useHorizontal = false;
                useVertical = false;
                useSingle = true;
                break;
            default:
                // Default to full chart if no state is saved
                useHorizontal = false;
                useVertical = false;
                useSingle = false;
        }
    
        const chartType = localStorage.getItem('chartType');
        switch(chartType) {
            case 'numbers':
                useNumbers = true;
                useTumblingE = false;
                useLandoltC = false;
                break;
            case 'tumblingE':
                useNumbers = false;
                useTumblingE = true;
                useLandoltC = false;
                break;
            case 'landoltC':
                useNumbers = false;
                useTumblingE = false;
                useLandoltC = true;
                break;
            default:
                // Default to snellen chart if no state is saved
                useNumbers = false;
                useTumblingE = false;
                useLandoltC = false;
        }
    
        updateChart();
    });
    

    chart.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        const row = event.target.closest('.row');
        if (row) {
            toolbar.style.display = 'block';
            toolbar.style.left = `${event.pageX}px`;
            toolbar.style.top = `${event.pageY}px`;
            toolbar.dataset.metric = row.querySelector('.metric').textContent;
            toolbar.dataset.targetId = row.id; // Store the ID of the target row
        }
    });

    // Initial chart update
    generateChart();
});

window.onload = function() {
    const banner = document.getElementById('banner');
    banner.style.opacity = 1;
    setTimeout(() => {
        banner.style.opacity = 0;
    }, 2000);
};

function navigateToFile(path) {
    window.location.href = path;
}

function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'R-click';
    toolbar.style.display = 'none'; // Hide the toolbar initially
    toolbar.style.position = 'absolute'; // Position the toolbar absolutely
    toolbar.style.fontFamily = 'Roboto, sans-serif'; // Set the font family for the entire toolbar
    toolbar.innerHTML = `
        <div class="toolbar-row">
            <h4 style="font-family: 'Roboto', sans-serif;">sc</h4>
            <button style="font-family: 'Roboto', sans-serif;" onclick="saveMetricValue(this, 'sc-RE')">RE<span class="metric-value"></span></button>
            <button style="font-family: 'Roboto', sans-serif;" onclick="saveMetricValue(this, 'sc-LE')">LE<span class="metric-value"></span></button>
            <button style="font-family: 'Roboto', sans-serif;" onclick="saveMetricValue(this, 'sc-OU')">OU<span class="metric-value"></span></button>
        </div>
        <div class="toolbar-row">
            <h4 style="font-family: 'Roboto', sans-serif;">cc</h4>
            <button style="font-family: 'Roboto', sans-serif;" onclick="saveMetricValue(this, 'cc-RE')">RE<span class="metric-value"></span></button>
            <button style="font-family: 'Roboto', sans-serif;" onclick="saveMetricValue(this, 'cc-LE')">LE<span class="metric-value"></span></button>
            <button style="font-family: 'Roboto', sans-serif;" onclick="saveMetricValue(this, 'cc-OU')">OU<span class="metric-value"></span></button>
        </div>
        <div class="empty-column"></div>
    `;
    document.body.appendChild(toolbar);
    loadSavedValues();
    
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const scrollY = window.scrollY; // Get the vertical scroll amount
        const viewportHeight = window.innerHeight;
        const mouseY = e.clientY + scrollY; // Mouse Y position relative to the document
        
        if (mouseY < (scrollY + viewportHeight / 2)) {
            // Mouse is in the top half of the viewport, show dropdown
            toolbar.style.top = `${mouseY}px`;
        } else {
            // Mouse is in the bottom half of the viewport, show dropup
            toolbar.style.top = `${mouseY - toolbar.offsetHeight}px`;
        }
        toolbar.style.left = `${e.clientX}px`;
        toolbar.style.display = 'block'; // Show the toolbar
    });

    document.addEventListener('click', function() {
        toolbar.style.display = 'none'; // Hide the toolbar when clicking outside
    });
    
    return toolbar;
}


function saveMetricValue(button, key) {
    const metricValue = toolbar.dataset.metric;
    const metricSpan = button.querySelector('.metric-value');
    metricSpan.textContent = metricValue;

    // Save the value to localStorage
    localStorage.setItem(key, metricValue);

    // Update the corresponding cell in the table
    const targetRow = document.getElementById(toolbar.dataset.targetId);
    if (targetRow) {
        const targetCell = targetRow.querySelector('.metric');
        if (targetCell) {
            targetCell.textContent = metricValue;
        }
    }

    toolbar.style.display = 'none'; // Hide the toolbar after clicking a button
}

function loadSavedValues() {
    const keys = ['sc-RE', 'sc-LE', 'sc-OU', 'cc-RE', 'cc-LE', 'cc-OU'];
    keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            const button = document.querySelector(`button[onclick*="${key}"]`);
            if (button) {
                button.querySelector('.metric-value').textContent = value;
            }
        }
    });
}

const toolbar = createToolbar();
