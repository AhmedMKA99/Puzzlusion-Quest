let rows = 5; // Define puzzle row dimensions
let columns = 5; // Define puzzle column dimensions
let turns = 0; // Initialize turns counter
let currTile; // Initialize currentile variable for dragging
let otherTile; // Initialize otherTile variable for dragging
let originalOrder = []; // Store original order of puzzle pieces
let originalSources = []; // Store original puzzle piece sources
let levelSelected = false; // Flag to track if a level has been selected
let highestLevelAttempted = 2; // Because level 2 is always accessible but in reality level 2 is level 1
let sizeChosen = false; // Flag to track whether the user has chosen a size

// Initialization and Event Listeners:
document.addEventListener("DOMContentLoaded", function() {
    // Get the clickable image element
    const clickableImage = document.getElementById("clickableImage");

    // Add a click event listener to the image
    clickableImage.addEventListener("click", function() {
        // Redirect the user to the main_menu.html page
        window.location.href = "main_menu.html";
        clickSound();
    });

    // Get the levels and custom images elements
    const levelsImage = document.getElementById("levels");
    const customImage = document.getElementById("custom");

    // Add click event listeners to the images
    levelsImage.addEventListener("click", function() {
        redirectTo('levels.html');
        clickSound();
    });

    customImage.addEventListener("click", function() {
        redirectTo('custom.html');
        clickSound();
    });
});



// Function to initialize the puzzle board with blank pieces
function initializeBoard() {
    const board = document.getElementById("board");
    originalOrder = []; // Clear the originalOrder array
    let sizeChosen = true;
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

function clearBoard(){
    
    const piecesContainer = document.getElementById('pieces');
    // Remove existing puzzle pieces if they exist
    piecesContainer.innerHTML = '';
    board.innerHTML = '';
    sizeChosen = false;
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
    }else {
        if (sizeChosen == false){
            alert("Please select a board size before choosing an image.");
            return; // Exit the function if the board size is not selected
        }
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
    piecesContainer.innerHTML = ''; // Clear previous puzzle pieces
    originalSources = []; // Clear the originalSources array
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;
    image.onload = function() {
        const pieceWidth = image.width / columns;
        const pieceHeight = image.height / rows;
        const pieces = []; // Array to store puzzle pieces

        // Create puzzle pieces
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
                pieces.push(tile); // Add piece to array
            }
        }

        // Shuffle the pieces
        shuffleArray(pieces);

        // Append shuffled pieces to the container
        pieces.forEach(piece => {
            piecesContainer.appendChild(piece);
        });
    }
}

// Function to shuffle array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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

