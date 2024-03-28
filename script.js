// Define puzzle dimensions
let rows = 5;
let columns = 5;

// Initialize turns counter
let turns = 0;

// Initialize current and other tile variables for dragging
let currTile;
let otherTile;

// Store original order of puzzle pieces
let originalOrder = [];

// Store original puzzle piece sources
let originalSources = [];

document.addEventListener("DOMContentLoaded", function() {
    // Get the clickable image element
    const clickableImage = document.getElementById("clickableImage");

    // Add a click event listener to the image
    clickableImage.addEventListener("click", function() {
        // Redirect the user to the main_menu.html page
        window.location.href = "main_menu.html";
    });
});

// Function to initialize the puzzle board with blank pieces
function initializeBoard() {
    const board = document.getElementById("board");
    originalOrder = []; // Clear the originalOrder array
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("img");
            tile.src = "./blank.jpg";
            tile.draggable = true; // Enable dragging
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("drop", dragDrop);
            board.appendChild(tile);
            originalOrder.push(tile.src); // Store original order
        }
    }
}


// Function to handle image selection and initialize puzzle pieces
function handleImage() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createPieces(e.target.result);
        }
        reader.readAsDataURL(file);
    }
}

// Function to create puzzle pieces from user-selected image
function createPieces(imageSrc) {
    const piecesContainer = document.getElementById("pieces");
    piecesContainer.innerHTML = ""; // Clear previous puzzle pieces
    originalSources = []; // Clear the originalSources array

    const image = new Image();
    image.src = imageSrc;
    image.onload = function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const pieceWidth = image.width / columns;
        const pieceHeight = image.height / rows;
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                context.clearRect(0, 0, pieceWidth, pieceHeight); // Clear the canvas
                context.drawImage(image, c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                const tile = document.createElement("img");
                tile.src = canvas.toDataURL(); // Convert canvas to data URL
                originalSources.push(tile.src); // Store original puzzle piece source
                tile.draggable = true; // Enable dragging
                tile.addEventListener("dragstart", dragStart);
                tile.addEventListener("dragover", dragOver);
                tile.addEventListener("drop", dragDrop);
                piecesContainer.appendChild(tile);
            }
        }
    }
}




// Function to check if the puzzle is completed
function isPuzzleCompleted() {
    const boardImages = document.querySelectorAll("#board img");
    for (let i = 0; i < boardImages.length; i++) {
        if (boardImages[i].src !== originalSources[i]) {
            return false; // Puzzle is not completed
        }
    }
    return true; // Puzzle is completed
}

// Function to check if the puzzle is solved correctly
function checkPuzzle() {
    if (isPuzzleCompleted()) {
        alert("Congratulations! The puzzle is solved correctly.");
    } else {
        alert("Sorry, the puzzle is not yet solved.");
    }
}

// Function to handle the dragging of puzzle pieces
function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop(e) {
    e.preventDefault();
    otherTile = this;
    const currSrc = currTile.src;
    const otherSrc = otherTile.src;
    currTile.src = otherSrc;
    otherTile.src = currSrc;
    turns++;
    document.getElementById("turns").innerText = turns;
}

function changePuzzleSize() {
    var selectedSize = document.getElementById("sizeDropdown").value;
    console.log("Selected size:", selectedSize); // Log selected size
    var size = parseInt(selectedSize);

    // Call the function to change the puzzle size
    changePuzzleSizeInJavaScriptFile(size);
}

function changePuzzleSizeInJavaScriptFile(newSize) {
    console.log("New size:", newSize); // Log new size

    // Define the dimensions based on the selected size
    let width, height;
    switch (newSize) {
        case 2:
            width = height = 160;
            break;
        case 3:
            width = height = 240;
            break;
        case 4:
            width = height = 320;
            break;
        case 5:
            width = 400;
            height = 410;
            break;
        case 6:
            width = 480;
            height = 490;
            break;
        case 7:
            width = 560;
            height = 570;
            break;
        case 8:
            width = 635;
            height = 645;
            break;
        case 9:
            width = 715;
            height = 720;
            break;
        case 10:
            width = 795;
            height = 805;
            break;
        case 11:
            width = 875;
            height = 900;
            break;
        default:
            width = height = 320; // Default to 4x4 dimensions
    }

    // Set the width and height of the puzzle board
    document.getElementById("board").style.width = width + "px";
    document.getElementById("board").style.height = height + "px";

    // Override puzzle dimensions in the JavaScript file
    rows = newSize;
    columns = newSize;

    // Reset turns counter
    turns = 0;
    document.getElementById("turns").innerText = turns;

    // Clear board and pieces container
    document.getElementById("board").innerHTML = "";
    document.getElementById("pieces").innerHTML = "";

    // Reinitialize the board with the new size
    initializeBoard();
}

// Function to show the image selection popup
function showImageSelectionPopup() {
    document.getElementById('imageSelectionPopup').style.display = 'block';
}

// Function to handle image selection
function selectImage() {
    const selectedImage = document.querySelector('input[name="selectedImage"]:checked');
    if (selectedImage) {
        const imageUrl = selectedImage.value;
        // Pass the selected image to the createPieces function
        createPieces(imageUrl);
        // Hide the image selection popup
        hideImageSelectionPopup();
    } else {
        alert('Please select an image.');
    }
}


// Function to hide the image selection popup
function hideImageSelectionPopup() {
    document.getElementById('imageSelectionPopup').style.display = 'none';
}



/* -------------- PLAY_LEVELS -------------- */

// Global variable to store the selected level
let selectedLevelValue;

function hideLevelPopup() {
    document.getElementById('levelPopup').style.display = 'none';
}

// Function to show the level selection popup when the page loads
function showLevelPopup() {
    document.getElementById('levelPopup').style.display = 'block';
}

// Function to handle level selection
function selectLevel() {
    const selectedLevel = document.querySelector('input[name="level"]:checked');
    if (selectedLevel) {
        const levelValue = parseInt(selectedLevel.value);
        // Set puzzle size based on the selected level
        changePuzzleSizeInJavaScriptFile(levelValue);
        // Hide the level selection popup
        hideLevelPopup();
    } else {
        alert('Please select a level.');
    }
}


// Function to handle level selection
function selectLevel() {
    const selectedLevel = document.querySelector('input[name="level"]:checked');
    if (selectedLevel) {
        const levelValue = parseInt(selectedLevel.value);
        // Set puzzle size based on the selected level
        changePuzzleSizeInJavaScriptFile(levelValue);
        // Hide the level selection popup
        hideLevelPopup();
        // Show the image selection popup
        showImageSelectionPopup();
    } else {
        alert('Please select a level.');
    }
}

// Add event listener to the submit button in the level selection pop-up
document.getElementById('submitLevel').addEventListener('click', handleSubmit);
