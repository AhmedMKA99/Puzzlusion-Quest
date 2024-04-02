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

let levelSelected = false; // Flag to track if a level has been selected

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
            tile.src = "./img/gray.png";
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
    const sizeDropdown = document.getElementById("sizeDropdown");
    const imageInput = document.getElementById('imageInput');
    const piecesContainer = document.getElementById('pieces');

    // Remove existing puzzle pieces if they exist
    piecesContainer.innerHTML = '';

    // Check if the board size is selected
    if (!sizeDropdown.value) {
        alert("Please select a board size before choosing an image.");
        return; // Exit the function if the board size is not selected
    }

    const file = imageInput.files[0];
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

// Function to enable the "Check Puzzle" button
function enableCheckButton() {
    const checkButton = document.getElementById('checkButton');
    checkButton.disabled = false;
}

// Function to disable the "Check Puzzle" button
function disableCheckButton() {
    const checkButton = document.getElementById('checkButton');
    checkButton.disabled = true;
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

// Function to show the congratulations popup
function showCongratulationsPopup() {
    document.getElementById('congratulationsPopup').style.display = 'block';
}

// Function to hide the congratulations popup
function hideCongratulationsPopup() {
    document.getElementById('congratulationsPopup').style.display = 'none';
}

// Function to attempt the next level
function attemptNextLevel() {
    alert(highestLevelAttempted);
    // Increment the highestLevelAttempted
    highestLevelAttempted=highestLevelAttempted+1;
    alert(highestLevelAttempted);
    // Hide the congratulations popup
    hideCongratulationsPopup();

    // Show the level selection form and automatically select the next level
    const nextLevelRadioButton = document.querySelector(`input[name="level"][value="${highestLevelAttempted}"]`);
    if (nextLevelRadioButton) {
        nextLevelRadioButton.checked = true;
        selectLevel(); // Trigger level selection
    } else {
        alert('Congratulations! You have completed all available levels.');
    }
}

// Function to return to the menu page
function returnToMenu() {
    // Redirect to the menu page
    window.location.href = 'main_menu.html';
}

// Function to refresh the current page (play again)
function playAgain() {
    window.location.reload(); // Reloads the current page
}


// Function to check if the puzzle is solved correctly
function checkPuzzle() {
    const currentPage = window.location.pathname;
    if (currentPage.includes("levels.html")) {
        if (levelSelected) {
            if (isPuzzleCompleted()) {
                showCongratulationsPopup(); // Show the congratulations popup
            } else {
                alert("Sorry, the puzzle is not yet solved.");
            }
        } else {
            alert("Please select a level before checking the puzzle.");
        }
    } else if (currentPage.includes("custom.html")) {
        const sizeDropdown = document.getElementById("sizeDropdown");
        const imageInput = document.getElementById("imageInput");
        if (sizeDropdown.value && imageInput.files.length > 0) {
            // Both size and image are selected
            if (isPuzzleCompleted()) {
                showCongratulationsPopup(); // Show the congratulations popup
            } else {
                alert("Sorry, the puzzle is not yet solved.");
            }
        } else {
            alert("Please select a board size and image before checking the puzzle.");
        }
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

//-----------------------------------------------------//


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

// Variable to store the highest level attempted by the user
let highestLevelAttempted = 2; // Assuming level 2 is always accessible

// Function to handle level selection
function selectLevel() {
    const selectedLevel = document.querySelector('input[name="level"]:checked');
    if (selectedLevel) {
        const selectedLevelValue = parseInt(selectedLevel.value);
        
        // Check if the selected level is higher than the highest level attempted
        if (selectedLevelValue <= highestLevelAttempted) {
            // Set puzzle size based on the selected level
            changePuzzleSizeInJavaScriptFile(selectedLevelValue);
            // Show the image selection popup
            showImageSelectionPopup();
            // Set levelSelected flag to true
            levelSelected = true;
            // Enable the "Check Puzzle" button
            enableCheckButton();
        } else {
            alert('Please complete the previous level first.');
        }
    } else {
        alert('Please select a level.');
    }
}


// Function to toggle the sidebar
function toggleSidebar() {
    var sidebar = document.querySelector(".sidenav");
    var content = document.querySelector(".content");
    var sizeForm = document.getElementById("levelForm"); // Assuming levelForm corresponds to sizeForm
    var uploadForm = document.getElementById("imageSelectionForm"); // Assuming imageSelectionForm corresponds to uploadForm
    var previewButton = document.querySelector(".preview-button"); // Assuming the button has a class named "preview-button"

    sidebar.classList.toggle("minimized");
    content.classList.toggle("sidebar-closed");

    // Toggle visibility of sizeForm, uploadForm, and previewButton
    if (sidebar.classList.contains("minimized")) {
        sizeForm.style.display = "none";
        uploadForm.style.display = "none";
        previewButton.style.display = "none";
    } else {
        sizeForm.style.display = "block";
        uploadForm.style.display = "block";
        previewButton.style.display = "block";
    }
}



// Function to preview the completed puzzle
function previewCompletedPuzzle() {
    const currentPage = window.location.pathname;

    // Check if the user is on the Custom page
    if (currentPage.includes("custom.html")) {
        previewCompletedPuzzleCustom();
    }
    // Check if the user is on the Levels page
    else if (currentPage.includes("levels.html")) {
        previewCompletedPuzzleLevels();
    }
    else {
        alert("Preview not available on this page.");
    }
}

// Function to preview completed puzzle on the Custom page
function previewCompletedPuzzleCustom() {
    const imageInput = document.getElementById('imageInput');

    // Check if an image is selected or uploaded
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            // Set the preview image source
            const previewImage = document.getElementById('previewImage');
            previewImage.src = imageUrl;
            // Show the preview popup
            const previewPopup = document.getElementById('previewPopup');
            previewPopup.style.display = 'block';
        };
        // Read the selected image file
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        alert("Please select or upload an image first.");
    }
}

// Function to preview completed puzzle on the Levels page
function previewCompletedPuzzleLevels() {
    const selectedImage = document.querySelector('input[name="selectedImage"]:checked');

    // Check if an image is selected
    if (selectedImage) {
        const imageUrl = selectedImage.value;
        // Set the preview image source
        const previewImage = document.getElementById('previewImage');
        previewImage.src = imageUrl;
        // Show the preview popup
        const previewPopup = document.getElementById('previewPopup');
        previewPopup.style.display = 'block';
    } else {
        alert("Please select an image first.");
    }
}

// Function to close the preview popup
function closePreviewPopup() {
    const previewPopup = document.getElementById('previewPopup');
    previewPopup.style.display = 'none';
}
