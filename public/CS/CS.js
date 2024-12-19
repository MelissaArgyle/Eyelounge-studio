document.addEventListener('DOMContentLoaded', function() {
    const contrastTest = document.getElementById('contrast-test');
    const percentageDisplay = document.getElementById('percentage-display');
    const highlighter = document.getElementById('highlighter');
    const numbers = '0123456789';
    const letters = 'CDHKNORSVZ';
    const E = 'E';
    const percentages = ['80%', '50%', '35%', '15%', '7.5%', '3.0%', '1.5%', '0.8%', '0.2%'];
    const snellenButton = document.getElementById('snellen');
    const numberButton = document.getElementById('number');
    const tumblingEButton = document.getElementById('tumblingE');

    // Create 9 lines with varying contrasts
    for (let i = 0; i < 9; i++) {
        const line = document.createElement('div');
        line.className = 'line';
        line.id = `line${i + 1}`; // Add unique IDs to each line
        line.innerHTML = `<span>${generateUniqueNumbers()}</span><span class="percentage">${percentages[i]}</span>`;
        contrastTest.appendChild(line);
    }

    // Highlight the first line initially and display its percentage
    const lines = document.querySelectorAll('.line');
    let currentIndex = 0; // Set to 0 to highlight the first row
    lines[currentIndex].classList.add('highlight');
    percentageDisplay.textContent = lines[currentIndex].querySelector('.percentage').textContent;

    // Function to update the highlight bar position and content
    function updateHighlight() {
        lines.forEach(line => line.classList.remove('highlight'));
        lines[currentIndex].classList.add('highlight');
        percentageDisplay.textContent = lines[currentIndex].querySelector('.percentage').textContent;

        // Update highlighter content and style to match the current line
        highlighter.innerHTML = lines[currentIndex].innerHTML;
        highlighter.style.fontSize = window.getComputedStyle(lines[currentIndex]).fontSize;
        highlighter.style.color = window.getComputedStyle(lines[currentIndex]).color;
        highlighter.style.letterSpacing = window.getComputedStyle(lines[currentIndex]).letterSpacing;
    }

    // Add scroll event listener to move lines up and down
    window.addEventListener('wheel', function(event) {
        event.preventDefault();
        const previousIndex = currentIndex;
        if (event.deltaY > 0 && currentIndex < lines.length - 1) {
            currentIndex++;
        } else if (event.deltaY < 0 && currentIndex > 0) {
            currentIndex--;
        }
        if (previousIndex !== currentIndex) {
            updateHighlight();
        }
    });

    // Function to generate unique numbers ensuring no repeats in a row
    function generateUniqueNumbers() {
        let result = '';
        let availableNumbers = numbers.split('');
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            result += availableNumbers[randomIndex];
            availableNumbers.splice(randomIndex, 1);
        }
        return result;
    }

    // Function to generate unique letters ensuring no repeats in a row
    function generateUniqueLetters() {
        let result = '';
        let availableLetters = letters.split('');
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * availableLetters.length);
            result += availableLetters[randomIndex];
            availableLetters.splice(randomIndex, 1);
        }
        return result;
    }

    // Function to generate tumbling E letters with random rotations
    function generateTumblingE() {
        let result = '<div class="tumbling-e-container">';
        for (let i = 0; i < 5; i++) {
            const rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)];
            result += `<span class="tumbling-e" style="transform: rotate(${rotation}deg);">${E}</span>`;
        }
        result += '</div>';
        return result;
    }

    // Event listener for the snellenButton to generate letters
    snellenButton.addEventListener('click', function() {
        const lines = document.querySelectorAll('.line');
        lines.forEach(line => {
            line.querySelector('span:first-child').textContent = generateUniqueLetters();
        });
        updateHighlight(); // Update the highlighter to reflect the new letters
    });

    // Event listener for the numberButton to generate numbers
    numberButton.addEventListener('click', function() {
        const lines = document.querySelectorAll('.line');
        lines.forEach(line => {
            line.querySelector('span:first-child').textContent = generateUniqueNumbers();
        });
        updateHighlight(); // Update the highlighter to reflect the new numbers
    });

    // Event listener for the tumblingEButton to generate tumbling E letters
    tumblingEButton.addEventListener('click', function() {
        const lines = document.querySelectorAll('.line');
        lines.forEach(line => {
            line.querySelector('span:first-child').innerHTML = generateTumblingE();
        });
        updateHighlight(); // Update the highlighter to reflect the new tumbling E letters
    });

    window.addEventListener('mousedown', function(event) {
        if (event.button === 1) { // Middle mouse button
            const lines = document.querySelectorAll('.line');
            lines.forEach(line => {
                line.querySelector('span:first-child').textContent = generateUniqueNumbers();
            });
        }
    });

    // Initial call to set the highlighter position correctly
    updateHighlight();
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

document.addEventListener('DOMContentLoaded', function() {
    const percentageDisplay = document.getElementById('percentage-display');
    const rClick = document.getElementById('r-click');
    const odInput = document.getElementById('od-input');
    const osInput = document.getElementById('os-input');

    // Load saved values from local storage
    odInput.value = localStorage.getItem('odValue') || '';
    osInput.value = localStorage.getItem('osValue') || '';

    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        rClick.style.top = `${event.clientY + scrollTop}px`;
        rClick.style.left = `${event.clientX + scrollLeft}px`;
        rClick.style.display = 'block';
    });

    document.addEventListener('click', function(event) {
        if (!rClick.contains(event.target)) {
            rClick.style.display = 'none';
        }
    });

    rClick.addEventListener('click', function(event) {
        if (event.target.id === 'od-input') {
            odInput.value = percentageDisplay.textContent;
            localStorage.setItem('odValue', odInput.value);
        } else if (event.target.id === 'os-input') {
            osInput.value = percentageDisplay.textContent;
            localStorage.setItem('osValue', osInput.value);
        }
        rClick.style.display = 'none'; // Hide the toolbar after clicking
    });
});
