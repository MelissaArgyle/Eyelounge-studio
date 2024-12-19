let currentImageIndex = 1;
const totalImages = 10; // Adjust this to the total number of images you have

function changeImage(index) {
    currentImageIndex = index;
    const imageElement = document.getElementById('colorImage');
    imageElement.src = `images/image${index}.jpg`; // Adjust the path as necessary
}

// Optional: You can preload images for better performance
function preloadImages() {
    for (let i = 1; i <= totalImages; i++) {
        const img = new Image();
        img.src = `images/image${i}.jpg`; // Adjust the path as necessary
    }
}

window.onload = function() {
    preloadImages();

    const banner = document.getElementById('banner');
    banner.style.opacity = 1;
    setTimeout(() => {
        banner.style.opacity = 0;
    }, 2000);

    document.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex % totalImages) + 1;
        changeImage(currentImageIndex);
    });

    const savedOption = localStorage.getItem('colorVision');
    if (savedOption) {
        highlightSelectedOption(savedOption);
    }

    document.getElementById('colorImage').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex % totalImages) + 1;
        changeImage(currentImageIndex);
    });

    // Add the loaded class to the initial image for the fade-in effect
    const imageElement = document.getElementById('colorImage');
    imageElement.classList.add('loaded');
};


function navigateToFile(path) {
    window.location.href = path;
}

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    const rClick = document.getElementById('r-click');
    rClick.style.display = 'block';
    rClick.style.left = event.pageX + 'px';
    rClick.style.top = event.pageY + 'px';
    highlightSelectedOption(localStorage.getItem('colorVision'));
});

document.addEventListener('click', function() {
    const rClick = document.getElementById('r-click');
    rClick.style.display = 'none';
});

function selectOption(option) {
    localStorage.setItem('colorVision', option);
    highlightSelectedOption(option);
}

function highlightSelectedOption(option) {
    document.getElementById('normal').classList.remove('selected');
    document.getElementById('red-green').classList.remove('selected');
    document.getElementById('normal-checkbox').checked = false;
    document.getElementById('red-green-checkbox').checked = false;
    if (option) {
        if (option === 'Normal color vision') {
            document.getElementById('normal').classList.add('selected');
            document.getElementById('normal-checkbox').checked = true;
        } else if (option === 'Red-green color deficiency') {
            document.getElementById('red-green').classList.add('selected');
            document.getElementById('red-green-checkbox').checked = true;
        }
    }
}
