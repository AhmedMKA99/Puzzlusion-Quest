// Define puzzle dimensions
const rows = 5;
const columns = 5;

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
    var clickableImage = document.getElementById("clickableImage");
    if (clickableImage) {
        clickableImage.addEventListener("click", function() {
            window.location.href = "main_menu.html";
        });
    }

    var imageInput = document.getElementById("imageInput");
    if (imageInput) {
        imageInput.addEventListener("change", handleImage);
    }

    initializeBoard();
});

// Function to initialize the puzzle board with blank pieces
function initializeBoard() {
    const board = document.getElementById("board");
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
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;
    image.onload = function() {
        const pieceWidth = image.width / columns;
        const pieceHeight = image.height / rows;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                context.drawImage(image, c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                const tile = document.createElement("img");
                const src = canvas.toDataURL(); // Convert canvas to data URL
                tile.src = src;
                originalSources.push(src); // Store original puzzle piece source
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