// Function to check if the puzzle is solved correctly
function checkPuzzle() {
    const currentPage = window.location.pathname;
    if (currentPage.includes("levels.html")) {
        if (levelSelected) {
            if (isPuzzleCompleted()) {
                const highestLevelAttempted = localStorage.getItem("highestLevelAttempted");
                if (parseInt(highestLevelAttempted) === 11) {
                    congratulationsPopupAllLevels(); // Call the all levels congratulations popup
                } else {
                    showCongratulationsPopup(); // Call the regular congratulations popup
                }
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

function congratulationsPopupAllLevels() {
    document.getElementById('congratulations-Popup-All-Levels').style.display = 'block';
}



// Function to hide the congratulations popup
function hideCongratulationsPopup() {
    document.getElementById('congratulationsPopup').style.display = 'none';
    document.getElementById('congratulations-Popup-All-Levels').style.display = 'none';
}

// Function to attempt the next level
function attemptNextLevel() {
    // Increment the highestLevelAttempted
    highestLevelAttempted++;
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

// Function to play again 
function playAgain() {
    window.location.reload(); // Reloads the current page
}

// Function to handle the dragging of puzzle pieces
function dragStart() {
    currTile = this;
    // Check if the current tile is the gray placeholder tile
    if (currTile.src.endsWith("gray.png")) {
        // If it is, set currTile to null to prevent swapping
        currTile = null;
    }else{
        playPickDropSound();
    }
    
}

function dragDrop(e) {
    e.preventDefault();
    otherTile = this;
    // Check if currTile is null (gray placeholder tile)
    if (!currTile) {
        return; // Prevent swapping and counter increment
    }
    const currSrc = currTile.src;
    const otherSrc = otherTile.src;
    currTile.src = otherSrc;
    otherTile.src = currSrc;
    turns++;
    document.getElementById("turns").innerText = turns;
    playPickDropSound();
}

function dragOver(e) {
    e.preventDefault();
}




// Function to change the puzzle size
function changePuzzleSize() {
    var selectedSize = parseInt(document.getElementById("sizeDropdown").value);
    console.log("Selected size:", selectedSize);

    changePuzzleSizeInJavaScriptFile(selectedSize);
    changePuzzlePiecesSizeInJavaScriptFile(selectedSize);
    sizeChosen = true;
}

// Function to change the puzzle board size in the JavaScript file
function changePuzzleSizeInJavaScriptFile(newSize) {
    console.log("New size:", newSize);

    const dimensions = {
        2: { width: 160, height: 160 },
        3: { width: 240, height: 240 },
        4: { width: 320, height: 320 },
        5: { width: 400, height: 410 },
        6: { width: 480, height: 490 },
        7: { width: 560, height: 570 },
        8: { width: 635, height: 645 },
        9: { width: 715, height: 720 },
        10: { width: 795, height: 805 },
        11: { width: 875, height: 900 },
        default: { width: 320, height: 320 }
    };

    const { width, height } = dimensions[newSize] || dimensions.default;

    document.getElementById("board").style.width = width + "px";
    document.getElementById("board").style.height = height + "px";

    rows = newSize;
    columns = newSize;
    turns = 0;
    document.getElementById("turns").innerText = turns;
    document.getElementById("board").innerHTML = "";
    document.getElementById("pieces").innerHTML = "";
    initializeBoard();
}

// Function to change the puzzle pieces size in the JavaScript filethe box where the picies go
function changePuzzlePiecesSizeInJavaScriptFile(newSize) {
    console.log("New size:", newSize);

    const dimensions = {
        2: { width: 1040, height: 160 },
        3: { width: 1040, height: 160 },
        4: { width: 1040, height: 160 },
        5: { width: 1040, height: 160 },
        6: { width: 1430, height: 160 },
        7: { width: 1430, height: 240 },
        8: { width: 1430, height: 320 },
        9: { width: 1590, height: 410 },
        10: { width: 1590, height: 410 },
        11: { width: 1585, height: 560 },
        default: { width: 1430, height: 160 }
    };

    const { width, height } = dimensions[newSize] || dimensions.default;

    document.getElementById("pieces").style.width = width + "px";
    document.getElementById("pieces").style.height = height + "px";
}

// Function to show the image selection popup with appropriate images based on the selected level
function showImageSelectionPopup(selectedLevel) {
    const imageSelectionForm = document.getElementById('imageSelectionForm');
    const imageOptions = imageSelectionForm.querySelectorAll('input[type="radio"]');
    
    // Hide all images
    imageOptions.forEach(option => {
        option.parentNode.style.display = 'none';
    });

    // Determine which images to show based on the selected level
    let startIdx = 0;
    if (selectedLevel >= 2 && selectedLevel <= 5) {
        startIdx = 0;
    } else if (selectedLevel >= 6 && selectedLevel <= 9) {
        startIdx = 4;
    } else if (selectedLevel >= 10 && selectedLevel <= 11) {
        startIdx = 6; // Start from index 6 for levels 9 and 10
    }

    // Show appropriate images
    for (let i = startIdx; i < startIdx + 4 && i < imageOptions.length; i++) {
        imageOptions[i].parentNode.style.display = 'block';
    }

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


// Function to handle level selection
function selectLevel() {
    const selectedLevel = document.querySelector('input[name="level"]:checked');
    if (selectedLevel) {
        const selectedLevelValue = parseInt(selectedLevel.value);
        
        // Check if the selected level is higher than the highest level attempted
        if (selectedLevelValue <= highestLevelAttempted) {
            // Set puzzle size based on the selected level
            changePuzzlePiecesSizeInJavaScriptFile(selectedLevelValue);
            changePuzzleSizeInJavaScriptFile(selectedLevelValue);
            // Show the image selection popup with appropriate images based on the selected level
            showImageSelectionPopup(selectedLevelValue);
            // Change the title based on the selected level
            changeTitle(selectedLevelValue);
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

// Function to change the title based on the selected level
function changeTitle(selectedLevel) {
    const levelTitle = document.getElementById('levelTitle');
    levelTitle.textContent = `Level ${selectedLevel-1}`;
}

// Function to toggle the sidebar
function toggleSidebar() {
    var sidebar = document.querySelector(".sidenav");
    var content = document.querySelector(".content");
    var sizeForm = document.getElementById("sizeForm");
    var uploadForm = document.getElementById("uploadForm");
    var previewButton = document.querySelector(".previewButton");

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
        alert('Please select an image/level.');
    }
}

// Function to close the preview popup
function closePreviewPopup() {
    const previewPopup = document.getElementById('previewPopup');
    previewPopup.style.display = 'none';
}

