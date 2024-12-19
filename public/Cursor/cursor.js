document.addEventListener('DOMContentLoaded', function() {
    applyCursorPreference();

    // Adding mouse movement detection to hide the cursor after inactivity
    let cursorTimeout;
    document.body.addEventListener('mousemove', resetCursorTimer);

    function resetCursorTimer() {
        clearTimeout(cursorTimeout);
        const savedCursor = localStorage.getItem('cursorPreference');
        document.body.style.cursor = savedCursor ? `url(${savedCursor}), auto` : 'auto';

        cursorTimeout = setTimeout(() => {
            document.body.style.cursor = 'none';
        }, 3000); // 
    }

    // Initialize the cursor timer
    resetCursorTimer();
});

function applyCursorPreference() {
    const savedCursor = localStorage.getItem('cursorPreference');
    if (savedCursor) {
        changeCursor(savedCursor);
    }
}

function changeCursor(cursor) {
    document.body.style.cursor = `url(${cursor}), auto`;
}
